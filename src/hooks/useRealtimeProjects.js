// src/hooks/useRealtimeProjects.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext.jsx'; 

export const useRealtimeProjects = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const teamId = user?.team_id; 

  useEffect(() => {
    if (!isAuthenticated || !teamId) {
      setLoading(false);
      setProjects([]);
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Initial Fetch
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching initial projects:', error);
        setError(error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();

    // 2. Real-time Subscription
    const projectsSubscription = supabase
      .channel('projects-team-' + teamId) 
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'projects',
          filter: `team_id=eq.${teamId}`, 
        },
        (payload) => {
          setProjects((currentProjects) => {
            const newRecord = payload.new;
            const oldRecord = payload.old;

            switch (payload.eventType) {
              case 'INSERT':
                return [newRecord, ...currentProjects];
              case 'UPDATE':
                return currentProjects.map((p) =>
                  p.id === newRecord.id ? newRecord : p
                );
              case 'DELETE':
                return currentProjects.filter((p) => p.id !== oldRecord.id);
              default:
                return currentProjects;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsSubscription);
    };
  }, [isAuthenticated, teamId]);

  return { projects, loading, error };
};
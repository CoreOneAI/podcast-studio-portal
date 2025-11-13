// src/hooks/useRealtimeProjects.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export const useRealtimeProjects = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const teamId = user?.team_id; // Safely get the team_id

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
    // Subscribe to all changes (INSERT, UPDATE, DELETE) for the projects table
    // where the team_id matches the user's team.
    const projectsSubscription = supabase
      .channel('projects-team-' + teamId) // Unique channel name per team
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events
          schema: 'public',
          table: 'projects',
          filter: `team_id=eq.${teamId}`, // Real-time filter by team_id
        },
        (payload) => {
          setProjects((currentProjects) => {
            const newRecord = payload.new;
            const oldRecord = payload.old;

            switch (payload.eventType) {
              case 'INSERT':
                // Add new project to the start of the list
                return [newRecord, ...currentProjects];
              case 'UPDATE':
                // Replace the old version with the updated one
                return currentProjects.map((p) =>
                  p.id === newRecord.id ? newRecord : p
                );
              case 'DELETE':
                // Remove the deleted project
                return currentProjects.filter((p) => p.id !== oldRecord.id);
              default:
                return currentProjects;
            }
          });
        }
      )
      .subscribe();

    // Cleanup function: Unsubscribe when the component unmounts or teamId changes
    return () => {
      supabase.removeChannel(projectsSubscription);
    };
  }, [isAuthenticated, teamId]);

  return { projects, loading, error };
};
// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure path is correct

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Check and Session Subscription
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        // A user's team_id is often stored in the 'public.profiles' table
        // or directly in the auth.users metadata if you set it there.
        // We assume it's in the 'public.profiles' table.
        await getUserProfile(session.user);
      } else if (error) {
        console.error('Error fetching session:', error);
      }
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await getUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        // No need to set loading here, as it's handled by the initial check
      }
    );

    fetchSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Helper to get user profile and team_id
  const getUserProfile = async (supabaseUser) => {
    const { data: profile, error } = await supabase
      .from('profiles') // Assuming you have a 'profiles' table
      .select('team_id')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      // Fallback: Use the standard user object without team_id
      setUser(supabaseUser);
    } else if (profile) {
      // Combine Supabase User object with the essential team_id
      setUser({ ...supabaseUser, team_id: profile.team_id });
    }
  };

  // Auth functions
  const signIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        setUser(null);
    }
    return { error };
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    // team_id is accessible via user.team_id
    isAuthenticated: !!user && !!user.team_id,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
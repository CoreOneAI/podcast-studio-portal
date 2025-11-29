// src/components/AuthManager.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Import your Firebase auth instance
import { signInAnonymously, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthManager = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        // Firebase Authentication listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoadingAuth(false);
            setAuthError(null); // Clear errors on auth state change
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleAnonymousSignIn = async () => {
        setAuthError(null);
        try {
            await signInAnonymously(auth);
            console.log("Signed in anonymously!");
        } catch (error) {
            console.error("Error signing in anonymously:", error);
            setAuthError(error.message);
        }
    };

    const handleEmailPasswordSignIn = async () => {
        setAuthError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Signed in with email/password!");
        } catch (error) {
            console.error("Error signing in with email/password:", error);
            setAuthError(error.message);
        }
    };

    const handleSignOut = async () => {
        setAuthError(null);
        try {
            await signOut(auth);
            console.log("Signed out!");
        } catch (error) {
            console.error("Error signing out:", error);
            setAuthError(error.message);
        }
    };

    if (loadingAuth) {
        return <div style={{ color: 'white', padding: '10px' }}>Checking authentication status...</div>;
    }

    return (
        <div style={{
            backgroundColor: '#333',
            padding: '15px',
            borderRadius: '8px',
            margin: '20px',
            color: 'white',
            textAlign: 'center'
        }}>
            {currentUser ? (
                <div>
                    <p>Logged in as: {currentUser.isAnonymous ? 'Anonymous' : currentUser.email}</p>
                    <button onClick={handleSignOut} style={{
                        backgroundColor: '#dc3545', color: 'white', border: 'none',
                        padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'
                    }}>Sign Out</button>
                </div>
            ) : (
                <div>
                    <p>You are not logged in.</p>
                    <button onClick={handleAnonymousSignIn} style={{
                        backgroundColor: '#28a745', color: 'white', border: 'none',
                        padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px'
                    }}>Sign In Anonymously (for testing)</button>

                    <p style={{marginTop: '15px', marginBottom: '10px'}}>Or sign in with Email:</p>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '8px', marginRight: '5px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#444', color: 'white' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '8px', marginRight: '5px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#444', color: 'white' }}
                    />
                    <button onClick={handleEmailPasswordSignIn} style={{
                        backgroundColor: '#007bff', color: 'white', border: 'none',
                        padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'
                    }}>Sign In</button>

                    {authError && <p style={{ color: '#dc3545', marginTop: '10px' }}>Error: {authError}</p>}
                </div>
            )}
        </div>
    );
};

export default AuthManager;

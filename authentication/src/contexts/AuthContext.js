import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure this path is correct and leads to your initialized Firebase instance


const AuthContext = React.createContext();
const authh = getAuth();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const emailRef = useRef();
  const passwordRef = useRef();

  async function signup(email, password) {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      setLoading(false);
    } catch (error) {
      console.error("Error creating user:", error);
      setLoading(false);
    }
  }

  async function login(email, password) {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      setLoading(false);
      return true; // Indicate success
    } catch (error) {
      console.error("Error signing in:", error);
      setLoading(false);
      return false; // Indicate failure
    }
  }

  function logout() {
    return auth.signOut()
  }

  // async function resetPassword(auth, email) {
  //   try {
  //     await auth.sendPasswordResetEmail(email);
  //     console.log('Password reset email sent successfully');
  //   } catch (error) {
  //     console.error('Error sending password reset email:', error);
  //   }
  // }
  
  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(authh, email);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null); // Set current user to null if no user is signed in
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout: () => signOut(auth),
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

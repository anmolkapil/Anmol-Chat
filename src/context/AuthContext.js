import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import {
  collection,
  doc,
  documentId,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';

import { db } from '../firebase';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  const profileCreation = (user) => {
    if (user) {
      try {
        setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          profile_picture: user.photoURL,
          created_at: Timestamp.now(),
          email: user.email,
        });
      } catch (err) {
        console.log(err, 'firestore err');
        window.confirm(
          'Something went wrong during profile creation, Please Retry'
        ) === true && window.location.reload();
      }
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      const q = query(
        collection(db, 'users'),
        where(documentId(), '==', currentUser?.uid)
      );
      onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.docs.length) {
          profileCreation(currentUser);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

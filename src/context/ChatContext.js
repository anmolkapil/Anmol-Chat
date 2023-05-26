import { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

// Create the ChatContext
const ChatContext = createContext();

// Custom hook to access the ChatContext
export const useChat = () => useContext(ChatContext);

// ChatContextProvider component
export function ChatContextProvider({ children }) {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [joinedPrivateChats, setJoinedPrivateChats] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  //List of All Users Registered on App
  useEffect(() => {
    if (currentUser && currentUser?.uid) {
      const unsubscribe = onSnapshot(
        query(collection(db, 'users'), orderBy('displayName')),
        (snapshot) => {
          const usersData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // Filter out the current user
          const filteredUsers = usersData.filter(
            (user) => user.id !== currentUser.uid
          );
          setUsers(filteredUsers);
        }
      );

      return () => unsubscribe();
    }
  }, [currentUser]);

  //Update Chat Rooms Data
  useEffect(() => {
    if (currentUser && currentUser?.uid) {
      const q = query(collection(db, 'rooms'), orderBy('name'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const roomsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setRooms(roomsData);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  //Update Joined Rooms Data
  useEffect(() => {
    if (currentUser && currentUser?.uid) {
      const unsubscribe = onSnapshot(
        collection(db, 'users', currentUser.uid, 'joinedRooms'),
        (snapshot) => {
          const joinedRoomsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setJoinedRooms(joinedRoomsData);
        }
      );

      return () => unsubscribe();
    }
  }, [currentUser]);

  //Update Joined Private Chat Data
  useEffect(() => {
    if (currentUser && currentUser?.uid) {
      const unsubscribe = onSnapshot(
        collection(db, 'users', currentUser.uid, 'joinedPrivateChats'),
        (snapshot) => {
          const joinedPrivateChats = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setJoinedPrivateChats(joinedPrivateChats);
        }
      );

      return () => unsubscribe();
    }
  }, [currentUser]);

  //Update all messages in joined Rooms
  useEffect(() => {
    if (currentUser && currentUser?.uid) {
      joinedRooms.forEach((room) => {
        const unsubscribe = onSnapshot(
          query(
            collection(db, 'rooms', room.id, 'messages'),
            orderBy('timestamp')
          ),
          (snapshot) => {
            const roomMessages = snapshot.docs.map((doc) => doc.data());
            setMessages((prevMessages) => ({
              ...prevMessages,
              [room.id]: roomMessages,
            }));

            const lastMessage = roomMessages[roomMessages.length - 1];
            setLastMessages((prevLastMessages) => ({
              ...prevLastMessages,
              [room.id]: lastMessage,
            }));
          }
        );

        return () => unsubscribe();
      });
    }
  }, [currentUser, joinedRooms]);

  //Update all messages in joined Chats
  useEffect(() => {
    if (currentUser && currentUser?.uid) {
      joinedPrivateChats.forEach((room) => {
        const unsubscribe = onSnapshot(
          query(
            collection(db, 'privatechats', room.id, 'messages'),
            orderBy('timestamp')
          ),
          (snapshot) => {
            const roomMessages = snapshot.docs.map((doc) => doc.data());
            setMessages((prevMessages) => ({
              ...prevMessages,
              [room.id]: roomMessages,
            }));

            const lastMessage = roomMessages[roomMessages.length - 1];
            setLastMessages((prevLastMessages) => ({
              ...prevLastMessages,
              [room.id]: lastMessage,
            }));
          }
        );

        return () => unsubscribe();
      });
    }
  }, [currentUser, joinedPrivateChats]);

  const joinRoom = async (room) => {
    try {
      await setDoc(doc(db, 'users', currentUser.uid, 'joinedRooms', room.id), {
        name: room.name,
      });

      setSelectedRoom(room);
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const joinChat = async (user) => {
    const uniqueID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    const uniqueName =
      currentUser.uid > user.uid
        ? currentUser.displayName + ' and ' + user.displayName
        : user.displayName + ' and ' + currentUser.displayName;

    try {
      const docRef = doc(
        db,
        'users',
        currentUser.uid,
        'joinedPrivateChats',
        uniqueID
      );
      await setDoc(docRef, {
        name: user.displayName,
        profilePic: user.profile_picture,
      });

      await getDoc(docRef).then((doc) => {
        setSelectedUser({
          id: doc.id,
          ...doc.data(),
        });
        setSelectedRoom(null);
      });

      await setDoc(doc(db, 'users', user.uid, 'joinedPrivateChats', uniqueID), {
        name: currentUser.displayName,
        profilePic: currentUser.photoURL,
      });

      const userRef = doc(db, 'privatechats', uniqueID);
      await setDoc(userRef, { name: uniqueName });
    } catch (error) {
      console.error(error);
    }
  };

  const leaveRoom = async (room) => {
    try {
      await deleteDoc(
        doc(db, 'users', currentUser.uid, 'joinedRooms', room.id)
      );
      setSelectedRoom(null);
    } catch (error) {
      console.error(error);
    }
  };

  const leaveChat = async (chat) => {
    try {
      await deleteDoc(
        doc(db, 'users', currentUser.uid, 'joinedPrivateChats', chat.id)
      );
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const createRoom = async (roomName) => {
    try {
      const roomRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        type: 'room',
      });

      await getDoc(roomRef).then((doc) => {
        setSelectedRoom({
          id: doc.id,
          ...doc.data(),
        });
        setSelectedUser(null);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const chatContextValue = {
    selectedRoom,
    setSelectedRoom,
    selectedUser,
    setSelectedUser,
    joinedRooms,
    rooms,
    joinRoom,
    joinChat,
    leaveRoom,
    createRoom,
    messages,
    lastMessages,
    users,
    leaveChat,
    joinedPrivateChats,
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
}

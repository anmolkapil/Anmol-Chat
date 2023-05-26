import './Sidebar.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import Chat from '../Chat/Chat';
import { useChat } from '../../context/ChatContext';

import Inbox from './messenger.png';
import Users from './user.png';
import Rooms from './group.png';
import Logout from './turn-off.png';

const Sidebar = () => {
  const {
    users,
    rooms,
    joinedPrivateChats,
    joinedRooms,
    joinRoom,
    joinChat,
    createRoom,
    setSelectedRoom,
    setSelectedUser,
    lastMessages,
  } = useChat();

  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    createRoom(newRoomName);
    setNewRoomName('');
  };
  const { currentUser } = useAuth();
  const [selectedSection, setSelectedSection] = useState('chats');

  const handleSectionChange = (section) => {
    if (selectedSection !== section) {
      setSelectedSection(section);
    }
  };

  console.log(currentUser);

  return (
    <div className="sidebar">
      <div className="leftBar">
        <div className="userlogged">
          <img
            className="logged"
            src={currentUser.photoURL}
            alt="logged user"
          ></img>
        </div>

        <div className="icons">
          <button
            className={selectedSection === 'chats' ? 'active' : ''}
            onClick={() => handleSectionChange('chats')}
          >
            <img src={Inbox} alt="inbox"></img>
          </button>
          <button
            className={selectedSection === 'users' ? 'active' : ''}
            onClick={() => handleSectionChange('users')}
          >
            <img src={Users} alt="users"></img>
          </button>
          <button
            className={selectedSection === 'rooms' ? 'active' : ''}
            onClick={() => handleSectionChange('rooms')}
          >
            <img src={Rooms} alt="rooms"></img>
          </button>
        </div>
        <button className="logout" onClick={() => signOut(auth)}>
          <img src={Logout} alt="logout"></img>
        </button>
      </div>

      <div className="sidebar-right">
        {selectedSection === 'chats' && (
          <div>
            <h2>Joined Rooms</h2>
            {joinedRooms.map((room) => (
              <Chat
                chatId={room.id}
                key={room.id}
                name={room.name}
                latestMessage={
                  lastMessages[room.id] ? lastMessages[room.id].text : ''
                }
                timestamp={
                  lastMessages[room.id] ? lastMessages[room.id].timestamp : ''
                }
                handleClick={() => {
                  setSelectedRoom(room);
                  setSelectedUser(null);
                }}
              />
            ))}
            <h2>Joined Chats</h2>
            {joinedPrivateChats.map((chat) => (
              <Chat
                key={chat.id}
                chatId={chat.id}
                name={chat.name}
                latestMessage={
                  lastMessages[chat.id] ? lastMessages[chat.id].text : ''
                }
                timestamp={
                  lastMessages[chat.id] ? lastMessages[chat.id].timestamp : ''
                }
                profilePic={chat.profilePic}
                handleClick={() => {
                  setSelectedRoom(null);
                  setSelectedUser(chat);
                }}
              />
            ))}
          </div>
        )}
        {selectedSection === 'users' && (
          <div>
            <h2>All Users</h2>
            {users.length > 0 ? (
              users.map((user) => (
                <div className="userBox" key={user.id}>
                  <img src={user.profile_picture} alt="display pic"></img>
                  <div className="userName">{user.displayName}</div>
                  <button
                    onClick={() => {
                      joinChat(user);
                    }}
                  >
                    Add
                  </button>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        )}
        {selectedSection === 'rooms' && (
          <div className="wrapper">
            <h2>All Rooms</h2>
            <div className="roomsView">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <div className="userBox" key={room.id}>
                    <div className="userName">{room.name}</div>

                    <button onClick={() => joinRoom(room)}>Join</button>
                  </div>
                ))
              ) : (
                <p>No rooms found</p>
              )}
            </div>
            <div className="roomCreate">
              <h2>Create New Room</h2>
              <form onSubmit={handleCreateRoom}>
                <input
                  className="textarea"
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                />
                <button className="createButton" type="submit">
                  Create
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

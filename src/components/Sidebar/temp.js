<div className="temp">
  <h2>All Rooms</h2>
  {rooms.length > 0 ? (
    <ul>
      {rooms.map((room) => (
        <li key={room.id}>
          {room.name} <button onClick={() => joinRoom(room)}>Join</button>
        </li>
      ))}
    </ul>
  ) : (
    <p>No rooms found</p>
  )}

  <h2>Joined Rooms</h2>

  {joinedRooms.map((room) => (
    <Chat
      key={room.id}
      name={room.name}
      latestMessage={lastMessages[room.id] ? lastMessages[room.id].text : ''}
      timestamp={lastMessages[room.id] ? lastMessages[room.id].timestamp : ''}
      handleClick={() => {
        setSelectedRoom(room);
        setSelectedUser(null);
      }}
      leaveRoom={() => leaveRoom(room)}
    />
  ))}

  <h2>Joined Chats</h2>

  {joinedPrivateChats.map((chat) => (
    <Chat
      key={chat.id}
      name={chat.name}
      latestMessage={lastMessages[chat.id] ? lastMessages[chat.id].text : ''}
      timestamp={lastMessages[chat.id] ? lastMessages[chat.id].timestamp : ''}
      profilePic={chat.profilePic}
      handleClick={() => {
        setSelectedRoom(null);
        setSelectedUser(chat);
      }}
      leaveRoom={() => leaveChat(chat)}
    />
  ))}

  <h2>Create New Room</h2>
  <form onSubmit={handleCreateRoom}>
    <input
      type="text"
      value={newRoomName}
      onChange={(e) => setNewRoomName(e.target.value)}
      placeholder="Enter room name"
    />
    <button type="submit">Create</button>
  </form>
</div>;

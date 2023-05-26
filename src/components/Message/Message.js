import './Message.css';

import { useChat } from '../../context/ChatContext';

// const Message = ({ text, senderName, currentUser }) => {
//   const isSentByCurrentUser = currentUser.displayName === senderName;

//   return (
//     <div className="message">
//       <div className="name">{isSentByCurrentUser ? 'You' : senderName}</div>
//       <div>
//         <span className={`text ${isSentByCurrentUser ? 'sent' : 'received'}`}>
//           {text}
//         </span>
//       </div>
//     </div>
//   );
// };

const Message = ({ text, senderName, currentUser, noTail }) => {
  const { selectedRoom } = useChat();

  const isSentByCurrentUser = currentUser.displayName === senderName;
  const sender = isSentByCurrentUser ? 'You' : senderName;

  return (
    <>
      <div
        className={`text ${isSentByCurrentUser ? 'sent' : 'received'} ${
          noTail ? 'noTail' : ''
        }`}
      >
        {selectedRoom && <div className="sender">{sender}</div>}
        {text}
      </div>
    </>
  );
};

export default Message;

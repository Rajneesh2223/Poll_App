import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../utils/socket';
import { X, Send, MessageCircle, Users, User } from 'lucide-react';

const ChatWindow = ({ isOpen, onClose, isTeacher, userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userList, setUserList] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleChatHistory = (history) => {
      setMessages(history);
    };

    const handleUserList = (list) => {
      setUserList(list);
    };

    const handleKicked = (data) => {
      alert(`You have been kicked: ${data.reason || "No reason provided"}`);
      onClose();
    };

    const handleKickSuccess = ({ targetName }) => {
      console.log(`Successfully kicked ${targetName}`);
    };

    const handleError = (error) => {
      console.error("Chat error:", error);
    };

    socket.on('chat-message', handleChatMessage);
    socket.on('chat-history', handleChatHistory);
    socket.on('update_user_list', handleUserList);
    socket.on('kicked', handleKicked);
    socket.on('kick_success', handleKickSuccess);
    socket.on('error', handleError);

    return () => {
      socket.off('chat-message', handleChatMessage);
      socket.off('chat-history', handleChatHistory);
      socket.off('update_user_list', handleUserList);
      socket.off('kicked', handleKicked);
      socket.off('kick_success', handleKickSuccess);
      socket.off('error', handleError);
    };
  }, [onClose]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket?.connected || !newMessage.trim()) return;

    socket.emit('send-chat-message', { message: newMessage.trim() });
    setNewMessage('');
  };

  const handleKick = (userId) => {
    if (!isTeacher) return;
    
    if (window.confirm(`Are you sure you want to kick this user?`)) {
      socket.emit('kick-user', userId);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header with Tabs */}
      <div className="flex flex-col">
        {/* <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center">
            {activeTab === 'chat' ? (
              <MessageCircle className="h-5 w-5 text-[#5A66D1] mr-2" />
            ) : (
              <Users className="h-5 w-5 text-[#5A66D1] mr-2" />
            )}
            <h3 className="font-semibold text-gray-900">
              {activeTab === 'chat' ? 'Chat' : 'Participants'} ({userList.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
         */}
        {/* Tab Buttons */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'chat' ? 'text-[#5A66D1] border-b-2 border-[#5A66D1]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'participants' ? 'text-[#5A66D1] border-b-2 border-[#5A66D1]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat' ? (
          <div className="p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id || message.timestamp}
                  className={`flex ${message.sender === userName ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === userName
                        ? 'bg-[#5A66D1] text-white'
                        : message.isTeacher
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {message.sender !== userName && (
                      <div className="flex items-center mb-1">
                        <User className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">
                          {message.sender}
                          {message.isTeacher && ' (Teacher)'}
                        </span>
                      </div>
                    )}
                    <p className="text-sm break-words">{message.message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-2">
              {userList.map((user) => (
                <div 
                  key={user.id || user.name} 
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">
                      {user.name}
                      {user.role === "teacher" && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Teacher
                        </span>
                      )}
                    </span>
                  </div>
                  {isTeacher && user.role !== "teacher" && user.name !== userName && (
                    <button
                      onClick={() => handleKick(user.id || user.name)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                    >
                      Kick
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input (only shown in chat tab) */}
      {activeTab === 'chat' && (
        <form onSubmit={handleSendMessage} className="p-3 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A66D1] focus:border-transparent text-sm"
              maxLength={500}
              disabled={!socket?.connected}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !socket?.connected}
              className="px-3 py-2 bg-[#5A66D1] text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {!socket?.connected && (
            <p className="text-xs text-red-500 mt-1">Disconnected from server</p>
          )}
        </form>
      )}
    </div>
  );
};

export default ChatWindow;
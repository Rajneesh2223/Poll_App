import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatButton = ({ isOpen, onClick, hasUnreadMessages = false }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-40 ${
        isOpen 
          ? 'bg-red-600 hover:bg-red-700' 
          : 'bg-[#8F64E1] hover:bg-blue-700'
      } text-white flex items-center justify-center`}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <div className="relative">
          <MessageCircle className="h-6 w-6" />
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          )}
        </div>
      )}
    </button>
  );
};

export default ChatButton;
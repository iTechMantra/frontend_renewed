// src/components/MessageVideoSection.jsx
import { useState, useEffect } from "react";
import JitsiMeetingWrapper from "./JitsiMeetingWrapper";
import { createVisit, getMessagesByRoom, createMessage, getMessagesBetweenUsers, createMessageBetweenUsers } from "../services/storageService";
import { getCurrentUser, getCurrentRole } from "../services/authService";
import { translate } from "../services/translationService";

export default function MessageVideoSection({ 
  userId, 
  userName, 
  messages, 
  onSendMessage,
  roomId = null,
  onVisitCreated = null,
  showCreateVisit = false
}) {
  const [newMessage, setNewMessage] = useState("");
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(roomId);
  const [roomMessages, setRoomMessages] = useState(messages || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentRoomId) {
      loadRoomMessages();
    } else {
      setRoomMessages(messages || []);
    }
  }, [currentRoomId, messages]);

  const loadRoomMessages = () => {
    if (currentRoomId) {
      const messages = getMessagesByRoom(currentRoomId);
      setRoomMessages(messages);
    } else if (userId) {
      // Load direct messages between users
      const currentUser = getCurrentUser();
      if (currentUser) {
        const messages = getMessagesBetweenUsers(currentUser.id, userId);
        setRoomMessages(messages);
      }
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const currentUser = getCurrentUser();
    const currentRole = getCurrentRole();
    
    if (!currentUser) {
      alert('Please log in to send messages');
      return;
    }

    let newMessageObj;
    
    if (currentRoomId) {
      // Room-based messaging
      const messageData = {
        roomId: currentRoomId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentRole,
        text: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      newMessageObj = createMessage(messageData);
    } else {
      // Direct messaging between users
      newMessageObj = createMessageBetweenUsers(
        currentUser.id, 
        userId, 
        newMessage.trim(), 
        currentRole
      );
    }
    
    // Update local state
    setRoomMessages(prev => [...prev, newMessageObj]);
    
    // Notify parent component
    if (onSendMessage) {
      onSendMessage(newMessageObj);
    }
    
    setNewMessage("");
  };

  const handleCreateVisit = () => {
    if (!showCreateVisit) return;
    
    setLoading(true);
    
    try {
      const currentUser = getCurrentUser();
      const currentRole = getCurrentRole();
      
      if (!currentUser) {
        alert('Please log in to create a visit');
        return;
      }

      const visitData = {
        patientId: userId,
        patientName: userName,
        doctorId: currentRole === 'doctor' ? currentUser.id : null,
        ashaId: currentRole === 'asha' ? currentUser.id : null,
        type: 'consultation',
        status: 'waiting',
        priority: 'normal',
        symptoms: [],
        notes: 'Visit created from message section'
      };

      const newVisit = createVisit(visitData);
      
      // Set room ID for this visit
      setCurrentRoomId(newVisit.roomId);
      
      // Notify parent component
      if (onVisitCreated) {
        onVisitCreated(newVisit);
      }
      
      alert('Visit created successfully! A doctor will attend to you shortly.');
    } catch (error) {
      console.error('Error creating visit:', error);
      alert('Failed to create visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartVideoCall = () => {
    if (!currentRoomId) {
      // Create a room ID if none exists
      setCurrentRoomId(`room-${userId}-${Date.now()}`);
    }
    setShowVideoCall(true);
  };

  const handleEndVideoCall = () => {
    setShowVideoCall(false);
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return translate('Just now');
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${translate('min ago')}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${translate('hr ago')}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSenderDisplayName = (message) => {
    if (message.senderName) {
      return message.senderName;
    }
    
    // Fallback to sender role
    switch (message.senderRole) {
      case 'doctor':
        return translate('Doctor');
      case 'asha':
        return translate('ASHA Worker');
      case 'pharmacy':
        return translate('Pharmacy');
      default:
        return translate('User');
    }
  };

  const getSenderColor = (message) => {
    const currentUser = getCurrentUser();
    if (currentUser && message.senderId === currentUser.id) {
      return 'bg-blue-500 text-white';
    }
    
    switch (message.senderRole) {
      case 'doctor':
        return 'bg-green-500 text-white';
      case 'asha':
        return 'bg-purple-500 text-white';
      case 'pharmacy':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {translate('Messages & Video Call')}
        </h2>
        
        {showCreateVisit && !currentRoomId && (
          <button
            onClick={handleCreateVisit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? translate('Creating...') : translate('Create Visit')}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
        {roomMessages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            {translate('No messages yet. Start a conversation!')}
          </p>
        ) : (
          <div className="space-y-3">
            {roomMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === getCurrentUser()?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${getSenderColor(message)}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium">
                      {getSenderDisplayName(message)}
                    </span>
                    <span className="text-xs opacity-75">
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send message */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          placeholder={translate('Type your message...')}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          onClick={handleSend}
        >
          {translate('Send')}
        </button>
      </div>

      {/* Video Call */}
      {!showVideoCall ? (
        <button
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          onClick={handleStartVideoCall}
        >
          📹 {translate('Start Video Call')}
        </button>
      ) : (
        <div className="mt-4">
          <div className="bg-gray-100 p-4 rounded-lg mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {translate('Video Call with')} {userName}
            </h3>
            <p className="text-xs text-gray-500">
              {translate('Room ID')}: {currentRoomId}
            </p>
          </div>
          
          <JitsiMeetingWrapper
            roomName={currentRoomId}
            displayName={getCurrentUser()?.name || userName}
            onEnd={handleEndVideoCall}
          />
          
          <button
            className="mt-3 w-full bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            onClick={handleEndVideoCall}
          >
            {translate('End Call')}
          </button>
        </div>
      )}
    </section>
  );
}
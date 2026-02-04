import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import { Send } from 'lucide-react';

export default function Chat({ transactionId, otherUserName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

useEffect(() => {
  const socket = getSocket();

  // Verificar si ya está conectado
  if (socket.connected) {
    setConnected(true);
    socket.emit('join_chat', {
      transactionId,
      userId: user.id
    });
  }

  // Conectar eventos
  socket.on('connect', () => {
    setConnected(true);
    // Unirse al chat
    socket.emit('join_chat', {
      transactionId,
      userId: user.id
    });
  });

  socket.on('disconnect', () => {
    setConnected(false);
  });

  // Mensajes previos
  socket.on('previous_messages', (prevMessages) => {
    setMessages(prevMessages);
  });

  // Nuevo mensaje
  socket.on('new_message', (message) => {
    setMessages((prev) => [...prev, message]);
  });

  // Usuario escribiendo
  socket.on('user_typing', ({ userName }) => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  });

  // Limpiar al desmontar
  return () => {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('previous_messages');
    socket.off('new_message');
    socket.off('user_typing');
  };
}, [transactionId, user.id]);

  }, [transactionId, user.id]);

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !connected) return;

    const socket = getSocket();
    socket.emit('send_message', {
      transactionId,
      userId: user.id,
      userName: user.name,
      content: newMessage.trim()
    });

    setNewMessage('');
  };

  const handleTyping = () => {
    const socket = getSocket();
    socket.emit('typing', {
      transactionId,
      userName: user.name
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="bg-brand-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">Chat con {otherUserName}</h3>
            <p className="text-xs text-brand-100">
              {connected ? '🟢 Conectado' : '🔴 Desconectado'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No hay mensajes aún.</p>
            <p className="text-sm">¡Envía el primero!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.sender === user.id;
            
            return (
              <div
                key={index}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isOwnMessage
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold mb-1 opacity-70">
                      {message.senderName}
                    </p>
                  )}
                  <p className="break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-brand-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 text-gray-500 text-sm italic">
              {otherUserName} está escribiendo...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            maxLength={1000}
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !connected}
            className="bg-brand-600 text-white p-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
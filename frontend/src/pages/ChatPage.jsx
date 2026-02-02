import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTransaction } from '../services/api';
import { initSocket } from '../services/socket';
import Navbar from '../components/Navbar';
import Chat from '../components/Chat';
import { ArrowLeft } from 'lucide-react';

export default function ChatPage() {
  const { transactionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    loadTransaction();
    initSocket(); // Inicializar socket al montar
  }, [transactionId]);

  const loadTransaction = async () => {
    try {
      const response = await getTransaction(transactionId);
      const txn = response.data.data;
      setTransaction(txn);

      // Determinar quién es el otro usuario
      const isClient = txn.client._id === user.id;
      setOtherUser(isClient ? txn.provider : txn.client);
    } catch (error) {
      console.error('Error al cargar transacción:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-600">Transacción no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/wallet')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Volver a Wallet
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {transaction.serviceTitle}
          </h2>
          <p className="text-gray-600">
            {transaction.trueqqAmount} Trueqqs • {transaction.status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}
          </p>
        </div>

        <Chat 
          transactionId={transactionId}
          otherUserName={otherUser?.name}
        />
      </div>
    </div>
  );
}
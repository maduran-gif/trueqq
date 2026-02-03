// Fixed return
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTransactions } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';

export default function Wallet() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'sent', 'received'

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const type = filter === 'all' ? '' : filter;
      const response = await getMyTransactions(type);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-brand-600 to-blue-500 text-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-brand-100 mb-2">Saldo Disponible</p>
              <p className="text-5xl font-bold mb-4">{user?.trueqqBalance || 0} Trueqqs</p>
              <div className="flex items-center gap-3">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {user?.accountType}
                </span>
                <span className="text-brand-100 text-sm">
                  {user?.name}
                </span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <WalletIcon size={40} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                filter === 'sent'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Enviadas
            </button>
            <button
              onClick={() => setFilter('received')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                filter === 'received'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Recibidas
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Historial de Transacciones</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
              <p className="mt-4 text-gray-600">Cargando transacciones...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg">No hay transacciones aún</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 text-brand-600 hover:underline"
              >
                Explorar servicios
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map(transaction => {
                const isSent = transaction.client === user.id;
                const isReceived = transaction.provider === user.id;

                return (
                  <div key={transaction._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {isSent ? (
                            <div className="bg-red-100 p-2 rounded-full">
                              <TrendingDown size={20} className="text-red-600" />
                            </div>
                          ) : (
                            <div className="bg-green-100 p-2 rounded-full">
                              <TrendingUp size={20} className="text-green-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-gray-900">{transaction.serviceTitle}</h3>
                            <p className="text-sm text-gray-600">
                              {isSent ? `Para: ${transaction.providerName}` : `De: ${transaction.clientName}`}
                            </p>
                          </div>
                        </div>
                        <div className="ml-14">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {transaction.status === 'completed' ? 'Completada' : 
                             transaction.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          isSent ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {isSent ? '-' : '+'}{transaction.trueqqAmount}
                        </p>
                        <p className="text-sm text-gray-500">Trueqqs</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>  
      </div>
    </div>
    {transaction.chatActive && (
  <button
    onClick={() => navigate(`/chat/${transaction._id}`)}
    className="mt-3 w-full bg-brand-100 text-brand-600 py-2 rounded-lg font-semibold hover:bg-brand-200 transition-colors flex items-center justify-center gap-2"
  >
    <MessageSquare size={18} />
    Abrir Chat
  </button>
)}
}
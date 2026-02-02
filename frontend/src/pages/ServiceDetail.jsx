import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getService, requestService, getServiceReviews } from '../services/api';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import { ArrowLeft, User, MessageSquare } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams();
  const { user, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadService();
    loadReviews();
  }, [id]);

  const loadService = async () => {
    try {
      const response = await getService(id);
      setService(response.data.data);
    } catch (error) {
      console.error('Error al cargar servicio:', error);
      setError('No se pudo cargar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await getServiceReviews(id);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error al cargar reviews:', error);
    }
  };

  const handleRequest = async () => {
    if (user.trueqqBalance < service.trueqqPrice) {
      setError(`No tienes suficientes Trueqqs. Necesitas ${service.trueqqPrice} pero solo tienes ${user.trueqqBalance}`);
      return;
    }

    setRequesting(true);
    setError('');

    try {
      const response = await requestService(service._id);
      const newBalance = response.data.data.newBalance;
      
      updateBalance(newBalance);
      setSuccess(`¡Servicio solicitado! Se descontaron ${service.trueqqPrice} Trueqqs. Chat activado con ${service.providerName}.`);
      
      setTimeout(() => {
        navigate('/wallet');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al solicitar servicio');
    } finally {
      setRequesting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-600">Servicio no encontrado</p>
        </div>
      </div>
    );
  }

  const isMyService = service.provider._id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-blue-500 text-white p-8">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                <div className="flex items-center gap-4 text-brand-100">
                  <div className="flex items-center gap-1">
                    <StarRating rating={parseFloat(service.rating)} size={18} />
                  </div>
                  <span>•</span>
                  <span>{service.category}</span>
                  {service.community && (
                    <>
                      <span>•</span>
                      <span>{service.community.icon} {service.community.name}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-white text-brand-600 px-6 py-3 rounded-full">
                <span className="text-2xl font-bold">{service.trueqqPrice}</span>
                <span className="text-sm ml-1">Trueqqs</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>

            {/* Provider */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Proveedor</h2>
              <div className="flex items-center gap-4">
                <div className="bg-brand-100 p-3 rounded-full">
                  <User size={24} className="text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{service.provider.name}</p>
                  <p className="text-sm text-gray-600">{service.provider.email}</p>
                  <span className="inline-block mt-1 text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded">
                    {service.provider.accountType}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{service.timesRequested}</p>
                <p className="text-sm text-gray-600">Veces solicitado</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{service.rating}</p>
                <p className="text-sm text-gray-600">Calificación</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-sm text-gray-600">Reseñas</p>
              </div>
            </div>

            {/* Actions */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2">
                <MessageSquare size={20} />
                {success}
              </div>
            )}

            {isMyService ? (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-center">
                Este es tu servicio
              </div>
            ) : (
              <button
                onClick={handleRequest}
                disabled={requesting}
                className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {requesting ? 'Solicitando...' : `Solicitar Servicio (${service.trueqqPrice} Trueqqs)`}
              </button>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Calificaciones ({reviews.length})
            </h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-100 p-2 rounded-full">
                      <User size={20} className="text-brand-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.client.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                        <StarRating rating={review.rating} size={16} />
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
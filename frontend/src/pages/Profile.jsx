import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServices } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, User, Mail, Briefcase, Calendar, Award } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyServices();
  }, []);

  const loadMyServices = async () => {
    try {
      const response = await getServices();
      const userServices = response.data.data.filter(
        service => service.provider._id === user.id
      );
      setMyServices(userServices);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAccountBadge = (accountType) => {
    const badges = {
      free: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Free' },
      freemium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Freemium' },
      premium: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Premium' }
    };
    return badges[accountType] || badges.free;
  };

  const badge = getAccountBadge(user?.accountType);

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

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end gap-6 -mt-16">
              <div className="bg-white p-2 rounded-2xl shadow-lg">
                <div className="bg-purple-100 p-6 rounded-xl">
                  <User size={64} className="text-purple-600" />
                </div>
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold`}>
                    {badge.label}
                  </span>
                  <span className="text-gray-600 flex items-center gap-1">
                    <Mail size={16} />
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Briefcase size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{myServices.length}</p>
                <p className="text-sm text-gray-600">Servicios Publicados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Award size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{user?.trueqqBalance}</p>
                <p className="text-sm text-gray-600">Trueqqs Disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Miembro desde</p>
                <p className="text-xs text-gray-600">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Services */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Mis Servicios Publicados</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : myServices.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No has publicado servicios aún</p>
              <button
                onClick={() => navigate('/create-service')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Publicar mi primer servicio
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {myServices.map(service => (
                <div
                  key={service._id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/services/${service._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {service.category}
                        </span>
                        {service.community && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {service.community.icon} {service.community.name}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          service.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {service.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-purple-600">{service.trueqqPrice}</p>
                      <p className="text-sm text-gray-500">Trueqqs</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {service.timesRequested} veces solicitado
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServices, getCommunities } from '../services/api';
import Navbar from '../components/Navbar';
import { Search, Plus, Star } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedCommunity]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesRes, communitiesRes] = await Promise.all([
        getServices({ community: selectedCommunity }),
        getCommunities()
      ]);
      
      setServices(servicesRes.data.data);
      setCommunities(communitiesRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.name} 👋
          </h1>
          <p className="text-gray-600">
            Explora servicios o publica el tuyo
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todas las comunidades</option>
            {communities.map(community => (
              <option key={community._id} value={community._id}>
                {community.icon} {community.name}
              </option>
            ))}
          </select>

          <Link
            to="/create-service"
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            Publicar Servicio
          </Link>
        </div>

        {/* Services grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Cargando servicios...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No se encontraron servicios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <Link
                key={service._id}
                to={`/services/${service._id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {service.trueqqPrice} T
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{service.rating}</span>
                  <span className="text-xs text-gray-500">• {service.category}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">por {service.providerName}</span>
                  {service.community && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {service.community.icon} {service.community.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServices } from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Search } from 'lucide-react';

const COMMUNITIES = [
  // GRUPO 1: CUERPO & MENTE
  { 
    name: 'Fitness & Bienestar', 
    icon: '💪',
    description: 'Deporte, yoga, meditación, salud',
    color: 'bg-brand-50'
  },
  { 
    name: 'Profesionales de la salud', 
    icon: '⚕️',
    description: 'Médicos, psicólogos, terapeutas',
    color: 'bg-gray-50'
  },
  { 
    name: 'Estilo & Imagen', 
    icon: '💇',
    description: 'Belleza, peluquería, moda',
    color: 'bg-brand-50'
  },
  
  // GRUPO 2: HOGAR & ESPACIO
  { 
    name: 'Construcción & Reparaciones', 
    icon: '🔧',
    description: 'Albañilería, plomería, electricidad',
    color: 'bg-gray-50'
  },
  { 
    name: 'Limpieza & Mantenimiento', 
    icon: '🧹',
    description: 'Limpieza del hogar, organización',
    color: 'bg-brand-50'
  },
  { 
    name: 'Jardinería & Exteriores', 
    icon: '🌱',
    description: 'Jardines, plantas, paisajismo',
    color: 'bg-gray-50'
  },
  
  // GRUPO 3: ALIMENTACIÓN & MOVILIDAD
  { 
    name: 'Cocina & Alimentos', 
    icon: '🍳',
    description: 'Gastronomía, catering, repostería',
    color: 'bg-brand-50'
  },
  { 
    name: 'Transporte & Logística', 
    icon: '🚚',
    description: 'Movilidad, entregas, mudanzas',
    color: 'bg-gray-50'
  },
  
  // GRUPO 4: CREATIVIDAD & TECNOLOGÍA
  { 
    name: 'Arte & Manualidades', 
    icon: '🎨',
    description: 'Pintura, artesanías, joyería',
    color: 'bg-brand-50'
  },
  { 
    name: 'Fotografía & Video', 
    icon: '📸',
    description: 'Fotografía, video, edición',
    color: 'bg-gray-50'
  },
  { 
    name: 'Tecnología & Digital', 
    icon: '💻',
    description: 'Programación, soporte técnico',
    color: 'bg-brand-50'
  },
  
  // GRUPO 5: APRENDIZAJE & CUIDADO
  { 
    name: 'Educación & Formación', 
    icon: '🎓',
    description: 'Clases, tutorías, talleres',
    color: 'bg-gray-50'
  },
  { 
    name: 'Cuidado & Acompañamiento', 
    icon: '💝',
    description: 'Mascotas, adultos mayores, niños',
    color: 'bg-brand-50'
  },
  
  // GRUPO 6: NEGOCIOS & PROFESIONAL
  { 
    name: 'Emprendimiento-Empresa', 
    icon: '💼',
    description: 'Consultoría, marketing, negocios',
    color: 'bg-gray-50'
  },
  { 
    name: 'Legal & Trámites', 
    icon: '⚖️',
    description: 'Abogados, gestoría, trámites',
    color: 'bg-brand-50'
  },
  
  // GRUPO 7: VIDA & OCIO
  { 
    name: 'Experiencias & Ocio', 
    icon: '🎉',
    description: 'Eventos, turismo, entretenimiento',
    color: 'bg-gray-50'
  }
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityClick = (communityName) => {
    navigate(`/community/${encodeURIComponent(communityName)}`);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Por ahora solo filtra localmente - después implementarás búsqueda real
      console.log('Buscar:', searchTerm);
    }
  };

  const filteredServices = searchTerm
    ? services.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : services;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-600">
            Explora las comunidades y encuentra el servicio perfecto
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca servicios: yoga, programación, limpieza..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Quick Action */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/create-service')}
            className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Publicar Servicio
          </button>
        </div>

        {/* Communities Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explora por Categorías
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {COMMUNITIES.map((community) => {
                const communityServices = services.filter(s => s.category === community.name);
                return (
                  <div
                    key={community.name}
                    onClick={() => handleCommunityClick(community.name)}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100 hover:border-brand-500"
                  >
                    <div className={`${community.color} p-8 text-center group-hover:bg-brand-100 transition-colors duration-300`}>
                      <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {community.icon}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 text-center group-hover:text-brand-600 transition-colors">
                        {community.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-center mb-3">
                        {community.description}
                      </p>
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">
                          {communityServices.length} {communityServices.length === 1 ? 'servicio' : 'servicios'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent/Filtered Services */}
        {filteredServices.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Servicios Recientes'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.slice(0, 6).map((service) => (
                <div
                  key={service._id}
                  onClick={() => handleServiceClick(service._id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 border border-gray-100 hover:border-brand-500 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex-1 group-hover:text-brand-600 transition-colors">
                      {service.title}
                    </h3>
                    <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-2">
                      {service.trueqqPrice} Trueqqs
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{service.category}</span>
                    <span>⭐ {service.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {searchTerm && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No encontramos servicios para "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-brand-600 hover:text-brand-700 font-semibold"
            >
              Ver todos los servicios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
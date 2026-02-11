import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServices } from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Search } from 'lucide-react';
import Footer from '../components/Footer';

const COMMUNITIES = [
  // GRUPO 1: CUERPO & MENTE
  { 
    name: 'Fitness & Bienestar', 
    icon: '💪',
    description: 'Deporte, yoga, meditación',
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
    description: 'Albañilería, plomería',
    color: 'bg-gray-50'
  },
  { 
    name: 'Limpieza & Mantenimiento', 
    icon: '🧹',
    description: 'Limpieza, organización',
    color: 'bg-brand-50'
  },
  { 
    name: 'Jardinería & Exteriores', 
    icon: '🌱',
    description: 'Jardines, paisajismo',
    color: 'bg-gray-50'
  },
  
  // GRUPO 3: ALIMENTACIÓN & MOVILIDAD
  { 
    name: 'Cocina & Alimentos', 
    icon: '🍳',
    description: 'Gastronomía, catering',
    color: 'bg-brand-50'
  },
  { 
    name: 'Transporte & Logística', 
    icon: '🚚',
    description: 'Movilidad, entregas',
    color: 'bg-gray-50'
  },
  
  // GRUPO 4: CREATIVIDAD & TECNOLOGÍA
  { 
    name: 'Arte & Manualidades', 
    icon: '🎨',
    description: 'Pintura, artesanías',
    color: 'bg-brand-50'
  },
  { 
    name: 'Fotografía & Video', 
    icon: '📸',
    description: 'Fotografía, edición',
    color: 'bg-gray-50'
  },
  { 
    name: 'Tecnología & Digital', 
    icon: '💻',
    description: 'Programación, soporte',
    color: 'bg-brand-50'
  },
  
  // GRUPO 5: APRENDIZAJE & CUIDADO
  { 
    name: 'Educación & Formación', 
    icon: '🎓',
    description: 'Clases, tutorías',
    color: 'bg-gray-50'
  },
  { 
    name: 'Cuidado & Acompañamiento', 
    icon: '💝',
    description: 'Mascotas, adultos mayores',
    color: 'bg-brand-50'
  },
  
  // GRUPO 6: NEGOCIOS & PROFESIONAL
  { 
    name: 'Emprendimiento-Empresa', 
    icon: '💼',
    description: 'Consultoría, marketing',
    color: 'bg-gray-50'
  },
  { 
    name: 'Legal & Trámites', 
    icon: '⚖️',
    description: 'Abogados, gestoría',
    color: 'bg-brand-50'
  },
  
  // GRUPO 7: VIDA & OCIO
  { 
    name: 'Experiencias & Ocio', 
    icon: '🎉',
    description: 'Eventos, entretenimiento',
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

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar búsqueda después
    console.log('Buscar:', searchTerm);
  };

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

        {/* Search Bar + Publish Button */}
        <div className="mb-8 flex gap-4">
          <form onSubmit={handleSearch} className="flex-1">
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
          
          <button
            onClick={() => navigate('/create-service')}
            className="bg-brand-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-brand-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap min-w-[200px]"
          >
            <Plus size={20} />
            Publicar Servicio
          </button>
        </div>

        {/* Communities Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explora por Categorías
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {COMMUNITIES.map((community) => {
                const communityServices = services.filter(s => s.category === community.name);
                
                return (
                  <div
                    key={community.name}
                    onClick={() => handleCommunityClick(community.name)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100 hover:border-brand-500"
                  >
                    <div className={`${community.color} p-6 text-center group-hover:bg-brand-100 transition-colors duration-300`}>
                      <div className="text-5xl mb-1 group-hover:scale-110 transition-transform duration-300">
                        {community.icon}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900 text-sm text-center mb-1 group-hover:text-brand-600 transition-colors">
                        {community.name}
                      </h3>
                      <p className="text-xs text-gray-600 text-center mb-2 line-clamp-1">
                        {community.description}
                      </p>
                      <div className="text-center">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">
                          {communityServices.length}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
 </div>
      </div>
      
      <Footer />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServices } from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Search, X } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearchTerm(''); // Limpiar búsqueda al seleccionar categoría
    
    // Scroll suave a la sección de servicios
    setTimeout(() => {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSelectedCategory(null); // Limpiar filtro de categoría al buscar
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
  };

  // Filtrar servicios por búsqueda o categoría
  const filteredServices = services.filter(service => {
    // Si hay categoría seleccionada, filtrar por categoría
    if (selectedCategory) {
      return service.category === selectedCategory;
    }
    
    // Si hay término de búsqueda, filtrar por búsqueda
    if (searchTerm) {
      return (
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Si no hay filtros, mostrar todos
    return true;
  });

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
        <div className="mb-8 flex gap-4 items-center">
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
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
            className="bg-brand-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
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
                const isSelected = selectedCategory === community.name;
                
                return (
                  <div
                    key={community.name}
                    onClick={() => handleCategoryClick(community.name)}
                    className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border-2 ${
                      isSelected ? 'border-brand-600' : 'border-gray-100 hover:border-brand-500'
                    }`}
                  >
                    <div className={`${community.color} p-8 text-center ${
                      isSelected ? 'bg-brand-100' : 'group-hover:bg-brand-100'
                    } transition-colors duration-300`}>
                      <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {community.icon}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className={`font-bold mb-2 text-center transition-colors ${
                        isSelected ? 'text-brand-600' : 'text-gray-900 group-hover:text-brand-600'
                      }`}>
                        {community.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-center mb-3">
                        {community.description}
                      </p>
                      <div className="text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          isSelected 
                            ? 'bg-brand-100 text-brand-700' 
                            : 'bg-gray-100 text-gray-700 group-hover:bg-brand-100 group-hover:text-brand-700'
                        }`}>
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

        {/* Services Section */}
        <div id="services-section">
          {/* Active Filters */}
          {(selectedCategory || searchTerm) && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-gray-600 font-medium">Filtrando por:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {selectedCategory}
                  <button onClick={clearFilters} className="hover:bg-brand-200 rounded-full p-1">
                    <X size={14} />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold">
                  "{searchTerm}"
                  <button onClick={clearFilters} className="hover:bg-brand-200 rounded-full p-1">
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}

          {filteredServices.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedCategory 
                  ? `Servicios de ${selectedCategory}` 
                  : searchTerm 
                    ? `Resultados para "${searchTerm}"` 
                    : 'Todos los Servicios'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
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
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                {selectedCategory 
                  ? `No hay servicios en la categoría "${selectedCategory}" todavía`
                  : searchTerm 
                    ? `No encontramos servicios para "${searchTerm}"`
                    : 'No hay servicios disponibles'}
              </p>
              <button
                onClick={clearFilters}
                className="text-brand-600 hover:text-brand-700 font-semibold"
              >
                Ver todos los servicios
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
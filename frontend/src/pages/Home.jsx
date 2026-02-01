import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServices } from '../services/api';
import Navbar from '../components/Navbar';
import { Search, Plus, Star, X } from 'lucide-react';

const CATEGORIES = [
  'Fitness & Bienestar',
  'Transporte & Logística',
  'Hogar & Construcción',
  'Cocina & Alimentos',
  'Tecnología & Digital',
  'Arte, Diseño & Manualidades',
  'Educación & Cuidado',
  'Estilo & Imagen',
  'Experiencias & Ocio',
  'Administrativo & Oficina'
];

const PLACEHOLDER_EXAMPLES = [
  'Busca clases de yoga...',
  'Busca transporte al aeropuerto...',
  'Busca tutores de matemáticas...',
  'Busca cocineros para eventos...',
  'Busca electricistas en tu zona...',
  'Busca diseñadores gráficos...',
  'Busca profesores de inglés...',
  'Busca mecánicos de confianza...'
];

export default function Home() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await getServices();
      setServices(response.data.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    setAppliedSearch('');
  };

  const filteredServices = services.filter(service => {
    const matchesSearch =
      appliedSearch === '' ||
      service.title.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      service.description.toLowerCase().includes(appliedSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === '' ||
      service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.name} 👋
          </h1>
          <p className="text-gray-600">Explora servicios o publica el tuyo</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={PLACEHOLDER_EXAMPLES[placeholderIndex]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {searchTerm && (
                <button onClick={handleClear} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Search size={18} />
              Buscar
            </button>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            style={{ WebkitAppearance: 'auto', appearance: 'auto', backgroundColor: 'white' }}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <Link
            to="/create-service"
            className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Publicar Servicio
          </Link>
        </div>

        {(appliedSearch || selectedCategory) && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Filtros activos:</span>
            {appliedSearch && (
              <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm">
                🔍 "{appliedSearch}"
                <button onClick={handleClear} className="hover:text-purple-900"><X size={14} /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm">
                📂 {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:text-purple-900"><X size={14} /></button>
              </span>
            )}
            <button
              onClick={() => { handleClear(); setSelectedCategory(''); }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Limpiar todos
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            <p className="mt-4 text-gray-600">Cargando servicios...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {appliedSearch || selectedCategory
                ? 'No se encontraron servicios con ese filtro'
                : 'No se encontraron servicios'}
            </p>
            {(appliedSearch || selectedCategory) && (
              <button
                onClick={() => { handleClear(); setSelectedCategory(''); }}
                className="mt-3 text-brand-600 hover:text-brand-700 font-semibold"
              >
                Limpiar filtros
              </button>
            )}
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
                  <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {service.trueqqPrice} T
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
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

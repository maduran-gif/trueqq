import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServices } from '../services/api';
import Navbar from '../components/Navbar';
import { Plus } from 'lucide-react';

const COMMUNITIES = [
  // GRUPO 1: CUERPO & MENTE
  { 
    name: 'Fitness & Bienestar', 
    icon: '💪',
    description: 'Deporte, yoga, meditación, salud física y mental',
    color: 'from-green-400 to-cyan-500'
  },
  { 
    name: 'Profesionales de la salud', 
    icon: '⚕️',
    description: 'Médicos, psicólogos, fisioterapeutas, nutricionistas',
    color: 'from-red-400 to-pink-500'
  },
  { 
    name: 'Estilo & Imagen', 
    icon: '💇',
    description: 'Belleza, peluquería, maquillaje, moda, asesoría de imagen',
    color: 'from-purple-400 to-pink-500'
  },
  
  // GRUPO 2: HOGAR & ESPACIO
  { 
    name: 'Construcción & Reparaciones', 
    icon: '🔧',
    description: 'Albañilería, plomería, electricidad, pintura, reparaciones',
    color: 'from-orange-400 to-red-500'
  },
  { 
    name: 'Limpieza & Mantenimiento', 
    icon: '🧹',
    description: 'Limpieza del hogar, lavandería, organización, limpieza profunda',
    color: 'from-blue-400 to-cyan-500'
  },
  { 
    name: 'Jardinería & Exteriores', 
    icon: '🌱',
    description: 'Jardines, plantas, paisajismo, mantenimiento exterior',
    color: 'from-green-400 to-emerald-500'
  },
  
  // GRUPO 3: ALIMENTACIÓN & MOVILIDAD
  { 
    name: 'Cocina & Alimentos', 
    icon: '🍳',
    description: 'Gastronomía, catering, repostería, clases de cocina',
    color: 'from-yellow-400 to-orange-500'
  },
  { 
    name: 'Transporte & Logística', 
    icon: '🚚',
    description: 'Movilidad, entregas, mudanzas, mensajería',
    color: 'from-blue-400 to-indigo-500'
  },
  
  // GRUPO 4: CREATIVIDAD & TECNOLOGÍA
  { 
    name: 'Arte & Manualidades', 
    icon: '🎨',
    description: 'Pintura, escultura, artesanías, joyería, tejido',
    color: 'from-pink-400 to-rose-500'
  },
  { 
    name: 'Fotografía & Video', 
    icon: '📸',
    description: 'Fotografía de eventos, sesiones, edición de foto y video',
    color: 'from-indigo-400 to-purple-500'
  },
  { 
    name: 'Tecnología & Digital', 
    icon: '💻',
    description: 'Programación, soporte técnico, diseño web, apps',
    color: 'from-cyan-400 to-blue-500'
  },
  
  // GRUPO 5: APRENDIZAJE & CUIDADO
  { 
    name: 'Educación & Formación', 
    icon: '🎓',
    description: 'Clases, tutorías, talleres, capacitaciones, idiomas',
    color: 'from-blue-400 to-purple-500'
  },
  { 
    name: 'Cuidado & Acompañamiento', 
    icon: '💝',
    description: 'Cuidado de mascotas, adultos mayores, niños, compañía',
    color: 'from-pink-400 to-red-500'
  },
  
  // GRUPO 6: NEGOCIOS & PROFESIONAL
  { 
    name: 'Emprendimiento-Empresa', 
    icon: '💼',
    description: 'Consultoría, marketing, contabilidad, administración',
    color: 'from-gray-400 to-slate-500'
  },
  { 
    name: 'Legal & Trámites', 
    icon: '⚖️',
    description: 'Abogados, gestoría, trámites, documentos legales',
    color: 'from-slate-400 to-gray-600'
  },
  
  // GRUPO 7: VIDA & OCIO
  { 
    name: 'Experiencias & Ocio', 
    icon: '🎉',
    description: 'Eventos, turismo, entretenimiento, DJ, animación',
    color: 'from-purple-400 to-pink-500'
  }
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

        {/* Quick Actions */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/create-service')}
            className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Publicar Servicio
          </button>
        </div>

        {/* Communities Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explora por Categorías
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {COMMUNITIES.map((community) => (
                <div
                  key={community.name}
                  onClick={() => handleCommunityClick(community.name)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                >
                  <div className={`bg-gradient-to-br ${community.color} p-6 text-center`}>
                    <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                      {community.icon}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 text-center">
                      {community.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      {community.description}
                    </p>
                    <div className="mt-4 text-center">
                      <span className="text-xs text-brand-600 font-semibold">
                        {services.filter(s => s.category === community.name).length} servicios
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Services */}
        {services.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Servicios Recientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service) => (
                <div
                  key={service._id}
                  onClick={() => navigate(`/service/${service._id}`)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex-1">
                      {service.title}
                    </h3>
                    <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-2">
                      {service.trueqqPrice} Trueqqs
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{service.category}</span>
                    <span>⭐ {service.rating}</span>
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
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServices } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

export default function CommunityPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoryName = decodeURIComponent(category);

  useEffect(() => {
    loadServices();
  }, [category]);

  const loadServices = async () => {
    try {
      const response = await getServices();
      const filteredServices = response.data.data.filter(
        service => service.category === categoryName
      );
      setServices(filteredServices);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver al inicio
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-600">
            {services.length} {services.length === 1 ? 'servicio disponible' : 'servicios disponibles'}
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
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
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {service.provider?.name || 'Proveedor'}
                  </span>
                  <span className="text-gray-500">⭐ {service.rating}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">
              No hay servicios en esta categoría todavía
            </p>
            <button
              onClick={() => navigate('/create-service')}
              className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors"
            >
              Sé el primero en publicar
            </button>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}
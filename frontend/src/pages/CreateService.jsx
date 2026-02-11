import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createService } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  // GRUPO 1: CUERPO & MENTE
  'Fitness & Bienestar',
  'Profesionales de la salud',
  'Estilo & Imagen',
  
  // GRUPO 2: HOGAR & ESPACIO
  'Construcción & Reparaciones',
  'Limpieza & Mantenimiento',
  'Jardinería & Exteriores',
  
  // GRUPO 3: ALIMENTACIÓN & MOVILIDAD
  'Cocina & Alimentos',
  'Transporte & Logística',
  
  // GRUPO 4: CREATIVIDAD & TECNOLOGÍA
  'Arte & Manualidades',
  'Fotografía & Video',
  'Tecnología & Digital',
  
  // GRUPO 5: APRENDIZAJE & CUIDADO
  'Educación & Formación',
  'Cuidado & Acompañamiento',
  
  // GRUPO 6: NEGOCIOS & PROFESIONAL
  'Emprendimiento-Empresa',
  'Legal & Trámites',
  
  // GRUPO 7: VIDA & OCIO
  'Experiencias & Ocio'
];

export default function CreateService() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hours, setHours] = useState('');
  const [numberWarning, setNumberWarning] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });

  const detectLongNumbers = (text) => {
    // Detecta números de 5 o más dígitos seguidos
    const longNumberPattern = /\d{5,}/;
    return longNumberPattern.test(text);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si es el campo de descripción, validar números
    if (name === 'description') {
      if (detectLongNumbers(value)) {
        setNumberWarning('⚠️ No incluyas números de teléfono o contacto. Usa el chat de Trueqq para comunicarte.');
        return; // No actualizar si hay números largos
      } else {
        setNumberWarning('');
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleHoursChange = (e) => {
    setHours(e.target.value);
  };

  const calculatedPrice = hours ? Number(hours) * 100 : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación final antes de enviar
    if (detectLongNumbers(formData.description)) {
      setError('No puedes incluir números de teléfono o contacto en la descripción');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createService({
        ...formData,
        trueqqPrice: calculatedPrice
      });
      navigate('/home');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicar Nuevo Servicio</h1>
            <p className="text-gray-600">Comparte tus habilidades con la comunidad</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Servicio *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Ej: Clases de Yoga para principiantes"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Servicio *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none whitespace-pre-wrap"
                placeholder="Describe tu servicio en detalle:

- ¿Qué ofreces exactamente?
- ¿Cuánta experiencia tienes?
- ¿A quién está dirigido?
- ¿Es presencial, virtual o a domicilio?
- ¿Qué incluye el servicio?
- ¿Qué debe saber el cliente antes de contratarte?

Recuerda: NO incluyas números de teléfono o WhatsApp. 
Toda la comunicación se hace por el chat de Trueqq."
                required
                style={{ whiteSpace: 'pre-wrap' }}
              />
              {numberWarning && (
                <div className="mt-2 flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{numberWarning}</p>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                💡 Tip: Cuanto más detallada sea tu descripción, más fácil será que encuentres clientes.
              </p>
            </div>

            {/* Categoría y Horas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    WebkitAppearance: 'auto',
                    appearance: 'auto',
                    backgroundColor: 'white',
                    height: '50px',
                    width: '100%',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo del servicio (horas) *
                </label>
                <input
                  type="number"
                  name="hours"
                  value={hours}
                  onChange={handleHoursChange}
                  min="0.5"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="2"
                  required
                />
                {hours && (
                  <p className="mt-2 text-sm text-brand-600 font-semibold">
                    Este servicio valdrá: {calculatedPrice} Trueqqs
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  1 hora = 100 Trueqqs
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !!numberWarning}
                className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Publicando...'
                ) : (
                  <>
                    <Plus size={20} />
                    Publicar Servicio
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
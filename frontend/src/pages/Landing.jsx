import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star } from 'lucide-react';

const HOW_IT_WORKS = [
  { step: '1', title: 'Crea tu perfil', description: 'Regístrate y cuenta quién eres. Puedes compartir lo que sabes hacer y lo que necesitas aprender.', icon: '👤' },
  { step: '2', title: 'Publica o busca servicios', description: 'Ofrece lo que sabes hacer, o busca lo que necesitas. Desde clases hasta transporte, todo tiene valor.', icon: '🔍' },
  { step: '3', title: 'Intercambia sin dinero', description: 'Cuando alguien solicita tu servicio, se genera un intercambio. Así crece la comunidad.', icon: '🤝' }
];

const SERVICE_EXAMPLES = [
  { title: 'Clases de Yoga', category: 'Fitness & Bienestar', price: 40, provider: 'Laura M.' },
  { title: 'Diseño de logos', category: 'Arte, Diseño & Manualidades', price: 60, provider: 'Alejandro R.' },
  { title: 'Transporte al aeropuerto', category: 'Transporte & Logística', price: 30, provider: 'Diego P.' },
  { title: 'Clases de inglés', category: 'Educación & Cuidado', price: 50, provider: 'Valentina S.' },
  { title: 'Reparación de plomería', category: 'Hogar & Construcción', price: 55, provider: 'Carlos E.' },
  { title: 'Cena para eventos', category: 'Cocina & Alimentos', price: 70, provider: 'María G.' }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-600">Trueqq</h1>
          <div className="flex gap-3">
            <Link to="/login" className="text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">Iniciar sesión</Link>
            <Link to="/register" className="bg-brand-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Registrarte</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 via-brand-500 to-blue-500 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Intercambia servicios.<br />
            <span style={{ color: '#D4FF00' }}>Sin dinero.</span>
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-10">
            Trueqq es una comunidad donde las personas comparten sus habilidades y reciben ayuda a cambio. No necesitas pagar, solo contribuir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center gap-2 text-white font-semibold text-lg px-8 py-4 rounded-xl border-2 border-white hover:bg-white hover:text-brand-600 transition-colors">
              Comienza gratis <ArrowRight size={22} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center text-green-100 font-semibold text-lg px-8 py-4 rounded-xl hover:text-white transition-colors">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">¿Cómo funciona?</h3>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">Es más simple de lo que imaginas. En tres pasos estás listo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold text-sm mb-4">{item.step}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ejemplos servicios */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Lo que la comunidad ofrece</h3>
            <p className="text-gray-600 text-lg">Estos son algunos ejemplos de servicios que podrías encontrar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_EXAMPLES.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{service.title}</h4>
                  <span className="bg-brand-100 text-brand-600 px-3 py-1 rounded-full text-sm font-semibold">{service.price} T</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{service.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">por {service.provider}</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">Ejemplo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que Trueqq */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">¿Por qué Trueqq?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Sin barreras económicas', desc: 'No necesitas dinero para acceder a servicios. Solo contribuir con lo que sabes.' },
              { title: 'Aprende mientras ayudas', desc: 'Cada intercambio es una oportunidad de aprender algo nuevo.' },
              { title: 'Comunidad real', desc: 'Conecta con personas cercanas que comparten intereses similares.' },
              { title: 'Tú decides el valor', desc: 'Los precios en Trueqqs los pones tú según lo que consideres justo.' }
            ].map((item, index) => (
              <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="bg-brand-100 p-2 rounded-lg h-fit">
                  <Check size={20} className="text-brand-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-brand-600 to-blue-500 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-4">¿Listo para empezar?</h3>
          <p className="text-green-100 text-lg mb-8">Únete a la comunidad y descubre lo que puedes lograr intercambiando.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-green-50 transition-colors shadow-lg">
            Registrarte gratis <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <p className="text-sm">© 2026 Trueqq. Economía colaborativa.</p>
      </footer>
    </div>
  );
}
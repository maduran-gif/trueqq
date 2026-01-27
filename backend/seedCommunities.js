const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Community = require('./models/Community');
const connectDB = require('./config/db');

dotenv.config();

const communities = [
  {
    name: 'Deportes & Fitness',
    description: 'Clases, entrenamiento, coaching deportivo',
    icon: '💪',
    color: '#EF4444'
  },
  {
    name: 'Tecnología',
    description: 'Reparaciones, desarrollo, soporte técnico',
    icon: '💻',
    color: '#3B82F6'
  },
  {
    name: 'Arte & Creatividad',
    description: 'Diseño, ilustración, fotografía, manualidades',
    icon: '🎨',
    color: '#EC4899'
  },
  {
    name: 'Educación',
    description: 'Clases, tutorías, mentorías',
    icon: '📚',
    color: '#8B5CF6'
  },
  {
    name: 'Música',
    description: 'Clases de instrumentos, producción, composición',
    icon: '🎵',
    color: '#F59E0B'
  },
  {
    name: 'Hogar & Reparaciones',
    description: 'Plomería, electricidad, carpintería',
    icon: '🔧',
    color: '#10B981'
  },
  {
    name: 'Idiomas',
    description: 'Clases y práctica de idiomas',
    icon: '🗣️',
    color: '#06B6D4'
  },
  {
    name: 'Bienestar',
    description: 'Yoga, meditación, terapias alternativas',
    icon: '🧘',
    color: '#A855F7'
  }
];

const seedCommunities = async () => {
  try {
    await connectDB();
    
    console.log('\n' + '='.repeat(50));
    console.log('🌱 INICIANDO SEED DE COMUNIDADES');
    console.log('='.repeat(50) + '\n');
    
    // Eliminar comunidades existentes
    await Community.deleteMany({});
    console.log('🗑️  Comunidades anteriores eliminadas');
    
    // Crear nuevas comunidades
    const createdCommunities = await Community.insertMany(communities);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('='.repeat(50));
    console.log(`📊 Total de comunidades creadas: ${createdCommunities.length}`);
    console.log('='.repeat(50) + '\n');
    
    createdCommunities.forEach((community, index) => {
      console.log(`${index + 1}. ${community.icon} ${community.name}`);
    });
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(50));
    console.error('❌ ERROR EN EL SEED');
    console.error('='.repeat(50));
    console.error(error);
    console.error('='.repeat(50) + '\n');
    process.exit(1);
  }
};

seedCommunities();
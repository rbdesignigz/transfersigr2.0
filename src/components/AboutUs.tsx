import { Shield, Sparkles, Award, Map, CheckCircle2, History, Users2 } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: <Award className="h-6 w-6 text-[#65d6e9]" />,
      title: '40 años de trayectoria operativa',
      description: 'Fundada en 1986, somos la empresa pionera y líder de traslados turísticos ejecutivos terrestres y excursiones personalizadas en la Triple Frontera.'
    },
    {
      icon: <Shield className="h-6 w-6 text-[#65d6e9]" />,
      title: 'seguridad civil homologada',
      description: 'Nuestra flota moderna posee habilitaciones de transporte nacional e internacional (CNRT en Argentina, ANTT en Brasil). Choferes profesionales capacitados.'
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[#65d6e9]" />,
      title: 'paso migratorio preferencial',
      description: 'Nuestros permisos consulares preferenciales agilizan extraordinariamente los tiempos de espera migratoria en aduanas bilaterales respecto a vehículos particulares.'
    },
    {
      icon: <Map className="h-6 w-6 text-[#65d6e9]" />,
      title: 'cobertura tricolor integral',
      description: 'Servicio integrado conectando aeropuertos, hoteles residenciales e hitos turísticos en Argentina, Brasil y Paraguay de manera ininterrumpida.'
    }
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-6 space-y-16">
      
      {/* Intro visual banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#65d6e9]/10 border border-[#65d6e9]/30 text-[#65d6e9] font-mono text-[10px] tracking-widest uppercase rounded-full">
            EXPERIENCIA OPERATIVA PIONERA
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight leading-none">
            MÁS QUE TRASLADOS, <br />
            <span className="text-[#65d6e9]">CONFIANZA INTEGRAL</span>
          </h2>
          <p className="text-gray-400 font-sans text-sm leading-relaxed">
            Nacimos con la vocación de conectar viajeros de todo el mundo con las majestuosas maravillas de las Cataratas del Iguazú y la Triple Frontera de manera ágil, confortable y absolutamente segura. Con más de cuatro décadas en las carreteras de Argentina, Brasil y Paraguay, formamos el equipo de choferes profesionales más experimentado del territorio.
          </p>

          <div className="space-y-3 font-mono text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#65d6e9]" />
              <span>Flota propia de autos tipo sedán ejecutivos y minivans especiales</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#65d6e9]" />
              <span>Atención técnica bilingüe en español, inglés y portugués</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#65d6e9]" />
              <span>Compromiso de puntualidad garantizada con monitoreo de vuelos</span>
            </div>
          </div>
        </div>

        {/* Decorative Grid Image stats panel */}
        <div className="bg-[#0f1214] border border-[#65d6e9]/20 rounded-xl p-8 space-y-6 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#65d6e9]/5 rounded-full blur-3xl"></div>
          
          <div className="text-center font-mono py-4 border-b border-gray-800">
            <span className="text-[#65d6e9] text-5xl font-black block tech-glow">40+ AÑOS</span>
            <span className="text-gray-400 text-[10px] tracking-widest uppercase">Marcando el estándar en transporte regional</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-[#0a0c0d] border border-gray-800 rounded">
              <span className="text-white text-2xl font-bold block">150.000+</span>
              <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wide">Viajes Completados</span>
            </div>
            <div className="p-4 bg-[#0a0c0d] border border-gray-800 rounded">
              <span className="text-white text-2xl font-bold block">24/7/365</span>
              <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wide">Monitoreo de Rutas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid values cards */}
      <div className="space-y-4">
        <div className="border-t border-gray-800 pt-8 text-center sm:text-left">
          <h3 className="font-mono text-gray-400 text-xs tracking-widest uppercase mb-4">
            NUESTROS PILARES TECNOLÓGICOS Y OPERATIVOS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div 
              key={i} 
              className="bg-[#0f1214] border border-gray-800 hover:border-[#65d6e9]/30 rounded-lg p-5 space-y-3 transition-colors hover:shadow-[0_0_15px_rgba(101,214,233,0.05)]"
            >
              <div className="p-2 border border-gray-800 bg-[#0a0c0d] w-fit rounded">
                {v.icon}
              </div>
              <h4 className="text-white font-mono text-[11px] font-bold uppercase tracking-widest">
                {v.title}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

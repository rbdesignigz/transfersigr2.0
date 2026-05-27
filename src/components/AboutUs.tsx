import { Shield, Sparkles, Award, Map, CheckCircle2, History, Users2 } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: <Award className="h-6 w-6 text-[var(--color-primary-base)]" />,
      title: '40 años de trayectoria operativa',
      description: 'Fundada en 1986, somos la empresa pionera y líder de traslados turísticos ejecutivos terrestres y excursiones personalizadas en la Triple Frontera.'
    },
    {
      icon: <Shield className="h-6 w-6 text-[var(--color-primary-base)]" />,
      title: 'seguridad civil homologada',
      description: 'Nuestra flota moderna posee habilitaciones de transporte nacional e internacional (CNRT en Argentina, ANTT en Brasil). Choferes profesionales capacitados.'
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[var(--color-primary-base)]" />,
      title: 'paso migratorio preferencial',
      description: 'Nuestros permisos consulares preferenciales agilizan extraordinariamente los tiempos de espera migratoria en aduanas bilaterales respecto a vehículos particulares.'
    },
    {
      icon: <Map className="h-6 w-6 text-[var(--color-primary-base)]" />,
      title: 'cobertura tricolor integral',
      description: 'Servicio integrado conectando aeropuertos, hoteles residenciales e hitos turísticos en Argentina, Brasil y Paraguay de manera ininterrumpida.'
    }
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-6 space-y-16">
      
      {/* Intro visual banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary-base)]/10 border border-[var(--color-primary-base)]/30 text-[var(--color-primary-base)] font-mono text-[10px] tracking-widest uppercase rounded-full">
            EXPERIENCIA OPERATIVA PIONERA
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[var(--text-main)] uppercase tracking-tight leading-none">
            MÁS QUE TRASLADOS, <br />
            <span className="text-[var(--color-primary-base)]">CONFIANZA INTEGRAL</span>
          </h2>
          <p className="text-[var(--text-muted)] font-sans text-sm leading-relaxed">
            Nacimos con la vocación de conectar viajeros de todo el mundo con las majestuosas maravillas de las Cataratas del Iguazú y la Triple Frontera de manera ágil, confortable y absolutamente segura. Con más de cuatro décadas en las carreteras de Argentina, Brasil y Paraguay, formamos el equipo de choferes profesionales más experimentado del territorio.
          </p>

          <div className="space-y-3 font-mono text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-primary-base)]" />
              <span>Flota propia de autos tipo sedán ejecutivos y minivans especiales</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-primary-base)]" />
              <span>Atención técnica bilingüe en español, inglés y portugués</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-primary-base)]" />
              <span>Compromiso de puntualidad garantizada con monitoreo de vuelos</span>
            </div>
          </div>
        </div>

        {/* Decorative Grid Image stats panel */}
        <div className="bg-[var(--bg-card)] border border-[var(--color-primary-base)]/20 rounded-xl p-8 space-y-6 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-base)]/5 rounded-full blur-3xl"></div>
          
          <div className="text-center font-mono py-4 border-b border-[var(--border-tech)]">
            <span className="text-[var(--color-primary-base)] text-5xl font-black block tech-glow">40+ AÑOS</span>
            <span className="text-[var(--text-muted)] text-[10px] tracking-widest uppercase">Marcando el estándar en transporte regional</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-[var(--bg-app)] border border-[var(--border-tech)] rounded">
              <span className="text-[var(--text-main)] text-2xl font-bold block">150.000+</span>
              <span className="text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-wide">Viajes Completados</span>
            </div>
            <div className="p-4 bg-[var(--bg-app)] border border-[var(--border-tech)] rounded">
              <span className="text-[var(--text-main)] text-2xl font-bold block">24/7/365</span>
              <span className="text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-wide">Monitoreo de Rutas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid values cards */}
      <div className="space-y-4">
        <div className="border-t border-[var(--border-tech)] pt-8 text-center sm:text-left">
          <h3 className="font-mono text-[var(--text-muted)] text-xs tracking-widest uppercase mb-4">
            NUESTROS PILARES TECNOLÓGICOS Y OPERATIVOS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div 
              key={i} 
              className="bg-[var(--bg-card)] border border-[var(--border-tech)] hover:border-[var(--color-primary-base)]/30 rounded-lg p-5 space-y-3 transition-colors hover:shadow-[0_0_15px_rgba(101,214,233,0.05)]"
            >
              <div className="p-2 border border-[var(--border-tech)] bg-[var(--bg-app)] w-fit rounded">
                {v.icon}
              </div>
              <h4 className="text-[var(--text-main)] font-mono text-[11px] font-bold uppercase tracking-widest">
                {v.title}
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

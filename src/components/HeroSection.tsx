import { Search } from 'lucide-react';

interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export default function HeroSection({ searchTerm, onSearchChange }: HeroSectionProps) {
  const scrollToDestinations = () => {
    document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-[600px] md:h-[650px] flex items-center justify-center overflow-hidden border-b border-[var(--border-tech)] pt-16">

      {/* Background Image with Tech Overlay */}
      <div className="absolute inset-0 z-0 bg-[var(--bg-app)]">
        <img
          alt="Cataratas de Iguazú de fondo"
          className="w-full h-full object-cover object-center opacity-35 mix-blend-luminosity select-none pointer-events-none"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4dhdpHUfnF2ycazhcU1vtg7tAoOf79QRzQczgKLscSEc_OOFChm1xMilnSdNLYtd6YMbTFruzfC6t_BmIQontwII_JIlPTEi5VwDkQhw5M_uLvd5ysyWXH3Y032rFRrWDKprga_lsZN5rfH2UV3F062dNOr6cuqWilLH61RiYOI7RYo_j_2kbLUo8JIxuH89YEt-nppswderlOwrGZTTX3_hgIxKF7EDTSA42u7MNFepmtd5wzc7AxTSsGnqTFCwh5w5aJYJMRsWm"
        />
        {/* Soft elegant gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-app)] via-transparent to-[var(--bg-app)]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-app)]/80 via-transparent to-[var(--bg-app)]/80"></div>
        {/* Tech subtle grid mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(101,214,233,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(101,214,233,0.02)_1px,transparent_1px)] bg-[size:45px_45px]"></div>
      </div>

      {/* Hero Content & Title Header */}
      <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center gap-6 mt-6">

        {/* System Online Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-[var(--bg-app)]/90 backdrop-blur-md border border-[var(--border-tech-hover)] text-[var(--color-primary-base)] font-mono text-[9px] sm:text-[10px] tracking-[0.25em] mb-3 shadow-[0_0_15px_rgba(101,214,233,0.15)] uppercase select-none rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-base)] animate-pulse mr-3 shadow-[0_0_8px_rgba(101,214,233,0.8)]"></span>
          BIENVENIDOS
        </div>

        {/* Display title with glowing ampersand */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-[var(--text-main)] tracking-tighter leading-none uppercase select-none">
          TRASLADOS <span className="text-[var(--color-primary-base)] opacity-90 tech-glow">&amp;</span> EXCURSIONES
        </h1>

        <p className="text-sm sm:text-base font-mono text-[var(--color-primary-base)]/80 tracking-[0.16em] uppercase font-light max-w-2xl">
          MÁS DE 40 AÑOS DE EXPERIENCIA OPERATIVA EN LA TRIPLE FRONTERA
        </p>

        {/* Simplified Search Bar Widget with Spinning Border */}
        <div className="mt-10 w-full max-w-2xl relative p-[2px] rounded-lg overflow-hidden shadow-[0_0_40px_rgba(101,214,233,0.15)] group">
          
          {/* Animated Spinning Light */}
          <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_85%,var(--color-primary-base)_100%)] animate-[spin_3s_linear_infinite] opacity-100"></div>
          
          {/* Inner Content Wrapper */}
          <div className="relative w-full h-full bg-[var(--bg-app)]/95 backdrop-blur-xl p-4 md:p-5 flex items-center rounded-lg">
            
            {/* Tech decorative corners */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary-base)]/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[var(--color-primary-base)]/60"></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[var(--color-primary-base)]/60"></div>
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[var(--color-primary-base)]/60"></div>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[var(--color-primary-base)]/60"></div>

            {/* Search Input */}
            <div className="flex-grow flex items-center gap-3 px-3">
              <Search className="h-5 w-5 text-[var(--color-primary-base)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') scrollToDestinations(); }}
                placeholder="Escribe para buscar destinos, excursiones..."
                className="w-full bg-transparent border-none text-[var(--text-main)] font-mono text-sm sm:text-base focus:outline-none placeholder-gray-500"
              />
            </div>

            <button
              onClick={scrollToDestinations}
              className="hidden sm:flex bg-[var(--color-primary-base)] text-[var(--bg-app)] px-8 py-3 font-mono font-bold tracking-widest uppercase text-xs hover:shadow-[0_0_30px_rgba(101,214,233,0.8)] hover:bg-white transition-all cursor-pointer rounded-sm items-center gap-2"
            >
              BUSCAR
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}

import { Search, MapPin, Compass, ArrowRightLeft, Users, Calendar } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { LOCATIONS_DATA } from '../data';
import { LocationRoute } from '../types';

interface HeroSectionProps {
  onSearchQuote: (originId: string, destId: string, paxs: number) => void;
  onNavigateToQuoter: () => void;
}

export default function HeroSection({ onSearchQuote, onNavigateToQuoter }: HeroSectionProps) {
  const [searchVal, setSearchVal] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [origin, setOrigin] = useState<LocationRoute | null>(null);
  const [dest, setDest] = useState<LocationRoute | null>(null);
  const [passengers, setPassengers] = useState(2);
  const [searchingField, setSearchingField] = useState<'origin' | 'dest' | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSearchingField(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = LOCATIONS_DATA.filter(loc => 
    loc.name.toLowerCase().includes(searchVal.toLowerCase()) || 
    loc.city.toLowerCase().includes(searchVal.toLowerCase())
  );

  const handleSelectLocation = (loc: LocationRoute) => {
    if (searchingField === 'origin') {
      setOrigin(loc);
      // Auto switch searching context to destination to guide user
      setSearchingField('dest');
      setSearchVal('');
    } else if (searchingField === 'dest') {
      setDest(loc);
      setSearchingField(null);
      setShowDropdown(false);
      setSearchVal('');
    }
  };

  const handleConsultar = () => {
    if (origin && dest) {
      onSearchQuote(origin.id, dest.id, passengers);
    } else {
      // If incomplete, navigate to quoter page so user can fill comfortably
      onNavigateToQuoter();
    }
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(dest);
    setDest(temp);
  };

  return (
    <section className="relative w-full h-[750px] md:h-[820px] min-h-[650px] flex items-center justify-center overflow-hidden border-b border-[#65d6e9]/20 pt-16">
      
      {/* Background Image with Tech Overlay */}
      <div className="absolute inset-0 z-0 bg-[#0a0c0d]">
        <img 
          alt="Cataratas de Iguazú de fondo" 
          className="w-full h-full object-cover object-center opacity-35 mix-blend-luminosity select-none pointer-events-none" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4dhdpHUfnF2ycazhcU1vtg7tAoOf79QRzQczgKLscSEc_OOFChm1xMilnSdNLYtd6YMbTFruzfC6t_BmIQontwII_JIlPTEi5VwDkQhw5M_uLvd5ysyWXH3Y032rFRrWDKprga_lsZN5rfH2UV3F062dNOr6cuqWilLH61RiYOI7RYo_j_2kbLUo8JIxuH89YEt-nppswderlOwrGZTTX3_hgIxKF7EDTSA42u7MNFepmtd5wzc7AxTSsGnqTFCwh5w5aJYJMRsWm"
        />
        {/* Soft elegant gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0d] via-transparent to-[#0a0c0d]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c0d]/80 via-transparent to-[#0a0c0d]/80"></div>
        {/* Tech subtle grid mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(101,214,233,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(101,214,233,0.02)_1px,transparent_1px)] bg-[size:45px_45px]"></div>
      </div>

      {/* Hero Content & Title Header */}
      <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center gap-6 mt-6">
        
        {/* System Online Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-[#0a0c0d]/90 backdrop-blur-md border border-[#65d6e9]/40 text-[#65d6e9] font-mono text-[9px] sm:text-[10px] tracking-[0.25em] mb-3 shadow-[0_0_15px_rgba(101,214,233,0.15)] uppercase select-none rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-[#65d6e9] animate-pulse mr-3 shadow-[0_0_8px_rgba(101,214,233,0.8)]"></span>
          SYS.STATUS: ONLINE // BIENVENIDOS
        </div>

        {/* Display title with glowing ampersand */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white tracking-tighter leading-none uppercase select-none">
          TRASLADOS <span className="text-[#65d6e9] opacity-90 tech-glow">&amp;</span> EXCURSIONES
        </h1>

        <p className="text-sm sm:text-base font-mono text-[#65d6e9]/80 tracking-[0.16em] uppercase font-light max-w-2xl">
          MÁS DE 40 AÑOS DE EXPERIENCIA OPERATIVA EN LA TRIPLE FRONTERA
        </p>

        {/* Dynamic Booking Quoter Widget containing state suggestion */}
        <div className="mt-10 w-full max-w-4xl bg-[#0a0c0d]/75 backdrop-blur-xl border border-[#65d6e9]/30 p-6 md:p-7 shadow-[0_0_40px_rgba(101,214,233,0.12)] flex flex-col gap-5 items-stretch text-left relative rounded-lg overflow-visible group">
          
          {/* Tech decorative corners */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#65d6e9]/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#65d6e9]/60"></div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#65d6e9]/60"></div>
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#65d6e9]/60"></div>
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#65d6e9]/60"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Origin Selection */}
            <div className="md:col-span-5 relative">
              <label className="block text-[#65d6e9]/70 font-mono text-[10px] tracking-widest mb-1.5 uppercase flex items-center gap-1.5 select-none">
                <MapPin className="h-3 w-3 text-[#65d6e9]" />
                ORIGEN / RECOGIDA
              </label>
              <button
                onClick={() => {
                  setSearchingField('origin');
                  setShowDropdown(true);
                  setSearchVal('');
                }}
                className="w-full text-left bg-[#0a0c0d]/50 border border-[#65d6e9]/20 hover:border-[#65d6e9]/50 text-white p-3 font-mono text-xs rounded transition-all cursor-pointer h-11 flex items-center truncate"
              >
                {origin ? (
                  <span className="text-white font-medium">{origin.name}</span>
                ) : (
                  <span className="text-gray-500 italic">ELEGIR PUNTO DE PARTIDA...</span>
                )}
              </button>
            </div>

            {/* Swap visual button */}
            <div className="md:col-span-1 flex justify-center pt-3 md:pt-4">
              <button 
                onClick={swapLocations}
                type="button"
                className="p-1.5 rounded-full border border-[#65d6e9]/25 bg-[#0a0c0d] hover:bg-[#65d6e9]/10 text-[#65d6e9] transition-all cursor-pointer"
                title="Intercambiar Origen y Destino"
              >
                <ArrowRightLeft className="h-4 w-4 rotate-90 md:rotate-0" />
              </button>
            </div>

            {/* Destination Selection */}
            <div className="md:col-span-4 relative">
              <label className="block text-[#65d6e9]/70 font-mono text-[10px] tracking-widest mb-1.5 uppercase flex items-center gap-1.5 select-none">
                <Compass className="h-3 w-3 text-[#65d6e9]" />
                DESTINO / DESTINATION
              </label>
              <button
                onClick={() => {
                  setSearchingField('dest');
                  setShowDropdown(true);
                  setSearchVal('');
                }}
                className="w-full text-left bg-[#0a0c0d]/50 border border-[#65d6e9]/20 hover:border-[#65d6e9]/50 text-white p-3 font-mono text-xs rounded transition-all cursor-pointer h-11 flex items-center truncate"
              >
                {dest ? (
                  <span className="text-white font-medium">{dest.name}</span>
                ) : (
                  <span className="text-gray-500 italic">ELEGIR LUGAR DE DESTINO...</span>
                )}
              </button>
            </div>

            {/* In-Line Passengers count */}
            <div className="md:col-span-2 relative">
              <label className="block text-[#65d6e9]/70 font-mono text-[10px] tracking-widest mb-1.5 uppercase flex items-center gap-1.5 select-none">
                <Users className="h-3 w-3 text-[#65d6e9]" />
                PASAJEROS
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full bg-[#0a0c0d]/80 border border-[#65d6e9]/20 text-white p-2.5 font-mono text-xs rounded transition-all h-11 focus:outline-none focus:border-[#65d6e9]"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num} className="bg-[#111415]">{num} Pax ({num <= 4 ? 'Auto' : 'Van'})</option>
                ))}
              </select>
            </div>

          </div>

          {/* Combined Suggester Panel / Dropdown inside widgets */}
          {showDropdown && (
            <div 
              ref={dropdownRef}
              className="absolute left-6 right-6 top-[152px] md:top-[85px] bg-[#0c0f10] border border-[#65d6e9]/50 p-4 rounded shadow-2xl z-20 max-h-[300px] overflow-y-auto"
            >
              <div className="flex items-center gap-2 mb-3 bg-[#0a0c0d] p-2 border border-gray-800 rounded">
                <Search className="h-4 w-4 text-[#65d6e9]" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={`Buscar punto para ${searchingField === 'origin' ? 'origen' : 'destino'}...`}
                  className="bg-transparent text-white font-mono text-xs focus:outline-none w-full placeholder-gray-600 uppercase"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-mono text-[#65d6e9]/50 uppercase tracking-widest mb-1">
                  Ubicaciones Recomendadas - {searchingField === 'origin' ? 'Origen de Traslado' : 'Destino de Viaje'}
                </div>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full text-left p-2.5 hover:bg-[#65d6e9]/10 rounded flex items-center justify-between transition-all group font-mono text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="h-3 w-3 text-[#65d6e9]/60 group-hover:text-[#65d6e9]" />
                        <span className="text-gray-200 group-hover:text-white truncate">{loc.name}</span>
                      </div>
                      <span className="text-[9px] bg-gray-900 border border-gray-800 text-gray-400 py-0.5 px-2 rounded-full uppercase scale-90 group-hover:bg-[#65d6e9]/20 group-hover:text-[#65d6e9] group-hover:border-[#65d6e9]/30">
                        {loc.country}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 font-mono text-xs">
                    No se encontraron ubicaciones para la búsqueda.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Info & Action Trigger */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-800 pt-4 mt-2 font-mono text-xs">
            <span className="text-[#65d6e9]/60 text-center sm:text-left flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#65d6e9]/70 rounded-full animate-pulse inline-block"></span>
              Tarifas reguladas. Seguro internacional AP y migración preferencial permanente incluidos.
            </span>
            <button
              onClick={handleConsultar}
              className="w-full sm:w-auto bg-[#65d6e9] text-[#0a0c0d] px-10 py-3 font-mono font-bold tracking-widest uppercase text-xs hover:shadow-[0_0_30px_rgba(101,214,233,0.8)] hover:bg-white transition-all duration-300 flex-shrink-0 flex items-center justify-center gap-2 group cursor-pointer"
            >
              CONSULTAR <Search className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}

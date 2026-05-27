import { useState } from 'react';
import { Destination } from '../types';
import { ArrowUpRight, Loader } from 'lucide-react';

interface DestinationsListProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  loading?: boolean;
}

export default function DestinationsList({ destinations, onSelectDestination, loading = false }: DestinationsListProps) {
  const [filterCode, setFilterCode] = useState<'ALL' | 'AR' | 'BR' | 'PY'>('ALL');

  // Filter only 'Activo' status destinations for visitors, then filter by country code
  const activeDestinations = destinations.filter(d => d.status === 'Activo')
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const filteredDestinations = filterCode === 'ALL'
    ? activeDestinations
    : activeDestinations.filter(d => d.code === filterCode);

  return (
    <section id="destinos" className="py-16 px-6 max-w-7xl mx-auto relative">
      {/* Absolute tech side glow indicator */}
      <div className="absolute left-0 top-1/2 w-[1px] h-2/3 bg-gradient-to-b from-transparent via-[var(--color-primary-base)]/20 to-transparent -translate-y-1/2"></div>

      {/* Title & Interactive country filtering tags */}
      <div className="mb-12 flex flex-col items-center text-center border-b border-[var(--border-tech)] pb-8">
        <div className="text-[var(--color-primary-base)] font-mono text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
          EXPLORE LA TRIPLE FRONTERA
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[var(--text-main)] mb-4 tracking-tighter uppercase">
          DESTINOS
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button
            onClick={() => setFilterCode('ALL')}
            className={`px-5 py-2 border font-mono text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer ${filterCode === 'ALL'
              ? 'bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)] border-[var(--color-primary-base)] shadow-[0_0_15px_rgba(101,214,233,0.3)]'
              : 'border-[var(--border-tech)] text-[var(--text-muted)] hover:text-[var(--color-primary-base)] hover:border-[var(--color-primary-base)]/40'
              }`}
          >
            <span className={`w-1 h-1 rounded-full ${filterCode === 'ALL' ? 'bg-[var(--color-primary-base)]' : 'bg-gray-500'}`}></span>
            Todos los países
          </button>

          {(['AR', 'BR', 'PY'] as const).map(code => {
            const label = code === 'AR' ? 'Argentina' : code === 'BR' ? 'Brasil' : 'Paraguay';
            const isActive = filterCode === code;
            return (
              <button
                key={code}
                onClick={() => setFilterCode(code)}
                className={`px-5 py-2 border font-mono text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer ${isActive
                  ? 'bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)] border-[var(--color-primary-base)] shadow-[0_0_15px_rgba(101,214,233,0.3)]'
                  : 'border-[var(--border-tech)] text-[var(--text-muted)] hover:text-[var(--color-primary-base)] hover:border-[var(--color-primary-base)]/40'
                  }`}
              >
                <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-[var(--color-primary-base)]' : 'bg-gray-500'}`}></span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Destinations Cards Layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-[var(--bg-card)] rounded-xl h-[480px] border border-[var(--border-tech)] animate-pulse flex flex-col overflow-hidden">
              <div className="h-64 bg-[var(--border-tech)]"></div>
              <div className="p-6 space-y-4 flex-grow">
                <div className="h-6 bg-[var(--border-tech)] w-2/3 rounded"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-[var(--border-tech)] opacity-50 rounded"></div>
                  <div className="h-3 bg-[var(--border-tech)] opacity-50 rounded"></div>
                  <div className="h-3 bg-[var(--border-tech)] opacity-50 rounded w-5/6"></div>
                </div>
                <div className="pt-6 border-t border-[var(--border-tech)] space-y-3 mt-auto">
                  <div className="h-8 bg-[var(--border-tech)] opacity-50 rounded"></div>
                  <div className="h-8 bg-[var(--border-tech)] opacity-50 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-16 border border-[var(--border-tech)] bg-[var(--bg-card)] rounded-xl font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
          No hay destinos disponibles activos para este país actualmente.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <article
              key={dest.id}
              className="bg-[var(--bg-card)] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col border border-[var(--color-primary-base)]/10 hover:border-[var(--color-primary-base)]/40 hover:shadow-[0_0_30px_rgba(101,214,233,0.12)] relative"
            >
              {/* Image section */}
              <div className="relative h-64 overflow-hidden group">
                <img
                  alt={`${dest.title} excursion travel`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={dest.imageUrl}
                />

                {/* Status "Activo" */}
                <div className="absolute top-4 left-4 bg-[var(--color-primary-base)] text-[var(--bg-app)] font-mono text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-lg select-none">
                  {dest.status}
                </div>

                {/* Country Code (AR, BR, PY) */}
                <div className="absolute top-4 right-4 bg-[var(--bg-app)]/80 backdrop-blur-md text-[var(--text-main)] font-mono text-[9px] px-2.5 py-1 border border-white/20 rounded font-bold uppercase tracking-widest">
                  {dest.code}
                </div>

                {/* Gradient dark frame mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-60"></div>
              </div>

              {/* Content info section */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-[var(--text-main)] uppercase tracking-wide">
                    {dest.title}
                  </h3>
                </div>

                <p className="text-sm text-[var(--text-muted)] mb-8 flex-grow font-light leading-relaxed">
                  {dest.description}
                </p>

                {/* Price Details table matching precisely the specifications */}
                <div className="space-y-3 pt-6 border-t border-[var(--border-tech)]">
                  {(dest.price4Pax > 0 || dest.price4PaxUsd > 0) && (
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
                        Hasta 4 Pax:
                      </span>
                      <div className="text-right">
                        {dest.price4Pax > 0 && (
                          <div className="text-[var(--color-primary-base)] font-bold text-sm">ARS ${dest.price4Pax.toLocaleString()}</div>
                        )}
                        {dest.price4PaxUsd > 0 && (
                          <div className="text-[var(--color-primary-base)]/70 text-[10px]">USD ${dest.price4PaxUsd}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {(dest.price6Pax > 0 || dest.price6PaxUsd > 0) && (
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
                        Hasta 6 Pax:
                      </span>
                      <div className="text-right">
                        {dest.price6Pax > 0 && (
                          <div className="text-[var(--color-primary-base)] font-bold text-sm">ARS ${dest.price6Pax.toLocaleString()}</div>
                        )}
                        {dest.price6PaxUsd > 0 && (
                          <div className="text-[var(--color-primary-base)]/70 text-[10px]">USD ${dest.price6PaxUsd}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking CTA trigger */}
                <button
                  type="button"
                  onClick={() => onSelectDestination(dest)}
                  className="mt-5 w-full bg-transparent border border-[var(--color-primary-base)]/20 hover:border-[var(--color-primary-base)]/65 text-[var(--text-muted)] hover:text-[var(--color-primary-base)] text-xs font-mono uppercase py-2.5 rounded hover:bg-[var(--color-primary-base)]/10 transition-all font-semibold tracking-wider cursor-pointer"
                >
                  COTIZAR / RESERVAR TRASLADO
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

import { EXCURSIONS_DATA } from '../data';
import { Excursion } from '../types';
import { Clock, MapPin, Compass, Check, CalendarCheck, HelpCircle } from 'lucide-react';

interface ExcursionsListProps {
  onBookExcursion: (excursion: Excursion) => void;
}

export default function ExcursionsList({ onBookExcursion }: ExcursionsListProps) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      
      {/* Visual Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary-base)]/10 border border-[var(--color-primary-base)]/30 text-[var(--color-primary-base)] font-mono text-[10px] tracking-widest uppercase mb-3 rounded-full">
          TURISMO Y AVENTURA TRIPLE FRONTERA
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[var(--text-main)] uppercase tracking-tight">
          NUESTRAS EXCURSIONES
        </h2>
        <p className="text-[var(--text-muted)] font-mono text-xs tracking-wider mt-2 uppercase max-w-xl mx-auto select-none leading-relaxed">
          Vehículos privados con chofer-guía dedicados. Nos encargamos de los trámites migratorios bilaterales para que disfrute sin preocupaciones.
        </p>
      </div>

      {/* Excursions Grid Layout */}
      <div className="space-y-12">
        {EXCURSIONS_DATA.map((exc, index) => {
          const isEven = index % 2 === 0;
          return (
            <article 
              key={exc.id}
              className={`bg-[var(--bg-card)] border border-[var(--color-primary-base)]/15 rounded-xl overflow-hidden flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } transition-all duration-300 hover:border-[var(--color-primary-base)]/40 hover:shadow-[0_0_30px_rgba(101,214,233,0.08)]`}
            >
              
              {/* Left Side: Thumbnail with visual overlay */}
              <div className="lg:w-1/2 h-72 lg:h-auto min-h-[300px] relative overflow-hidden">
                <img 
                  alt={exc.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  src={exc.imageUrl} 
                />
                
                {/* Visual country tag (AR, BR, PY) */}
                <div className="absolute top-4 left-4 bg-[var(--bg-app)]/80 backdrop-blur-md text-[var(--text-main)] border border-[var(--border-tech)] font-mono text-[10px] px-3 py-1 rounded font-bold uppercase tracking-widest">
                  País: {exc.country === 'AR' ? 'Argentina' : exc.country === 'BR' ? 'Brasil' : 'Paraguay'}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Right Side: Informative Body Controls */}
              <div className="lg:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                
                <div className="space-y-3">
                  
                  {/* Duration Tag */}
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-primary-base)]/80 uppercase tracking-widest">
                    <Clock className="h-4 w-4" />
                    <span>Duración: {exc.duration}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-3xl font-display font-extrabold text-[var(--text-main)] uppercase tracking-tight hover:text-[var(--color-primary-base)] transition-colors leading-none">
                    {exc.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[var(--text-muted)] font-light text-sm leading-relaxed font-sans">
                    {exc.description}
                  </p>

                  {/* Highlights Bullet Checked Points */}
                  <div className="pt-4">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2 font-bold">
                      Servicios Destacados Incluidos:
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-main)] font-sans">
                      {exc.highlights.map((hil, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-emerald-400" />
                          </span>
                          <span className="truncate">{hil}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Pricing & CTA Controls footer */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t border-[var(--border-tech)] font-mono">
                  
                  {/* Price breakdown */}
                  <div>
                    <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider block">
                      VALOR SERVICIO PRIVADO (HASTA 4 PAX):
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl md:text-2xl font-bold text-[var(--text-main)]">ARS ${exc.priceArs.toLocaleString()}</span>
                      <span className="text-xs text-[var(--color-primary-base)] font-semibold">/ USD ${exc.priceUsd}</span>
                    </div>
                  </div>

                  {/* Book Trigger Button */}
                  <button
                    onClick={() => onBookExcursion(exc)}
                    className="bg-transparent hover:bg-[var(--color-primary-base)] text-[var(--color-primary-base)] hover:text-[var(--bg-app)] border border-[var(--color-primary-base)] font-bold text-xs uppercase py-3.5 px-6 rounded transition-all tracking-wider cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(101,214,233,0.4)]"
                  >
                    <span>RESERVAR PASEO</span>
                    <CalendarCheck className="h-4 w-4" />
                  </button>

                </div>

              </div>

            </article>
          );
        })}
      </div>

    </section>
  );
}

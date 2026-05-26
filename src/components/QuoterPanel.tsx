import { useState, useEffect } from 'react';
import { LOCATIONS_DATA, getRoutePrice } from '../data';
import { LocationRoute } from '../types';
import { HelpCircle, Calculator, Check, ArrowRightLeft, Users, Plane, ShieldCheck, MapPin } from 'lucide-react';

interface QuoterPanelProps {
  initialOriginId?: string;
  initialDestId?: string;
  initialPassengers?: number;
  onConfirmBookingQuote: (originId: string, destId: string, passengers: number, priceArs: number, priceUsd: number) => void;
}

export default function QuoterPanel({ 
  initialOriginId = '', 
  initialDestId = '', 
  initialPassengers = 2,
  onConfirmBookingQuote 
}: QuoterPanelProps) {
  
  const [originId, setOriginId] = useState(initialOriginId || LOCATIONS_DATA[0].id);
  const [destId, setDestId] = useState(initialDestId || LOCATIONS_DATA[3].id);
  const [passengers, setPassengers] = useState(initialPassengers);
  const [priceInfo, setPriceInfo] = useState({ ars: 0, usd: 0, message: '' });

  // Recalculate price when variables change
  useEffect(() => {
    const calculated = getRoutePrice(originId, destId, passengers);
    setPriceInfo(calculated);
  }, [originId, destId, passengers]);

  const originLoc = LOCATIONS_DATA.find(l => l.id === originId);
  const destLoc = LOCATIONS_DATA.find(l => l.id === destId);

  const handleSwap = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
  };

  const handleConfirm = () => {
    if (originId && destId && originId !== destId) {
      onConfirmBookingQuote(originId, destId, passengers, priceInfo.ars, priceInfo.usd);
    }
  };

  return (
    <section className="py-12 max-w-5xl mx-auto px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#65d6e9]/10 border border-[#65d6e9]/30 text-[#65d6e9] font-mono text-[10px] tracking-widest uppercase mb-3 rounded-full">
          CONEXIÓN GLOBAL DIRECTA
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white uppercase tracking-tight">
          CALCULADOR DE TRASLADOS
        </h2>
        <p className="text-gray-400 font-mono text-xs tracking-wider mt-1.5 uppercase">
          Precios fijos garantizados sin cargos ocultos ni tarifas dinámicas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main interactive controller panel */}
        <div className="lg:col-span-7 bg-[#0f1214] border border-[#65d6e9]/15 rounded-xl p-6 md:p-8 space-y-6 relative">
          
          <div className="absolute top-4 right-4 bg-gray-900 border border-gray-800 text-gray-400 font-mono text-[9px] px-2 py-0.5 rounded uppercase">
            REGULADO V.24
          </div>

          <div className="space-y-4">
            
            {/* Pick Point */}
            <div className="relative">
              <label className="block text-[#65d6e9] text-[10px] font-mono tracking-widest mb-1.5 uppercase">
                🛫 Punto de Recogida (Origen)
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-[#0a0c0d] border border-[#65d6e9]/25 text-white p-3 rounded font-mono text-xs focus:outline-none focus:border-[#65d6e9] transition-all cursor-pointer h-11"
              >
                {LOCATIONS_DATA.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-[#111415] text-white">
                    [{loc.country}] {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap visual triggers */}
            <div className="flex justify-center -my-2.5">
              <button
                onClick={handleSwap}
                type="button"
                className="p-2 border border-[#65d6e9]/30 bg-[#0a0c0d] text-[#65d6e9] rounded-full hover:bg-[#65d6e9]/15 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(101,214,233,0.3)]"
                title="Invertir trayecto"
              >
                <ArrowRightLeft className="h-4 w-4 rotate-90 lg:rotate-0" />
              </button>
            </div>

            {/* Drop Point */}
            <div>
              <label className="block text-[#65d6e9] text-[10px] font-mono tracking-widest mb-1.5 uppercase">
                🏨 Destino del Traslado
              </label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-[#0a0c0d] border border-[#65d6e9]/25 text-white p-3 rounded font-mono text-xs focus:outline-none focus:border-[#65d6e9] transition-all cursor-pointer h-11"
              >
                {LOCATIONS_DATA.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-[#111415] text-white">
                    [{loc.country}] {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity Input */}
            <div>
              <label className="block text-[#65d6e9] text-[10px] font-mono tracking-widest mb-1.5 uppercase flex justify-between items-center">
                <span>👤 Cantidad de pasajeros</span>
                <span className="text-gray-500 font-normal">Máximo 6 por vehículo</span>
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPassengers(num)}
                    className={`py-2 rounded font-mono text-xs font-semibold cursor-pointer border transition-all ${
                      passengers === num
                        ? 'bg-[#65d6e9] text-[#0a0c0d] border-[#65d6e9] shadow-[0_0_10px_rgba(101,214,233,0.4)]'
                        : 'bg-[#111415] border-gray-800 text-gray-400 hover:border-[#65d6e9]/30 hover:text-[#65d6e9]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-[#111415] p-4 rounded border border-gray-800 space-y-2 text-xs text-gray-400 font-sans">
            <div className="flex gap-2 items-start">
              <ShieldCheck className="h-4 w-4 text-[#65d6e9] flex-shrink-0 mt-0.5" />
              <p>
                <strong>Tipo de Vehículo Recomendado:</strong> {passengers <= 4 ? 'Sedán de turismo ejecutivo (4 plazas más equipaje)' : 'Van de alta capacidad (6 plazas con equipaje extendido)'}.
              </p>
            </div>
          </div>

        </div>

        {/* Pricing information summary card with instant quotes display */}
        <div className="lg:col-span-5 bg-[#0a0c0d] border border-[#65d6e9]/30 p-6 md:p-8 rounded-xl shadow-2xl relative flex flex-col justify-between self-stretch overflow-hidden">
          
          {/* Ambient visual background glow inside card */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#65d6e9]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-1">
                RESUMEN DE COTIZACIÓN
              </h3>
              <div className="text-[10px] font-mono text-[#65d6e9]/80 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                PRECIO GARANTIZADO EN TIEMPO REAL
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-start justify-between">
                <span className="text-gray-500 uppercase font-light">Origen:</span>
                <span className="text-right text-white font-medium max-w-[200px] truncate" title={originLoc?.name}>
                  {originLoc?.name?.split('(')[0]}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-gray-500 uppercase font-light">Destino:</span>
                <span className="text-right text-white font-medium max-w-[200px] truncate" title={destLoc?.name}>
                  {destLoc?.name?.split('(')[0]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 uppercase font-light">Servicio:</span>
                <span className="text-right text-[#65d6e9] font-semibold">
                  {passengers <= 4 ? 'Privado Auto' : 'Privado Van Especial'}
                </span>
              </div>

              {priceInfo.message && (
                <div className="bg-[#65d6e9]/5 border border-[#65d6e9]/10 p-2.5 rounded text-[11px] text-[#65d6e9]/90 text-center uppercase tracking-wide">
                  ✓ {priceInfo.message}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#111415] to-[#0f1214] p-5 rounded-lg border border-gray-800/80 text-center py-6">
              
              {originId === destId ? (
                <div className="text-xs text-red-400 font-mono uppercase tracking-widest py-4">
                  ⚠️ Error: El punto de origen y destino deben ser distintos.
                </div>
              ) : (
                <>
                  <div className="text-gray-500 font-mono text-[9px] uppercase tracking-widest mb-1">
                    VALOR ESTIMADO NETO
                  </div>
                  <div className="text-3xl font-bold text-white tracking-tight">
                    ARS ${priceInfo.ars.toLocaleString()}
                  </div>
                  <div className="text-sm font-mono text-[#65d6e9] mt-1">
                    USD ${priceInfo.usd} aprox.
                  </div>
                </>
              )}

            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleConfirm}
              disabled={originId === destId}
              type="button"
              className={`w-full py-4 rounded font-mono font-bold uppercase text-[11px] tracking-widest transition-all ${
                originId === destId
                  ? 'bg-gray-800 text-gray-600 border border-gray-900 cursor-not-allowed'
                  : 'bg-[#65d6e9] text-[#0a0c0d] hover:shadow-[0_0_25px_rgba(101,214,233,0.5)] hover:bg-white cursor-pointer hover:scale-[1.01]'
              }`}
            >
              CONFIRMAR Y RESERVAR TRASLADO
            </button>
            <p className="text-center text-[9px] font-sans text-gray-500 mt-2">
              Se requiere confirmación con al menos 12 horas de anticipación.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, Plane, Info, CheckCircle, FileText, Smartphone } from 'lucide-react';
import { getRoutePrice, LOCATIONS_DATA } from '../data';
import { BookingFormState } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedOriginId?: string;
  preselectedDestId?: string;
  preselectedPassengers?: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  preselectedOriginId,
  preselectedDestId,
  preselectedPassengers
}: BookingModalProps) {
  if (!isOpen) return null;

  const [originId, setOriginId] = useState(preselectedOriginId || LOCATIONS_DATA[0].id);
  const [destId, setDestId] = useState(preselectedDestId || LOCATIONS_DATA[3].id);
  const [passengers, setPassengers] = useState(preselectedPassengers || 2);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [vehicle, setVehicle] = useState<'car' | 'van'>(passengers <= 4 ? 'car' : 'van');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Simulated booking ID once completed
  const [bookingRefId, setBookingRefId] = useState('');

  // Active prices display
  const priceData = getRoutePrice(originId, destId, passengers);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (originId === destId) {
      setErrorMsg('El punto de recogida y de destino deben ser diferentes.');
      return;
    }

    if (!fullName || !email || !phone || !date || !time) {
      setErrorMsg('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    // Simulate transfer to backend or local list
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setBookingRefId('REF-' + Math.floor(100000 + Math.random() * 900000));
    }, 1500);
  };

  const selectedOriginObj = LOCATIONS_DATA.find(l => l.id === originId);
  const selectedDestObj = LOCATIONS_DATA.find(l => l.id === destId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Dark overlay backdrop with blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#0a0c0d]/90 backdrop-blur-md transition-opacity"
      ></div>

      {/* Main Dialog Container */}
      <div className="relative bg-[#0c0f10] border border-[#65d6e9]/40 w-full max-w-2xl rounded-xl shadow-[0_0_50px_rgba(101,214,233,0.25)] overflow-hidden z-10 font-sans max-h-[90vh] flex flex-col">
        
        {/* Header decoration */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#65d6e9] via-transparent to-[#65d6e9]"></div>
        
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#0f1214] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#65d6e9] animate-pulse"></span>
            <span className="text-sm font-mono text-[#65d6e9] uppercase tracking-widest font-bold">
              {success ? 'RESERVA COMPLETADA EXITOSAMENTE' : 'SISTEMA DE RESERVAS DIRECTAS'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Close booking system dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Contents Grid/Form */}
        <div className="p-6 md:p-8 overflow-y-auto flex-grow">
          
          {success ? (
            /* Successful Booking View showing virtual Ticket Receipt */
            <div className="space-y-6 text-center py-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center animate-bounce">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-extrabold text-white uppercase tracking-tight">
                  ¡OPERACIÓN CONFIRMADA!
                </h3>
                <p className="text-gray-400 text-xs font-mono uppercase tracking-wider max-w-md mx-auto">
                  Su solicitud ha sido grabada. Un coordinador de Transfers Aeropuerto se contactará por WhatsApp para detallar los datos del conductor asignado.
                </p>
              </div>

              {/* Virtual Receipt Table */}
              <div className="bg-[#0f1214] border border-green-500/30 rounded-lg p-5 text-left font-mono text-xs max-w-md mx-auto relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-[-15px] bg-green-500/20 text-green-400 font-bold px-5 py-1 text-[8px] tracking-widest uppercase rotate-45">
                  CONFIRMADO
                </div>

                <div className="border-b border-gray-800 pb-2 text-center text-gray-500 font-bold pb-2">
                  🛩️ VOUCHER DE TRANSFERS AEROPUERTO
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-gray-300">
                  <span className="text-gray-500">CÓDIGO DE RESERVA:</span>
                  <span className="text-right text-[#65d6e9] font-bold">{bookingRefId}</span>

                  <span className="text-gray-500 font-light">PASAJERO TITULAR:</span>
                  <span className="text-right text-white truncate">{fullName}</span>

                  <span className="text-gray-500 font-light">MÓVIL ASOCIADO:</span>
                  <span className="text-right text-white">{phone}</span>

                  <span className="text-gray-500 font-light">Ruta del Viaje:</span>
                  <span className="text-right text-gray-300 text-[11px] truncate" title={`${selectedOriginObj?.name} → ${selectedDestObj?.name}`}>
                    {selectedOriginObj?.name?.split('(')[0]} → {selectedDestObj?.name?.split('(')[0]}
                  </span>

                  <span className="text-gray-500 font-light">FECHA Y HORA:</span>
                  <span className="text-right text-white">{date} - {time} HS</span>

                  <span className="text-gray-500 font-light">CAPACIDAD CONTRATADA:</span>
                  <span className="text-right text-white font-semibold">{passengers} PASAJEROS ({passengers <= 4 ? 'AUTO PRIVADO' : 'EXECUTIVE VAN'})</span>

                  {flightNumber && (
                    <>
                      <span className="text-gray-500 font-light">NÚMERO DE VUELO:</span>
                      <span className="text-right text-[#65d6e9]">{flightNumber.toUpperCase()}</span>
                    </>
                  )}
                </div>

                <div className="border-t border-gray-800 pt-3 flex justify-between font-bold text-sm">
                  <span className="text-gray-400">MONTO TOTAL A ABONAR:</span>
                  <div className="text-right">
                    <div className="text-white">ARS ${priceData.ars.toLocaleString()}</div>
                    <div className="text-[#65d6e9] text-xs">USD ${priceData.usd}</div>
                  </div>
                </div>

                <div className="bg-[#111415] border border-gray-800 p-2.5 text-[10px] text-gray-500 font-sans tracking-tight text-center">
                  ⚠️ No se requiere pago adelantado por tarjeta de crédito. Abonará el costo directamente al chofer en efectivo al iniciar/finalizar el traslado en ARS, USD, BRL (efectivo, Pix o transferencia bancaria local).
                </div>
              </div>

              <div className="pt-4 flex gap-4 justify-center">
                <button
                  onClick={onClose}
                  className="bg-[#65d6e9] text-[#0a0c0d] font-mono font-bold uppercase py-2.5 px-8 text-xs tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(101,214,233,0.3)] transition-all cursor-pointer"
                >
                  Entendido / Volver
                </button>
              </div>

            </div>
          ) : (
            /* Main Input Form with Pricing widget sidebar inside */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/40 p-3 text-red-400 text-xs rounded font-mono uppercase tracking-wide">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-gray-400 font-mono text-[10px] uppercase tracking-widest mb-1 select-none">
                    Nombre del Pasajero Titular *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65d6e9] opacity-75" />
                    <input
                      required
                      type="text"
                      className="w-full bg-[#111415] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 pl-10 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#65d6e9]/20"
                      placeholder="Ej. Juan Pérez"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-gray-400 font-mono text-[10px] uppercase tracking-widest mb-1 select-none">
                    Dirección de Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65d6e9] opacity-75" />
                    <input
                      required
                      type="email"
                      className="w-full bg-[#111415] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 pl-10 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#65d6e9]/20"
                      placeholder="juan.perez@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Mobile Whatsapp */}
                <div>
                  <label className="block text-gray-400 font-mono text-[10px] uppercase tracking-widest mb-1 select-none">
                    Teléfono Móvil (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65d6e9] opacity-75" />
                    <input
                      required
                      type="tel"
                      className="w-full bg-[#111415] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 pl-10 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#65d6e9]/20"
                      placeholder="Ej. +54 9 11 1234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Vehicle or Route Flight Number */}
                <div>
                  <label className="block text-gray-400 font-mono text-[10px] uppercase tracking-widest mb-1 select-none flex justify-between">
                    <span>Número de Vuelo (Opcional)</span>
                    <span className="text-[#65d6e9]/60 text-[9px] lowercase font-normal">para seguimiento en vivo</span>
                  </label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65d6e9] opacity-75" />
                    <input
                      type="text"
                      className="w-full bg-[#111415] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 pl-10 text-white font-mono text-sm uppercase focus:outline-none focus:ring-1 focus:ring-[#65d6e9]/20 placeholder-gray-600"
                      placeholder="Ej. AR1732 o G3 1145"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                    />
                  </div>
                </div>

              </div>

              {/* Dynamic Quote Selection controls */}
              <div className="bg-[#0f1214] border border-gray-800 p-4 rounded-lg space-y-4">
                <div className="text-[#65d6e9] font-mono text-[10px] tracking-wider uppercase font-semibold">
                  📌 RUTA Y TRAYECTO CONTRATADO
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 font-mono text-[9px] uppercase tracking-widest mb-1">
                      Origen de Recogida
                    </label>
                    <select
                      value={originId}
                      onChange={(e) => setOriginId(e.target.value)}
                      className="w-full bg-[#0a0c0d] border border-[#65d6e9]/15 text-white p-2.5 rounded font-mono text-[11px] focus:outline-none focus:border-[#65d6e9]"
                    >
                      {LOCATIONS_DATA.map(l => (
                        <option key={l.id} value={l.id}>[{l.country}] {l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-mono text-[9px] uppercase tracking-widest mb-1">
                      Destino de Llegada
                    </label>
                    <select
                      value={destId}
                      onChange={(e) => setDestId(e.target.value)}
                      className="w-full bg-[#0a0c0d] border border-[#65d6e9]/15 text-white p-2.5 rounded font-mono text-[11px] focus:outline-none focus:border-[#65d6e9]"
                    >
                      {LOCATIONS_DATA.map(l => (
                        <option key={l.id} value={l.id}>[{l.country}] {l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-500 font-mono text-[9px] uppercase tracking-widest mb-1">
                      Fecha del Traslado *
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full bg-[#0a0c0d] border border-gray-800 text-white p-2 rounded font-mono text-xs focus:outline-none focus:border-[#65d6e9]"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-mono text-[9px] uppercase tracking-widest mb-1">
                      Hora de Recogida *
                    </label>
                    <input
                      required
                      type="time"
                      className="w-full bg-[#0a0c0d] border border-gray-800 text-white p-2 rounded font-mono text-xs focus:outline-none focus:border-[#65d6e9]"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-mono text-[9px] uppercase tracking-widest mb-1">
                      Nro. de Pasajeros
                    </label>
                    <select
                      value={passengers}
                      onChange={(e) => {
                        const count = Number(e.target.value);
                        setPassengers(count);
                        if (count > 4) setVehicle('van');
                        else setVehicle('car');
                      }}
                      className="w-full bg-[#0a0c0d] border border-gray-800 text-white p-2 rounded font-mono text-xs focus:outline-none focus:border-[#65d6e9]"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Pasajero' : 'Pasajeros'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Note Input */}
              <div>
                <label className="block text-gray-400 font-mono text-[10px] uppercase tracking-widest mb-1 select-none">
                  Comentarios / Necesidades Especiales (Opcional)
                </label>
                <textarea
                  className="w-full bg-[#111415] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 text-white font-sans text-xs focus:outline-none focus:ring-1 focus:ring-[#65d6e9]/20"
                  rows={2}
                  placeholder="Ej. Necesitamos silla porta-bebé, equipaje sobredimensionado, paradas intermedias, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Dynamic Live Quote Section */}
              {originId !== destId && (
                <div className="bg-[#111415] border border-[#65d6e9]/20 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                      TOTAL ESTIMADO A ABONAR AL CHOFER
                    </span>
                    <span className="text-gray-400 font-sans text-xs">
                      Vehículo: {passengers <= 4 ? 'AUTO PRIVADO SEDÁN' : 'MINIVAN FAMILIAR EXCLUSIVA'}
                    </span>
                  </div>
                  <div className="text-center sm:text-right font-mono">
                    <span className="text-lg md:text-xl font-bold text-white block">
                      ARS ${priceData.ars.toLocaleString()}
                    </span>
                    <span className="text-[#65d6e9] text-xs font-semibold">
                      USD ${priceData.usd} neto
                    </span>
                  </div>
                </div>
              )}

              {/* Legal Notice */}
              <div className="flex gap-2 items-start text-[10px] text-gray-500 bg-gray-950 p-3 rounded">
                <Info className="h-4 w-4 text-[#65d6e9] flex-shrink-0 mt-0.5" />
                <p>
                  Política de cancelación flexible: Puede cancelar o reprogramar sin cargo avisando por WhatsApp hasta 4 horas antes. Su reserva incluye seguro de accidentes civiles y gestión exprés de migraciones en la frontera con choferes profesionales certificados.
                </p>
              </div>

              {/* Footer and Submit Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 font-mono text-xs">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 cursor-pointer text-gray-400 border border-transparent hover:border-gray-800 transition-all uppercase tracking-wider"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 rounded font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all ${
                    loading 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#65d6e9] text-[#0a0c0d] hover:shadow-[0_0_20px_rgba(101,214,233,0.5)] hover:bg-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#0a0c0d] border-t-transparent rounded-full animate-spin"></span>
                      ENVIANDO...
                    </>
                  ) : (
                    <>
                      CONFIRMAR RESERVA
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}

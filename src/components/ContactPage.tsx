import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareCode, CheckSquare, Sparkles, Smartphone } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('traslado');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !message) {
      setErrorMsg('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        name,
        email,
        phone,
        subject,
        message,
        createdAt: Date.now()
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg('Ocurrió un error al enviar el mensaje. Intente de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      
      {/* Intro Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary-base)]/10 border border-[var(--color-primary-base)]/30 text-[var(--color-primary-base)] font-mono text-[10px] tracking-widest uppercase mb-3 rounded-full">
          SISTEMA DE ATENCIÓN MULTIPRESIAL
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[var(--text-main)] uppercase tracking-tight">
          CONTÁCTENOS
        </h2>
        <p className="text-[var(--text-muted)] font-mono text-xs tracking-wider mt-1.5 uppercase max-w-lg mx-auto">
          Resolución proactiva de consultas corporativas y grupales las 24 horas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Contact info desk details */}
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--color-primary-base)]/15 rounded-xl p-6 md:p-8 space-y-8 flex flex-col justify-between">
          
          <div className="space-y-6">
            <h3 className="text-[var(--text-main)] font-mono text-[11px] font-bold uppercase tracking-widest pb-3 border-b border-[var(--border-tech)]">
              OFICINA CENTRAL RECOGNIZED
            </h3>

            <div className="space-y-4 text-xs font-sans">
              
              <div className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-[var(--color-primary-base)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[var(--text-main)] font-bold font-mono text-[10px] uppercase">Dirección:</h4>
                  <p className="text-[var(--text-muted)] mt-0.5">Aeropuerto Internacional IGR<br />Puerto Iguazú, Misiones.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Smartphone className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-emerald-400 font-bold font-mono text-[10px] uppercase">Teléfono / WhatsApp:</h4>
                  <p className="text-[var(--text-main)] font-mono mt-0.5 font-bold">+549 3757 368041</p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick WhatsApp Action Button */}
          <div className="bg-[var(--bg-input)] border border-[var(--border-tech)] p-4 rounded text-center">
            <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
              ¿Consulta rápida?
            </p>
            <a 
              href="https://wa.me/5493757368041"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold uppercase py-2 px-5 text-[10px] tracking-widest rounded-sm transition-all"
            >
              <MessageSquareCode className="h-4 w-4" />
              Chatear ahora
            </a>
          </div>

        </div>

        {/* Input Interactive Form Area */}
        <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--color-primary-base)]/15 rounded-xl p-6 md:p-8">
          
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-green-500/10 border border-green-500 rounded-full mb-3 text-green-400">
                <CheckSquare className="h-8 w-8" />
              </div>
              <h3 className="text-[var(--text-main)] font-mono text-xs uppercase font-bold tracking-widest">
                ¡MENSAGE ENVIADO SATISFACTORIAMENTE!
              </h3>
              <p className="text-[var(--text-muted)] text-xs font-sans max-w-sm mx-auto">
                Registramos su consulta. Nuestro equipo comercial le responderá con una propuesta cotizada formal al email proporcionado en menos de 2 horas.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
                className="mt-4 bg-transparent border border-[var(--color-primary-base)] text-[var(--color-primary-base)] hover:bg-[var(--color-primary-base)]/10 font-mono font-bold uppercase py-2 px-6 text-xs tracking-widest transition-all cursor-pointer"
              >
                Enviar Otro Mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleMessageSubmit} className="space-y-5">
              
              <h3 className="text-[var(--text-main)] font-mono text-[11px] font-bold uppercase tracking-widest pb-3 border-b border-[var(--border-tech)]">
                FORMULARIO DE CONTACTO DIRECTO
              </h3>

              {errorMsg && (
                <div className="bg-red-500/15 border border-red-500/40 p-3 text-red-400 text-xs rounded font-mono uppercase">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-widest mb-1 select-none">
                    Su Nombre Completo *
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-tech)] focus:border-[var(--color-primary-base)] rounded p-2.5 text-[var(--text-main)] font-sans text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]/20"
                    placeholder="Ej. María Elena Walsh"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-widest mb-1 select-none">
                    Su Dirección de Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-tech)] focus:border-[var(--color-primary-base)] rounded p-2.5 text-[var(--text-main)] font-sans text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]/20"
                    placeholder="maria@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-widest mb-1 select-none">
                    Teléfono de Contacto (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-tech)] focus:border-[var(--color-primary-base)] rounded p-2.5 text-[var(--text-main)] font-sans text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]/20"
                    placeholder="Ej. +34 612 345 678"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-widest mb-1 select-none">
                    Motivo de la Consulta
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-tech)] focus:border-[var(--color-primary-base)] text-[var(--text-main)] p-2.5 rounded font-mono text-xs focus:outline-none"
                  >
                    <option value="traslado">Presupuesto Traslado Especial</option>
                    <option value="corporativo">Traslado Corporativo / Delegación</option>
                    <option value="excursion">Paseos y Excursiones Personalizadas</option>
                    <option value="asistencia">Facturación / Otros temas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-widest mb-1 select-none">
                  Escriba su Mensaje Ampliado *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-tech)] focus:border-[var(--color-primary-base)] rounded p-2.5 text-[var(--text-main)] font-sans text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]/20"
                  placeholder="Por favor deténganos la cantidad de personas, fechas previstas y cualquier requerimiento adicional de su itinerario..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3.5 font-mono font-bold uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                    loading 
                      ? 'bg-[var(--bg-input)] text-[var(--text-muted)]' 
                      : 'bg-[var(--color-primary-base)] text-[var(--bg-app)] hover:shadow-[0_0_20px_rgba(101,214,233,0.5)] hover:bg-[var(--text-main)]'
                  }`}
                >
                  {loading ? 'ENVIANDO...' : 'ENVIAR CONSULTA'}
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </section>
  );
}

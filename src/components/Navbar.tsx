import { PlaneTakeoff, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onOpenBooking: () => void;
}

export default function Navbar({ currentPage, onPageChange, onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'destinos', label: 'Destinos' },
    { id: 'traslados', label: 'Traslados' },
    { id: 'excursiones', label: 'Excursiones' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'contacto', label: 'Contacto' },
    { id: 'admin', label: '🛠 Admin' },
  ];

  const handleNavClick = (id: string) => {
    onPageChange(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-[#0a0c0d]/95 backdrop-blur-xl border-b border-[#65d6e9]/20 shadow-[0_4px_30px_rgba(101,214,233,0.05)] fixed top-0 left-0 w-full z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex justify-between items-center">
        
        {/* Brand Logo & Glowing Text */}
        <div 
          onClick={() => handleNavClick('destinos')}
          className="text-lg md:text-xl font-bold text-[#65d6e9] flex items-center gap-2.5 tracking-tight tech-glow cursor-pointer select-none"
        >
          <PlaneTakeoff className="h-6 w-6 text-[#65d6e9]" />
          <span>TRANSFERS AEROPUERTO</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center text-xs font-mono tracking-widest uppercase">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-all duration-300 pb-1 cursor-pointer hover:text-[#65d6e9] hover:tech-glow ${
                  isActive
                    ? 'text-[#65d6e9] font-bold border-b-2 border-[#65d6e9] shadow-[0_1px_0_rgba(101,214,233,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button / Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenBooking}
            className="hidden md:flex items-center gap-2 bg-transparent border border-[#65d6e9] text-[#65d6e9] px-6 py-2.5 text-xs font-mono tracking-widest uppercase hover:bg-[#65d6e9]/10 hover:shadow-[0_0_15px_rgba(101,214,233,0.4)] transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 bg-[#65d6e9] rounded-full animate-pulse"></span>
            Reservar
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#65d6e9] p-2 border border-[#65d6e9]/30 rounded-sm hover:bg-[#65d6e9]/15 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0f10] border-b border-[#65d6e9]/20 font-mono text-center py-6 px-4 absolute w-full left-0 transition-all z-40 shadow-2xl">
          <div className="flex flex-col gap-5 uppercase tracking-widest text-sm">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-2 border-b border-gray-800 last:border-none transition-all ${
                    isActive ? 'text-[#65d6e9] font-bold' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="mt-4 w-full justify-center flex items-center gap-2 bg-[#65d6e9] text-[#0a0c0d] py-3 text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(101,214,233,0.3)]"
            >
              <PlaneTakeoff className="h-4 w-4" />
              RESERVAR AHORA
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

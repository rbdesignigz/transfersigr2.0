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

        {/* Brand Logo Image */}
        <div
          onClick={() => handleNavClick('destinos')}
          className="cursor-pointer select-none"
        >
          <img
            src={`${(import.meta as any).env.BASE_URL}logo.png`}
            alt="Transfers Aeropuerto"
            className="max-h-[35px] w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center text-xs font-mono tracking-widest uppercase">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-all duration-300 pb-1 cursor-pointer hover:text-[#65d6e9] hover:tech-glow ${isActive
                  ? 'text-[#65d6e9] font-bold border-b-2 border-[#65d6e9] shadow-[0_1px_0_rgba(101,214,233,0.5)]'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#65d6e9] p-2 border border-[#65d6e9]/30 rounded-sm hover:bg-[#65d6e9]/15 transition-all ml-auto"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
                  className={`py-2 border-b border-gray-800 last:border-none transition-all ${isActive ? 'text-[#65d6e9] font-bold' : 'text-gray-400'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}

          </div>
        </div>
      )}
    </header>
  );
}

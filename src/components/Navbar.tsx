import { PlaneTakeoff, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onOpenBooking: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ currentPage, onPageChange, onOpenBooking, isDarkMode, toggleTheme }: NavbarProps) {
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
    <header className="bg-[var(--bg-app)]/95 backdrop-blur-xl border-b border-[var(--border-tech)] shadow-md fixed top-0 left-0 w-full z-50 transition-colors duration-300">
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
                className={`transition-all duration-300 pb-1 cursor-pointer hover:tech-glow ${isActive
                  ? 'text-[var(--color-primary-base)] font-bold border-b-2 border-[var(--color-primary-base)] shadow-[0_1px_0_var(--border-tech-hover)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="text-[var(--color-primary-base)] p-2 hover:bg-[var(--color-primary-base)]/15 rounded-full transition-all ml-auto md:ml-0 md:mr-0 mr-4"
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[var(--color-primary-base)] p-2 border border-[var(--color-primary-base)]/30 rounded-sm hover:bg-[var(--color-primary-base)]/15 transition-all"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-app)] border-b border-[var(--border-tech)] font-mono text-center py-6 px-4 absolute w-full left-0 transition-all z-40 shadow-2xl">
          <div className="flex flex-col gap-5 uppercase tracking-widest text-sm">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-2 border-b border-[var(--border-tech)] last:border-none transition-all ${isActive ? 'text-[var(--color-primary-base)] font-bold' : 'text-[var(--text-muted)]'
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

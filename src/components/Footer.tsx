import { PlaneTakeoff } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0c0d] border-t border-[#65d6e9]/20 shadow-[0_-4px_30px_rgba(101,214,233,0.02)] w-full px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto mt-auto relative overflow-hidden">
      {/* Visual bottom ambient line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#65d6e9]/40 to-transparent"></div>

      {/* Brand Logo & Glowing Text */}
      <div
        onClick={() => {
          onPageChange('destinos');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="text-lg md:text-xl font-bold text-[#65d6e9] flex items-center gap-2 tracking-tight tech-glow cursor-pointer"
      >
        <PlaneTakeoff className="h-5 w-5 text-[#65d6e9]" />
        <span>TRANSFERS AEROPUERTO</span>
      </div>

      {/* Center Links */}
      <nav className="flex flex-wrap justify-center gap-6 text-[10px] font-mono tracking-[0.15em] uppercase">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onPageChange('nosotros'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-gray-400 hover:text-[#65d6e9] hover:tech-glow transition-colors"
        >
          Nosotros
        </a>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onPageChange('contacto'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-gray-400 hover:text-[#65d6e9] hover:tech-glow transition-colors"
        >
          Contacto
        </a>
        <span className="text-gray-600">|</span>
        <span className="text-gray-500 font-sans tracking-normal font-light">
          © {currentYear} Transfers Aeropuerto S.A.
        </span>
      </nav>

      {/* Tech indicators */}
      <div className="text-xs font-mono text-[#65d6e9]/50 text-center md:text-right tracking-wider uppercase">
        RBDESIGN 2.0.24 // 40 AÑOS EXP
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DestinationsList from './components/DestinationsList';
import QuoterPanel from './components/QuoterPanel';
import ExcursionsList from './components/ExcursionsList';
import AboutUs from './components/AboutUs';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import AdminPanel from './components/AdminPanel';
import { Destination, Excursion } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('destinos');
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState<boolean>(true);
  
  // High fidelity transfer parameters to bootstrap custom booking quotes
  const [preSelected, setPreSelected] = useState<{
    originId?: string;
    destId?: string;
    passengers?: number;
  }>({});

  const fetchDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const res = await fetch('/api/destinations');
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      } else {
        console.error('Failed to load destinations from database API');
      }
    } catch (err) {
      console.error('Error connecting to database API:', err);
    } finally {
      setLoadingDestinations(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // When searching on the hero widget, calculate quotation
  const handleHeroSearchQuote = (originId: string, destId: string, paxs: number) => {
    setPreSelected({ originId, destId, passengers: paxs });
    setCurrentPage('traslados');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleNavigateToQuoter = () => {
    setCurrentPage('traslados');
  };

  // Selecting a card directly opens the system booking modal prepopulated
  const handleSelectDestination = (dest: Destination) => {
    let originId = 'igr'; // default AR
    let destId = 'h_igr'; 

    if (dest.code === 'BR') {
      originId = 'igu';
      destId = 'h_igu';
    } else if (dest.code === 'PY') {
      originId = 'agt';
      destId = 'h_cde';
    }

    setPreSelected({ originId, destId, passengers: 2 });
    setBookingModalOpen(true);
  };

  // Booking an excursion opens the booking flow with details pre-established
  const handleBookExcursion = (exc: Excursion) => {
    let originId = 'h_igr';
    let destId = 'c_arg'; // Cataratas AR

    if (exc.country === 'BR') {
      originId = 'h_igu';
      destId = 'c_bra';
    } else if (exc.country === 'PY') {
      originId = 'h_cde';
      destId = 'itp'; // Itaipu CDE
    }

    setPreSelected({ originId, destId, passengers: 2 });
    setBookingModalOpen(true);
  };

  // Confirming quotation directly from QuoterPanel copies parameters and launches booking
  const handleConfirmQuote = (originId: string, destId: string, passengers: number) => {
    setPreSelected({ originId, destId, passengers });
    setBookingModalOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    // Reset parameters so user can configure on clean sheet
    setPreSelected({});
    setBookingModalOpen(true);
  };

  return (
    <div className="bg-[#0a0c0d] font-sans text-white min-h-screen flex flex-col selection:bg-[#65d6e9] selection:text-[#0a0c0d]">
      
      {/* Dynamic Persistent Navbar */}
      <Navbar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        onOpenBooking={handleOpenGeneralBooking} 
      />

      {/* Main Content Layout routing page switcher */}
      <main className="flex-grow pt-[80px]">
        
        {currentPage === 'destinos' && (
          <div className="animate-fade-in">
            {/* The matching responsive high-contrast Hero */}
            <HeroSection 
              onSearchQuote={handleHeroSearchQuote} 
              onNavigateToQuoter={handleNavigateToQuoter}
            />
            {/* Argentina, Brasil, Paraguay responsive country cards */}
            <DestinationsList 
              destinations={destinations}
              onSelectDestination={handleSelectDestination} 
              loading={loadingDestinations}
            />
          </div>
        )}

        {currentPage === 'admin' && (
          <div className="py-8 animate-fade-in">
            {/* Dynamic Administration Panel with full CRUD controls */}
            <AdminPanel 
              destinations={destinations}
              onRefresh={fetchDestinations}
            />
          </div>
        )}

        {currentPage === 'traslados' && (
          <div className="py-8 animate-fade-in">
            {/* Interactive Quoter panel tool */}
            <QuoterPanel 
              initialOriginId={preSelected.originId}
              initialDestId={preSelected.destId}
              initialPassengers={preSelected.passengers}
              onConfirmBookingQuote={handleConfirmQuote}
            />
          </div>
        )}

        {currentPage === 'excursiones' && (
          <div className="py-8 animate-fade-in">
            {/* List of tours & activities in AR, BR, PY */}
            <ExcursionsList 
              onBookExcursion={handleBookExcursion} 
            />
          </div>
        )}

        {currentPage === 'nosotros' && (
          <div className="py-8 animate-fade-in">
            {/* Company history & local experience credentials */}
            <AboutUs />
          </div>
        )}

        {currentPage === 'contacto' && (
          <div className="py-8 animate-fade-in">
            {/* Interactive custom validation feedback contact */}
            <ContactPage />
          </div>
        )}

      </main>

      {/* System Footer matching image specs */}
      <Footer onPageChange={setCurrentPage} />

      {/* Booking Dialog Modal Portal */}
      <BookingModal 
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedOriginId={preSelected.originId}
        preselectedDestId={preSelected.destId}
        preselectedPassengers={preSelected.passengers}
      />

    </div>
  );
}

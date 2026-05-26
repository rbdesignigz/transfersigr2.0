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
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('destinos');
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // High fidelity transfer parameters to bootstrap custom booking quotes
  const [preSelected, setPreSelected] = useState<{
    originId?: string;
    destId?: string;
    passengers?: number;
  }>({});

  const fetchDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const querySnapshot = await getDocs(collection(db, 'destinations'));
      const data: Destination[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Destination);
      });
      setDestinations(data);
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

  // Selecting a card directly opens WhatsApp
  const handleSelectDestination = (dest: Destination) => {
    const phoneNumber = '543757368041';
    const message = `Hola, me interesa solicitar un traslado a: ${dest.title}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Booking an excursion opens WhatsApp directly
  const handleBookExcursion = (exc: Excursion) => {
    const phoneNumber = '543757368041';
    const message = `Hola, me interesa reservar la excursión: ${exc.title}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            {/* Argentina, Brasil, Paraguay responsive country cards */}
            <DestinationsList 
              destinations={destinations.filter(d => 
                d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.country.toLowerCase().includes(searchTerm.toLowerCase())
              )}
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

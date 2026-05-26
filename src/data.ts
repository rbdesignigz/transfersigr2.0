import { Destination, Excursion, LocationRoute } from './types';

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: 'arg',
    title: 'Argentina',
    country: 'Argentina',
    code: 'AR',
    status: 'Activo',
    description: 'Visite las majestuosas cataratas del lado argentino con su famosa pasarela a la Garganta del Diablo. Disfrute de la exquisita gastronomía local, espectáculos de tango y hotelería inmersa en la selva subtropical misionera.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7wy_6scgevLaxwTBCCwhbIgpZAgsrlVn5EjCNC5OIpsY1vRRstHwaiued_KHl6QK3Ev07FtrhQ2kSJKKtMlc3T1MRjhuGth8aKiKk5B4e9kLw-24J9IoZUYzb-0IkFUJVrpNmYCnUFvryNYfjlwL9FGvbzqiYaixYGIp94v62w4c-2A0kAMNVK02LTJKrg6lhEO7rQ5I4Z9E2m8gttEzBzGEhT1dLPOptR8wHoxZS3kdnHyxGp0WHwA9uDQ123g-pBdbsyVDMjtTI',
    price4Pax: 50000,
    price6Pax: 70000,
    price4PaxUsd: 45,
    price6PaxUsd: 65,
  },
  {
    id: 'bra',
    title: 'Brasil',
    country: 'Brasil',
    code: 'BR',
    status: 'Activo',
    description: 'Explore las cataratas del lado brasilero que ofrece la vista panorámica más espectacular e imponente de los saltos. Complete su experiencia visitando el fascinante Parque de las Aves y disfrutando de un tradicional rodizio de carnes.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqhXKn-9SQezi472rx7V_H8TKFOybFSBYI91bZogHEu4U7F9oYcv9uUBIZUtaly6kV4WnPp1U0kbc_TslnReyYXUn_43DUgQ8e9b52O2vTsqC1gwv6v-CGSSidfmWMn23Z89EPIx4Voes6GvFzksGLcAi4IXvIy2ioWdRGhT1PSzcH-XrUOojYacUnkCt9n2AnA6nEBzNZbwxIe91FAo69d8j6UF187sP7soGPd9ao1AsFYvMcXxSt1UeJvOHmNbUpdxT3wzyobopq',
    price4Pax: 50000,
    price6Pax: 70000,
    price4PaxUsd: 45,
    price6PaxUsd: 65,
  },
  {
    id: 'par',
    title: 'Paraguay',
    country: 'Paraguay',
    code: 'PY',
    status: 'Activo',
    description: 'Visite el centro de compras libre de impuestos más grande de Sudamérica en Ciudad del Este. Descubra la imponente ingeniería de la Represa de Itaipú, su rica artesanía en filigrana, y la calidez de su cultura bilingüe español-guaraní.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvEcKISmAd3mxlglQB-jg2HwXm_t_VY1utGm27tESL3-PVFPN68lSqjLj9LCJ2jz_RiVuTF_TaOFoVjJ0tTaDwwrg_KZbznn6dDk5iL_whetkQdVuzcDsMkGlRkpAPK5nshBFta8mnFwstMvAzVy7oyNvEMQrR0Ojcx3-FWVsYabMEvI8z5ohcsjaCw-zdfGMTeY_sy-Im3fpwukpeJlrIASJTr4ZAx_baU7u7rn0LtE1Q3o-4sP2N1W1E27p4MgrNaft_7TNRh4Rc',
    price4Pax: 50000,
    price6Pax: 70000,
    price4PaxUsd: 45,
    price6PaxUsd: 65,
  },
];

export const LOCATIONS_DATA: LocationRoute[] = [
  { id: 'igr', name: 'Aeropuerto de Puerto Iguazú (Argentina - IGR)', type: 'airport', city: 'Puerto Iguazú', country: 'AR' },
  { id: 'igu', name: 'Aeropuerto de Foz do Iguaçu (Brasil - IGU)', type: 'airport', city: 'Foz do Iguaçu', country: 'BR' },
  { id: 'agt', name: 'Aeropuerto Guaraní de Ciudad del Este (Paraguay - AGT)', type: 'airport', city: 'Ciudad del Este', country: 'PY' },
  { id: 'h_igr', name: 'Hoteles en Puerto Iguazú (Argentina)', type: 'hotel', city: 'Puerto Iguazú', country: 'AR' },
  { id: 'h_igu', name: 'Hoteles en Foz do Iguaçu (Brasil)', type: 'hotel', city: 'Foz do Iguaçu', country: 'BR' },
  { id: 'h_cde', name: 'Hoteles en Ciudad del Este (Paraguay)', type: 'hotel', city: 'Ciudad del Este', country: 'PY' },
  { id: 'c_arg', name: 'Cataratas del Iguazú - Lado Argentino', type: 'attraction', city: 'Parque Nacional Iguazú', country: 'AR' },
  { id: 'c_bra', name: 'Cataratas del Iguazú - Lado Brasileño', type: 'attraction', city: 'Parque Nacional do Iguaçu', country: 'BR' },
  { id: 'itp', name: 'Represa Binacional de Itaipú (Paraguay/Brasil)', type: 'attraction', city: 'Hernandarias/Foz', country: 'PY' },
];

export const EXCURSIONS_DATA: Excursion[] = [
  {
    id: 'exc-cat-ar',
    title: 'Cataratas del Iguazú Lado Argentino',
    duration: '8 Horas (Día Completo)',
    description: 'La experiencia definitiva para estar en contacto íntimo con los saltos. Recorra las pasarelas superiores, inferiores y acceda en el tren ecológico a la pasarela suspendida sobre el imponente abismo de la Garganta del Diablo.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7wy_6scgevLaxwTBCCwhbIgpZAgsrlVn5EjCNC5OIpsY1vRRstHwaiued_KHl6QK3Ev07FtrhQ2kSJKKtMlc3T1MRjhuGth8aKiKk5B4e9kLw-24J9IoZUYzb-0IkFUJVrpNmYCnUFvryNYfjlwL9FGvbzqiYaixYGIp94v62w4c-2A0kAMNVK02LTJKrg6lhEO7rQ5I4Z9E2m8gttEzBzGEhT1dLPOptR8wHoxZS3kdnHyxGp0WHwA9uDQ123g-pBdbsyVDMjtTI',
    priceArs: 120000,
    priceUsd: 110,
    country: 'AR',
    highlights: [
      'Tren de la Selva ecológico incluido',
      'Acceso exclusivo a la Garganta del Diablo',
      'Senderos de baja dificultad con vistas 360°',
      'Asistencia permanente de chofer calificado'
    ]
  },
  {
    id: 'exc-cat-br',
    title: 'Cataratas Brasileñas y Parque de las Aves',
    duration: '6 Horas',
    description: 'La visión panorámica más majestuosa del cañón de cataratas, ideal para fotografiar la inmensidad del paisaje. Luego, visite un santuario ecológico único con más de 140 especies de aves exóticas rescatadas.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqhXKn-9SQezi472rx7V_H8TKFOybFSBYI91bZogHEu4U7F9oYcv9uUBIZUtaly6kV4WnPp1U0kbc_TslnReyYXUn_43DUgQ8e9b52O2vTsqC1gwv6v-CGSSidfmWMn23Z89EPIx4Voes6GvFzksGLcAi4IXvIy2ioWdRGhT1PSzcH-XrUOojYacUnkCt9n2AnA6nEBzNZbwxIe91FAo69d8j6UF187sP7soGPd9ao1AsFYvMcXxSt1UeJvOHmNbUpdxT3wzyobopq',
    priceArs: 98000,
    priceUsd: 90,
    country: 'BR',
    highlights: [
      'Vista panorámica frontal de todos los saltos',
      'Pasarela colgante Floriano sobre el agua',
      'Ingreso al aviario gigante del Parque de Aves',
      'Trámites de frontera agilizados por chofer autorizado'
    ]
  },
  {
    id: 'exc-shopping-cde',
    title: 'Tour de Compras y Cultura en Ciudad del Este',
    duration: '5 Horas',
    description: 'Cruzar la frontera y comprar con total tranquilidad. Nuestro chofer profesional lo llevará a las tiendas electrónicas y shoppings más confiables y prestigiosos, cuidando sus pertenencias en todo momento y asesorándolo.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvEcKISmAd3mxlglQB-jg2HwXm_t_VY1utGm27tESL3-PVFPN68lSqjLj9LCJ2jz_RiVuTF_TaOFoVjJ0tTaDwwrg_KZbznn6dDk5iL_whetkQdVuzcDsMkGlRkpAPK5nshBFta8mnFwstMvAzVy7oyNvEMQrR0Ojcx3-FWVsYabMEvI8z5ohcsjaCw-zdfGMTeY_sy-Im3fpwukpeJlrIASJTr4ZAx_baU7u7rn0LtE1Q3o-4sP2N1W1E27p4MgrNaft_7TNRh4Rc',
    priceArs: 85000,
    priceUsd: 78,
    country: 'PY',
    highlights: [
      'Cruze preferencial de aduanas',
      'Esperas en parking cerrado vigilado',
      'Guía/Asesor de compras para evitar estafas',
      'Paradas en tiendas oficiales autorizadas'
    ]
  }
];

// Helper to calculate price based on origin, destination and select vehicle (capacity 1-4 vs 5-6)
export function getRoutePrice(originId: string, destId: string, passengers: number): { ars: number; usd: number; message?: string } {
  if (!originId || !destId) return { ars: 0, usd: 0 };
  if (originId === destId) return { ars: 0, usd: 0, message: 'Origen y destino no pueden ser iguales.' };

  const origin = LOCATIONS_DATA.find(l => l.id === originId);
  const dest = LOCATIONS_DATA.find(l => l.id === destId);
  if (!origin || !dest) return { ars: 0, usd: 0 };

  // Determine pricing based on international border crosing complexity
  const isInterCountry = origin.country !== dest.country;
  let baseArs = 40000;
  let baseUsd = 36;

  // Let's create a realistic pricing matrix
  if (isInterCountry) {
    baseArs = 65000; // International transfers require customs processing and waiting
    baseUsd = 60;
  } else {
    // Local domestic transfers are cheaper
    if (origin.type === 'airport' && dest.type === 'hotel') {
      baseArs = 45000;
      baseUsd = 40;
    } else if (origin.type === 'hotel' && dest.type === 'attraction') {
      baseArs = 35000;
      baseUsd = 32;
    }
  }

  // Multiply based on capacity (vehicle types)
  const isVan = passengers > 4;
  const multiplier = isVan ? 1.4 : 1.0;

  return {
    ars: Math.round(baseArs * multiplier),
    usd: Math.round(baseUsd * multiplier),
    message: isInterCountry ? 'Incluye trámites de migración exprés' : 'Traslado directo provincial / nacional'
  };
}

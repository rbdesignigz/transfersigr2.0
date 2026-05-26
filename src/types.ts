export interface Destination {
  id: string;
  title: string;
  country: string;
  code: 'AR' | 'BR' | 'PY';
  status: 'Activo' | 'Inactivo';
  description: string;
  imageUrl: string;
  price4Pax: number;
  price6Pax: number;
  price4PaxUsd: number;
  price6PaxUsd: number;
}

export interface Excursion {
  id: string;
  title: string;
  duration: string;
  description: string;
  imageUrl: string;
  priceArs: number;
  priceUsd: number;
  country: 'AR' | 'BR' | 'PY';
  highlights: string[];
}

export interface BookingFormState {
  fullName: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  vehicleType: 'car' | 'van'; // car is up to 4, van is up to 6
  additionalNotes: string;
  flightNumber?: string;
}

export interface LocationRoute {
  id: string;
  name: string;
  type: 'airport' | 'hotel' | 'attraction';
  city: string;
  country: 'AR' | 'BR' | 'PY';
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'usuario';
  fullName: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: number;
}

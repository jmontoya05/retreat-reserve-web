/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Feature {
  id: string;
  name: string;
  iconKey: string; // e.g. 'wifi', 'utensils', 'flame', 'car', 'tv', 'compass', 'snowflake', 'pet'
  description?: string;
}

export interface PolicyItem {
  title: string;
  displayOrder: number;
  items: string[];
}

export interface Cabin {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  city: string;
  state: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  maxGuests: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  pricePerNight: number;
  imageUrls: string[];
  featureIds: string[];
  policies: PolicyItem[];
}

export interface Reservation {
  id: string;
  cabinId: string;
  userId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guestsCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  cabinId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // YYYY-MM-DD
}

export interface OutgoingEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

// Default Seed Data
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Frente al Lago",
    description: "Cabañas con vistas increíbles y acceso directo al agua.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "cat-2",
    name: "Montaña",
    description: "Refugios en las alturas, rodeados de bosques espesos y aire puro.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "cat-3",
    name: "Bosque",
    description: "Cabañas escondidas entre los árboles de pinos y oyameles.",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "cat-4",
    name: "Románticas",
    description: "Nidos de amor perfectos para escapadas de pareja con chimenea.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "cat-5",
    name: "Con Alberca",
    description: "Estadías de lujo con alberca propia o jacuzzi climatizado.",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "cat-6",
    name: "Pet Friendly",
    description: "Tu mejor amigo peludo es bienvenido a explorar la naturaleza.",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "cat-7",
    name: "Familiares",
    description: "Cabañas amplias equipadas para toda la familia y asados memorables.",
    imageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8d5d8?auto=format&fit=crop&w=400&q=80"
  }
];

export const INITIAL_FEATURES: Feature[] = [
  { id: "feat-1", name: "Wifi de alta velocidad", iconKey: "wifi", description: "Fibra óptica ideal para home office" },
  { id: "feat-2", name: "Cocina equipada", iconKey: "utensils", description: "Estufa, refrigerador y utensilios completos" },
  { id: "feat-3", name: "Chimenea de leña", iconKey: "flame", description: "Chimenea acogedora para las noches frías" },
  { id: "feat-4", name: "Estacionamiento gratis", iconKey: "car", description: "Espacio seguro para 2 vehículos" },
  { id: "feat-5", name: "Smart TV", iconKey: "tv", description: "Netflix, Disney+ y canales locales" },
  { id: "feat-6", name: "Jacuzzi", iconKey: "compass", description: "Tinas de hidromasaje climatizadas" },
  { id: "feat-7", name: "Calefacción", iconKey: "snowflake", description: "Calefactor para las temporadas invernales" },
  { id: "feat-8", name: "Se admiten mascotas", iconKey: "pet", description: "Amplios jardines para pasear" }
];

export const INITIAL_CABINS: Cabin[] = [
  {
    id: "cab-1",
    name: "Cabaña del Lago",
    description: "Hermosa cabaña de madera frente al lago rodeada de exuberante vegetación y árboles nativos. Perfecta para relajarse, desconectar del ajetreo citadino y disfrutar de actividades náuticas al aire libre como kayak, remo y natación. Cuenta con un muelle privado con asador y fogata exterior para disfrutar los atardeceres mágicos.",
    categoryId: "cat-1",
    city: "Valle de Bravo",
    state: "Estado de México",
    country: "México",
    address: "Camino Al Muelle 21, Zona Náutica",
    latitude: 19.1917,
    longitude: -100.1309,
    maxGuests: 4,
    numberOfBedrooms: 2,
    numberOfBathrooms: 2,
    pricePerNight: 120,
    imageUrls: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    ],
    featureIds: ["feat-1", "feat-2", "feat-3", "feat-4", "feat-5", "feat-8"],
    policies: [
      {
        title: "Reglas de la casa",
        displayOrder: 1,
        items: ["Check-in: 15:00 - 21:00", "Check-out: 11:00", "No se permiten fiestas o eventos ruidosos", "Máximo de huéspedes contratados"]
      },
      {
        title: "Cancelación",
        displayOrder: 2,
        items: ["Cancelación gratuita hasta 7 días antes de la llegada", "Reembolso del 50% si cancelas al menos 48h antes"]
      },
      {
        title: "Seguridad y Salud",
        displayOrder: 3,
        items: ["Detector de humo y monóxido de carbono", "Extintor disponible en cocina", "Sanitizado profesionalmente entre reservas"]
      }
    ]
  },
  {
    id: "cab-2",
    name: "Refugio del Bosque",
    description: "Sumérgete en el sonido del silencio en este espectacular refugio rustico de pinos en Mazamitla. Un espacio moderno pero arraigado en la tradición forestal, con grandes ventanales que te permiten fundirte visualmente con el bosque. Increíble asador exterior y terraza elevada de madera.",
    categoryId: "cat-3",
    city: "Mazamitla",
    state: "Jalisco",
    country: "México",
    address: "Bosque Alto Sector 4, Mazamitla",
    latitude: 19.9213,
    longitude: -103.0211,
    maxGuests: 6,
    numberOfBedrooms: 3,
    numberOfBathrooms: 2,
    pricePerNight: 110,
    imageUrls: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    ],
    featureIds: ["feat-2", "feat-3", "feat-4", "feat-7", "feat-8"],
    policies: [
      {
        title: "Reglas de la casa",
        displayOrder: 1,
        items: ["Check-in: 14:00 - 20:00", "Check-out: 12:00", "Fumar solo en terrazas exteriores"]
      },
      {
        title: "Mascotas",
        displayOrder: 2,
        items: ["Se aceptan hasta 2 perros medianos", "Tarifa de limpieza única de $15 USD"]
      }
    ]
  },
  {
    id: "cab-3",
    name: "Cabaña Alpina",
    description: "Una experiencia alpina auténtica en tierras mexicanas. Con su icónico techo estilo A-Frame ('dos aguas') y chimenea central cilíndrica, esta cabaña ofrece las mejores puestas de sol de Jalisco. Completamente equipada e íntima.",
    categoryId: "cat-2",
    city: "Tapalpa",
    state: "Jalisco",
    country: "México",
    address: "Camino Los Espinos Km 4, Tapalpa",
    latitude: 19.9431,
    longitude: -103.7578,
    maxGuests: 4,
    numberOfBedrooms: 2,
    numberOfBathrooms: 1,
    pricePerNight: 150,
    imageUrls: [
      "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    ],
    featureIds: ["feat-1", "feat-2", "feat-3", "feat-4", "feat-5", "feat-6"],
    policies: [
      {
        title: "Reglas de la casa",
        displayOrder: 1,
        items: ["Check-in: 15:00 - 22:00", "Check-out: 11:00", "Prohibidas bocinas en el área verde exterior después de las 22:00"]
      }
    ]
  },
  {
    id: "cab-4",
    name: "La Cabaña Verde",
    description: "Ubicada en el místico pueblo mágico de Huasca de Ocampo. Diseñada con un enfoque ecológico utilizando celdas solares y captación de agua pluvial. Disfruta de un jardín gigante de orquídeas y senderos privados.",
    categoryId: "cat-3",
    city: "Huasca de Ocampo",
    state: "Hidalgo",
    country: "México",
    address: "Camino Real a San Miguel Regla",
    latitude: 20.2031,
    longitude: -98.5714,
    maxGuests: 2,
    numberOfBedrooms: 1,
    numberOfBathrooms: 1,
    pricePerNight: 105,
    imageUrls: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    ],
    featureIds: ["feat-1", "feat-2", "feat-3", "feat-4", "feat-8"],
    policies: [
      {
        title: "Políticas Ecológicas",
        displayOrder: 1,
        items: ["Uso responsable de energía", "Separación obligatoria de basura orgánica e inorgánica"]
      }
    ]
  },
  {
    id: "cab-5",
    name: "Bosque Sereno",
    description: "Elegante villa de montaña moderna suspendida en los riscos de Mazamitla. Un oasis premium con spa exterior, fogata hundida, y mayordomía de leña.",
    categoryId: "cat-2",
    city: "Mazamitla",
    state: "Jalisco",
    country: "México",
    address: "Senda del Halcón Lote 9",
    latitude: 19.919,
    longitude: -103.018,
    maxGuests: 8,
    numberOfBedrooms: 4,
    numberOfBathrooms: 4,
    pricePerNight: 230,
    imageUrls: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80"
    ],
    featureIds: ["feat-1", "feat-2", "feat-3", "feat-4", "feat-5", "feat-6", "feat-7"],
    policies: [
      {
        title: "Reglas de la villa",
        displayOrder: 1,
        items: ["Check-in: 16:00", "Check-out: 10:00", "Prohibidas mascotas sin aprobación escrita"]
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    cabinId: "cab-1",
    userId: "user-abc-1",
    userName: "María González",
    rating: 5,
    comment: "Lugar increíble. La vista es espectacular y la cabaña es súper cómoda y limpia. Definitivamente volveremos.",
    date: "2026-04-10"
  },
  {
    id: "rev-2",
    cabinId: "cab-1",
    userId: "user-abc-2",
    userName: "Carlos Ramírez",
    rating: 4.8,
    comment: "Todo perfecto, muy limpio y bien ubicado. Recomendado al 100%.",
    date: "2026-03-29"
  },
  {
    id: "rev-3",
    cabinId: "cab-2",
    userId: "user-abc-3",
    userName: "Sofía Méndez",
    rating: 4.5,
    comment: "Rodeado de pinos altos, el olor a bosque fue el mejor tónico para relajar la mente.",
    date: "2026-05-15"
  }
];

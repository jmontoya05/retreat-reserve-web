/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Category,
  Feature,
  Cabin,
  Reservation,
  Review,
  User,
  OutgoingEmail,
  INITIAL_CATEGORIES,
  INITIAL_FEATURES,
  INITIAL_CABINS,
  INITIAL_REVIEWS
} from '../types';

const STORAGE_KEYS = {
  CATEGORIES: 'rr_categories',
  FEATURES: 'rr_features',
  CABINS: 'rr_cabins',
  RESERVATIONS: 'rr_reservations',
  REVIEWS: 'rr_reviews',
  USERS: 'rr_users',
  LOGGED_IN_USER: 'rr_logged_in_user',
  FAVORITES: 'rr_favorites',
  OUTGOING_EMAILS: 'rr_outgoing_emails'
};

// Seed initial values if not present
function getOrSeed<T>(key: string, initial: T[]): T[] {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

// Initial Admin seed
const SEED_USERS: User[] = [
  {
    id: "user-admin-1",
    name: "Administrador",
    lastName: "Retreat",
    email: "admin@retreatreserve.com",
    role: "admin",
    createdAt: "2026-01-01T12:00:00Z"
  },
  {
    id: "user-demo-1",
    name: "María",
    lastName: "González",
    email: "maria@ejemplo.com",
    role: "user",
    createdAt: "2026-03-15T15:30:00Z"
  }
];

export class LocalDatabase {
  // --- Categories ---
  static getCategories(): Category[] {
    return getOrSeed<Category>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  static createCategory(category: Omit<Category, 'id'>): Category {
    const list = this.getCategories();
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`
    };
    list.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
    return newCategory;
  }

  static deleteCategory(id: string): boolean {
    const list = this.getCategories();
    const filtered = list.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    return filtered.length < list.length;
  }

  // --- Features ---
  static getFeatures(): Feature[] {
    return getOrSeed<Feature>(STORAGE_KEYS.FEATURES, INITIAL_FEATURES);
  }

  static createFeature(feature: Omit<Feature, 'id'>): Feature {
    const list = this.getFeatures();
    const newFeature: Feature = {
      ...feature,
      id: `feat-${Date.now()}`
    };
    list.push(newFeature);
    localStorage.setItem(STORAGE_KEYS.FEATURES, JSON.stringify(list));
    return newFeature;
  }

  static deleteFeature(id: string): boolean {
    const list = this.getFeatures();
    const filtered = list.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FEATURES, JSON.stringify(filtered));
    return filtered.length < list.length;
  }

  // --- Cabins ---
  static getCabins(): Cabin[] {
    return getOrSeed<Cabin>(STORAGE_KEYS.CABINS, INITIAL_CABINS);
  }

  static getCabinById(id: string): Cabin | null {
    const list = this.getCasbinListWithHydratedAverages();
    return list.find(c => c.id === id) || null;
  }

  private static getCasbinListWithHydratedAverages(): Cabin[] {
    return getOrSeed<Cabin>(STORAGE_KEYS.CABINS, INITIAL_CABINS);
  }

  static createCabin(cabin: Omit<Cabin, 'id'>): Cabin {
    const list = this.getCabins();
    // Validate uniqueness of name
    if (list.some(c => c.name.toLowerCase() === cabin.name.toLowerCase())) {
      throw new Error(`Ya existe una cabaña con el nombre "${cabin.name}".`);
    }

    const newCabin: Cabin = {
      ...cabin,
      id: `cab-${Date.now()}`
    };
    list.push(newCabin);
    localStorage.setItem(STORAGE_KEYS.CABINS, JSON.stringify(list));
    return newCabin;
  }

  static updateCabin(cabin: Cabin): Cabin {
    const list = this.getCabins();
    const index = list.findIndex(c => c.id === cabin.id);
    if (index === -1) {
      throw new Error("Cabaña no encontrada.");
    }
    list[index] = cabin;
    localStorage.setItem(STORAGE_KEYS.CABINS, JSON.stringify(list));
    return cabin;
  }

  static deleteCabin(id: string): boolean {
    const list = this.getCabins();
    const filtered = list.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CABINS, JSON.stringify(filtered));
    return filtered.length < list.length;
  }

  // --- Users ---
  static getUsers(): User[] {
    return getOrSeed<User>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  static toggleAdmin(userId: string): User {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error("Usuario no encontrado.");
    }
    // Prevent self demotion or simply toggle
    users[index].role = users[index].role === 'admin' ? 'user' : 'admin';
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // If the logged in user is updated, sync their status
    const currentLogged = this.getLoggedInUser();
    if (currentLogged && currentLogged.id === userId) {
      currentLogged.role = users[index].role;
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(currentLogged));
    }
    
    return users[index];
  }

  static registerUser(userIn: Omit<User, 'id'> & { password?: string }): User {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === userIn.email.toLowerCase())) {
      throw new Error("La dirección de correo electrónico ya está registrada.");
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userIn.name,
      lastName: userIn.lastName,
      email: userIn.email,
      role: 'user', // defaults to standard register
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Send confirmation email (Story 19)
    const verificationUrl = `${window.location.origin}/verify-email?token=token-${newUser.id}`;
    this.sendEmail(
      newUser.email,
      "¡Confirma tu registro en Retreat Reserve!",
      `Hola ${newUser.name} ${newUser.lastName},\n\nGracias por registrarte en Retreat Reserve. Tu cuenta ha sido creada con éxito.\n\nPor favor verifica tu información:\n- Nombre: ${newUser.name} ${newUser.lastName}\n- Correo: ${newUser.email}\n\nHaz clic en el siguiente enlace para verificar tu correo e iniciar sesión en tu cuenta:\n\n${verificationUrl}\n\n¡Escápate. Relájate. Reconecta!\nEl equipo de Retreat Reserve`
    );

    return newUser;
  }

  static updateProfile(userId: string, data: { name: string; lastName: string }): User {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error("Usuario no encontrado.");
    
    users[idx].name = data.name;
    users[idx].lastName = data.lastName;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Update logged in user if match
    const currentLogged = this.getLoggedInUser();
    if (currentLogged && currentLogged.id === userId) {
      const updated = { ...currentLogged, ...data };
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(updated));
    }
    return users[idx];
  }

  static loginUser(email: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error("Credenciales inválidas o correo no registrado.");
    }
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(user));
    return user;
  }

  static getLoggedInUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.LOGGED_IN_USER);
    return data ? JSON.parse(data) : null;
  }

  static logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN_USER);
  }

  // --- Reservations ---
  static getReservations(): Reservation[] {
    return getOrSeed<Reservation>(STORAGE_KEYS.RESERVATIONS, []);
  }

  static getReservationsByUserId(userId: string): Reservation[] {
    const all = this.getReservations();
    return all.filter(r => r.userId === userId);
  }

  static checkAvailability(cabinId: string, checkInDate: string, checkOutDate: string): boolean {
    const reservations = this.getReservations();
    // Overlap math: (StartA <= EndB) and (EndA >= StartB)
    const cIn = new Date(checkInDate);
    const cOut = new Date(checkOutDate);
    
    // Error bounds checking
    if (cIn >= cOut) return false;

    for (const r of reservations) {
      if (r.cabinId === cabinId && r.status !== 'cancelled') {
        const rIn = new Date(r.checkInDate);
        const rOut = new Date(r.checkOutDate);
        
        if (cIn < rOut && cOut > rIn) {
          return false; // overlapping!
        }
      }
    }
    return true;
  }

  static createReservation(reservation: Omit<Reservation, 'id' | 'createdAt'>): Reservation {
    // Check range availability again
    const available = this.checkAvailability(reservation.cabinId, reservation.checkInDate, reservation.checkOutDate);
    if (!available) {
      throw new Error("El rango de fechas seleccionado ya está ocupado. Por favor, selecciona otras fechas.");
    }

    const list = this.getReservations();
    const newReservation: Reservation = {
      ...reservation,
      id: `res-${Date.now()}`,
      status: 'confirmed', // immediately active or confirmed
      createdAt: new Date().toISOString()
    };
    list.push(newReservation);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));

    // Get info of user & cabin
    const cabin = this.getCabinById(reservation.cabinId);
    // Sync email notification (Story 35)
    const user = this.getLoggedInUser();
    if (user && cabin) {
      this.sendEmail(
        user.email,
        "Confirmación de tu Reserva — Retreat Reserve",
        `Hola ${user.name},\n\n¡Tu reserva ha sido confirmada con éxito!\n\nDetalles de la Reserva:\n- Cabaña: ${cabin.name}\n- Ubicación: ${cabin.city}, ${cabin.state}\n- Fecha de Entrada: ${reservation.checkInDate}\n- Fecha de Salida: ${reservation.checkOutDate}\n- Cantidad de Huéspedes: ${reservation.guestsCount}\n- Importe Total: $${reservation.totalAmount} USD\n- Código de Confirmación: RR-${newReservation.id.toUpperCase().split('-')[1]}\n\nTe sugerimos contactar al proveedor para coordinar el ingreso por WhatsApp.\n\n¡Disfruta tu escape en la naturaleza!\nAtentamente,\nRetreat Reserve`
      );
    }

    return newReservation;
  }

  static updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): Reservation {
    const list = this.getReservations();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) {
      throw new Error("Reserva no encontrada.");
    }
    list[idx].status = status;
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
    return list[idx];
  }

  // --- Reviews ---
  static getReviews(): Review[] {
    return getOrSeed<Review>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static getReviewsByCabinId(cabinId: string): Review[] {
    const all = this.getReviews();
    return all.filter(r => r.cabinId === cabinId);
  }

  static createReview(review: Omit<Review, 'id' | 'date'>): Review {
    const list = this.getReviews();
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    list.push(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));
    return newReview;
  }

  // --- Favorites ---
  static getFavoritesByUserId(userId: string): string[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.FAVORITES}_${userId}`);
    return data ? JSON.parse(data) : [];
  }

  static toggleFavorite(userId: string, cabinId: string): boolean {
    const favorites = this.getFavoritesByUserId(userId);
    const index = favorites.indexOf(cabinId);
    let isAdded = false;
    if (index === -1) {
      favorites.push(cabinId);
      isAdded = true;
    } else {
      favorites.splice(index, 1);
      isAdded = false;
    }
    localStorage.setItem(`${STORAGE_KEYS.FAVORITES}_${userId}`, JSON.stringify(favorites));
    return isAdded;
  }

  // --- Simulated Outgoing Email Notifier (Story 19 & 35 helper for extreme high fidelity) ---
  static getEmails(): OutgoingEmail[] {
    const data = localStorage.getItem(STORAGE_KEYS.OUTGOING_EMAILS);
    return data ? JSON.parse(data) : [];
  }

  static sendEmail(to: string, subject: string, body: string): void {
    const list = this.getEmails();
    const newEmail: OutgoingEmail = {
      id: `email-${Date.now()}`,
      to,
      subject,
      body,
      sentAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    list.unshift(newEmail); // put most recent on top
    localStorage.setItem(STORAGE_KEYS.OUTGOING_EMAILS, JSON.stringify(list));
    
    // Dispatch a custom event to notify components that are listening to emails
    window.dispatchEvent(new Event('rr_email_sent'));
  }

  static clearEmails(): void {
    localStorage.setItem(STORAGE_KEYS.OUTGOING_EMAILS, JSON.stringify([]));
    window.dispatchEvent(new Event('rr_email_sent'));
  }
}

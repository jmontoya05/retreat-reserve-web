/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocalDatabase } from './database';
import { Category, Feature, Cabin, Reservation, Review, User } from '../types';

// Read API URL from Vite environment or default
const BASE_API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api/v1';

// In-memory or localStorage token store
const TOKEN_KEY = 'rr_auth_token';

export class ApiClient {
  static getBackendUrl(): string {
    return BASE_API_URL;
  }

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  // Helper info mock request headers builder
  private static getHeaders(contentType = 'application/json'): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': contentType,
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const loggedUser = LocalDatabase.getLoggedInUser();
    if (loggedUser) {
      headers['X-User-Id'] = loggedUser.id;
    }
    return headers;
  }

  // General fetch with resilient fallback to local database mockup
  private static async request<T>(endpoint: string, options: RequestInit, localFallback: () => T): Promise<T> {
    try {
      const resp = await fetch(`${BASE_API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });
      if (!resp.ok) {
        throw new Error(`Server returned code ${resp.status}`);
      }
      return await resp.json() as T;
    } catch (e) {
      // Graceful fallback to LocalDatabase Mockup
      console.warn(`[API Client] Error contacting backend at ${BASE_API_URL}${endpoint}, falling back to client-safe mock engine:`, e);
      return localFallback();
    }
  }

  // --- Auth ---
  static async login(email: string): Promise<{ token: string; user: User }> {
    try {
      const resp = await fetch(`${BASE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' })
      });
      if (resp.ok) {
        const data = await resp.json();
        this.setToken(data.token);
        // Sync to local DB
        const existingUsers = LocalDatabase.getUsers();
        let matchedUser = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!matchedUser) {
          matchedUser = LocalDatabase.registerUser({
            name: data.user?.name || "Usuario",
            lastName: data.user?.lastName || "Demostracion",
            email: email,
            role: data.user?.role || 'user'
          });
        }
        localStorage.setItem('rr_logged_in_user', JSON.stringify(matchedUser));
        return { token: data.token, user: matchedUser };
      }
    } catch (err) {
      console.warn("Backend auth unavailable, falling back to client-safe session.");
    }
    
    // Local Fallback
    const user = LocalDatabase.loginUser(email);
    const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;
    this.setToken(mockToken);
    return { token: mockToken, user };
  }

  static async register(user: Omit<User, 'id'>): Promise<User> {
    try {
      const resp = await fetch(`${BASE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (resp.ok) {
        return await resp.json() as User;
      }
    } catch (e) {
      console.warn("Backend registration error, using client-safe DB");
    }
    return LocalDatabase.registerUser(user);
  }

  // --- Categories ---
  static async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories', { method: 'GET' }, () => LocalDatabase.getCategories());
  }

  static async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const resp = await fetch(`${BASE_API_URL}/categories`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(category)
      });
      if (resp.ok) return await resp.json() as Category;
    } catch (e) {
      console.warn("Backend category create error, using client-safe DB");
    }
    return LocalDatabase.createCategory(category);
  }

  static async deleteCategory(id: string): Promise<boolean> {
    try {
      const resp = await fetch(`${BASE_API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      if (resp.ok) return true;
    } catch (e) {
      console.warn("Backend category delete error, using client-safe DB");
    }
    return LocalDatabase.deleteCategory(id);
  }

  // --- Features ---
  static async getFeatures(): Promise<Feature[]> {
    return this.request<Feature[]>('/features', { method: 'GET' }, () => LocalDatabase.getFeatures());
  }

  static async createFeature(feature: Omit<Feature, 'id'>): Promise<Feature> {
    try {
      const resp = await fetch(`${BASE_API_URL}/features`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(feature)
      });
      if (resp.ok) return await resp.json() as Feature;
    } catch (e) {
      console.warn("Backend feature creation error, using client-safe DB");
    }
    return LocalDatabase.createFeature(feature);
  }

  static async deleteFeature(id: string): Promise<boolean> {
    try {
      const resp = await fetch(`${BASE_API_URL}/features/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      if (resp.ok) return true;
    } catch (e) {
      console.warn("Backend feature deletion error, using client-safe DB");
    }
    return LocalDatabase.deleteFeature(id);
  }

  // --- Cabins ---
  static async getCabinsSearch(params?: {
    city?: string;
    maxGuests?: number;
    maxPrice?: number;
    categoryId?: string;
  }): Promise<Cabin[]> {
    // Construct Query String
    let query = '';
    if (params) {
      const parts: string[] = [];
      if (params.city) parts.push(`city=${encodeURIComponent(params.city)}`);
      if (params.maxGuests) parts.push(`maxGuests=${params.maxGuests}`);
      if (params.maxPrice) parts.push(`maxPrice=${params.maxPrice}`);
      if (params.categoryId) parts.push(`categoryId=${params.categoryId}`);
      if (parts.length > 0) query = '?' + parts.join('&');
    }

    return this.request<Cabin[]>(`/cabins/search${query}`, { method: 'GET' }, () => {
      // Local Database search implementation
      let list = LocalDatabase.getCabins();
      if (params) {
        if (params.city) {
          list = list.filter(c => c.city.toLowerCase().includes(params.city!.toLowerCase()) || c.state.toLowerCase().includes(params.city!.toLowerCase()));
        }
        if (params.maxGuests) {
          list = list.filter(c => c.maxGuests >= params.maxGuests!);
        }
        if (params.maxPrice) {
          list = list.filter(c => c.pricePerNight <= params.maxPrice!);
        }
        if (params.categoryId) {
          list = list.filter(c => c.categoryId === params.categoryId);
        }
      }
      return list;
    });
  }

  static async getCabinById(id: string): Promise<Cabin> {
    return this.request<Cabin>(`/cabins/${id}`, { method: 'GET' }, () => {
      const found = LocalDatabase.getCabinById(id);
      if (!found) throw new Error("Cabaña no encontrada localmente");
      return found;
    });
  }

  static async createCabin(cabin: Omit<Cabin, 'id'>): Promise<Cabin> {
    try {
      const resp = await fetch(`${BASE_API_URL}/cabins`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(cabin)
      });
      if (resp.ok) return await resp.json() as Cabin;
    } catch (e) {
      console.warn("Backend cabin creation error, using client-safe DB");
    }
    return LocalDatabase.createCabin(cabin);
  }

  static async deleteCabin(id: string): Promise<boolean> {
    try {
      const resp = await fetch(`${BASE_API_URL}/cabins/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      if (resp.ok) return true;
    } catch (e) {
      console.warn("Backend cabin deletion error, using client-safe DB");
    }
    return LocalDatabase.deleteCabin(id);
  }

  // --- Reservations ---
  static async checkAvailability(cabinId: string, checkIn: string, checkOut: string): Promise<boolean> {
    const url = `/reservations/check-availability?cabinId=${cabinId}&checkInDate=${checkIn}&checkOutDate=${checkOut}`;
    return this.request<{ available: boolean }>(url, { method: 'GET' }, () => {
      return { available: LocalDatabase.checkAvailability(cabinId, checkIn, checkOut) };
    }).then(res => res.available);
  }

  static async createReservation(reservation: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation> {
    try {
      const resp = await fetch(`${BASE_API_URL}/reservations`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(reservation)
      });
      if (resp.ok) return await resp.json() as Reservation;
    } catch (e) {
      console.warn("Backend reservation creation error, using client-safe DB");
    }
    return LocalDatabase.createReservation(reservation);
  }

  static async getReservationsByUserId(userId: string): Promise<Reservation[]> {
    return this.request<Reservation[]>(`/reservations/user/${userId}`, { method: 'GET' }, () => {
      return LocalDatabase.getReservationsByUserId(userId);
    });
  }

  // --- Reviews ---
  static async getReviewsByCabinId(cabinId: string): Promise<Review[]> {
    return this.request<Review[]>(`/reviews/cabin/${cabinId}`, { method: 'GET' }, () => {
      return LocalDatabase.getReviewsByCabinId(cabinId);
    });
  }

  static async createReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    try {
      const resp = await fetch(`${BASE_API_URL}/reviews`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(review)
      });
      if (resp.ok) return await resp.json() as Review;
    } catch (e) {
      console.warn("Backend review creation error, using client-safe DB");
    }
    return LocalDatabase.createReview(review);
  }
}

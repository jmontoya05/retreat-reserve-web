/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Cabin, Reservation, Review, Category, Feature, OutgoingEmail } from '../types';
import { LocalDatabase } from '../services/database';
import { ApiClient } from '../services/api';

interface SearchCriteria {
  city: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
}

export type ViewState = 
  | 'home' 
  | 'detail' 
  | 'search' 
  | 'login' 
  | 'register' 
  | 'profile' 
  | 'reservations' 
  | 'favorites' 
  | 'admin';

interface AppContextType {
  user: User | null;
  currentView: ViewState;
  selectedCabinId: string | null;
  selectedCategoryFilter: string | null;
  searchCriteria: SearchCriteria;
  favorites: string[];
  cabins: Cabin[];
  categories: Category[];
  features: Feature[];
  allReservations: Reservation[];
  allReviews: Review[];
  sentEmails: OutgoingEmail[];
  adminMessage: string | null; // Top required message if redirecting to login
  adminSubTab: 'properties' | 'categories' | 'features' | 'users' | 'reservations';
  
  // Actions
  setView: (view: ViewState, cabinId?: string | null) => void;
  setCategoryFilter: (catId: string | null) => void;
  setSearch: (criteria: Partial<SearchCriteria>) => void;
  clearSearch: () => void;
  register: (user: Omit<User, 'id'>) => Promise<User>;
  login: (email: string) => Promise<User>;
  logout: () => void;
  toggleFavorite: (cabinId: string) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<Reservation>;
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<Review>;
  refreshEmails: () => void;
  setAdminMessage: (msg: string | null) => void;
  setAdminSubTab: (tab: 'properties' | 'categories' | 'features' | 'users' | 'reservations') => void;
  
  // DB reloads for admin edits
  reloadDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(LocalDatabase.getLoggedInUser());
  const [currentView, setCurrentViewState] = useState<ViewState>('home');
  const [selectedCabinId, setSelectedCabinId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [adminSubTab, setAdminSubTab] = useState<'properties' | 'categories' | 'features' | 'users' | 'reservations'>('properties');
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const [favorites, setFavorites] = useState<string[]>([]);
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [sentEmails, setSentEmails] = useState<OutgoingEmail[]>([]);

  // Load database snapshot
  const reloadDatabase = () => {
    setCabins(LocalDatabase.getCabins());
    setCategories(LocalDatabase.getCategories());
    setFeatures(LocalDatabase.getFeatures());
    setAllReservations(LocalDatabase.getReservations());
    setAllReviews(LocalDatabase.getReviews());
    setSentEmails(LocalDatabase.getEmails());
    
    if (user) {
      setFavorites(LocalDatabase.getFavoritesByUserId(user.id));
    } else {
      setFavorites([]);
    }
  };

  useEffect(() => {
    reloadDatabase();

    // Listen to simulated email system
    const handleEmailSent = () => {
      setSentEmails(LocalDatabase.getEmails());
    };
    window.addEventListener('rr_email_sent', handleEmailSent);
    return () => {
      window.removeEventListener('rr_email_sent', handleEmailSent);
    };
  }, [user]);

  const setView = (view: ViewState, cabinId: string | null = null) => {
    setCurrentViewState(view);
    if (cabinId) setSelectedCabinId(cabinId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCategoryFilter = (catId: string | null) => {
    setSelectedCategoryFilter(catId);
  };

  const setSearch = (criteria: Partial<SearchCriteria>) => {
    setSearchCriteria(prev => ({ ...prev, ...criteria }));
  };

  const clearSearch = () => {
    setSearchCriteria({
      city: '',
      checkIn: '',
      checkOut: '',
      guests: 1
    });
  };

  const register = async (userInfo: Omit<User, 'id'>) => {
    const newUser = await ApiClient.register(userInfo);
    reloadDatabase();
    return newUser;
  };

  const login = async (email: string) => {
    const { user: loggedInUser } = await ApiClient.login(email);
    setUser(loggedInUser);
    setFavorites(LocalDatabase.getFavoritesByUserId(loggedInUser.id));
    reloadDatabase();
    return loggedInUser;
  };

  const logout = () => {
    ApiClient.clearToken();
    LocalDatabase.logoutUser();
    setUser(null);
    setFavorites([]);
    reloadDatabase();
    setCurrentViewState('home');
  };

  const toggleFavorite = (cabinId: string) => {
    if (!user) {
      setAdminMessage("Por favor, inicia sesión para poder guardar tus cabañas favoritas.");
      setCurrentViewState('login');
      return;
    }
    LocalDatabase.toggleFavorite(user.id, cabinId);
    setFavorites(LocalDatabase.getFavoritesByUserId(user.id));
    reloadDatabase();
  };

  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const res = await ApiClient.createReservation(reservation);
    reloadDatabase();
    return res;
  };

  const addReview = async (review: Omit<Review, 'id' | 'date'>) => {
    const rev = await ApiClient.createReview(review);
    reloadDatabase();
    return rev;
  };

  const refreshEmails = () => {
    setSentEmails(LocalDatabase.getEmails());
  };

  return (
    <AppContext.Provider value={{
      user,
      currentView,
      selectedCabinId,
      selectedCategoryFilter,
      searchCriteria,
      favorites,
      cabins,
      categories,
      features,
      allReservations,
      allReviews,
      sentEmails,
      adminMessage,
      adminSubTab,
      setView,
      setCategoryFilter,
      setSearch,
      clearSearch,
      register,
      login,
      logout,
      toggleFavorite,
      addReservation,
      addReview,
      refreshEmails,
      setAdminMessage,
      setAdminSubTab,
      reloadDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { THEME_CLASSES } from '../styles/tokens';
import { Heart, Star, Trees, Trash2, ShieldAlert } from 'lucide-react';

export const Favorites: React.FC = () => {
  const { user, favorites, cabins, toggleFavorite, setView } = useApp();

  const favoriteCabins = useMemo(() => {
    return cabins.filter(c => favorites.includes(c.id));
  }, [cabins, favorites]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert size={48} className="text-amber-500 mx-auto" />
        <h3 className="font-bold">Para ver tus favoritos debes iniciar sesión primero</h3>
        <button onClick={() => setView('login')} className={THEME_CLASSES.btnPrimary}>Ir al Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-gray-200 pb-5">
        <h2 className="font-sans text-2xl font-black text-[#1F2937] tracking-tight flex items-center gap-2">
          <Heart size={28} className="text-red-500" fill="#EF4444" /> Mis Cabañas Favoritas
        </h2>
        <p className="text-xs text-gray-500">Tus refugios de ensueño guardados para reservas futuras. Administra esta selección de un solo clic.</p>
      </div>

      {favoriteCabins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteCabins.map((cabin) => (
            <div 
              key={cabin.id} 
              className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative cursor-pointer"
            >
              
              {/* Product Card Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img 
                  src={cabin.imageUrls[0]} 
                  alt={cabin.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onClick={() => setView('detail', cabin.id)}
                />

                {/* HEART BUTTON TO REMOVE ON FLY (Story 25) */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(cabin.id)}
                  className="absolute top-4 right-4 p-2.5 bg-white/95 rounded-full shadow hover:bg-red-150 text-red-500 transition-all cursor-pointer focus:outline-none"
                  title="Eliminar de favoritos"
                >
                  <Heart size={16} fill="#EF4444" stroke="#EF4444" className="animate-pulse" />
                </button>
              </div>

              {/* content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5Client">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 
                      onClick={() => setView('detail', cabin.id)}
                      className="text-base font-black text-[#1F2937] hover:text-[#1F5937] transition-colors leading-tight cursor-pointer"
                    >
                      {cabin.name}
                    </h4>
                    <span className="text-xs font-black text-[#1F5937] bg-emerald-50 px-1.5 py-0.5 rounded">
                      ★ 4.8
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">📍 {cabin.city}, {cabin.state}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{cabin.description}</p>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center bg-gray-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <span className="text-base font-black text-[#1F2937]">${cabin.pricePerNight} <span className="text-[10px] text-gray-400 font-normal">/ noche</span></span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(cabin.id)}
                      className="p-2 border border-red-200 text-red-650 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                    <button
                      onClick={() => setView('detail', cabin.id)}
                      className={`${THEME_CLASSES.btnPrimary} !py-1.5 !px-3 text-[11px] cursor-pointer`}
                    >
                      Reservar
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#F5F5F5] border border-gray-200 rounded-3xl p-16 text-center max-w-xl mx-auto flex flex-col items-center space-y-4">
          <Heart className="text-gray-300" size={56} />
          <h4 className="font-bold text-[#1F2937]">Tu lista está vacía</h4>
          <p className="text-xs text-gray-500 max-w-md">Para guardar tus cabañas favoritas y verlas aquí más tarde, haz clic en el botón de corazón ❤️ de cualquier alojamiento en la página principal.</p>
          <button
            onClick={() => setView('home')}
            className={THEME_CLASSES.btnPrimary}
          >
            Explorar Catálogo
          </button>
        </div>
      )}

    </div>
  );
};

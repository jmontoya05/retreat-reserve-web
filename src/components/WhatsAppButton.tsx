/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageSquare, Send, X, CheckCircle, AlertTriangle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const PRESET_MESSAGES = [
    "¿Tiene disponibilidad para este fin de semana?",
    "¿Cómo es el camino de acceso para autos pequeños?",
    "¿Qué incluye la tarifa de limpieza para mascotas?",
    "¿Hay señal de celular o internet satelital?"
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate connection issue / input validations
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setErrorMessage("Por favor, escribe un mensaje válido antes de enviar.");
      setShowNotification('error');
      setTimeout(() => setShowNotification(null), 4000);
      return;
    }

    // Success Simulation
    try {
      // Simulate external API call or standard custom URI redirection
      // window.open(`https://wa.me/5215500000000?text=${encodeURIComponent(trimmedMessage)}`, '_blank');
      
      setShowNotification('success');
      setMessage('');
      setIsOpen(false);
      
      // Auto dismiss
      setTimeout(() => setShowNotification(null), 4000);
    } catch (err) {
      setErrorMessage("Ocurrió un error de conexión con la plataforma de WhatsApp. Revisa tu acceso general a internet.");
      setShowNotification('error');
      setTimeout(() => setShowNotification(null), 5000);
    }
  };

  const handleSelectPreset = (preset: string) => {
    setMessage(preset);
  };

  return (
    <>
      {/* Floating Button right bottom corner */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        
        {/* Chat window panel */}
        {isOpen && (
          <div className="mb-4 w-80 sm:w-96 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
            
            {/* Header */}
            <div className="bg-[#1F5937] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-700/80 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
                  RR
                </div>
                <div>
                  <h4 className="font-bold text-sm">Soporte Retreat Reserve</h4>
                  <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse inline-block"></span>
                    En línea ahora — Responderemos de inmediato
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 bg-[#F4E9D9]/30 max-h-72 overflow-y-auto space-y-3">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-[#1F2937] border border-gray-100 max-w-[85%]">
                ¡Hola! Bienvenido a Retreat Reserve 🌲. ¿Tienes dudas sobre alguna cabaña, ubicación o reservación? Escríbenos y con gusto te asistiremos.
              </div>

              {/* Preset question chips */}
              <div className="space-y-1.5 pt-2">
                <p className="text-[10px] uppercase font-bold text-[#8DB600] tracking-wider mb-1">Preguntas populares:</p>
                {PRESET_MESSAGES.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full text-left bg-white hover:bg-[#F4E9D9] border border-gray-200 text-[#1F2937] p-2 rounded-lg text-xs transition duration-200 cursor-pointer block truncate"
                  >
                    💡 {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-gray-50 border border-gray-200 text-xs text-[#1F2937] px-3 py-2 rounded-xl focus:ring-1 focus:ring-[#1F5937] focus:border-[#1F5937] "
              />
              <button
                type="submit"
                className="p-2.5 bg-[#1F5937] hover:bg-[#143B24] text-white rounded-xl transition duration-200 shadow-sm active:scale-95 cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>

          </div>
        )}

        {/* WhatsApp Ring green button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-90 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-200"
          title="Iniciar chat con soporte"
        >
          <MessageSquare size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-bold text-sm tracking-wide max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-500 ease-out whitespace-nowrap">
            ¿Ayuda? Chat
          </span>
        </button>
      </div>

      {/* Floating popup Alert notification */}
      {showNotification && (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
          {showNotification === 'success' ? (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl shadow-xl flex gap-3 text-xs items-start">
              <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-bold text-emerald-800">¡Mensaje enviado con éxito!</p>
                <p className="text-emerald-700 font-medium">Se simuló la redirección con API de WhatsApp. ¡El proveedor recibió tu consulta!</p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-xl flex gap-3 text-xs items-start">
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-bold text-red-800">Error al enviar mensaje</p>
                <p className="text-red-700 font-medium">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

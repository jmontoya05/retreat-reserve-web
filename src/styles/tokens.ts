/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const THEME_TOKENS = {
  colors: {
    background: '#FFFFFF',
    primary: '#1F5937', // Deep forest green (Brand Primary)
    deepForest: '#1F5937', // Deep forest green
    accentOlive: '#8DB600', // Olive green
    warmSand: '#F4E9D9', // Sandy cream
    neutralText: '#1F2937', // Deep gray
    grayLighter: '#F5F5F5', // Light gray
    grayMedium: '#E5E7EB', // Border gray
    grayDark: '#9CA3AF'
  },
  fonts: {
    sans: '"Inter", sans-serif',
  },
  spacingUnit: 4 // 4px base multiplier
};

// Ready-to-use Tailwind class combos with enhanced border-radius and new color scheme
export const THEME_CLASSES = {
  btnPrimary: "bg-[#1F5937] hover:bg-[#143B24] text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-sm active:scale-95 text-center focus:outline-none focus:ring-2 focus:ring-[#1F5937] focus:ring-offset-2 cursor-pointer text-xs uppercase tracking-wider",
  btnOutline: "border-2 border-[#1F5937] text-[#1F5937] hover:bg-[#F4E9D9] font-semibold py-3 px-6 rounded-2xl transition duration-200 active:scale-95 text-center focus:outline-none cursor-pointer text-xs uppercase tracking-wider",
  btnSecondary: "bg-[#8DB600] hover:bg-[#739600] text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-sm active:scale-95 text-center focus:outline-none cursor-pointer text-xs uppercase tracking-wider",
  heading1: "font-sans text-3xl font-black tracking-tight text-[#1F2937] md:text-4xl uppercase",
  heading2: "font-sans text-2xl font-black tracking-tight text-[#1F2937] uppercase",
  heading3: "font-sans text-lg font-bold tracking-tight text-[#1F2937]",
  card: "bg-white border border-[#E5E7EB] rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
};

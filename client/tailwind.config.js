/** @type {import('tailwindcss').Config} */
//import { colors } from 'tailwindcss/colors';
//const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    colors: {
      // Light theme colors
      'primary': '#D1D5DB',
      'primary-hover': '#9CA0A4',
      'secondary': '#FFF',
      'light-theme': '#FFF',
      'light-text': '#000',


      // Dark theme colors
      'dark-primary': '#686A6E',
      'dark-primary-hover': '#4E4F52',
      'dark-secondary': '#424242',
      'dark-theme': '#424242',
      'dark-text': '#F1F1F1',

      // Universal colors
      'black': '#000',
      'white': '#FFF',
      'amber': '#F59E0B',
      'green': '#22C55E',
      'red': '#EF4444',
        
      'greeter': '#009E73',
      'ask': '#60A5FA',
      'remark': '#2DD4BF',
      'instruction': '#FCD34D',
      'handoff': '#64748B',
      'answer': '#A855F7',
      'wait': '#FB923C',
      'farewell': '#F472B6',
    },
    extend: {
      boxShadow: {
        'selected': '0 0 5px 5px',
        'violating': '0 0 5px 5px red',
      },
    },
  },
  plugins: [],
}

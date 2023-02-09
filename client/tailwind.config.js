/** @type {import('tailwindcss').Config} */
//import { colors } from 'tailwindcss/colors';
//const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    colors: {
      // Light theme colors
      primary: "#D1D5DB",
      "primary-hover": "#9CA0A4",
      secondary: "#FFF",
      "light-theme": "#FFF",
      "light-text": "#000",

      // Dark theme colors
      "dark-primary": "#686A6E",
      "dark-primary-hover": "#4E4F52",
      "dark-secondary": "#424242",
      "dark-theme": "#424242",
      "dark-text": "#F1F1F1",

      // Universal colors
      black: "#000",
      white: "#FFF",
      amber: "#F59E0B",
      "amber-hover": "#C47F08",
      green: "#22C55E",
      "green-hover": "#1A9948",
      red: "#EF4444",
      "red-hover": "#D32F2F",
      blue: "#2196F3",
      "blue-hover": "#1976D2",
      "red-800": "#991b1b",
      // cb = colorblind
      "amber-cb": "#FFB02A",
      "green-cb": "#46F787",
      "red-cb": "#F95B5B",

      greeter: "#009E73",
      ask: "#60A5FA",
      remark: "#2DD4BF",
      instruction: "#FCD34D",
      handoff: "#64748B",
      "handoff-dark": "#FFF",
      answer: "#A855F7",
      wait: "#FB923C",
      farewell: "#F472B6",
    },
    extend: {
      boxShadow: {
        selected: "0 0 5px 5px",
        violating: "0 0 5px 5px red",
      },
    },
  },
  plugins: [],
};

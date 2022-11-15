/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      dropShadow: {
        'violating': '0 0 25px red',
        'greeter': '0 0 25px rgb(34 197 94)',
        'ask': '0 0 25px rgb(96 165 250)',
        'remark': '0 0 25px rgb(244 114 182)',
        'instruction': '0 0 25px rgb(252 211 77)',
        'handoff': '0 0 25px rgb(100 116 139)',
        'answer': '0 0 25px rgb(147 51 234)',
        'wait': '0 0 25px rgb(251 146 60)',
        'farewell': '0 0 25px rgb(248 113 113)'
      }
    },
  },
  plugins: [],
}

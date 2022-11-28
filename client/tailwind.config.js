/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      boxShadow: {
        'violating': '0 0 5px 5px red',
        'greeter': '0 0 5px 5px rgb(34 197 94)',
        'ask': '0 0 5px 5px rgb(96 165 250)',
        'remark': '0 0 5px 5px rgb(45 212 191)',
        'instruction': '0 0 5px 5px rgb(252 211 77)',
        'handoff': '0 0 5px 5px rgb(100 116 139)',
        'answer': '0 0 5px 5px rgb(168 85 247)',
        'wait': '0 0 5px 5px rgb(251 146 60)',
        'farewell': '0 0 5px 5px rgb(244 114 182)'
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DF88B7',
          dark: '#c46b9a',
          light: '#f7d3e6',
        },
        secondary: {
          DEFAULT: '#87CEEB',
          dark: '#5faecf',
          light: '#d2effa',
        },
        medical: {
          low: '#10B981',      // Xanh lá - An toàn
          medium: '#F59E0B',   // Vàng - Thận trọng
          high: '#F97316',     // Cam - Nguy cơ cao
          critical: '#EF4444', // Đỏ - Nguy cơ rất cao
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem', // Bo góc lớn hiện đại theo yêu cầu UI/UX
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.05)', // Shadow nhẹ nhàng tinh tế
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,echarts-template,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        manjaro: {
          green: {
            50: '#e4f8ea',    // Very light green
            100: '#c8f1d4',
            200: '#9ae7b1',
            300: '#6ddd8d',
            400: '#40d36a',   // Slightly lighter than the base green
            500: '#34BE5B',   // Base Manjaro Green
            600: '#2ea852',
            700: '#268946',
            800: '#1f6b3a',
            900: '#174f2d',   // Darker green
          },
          darkGray: {
            50: '#e8e8e8',    // Very light gray
            100: '#c5c5c5',
            200: '#9f9f9f',
            300: '#787878',
            400: '#525252',
            500: '#2B2B2B',   // Base dark gray
            600: '#262626',
            700: '#1f1f1f',
            800: '#191919',
            900: '#121212',   // Darker gray
          },
          lightGray: {
            50: '#fdfdfd',    // Almost white
            100: '#fbfbfb',
            200: '#f6f6f6',
            300: '#f0f0f0',
            400: '#eaeaea',
            500: '#DCDCDC',   // Base light gray
            600: '#c6c6c6',
            700: '#a9a9a9',
            800: '#8b8b8b',
            900: '#6e6e6e',   // Darker light gray
          },
          white: {
            50: '#ffffff',    // Pure white
            100: '#fafafa',
            200: '#f5f5f5',
            300: '#f0f0f0',
            400: '#ebebeb',
            500: '#e6e6e6',   // Lightest shade of gray
            600: '#d1d1d1',
            700: '#bcbcbc',
            800: '#a7a7a7',
            900: '#929292',   // Light gray, darker than 500
          },
          black: {
            50: '#eaeaea',    // Light gray close to white
            100: '#c1c1c1',
            200: '#979797',
            300: '#6e6e6e',
            400: '#454545',
            500: '#000000',   // Pure black
            600: '#0a0a0a',
            700: '#141414',
            800: '#1e1e1e',
            900: '#282828',   // Lighter shade of black
          },
        },
      },
    },
  },
  plugins: [],
}


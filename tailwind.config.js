/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,echarts-template,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'theme-1-color-1': '#3F51B5',
                'theme-1-color-2': '#757de8',
                'theme-1-color-3': '#dedeff',
                'theme-1-color-4': '#2196F3',
                'theme-1-color-5': '#003f8f',
                'theme-1-color-6': '#f5f5f5',
                'theme-1-color-7': '#cccccc',
                'theme-1-color-8': '#5c5c5c',
                'theme-1-color-9': '#333333',
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
            height: {
                'rem-26': '26rem',
                'rem-27': '27rem',
                'rem-28': '28rem',
                'rem-29': '29rem',
                'rem-30': '30rem',
                'rem-31': '31rem',
                'rem-32': '32rem',
                'rem-33': '33rem',
                'rem-34': '34rem',
                'rem-35': '35rem',
                'rem-36': '36rem',
                'rem-37': '37rem',
                'rem-38': '38rem',
                'rem-39': '39rem',
                'rem-40': '40rem',
                'rem-41': '41rem',
                'rem-42': '42rem',
                'rem-43': '43rem',
                'rem-44': '44rem',
                'rem-45': '45rem',
                'rem-46': '46rem',
                'rem-47': '47rem',
                'rem-48': '48rem',
                'rem-49': '49rem',
                'rem-50': '50rem',
                'rem-51': '51rem',
                'rem-52': '52rem',
                'rem-53': '53rem',
                'rem-54': '54rem',
                'rem-55': '55rem',
                'rem-56': '56rem',
                'rem-57': '57rem',
                'rem-58': '58rem',
                'rem-59': '59rem',
            },
        },
    },
    
    plugins: [],
}


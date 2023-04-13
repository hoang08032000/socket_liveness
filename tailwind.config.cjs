/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                green: colors.emerald,
                yellow: colors.amber,
                purple: colors.violet,
            },
        },
        fontFamily: {
            sans: [...defaultTheme.fontFamily.sans],
            serif: [...defaultTheme.fontFamily.serif],
            mono: [...defaultTheme.fontFamily.mono],
            // display: [...defaultTheme.fontFamily.serif],
        },
    },
    plugins: [],
};

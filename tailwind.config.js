/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--color-primary)",
                'primary-light': "var(--color-primary-light)",
                'primary-dark': "var(--color-primary-dark)",
                accent: "var(--color-accent)",
                slate: {
                    850: '#1e293b', // Custom darker slate
                    950: '#020617', // Deepest background
                }
            },
            animation: {
                'in': 'in .2s ease-out',
                'out': 'out .2s ease-out',
                'fade-in': 'fade-in .2s ease-out',
            },
            keyframes: {
                in: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [],
};

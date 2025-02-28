/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		screens: {
			// Extra small devices (portrait phones)
			xxs: '320px',

			// Slightly larger phones
			xs: '425px',

			// Replacing the default sm
			sm: '640px',

			// Replacing the default md
			md: '768px',

			// Replacing the default lg
			lg: '1024px',

			// Replacing the default xl
			xl: '1280px',

			// Adding or replacing 2xl
			'2xl': '1536px',

			// You can add even larger screens
			'3xl': '1920px',
		},
		extend: {},
	},
	plugins: [],
};

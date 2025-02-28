import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'STUDYMAXX',
	description: 'Study to the MAXX.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body
				className={`overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 min-h-screen min-w-screen`}>
				{children}
			</body>
		</html>
	);
}

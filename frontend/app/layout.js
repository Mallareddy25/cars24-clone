import './globals.css';
import NotificationManager from '../components/NotificationManager';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'Cars24 Clone Platform',
  description: 'A full-stack car marketplace with dynamic pricing.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f8fafc', color: '#1e293b' }}>
        <Header />
        <main>{children}</main>
        <Footer />
        <NotificationManager />
      </body>
    </html>
  );
}

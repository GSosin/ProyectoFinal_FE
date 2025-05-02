import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
} 
import { metadata } from './metadata';
import AppClientWrapper from './components/AppClientWrapper';
import ThemeRegistry from './components/ThemeRegistry';
import ClientLayout from './components/ClientLayout';
import styles from './styles/layout.module.css';

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="viewport" content={metadata.viewport} />
            </head>
            <body>
                <ThemeRegistry>
                    <AppClientWrapper>
                        <ClientLayout>
                            <main className={styles.mainContainer}>
                                {children}
                            </main>
                        </ClientLayout>
                    </AppClientWrapper>
                </ThemeRegistry>
            </body>
        </html>
    );
} 
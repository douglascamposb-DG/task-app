import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'CRM DG HUB',
  description: 'Sistema de Gestão DG HUB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        {/* A classe app-container é que segura o Flexbox do globals.css */}
        <div className="app-container">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
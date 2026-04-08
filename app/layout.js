import './globals.css';

export const metadata = {
  title: 'ProdWM Portal',
  description: 'Internal Production Dept Portal - PT Sharp Electronics Indonesia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
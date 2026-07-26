import './globals.css';

export const metadata = {
  title: 'FigurAI',
  description: 'Tugas Besar Full-Stack Web Development',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-lg">
            FigurAI
          </a>
          <a href="/ai" className="text-sm text-slate-300 hover:text-white">
            Tanya AI
          </a>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

import Header from '../../Home Page/Compoents/Header';
import Footer from '../../Home Page/Compoents/Footer';

export default function PublicPageShell({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

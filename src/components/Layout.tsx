import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import WhatsAppWidget from "./WhatsAppWidget";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white relative">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logolaolla%20(1)-sOuVSlk4TfJBrfkB3tcN0lV5xd1Q9Q.png"
                alt="La Olla Logo"
                className="w-16 h-16"
              />
              <span className="text-2xl font-bold">La Olla</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex gap-6">
              <Link to="/" className="hover:text-yellow-400">
                Inicio
              </Link>
              <Link to="/menu" className="hover:text-yellow-400">
                Menú
              </Link>
              <Link to="/viandas" className="hover:text-yellow-400">
                Viandas
              </Link>
              <Link to="/pizza-party" className="hover:text-yellow-400">
                Pizza Party
              </Link>

              <Link to="/contacto" className="hover:text-yellow-400">
                Contacto
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:hidden absolute top-full left-0 right-0 bg-green-800 z-50`}
          >
            <div className="flex flex-col p-4 space-y-4">
              <Link
                to="/"
                className="hover:text-yellow-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/menu"
                className="hover:text-yellow-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Menú
              </Link>
              <Link
                to="/viandas"
                className="hover:text-yellow-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Viandas
              </Link>
              <Link
                to="/pizza-party"
                className="hover:text-yellow-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Pizza Party
              </Link>

              <Link
                to="/contacto"
                className="hover:text-yellow-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="w-full">
        <Outlet />
      </main>
      <footer className="bg-green-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">La Olla Rotisería</h3>
              <p>Doello Jurado 1050, Gualeguaychu.</p>
              <p>Tel: 3446-410459</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-yellow-400">
                Facebook
              </a>
              <a href="#" className="hover:text-yellow-400">
                Instagram
              </a>
              <a href="#" className="hover:text-yellow-400">
                WhatsApp
              </a>
            </div>
          </div>
          <div className="text-white text-left">
            Hecha por{" "}
            <a
              className="text-green-200"
              href="https://github.com/ignaciohaffner/"
            >
              Ignacio Haffner
            </a>
          </div>
        </div>
      </footer>
      <WhatsAppWidget />
    </div>
  );
}

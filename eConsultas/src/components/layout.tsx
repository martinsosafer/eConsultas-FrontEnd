import { useState } from "react";
import { Menu, Bell, User, LogOut, UserCircle } from "lucide-react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./sidebar";
import logo from "../../public/logo.png";
import { useAuth } from "@/context/AuthProvider";


export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, personaData, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="relative text-white backdrop-blur-md bg-opacity-80 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary animate-gradient-x z-0"></div>

        <div className="relative z-10 flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
            >
              <img src={logo} alt="App Logo" className="w-10 h-8" />
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Bell className="w-6 h-6" />
                </button>
                <Link
                  to={`/profile/${encodeURIComponent(
                    personaData?.credenciales?.username || ""
                  )}`}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <User className="w-6 h-6" />
                </Link>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Sign in"
              >
                <UserCircle className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {isAuthenticated && (
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}

      <main className="w-full h-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

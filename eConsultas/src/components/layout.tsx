import { useState } from "react";
import { Menu, Bell, User } from "lucide-react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./sidebar";
import logo from "../../public/logo.png";
import { useAuth } from "@/context/AuthProvider";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth(); // Get authentication state

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
            {isAuthenticated && ( // Only show menu button when authenticated
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>
          {isAuthenticated && ( // Only show notification/user when authenticated
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <User className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </header>

      {isAuthenticated && ( // Only show sidebar when authenticated
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}

      <main className="w-full h-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

// layout.tsx
import { useState } from "react";
import { Menu, Bell, User } from "lucide-react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./sidebar";
import logo from "../../public/logo.png";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#0288d1] text-white">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center justify-center w-8 h-8 rounded-full"
            >
              <img src={logo} alt="App Logo" className="w-10 h-8" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <main className="w-full h-full mx-auto  ">
        <Outlet />
      </main>
    </div>
  );
}

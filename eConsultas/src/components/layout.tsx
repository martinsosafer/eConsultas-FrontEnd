import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, User, Home, Info, UserPlus, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const navItems = [
  { path: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
  { path: "/about", label: "About", icon: <Info className="w-5 h-5" /> },
  {
    path: "/paciente",
    label: "Paciente",
    icon: <UserPlus className="w-5 h-5" />,
  },
  {
    path: "/colorshowcase",
    label: "Paleta de colores y botones",
    icon: <Palette className="w-5 h-5" />,
  },
];

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#0288d1] text-white">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
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

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black"
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-14 left-0 bottom-0 w-64 bg-white shadow-lg z-50"
            >
              <div className="bg-[#0288d1] p-4">
                <h1 className="text-white text-xl font-semibold">
                  E consultas
                </h1>
              </div>
              <div className="p-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

// sidebar.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Info, UserPlus, Palette } from "lucide-react";
import React from "react";

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

  {
    path: "/crear-password/:email/:code",
    label: "Restablecer Contraseña",
    icon: <UserPlus className="w-5 h-5" />,
  }
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              <h1 className="text-white text-xl font-semibold">eConsultas</h1>
            </div>
            <div className="p-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
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
  );
};

export default Sidebar;

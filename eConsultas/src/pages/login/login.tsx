import { useState } from "react";
import { motion } from "framer-motion";
import logo from "../../../public/logo.png";
export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary-light">
      {/* Container */}
      <div className="flex w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] bg-white rounded-2xl overflow-hidden shadow-xl">
        {/* Left Section */}
        <motion.div
          className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-primary to-primary-hover p-6"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          {/* Logo Placeholder */}
          <motion.div
            className="w-24 h-24 bg-secondary-light rounded-full mb-6 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="Company Logo"
              className="w-16 h-16 object-contain"
            />
          </motion.div>
          <motion.h1
            className="text-4xl text-white font-bold mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            eConsultas
          </motion.h1>
          <motion.p
            className="text-white text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Inicia sesión para continuar
          </motion.p>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="flex-1 p-8 flex flex-col justify-center"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <motion.h2
            className="text-3xl font-bold text-primary-dark mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Iniciar sesión
          </motion.h2>
          <motion.form
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex flex-col">
              <label className="text-primary-dark font-medium mb-1">
                Email, DNI, o teléfono
              </label>
              <input
                type="text"
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Escribe tus datos"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-primary-dark font-medium mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Escribe tu contraseña"
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                    whileHover={{ scale: 1.2 }}
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12l-3-3m0 0l-3 3m3-3v12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12c1.5 4.5 5.5 7.5 9 7.5s7.5-3 9-7.5-3-7.5-9-7.5-7.5 3-9 7.5z"
                      />
                    )}
                  </motion.svg>
                </button>
              </div>
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-md shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Iniciar sesión
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}

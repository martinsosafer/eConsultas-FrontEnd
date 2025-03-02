import React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { passwordManagement } from "../../api/passwordManagement";
import logo from "../../../public/logo.png";
import { Toaster, toast } from "sonner";
import { extractErrorMessage } from "@/api/misc/errorHandler";
import Cookies from "js-cookie";
import ButtonWithCooldown from "@/components/buttonWithCooldown";

interface PasswordCreateProps {
  isChangeMode?: boolean;
}

const PasswordCreate: React.FC<PasswordCreateProps> = ({ isChangeMode = false }) => {
  const { email, code } = useParams<{ email: string; code: string }>();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); 


  const isRecoveryFlow = !!email && !!code;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isRecoveryFlow) {
      if (!email || !code) {
        toast.error("Faltan datos en la URL.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Las contraseñas no coinciden.");
        return;
      }
  
      try {
        await passwordManagement.createPassword(email, password, code);
        toast.success("Contraseña cambiada correctamente, redirijiendo en 3 segundos...");
        
        setTimeout(() => {
          navigate("/login");
        }, 3000); 
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        toast.error("Error: " + errorMessage);
        console.error("Password reset error:", error);
      }
    } else if (isChangeMode) {
      const username = Cookies.get("username");
      if (!username) {
        toast.error("Usuario no autenticado.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Las contraseñas nuevas no coinciden.");
        return;
      }
  
      try {
        await passwordManagement.changePassword(username, oldPassword, password);
        
        toast.success("Contraseña cambiada correctamente, redirijiendo en 3 segundos...");
        
        setTimeout(() => {
          navigate("/login");
        }, 3000); 
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        toast.error("Error: " + errorMessage);
        console.error("Password change error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light flex justify-center items-center relative overflow-hidden">
      <Toaster richColors position="bottom-right" />

      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-primary opacity-30 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-30 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-30 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </motion.div>

      <motion.div
        className="bg-gray-100 bg-opacity-80 backdrop-filter backdrop-blur-lg w-full max-w-md rounded-2xl shadow-xl p-8 relative z-10 transform transition-all duration-300 hover:scale-105 hover:border-2 hover:border-primary focus-within:border-2 focus-within:border-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="App Logo"
              className="w-16 h-16"
            />
          </motion.div>
          <motion.h1
            className="text-3xl font-bold text-primary-dark"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isRecoveryFlow 
              ? isChangeMode ? "Restablecer Contraseña" : "Crear Contraseña" 
              : isChangeMode 
              ? "Cambiar Contraseña" 
              : "Crear Contraseña"}
          </motion.h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {isChangeMode && !isRecoveryFlow && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña Actual
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="block w-full px-4 py-3 border-2 border-primary-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                required
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: isChangeMode ? 0.4 : 0.3 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {isRecoveryFlow ? "Nueva Contraseña" : "Contraseña"}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 border-2 border-primary-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: isChangeMode ? 0.5 : 0.4 }}
          >
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {isRecoveryFlow 
                ? "Confirmar Nueva Contraseña" 
                : "Confirmar Contraseña"}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-4 py-3 border-2 border-primary-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </motion.div>

          <motion.div
            className="pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ButtonWithCooldown
              label={
                isRecoveryFlow 
                  ? isChangeMode ? "Restablecer contraseña" : "Crear contraseña" 
                  : isChangeMode 
                  ? "Cambiar contraseña" 
                  : "Crear contraseña"
              }
              type="primary"
              className="w-full py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            />
          </motion.div>
        </form>
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-sm text-primary-dark">
            Al crear una contraseña, aceptas nuestros{" "}
            <a href="#" className="font-medium hover:underline">
              Términos y Condiciones
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PasswordCreate;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { sendPasswordRecoveryEmail } from "@/api/misc/templateMail";
import { extractErrorMessage } from "@/api/misc/errorHandler";
import logo from "../../../../public/logo.png";
import ButtonWithCooldown from "@/components/buttonWithCooldown";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fechaFormateada = new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000
      )
        .toISOString()
        .replace("T", " ")
        .split(".")[0];

      await sendPasswordRecoveryEmail(email, fechaFormateada);
      toast.success("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
      setIsEmailSent(true); 
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error("Error: " + errorMessage);
      console.error("Error sending recovery email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-light p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row w-full sm:w-[80%] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
        {/* Mobile Logo Section */}
        <motion.div
          className="sm:hidden flex justify-center items-center bg-gradient-to-br from-primary to-primary-hover py-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={logo}
            alt="Company Logo"
            className="w-32 h-32 object-contain"
          />
        </motion.div>

        {/* Desktop Left Section */}
        <motion.div
          className="hidden sm:flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-primary to-primary-hover p-6"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <img
            src={logo}
            alt="Company Logo"
            className="w-48 h-48 mb-8 object-contain animate-float"
          />
          <motion.h1
            className="text-white text-xl sm:text-2xl font-bold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Recuperar Contraseña
          </motion.h1>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="flex-1 p-6 sm:p-8 flex flex-col justify-center"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          {!isEmailSent ? (
            <>
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-primary-dark mb-4 sm:mb-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                ¿Olvidaste tu contraseña?
              </motion.h2>

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="flex flex-col">
                  <label className="text-primary-dark font-medium mb-1 text-sm sm:text-base">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    placeholder="Ingresa tu correo electrónico"
                    required
                  />
                </div>

                <ButtonWithCooldown
                  label={
                    isLoading ? "Enviando..." : "Enviar correo de recuperación"
                  }
                  type="primary"
                  disabled={isLoading}
                  className="w-full py-2 sm:py-3 text-sm sm:text-base font-bold rounded-md shadow-lg"
                  cooldownDuration={5}
                />
              </motion.form>

              <motion.div
                className="mt-4 text-center text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <button
                  onClick={() => navigate("/login")}
                  className="text-primary-dark hover:underline"
                >
                  Volver al inicio de sesión
                </button>
              </motion.div>
            </>
          ) : (
            // Sección post envio de mail :p
            <motion.div
              className="flex flex-col items-center justify-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-primary-dark text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Correo de recuperación de contraseña enviado correctamente
              </motion.h2>

              <motion.button
                onClick={() => navigate("/login")}
                className="bg-primary text-white py-2 sm:py-3 px-6 sm:px-8 rounded-md shadow-lg hover:bg-primary-hover transition-colors text-sm sm:text-base font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ir a inicio de sesión
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default ForgotPassword;
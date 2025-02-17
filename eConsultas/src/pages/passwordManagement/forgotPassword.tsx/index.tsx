// pages/forgotPassword/index.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { sendPasswordRecoveryEmail } from "@/api/misc/templateMail";
import { extractErrorMessage } from "@/api/misc/errorHandler";
import Button from "@/components/button";
import logo from "../../../../public/logo.png";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fechaFormateada = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) 
        .toISOString()
        .replace("T", " ")
        .split(".")[0];

      await sendPasswordRecoveryEmail(email, fechaFormateada);
      toast.success("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
      navigate("/login");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error("Error: " + errorMessage);
      console.error("Error sending recovery email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary-light">
      <div className="flex w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] bg-white rounded-2xl overflow-hidden shadow-xl">

        <motion.div
          className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-primary to-primary-hover p-6"
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
            className="text-white text-2xl font-bold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Recuperar Contraseña
          </motion.h1>
        </motion.div>


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
              <label className="text-primary-dark font-medium mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>

            <Button
              label={isLoading ? "Enviando..." : "Enviar correo de recuperación"}
              type="primary"
              disabled={isLoading}
              className="w-full py-3 font-bold rounded-md shadow-lg"
              buttonType="submit"
            />
          </motion.form>

          <motion.div
            className="mt-4 text-center"
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
        </motion.div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default ForgotPassword;
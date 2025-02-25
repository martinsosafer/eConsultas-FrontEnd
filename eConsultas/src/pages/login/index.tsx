import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import logo from "../../../public/logo.png";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/context/AuthProvider";
import Cookies from "js-cookie";
import { extractErrorMessage } from "@/api/misc/errorHandler";
import ButtonWithCooldown from "@/components/buttonWithCooldown";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  isButtonDisabled;
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const disableButtonTemporarily = () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);
    // console.log(isButtonDisabled);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(isLoading);
    isLoading;

    try {
      await login(username, password);
      toast.success("Inicio de sesión exitoso.");
      navigate("/");
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error("Error: " + errorMessage);
      console.error("Login error:", err);
      disableButtonTemporarily();
    } finally {
      setIsLoading(false);
    }
  };

  // Autoredirección si el usuario ya está logueado!
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-light p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row w-full sm:w-[80%] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
        {/* Mobile-first logo section */}
        <motion.div
          className="sm:hidden flex justify-center items-center bg-gradient-to-br from-primary to-primary-hover py-8"
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

        {/* Left Section - Desktop */}
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
            Bienvenido a Nuestra Plataforma
          </motion.h1>
        </motion.div>

        {/* Right Section - Always visible */}
        <motion.div
          className="flex-1 p-6 sm:p-8 flex flex-col justify-center"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-primary-dark mb-4 sm:mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <LogIn className="inline-block mr-2 h-6 sm:h-8 w-6 sm:w-8" />
            Iniciar sesión
          </motion.h2>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Input sections */}
            <div className="flex flex-col">
              <label className="text-primary-dark font-medium mb-1 text-sm sm:text-base">
                Email, DNI o teléfono
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                placeholder="Escribe tus datos"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-primary-dark font-medium mb-1 text-sm sm:text-base">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 sm:p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder="Escribe tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {/* Keep existing SVG code, it's responsive enough */}
                </button>
              </div>
            </div>

            <ButtonWithCooldown
              label="Iniciar sesión"
              type="primary"
              cooldownDuration={5}
              onClick={handleSubmit}
              className="w-full py-2 sm:py-3 text-sm sm:text-base font-bold rounded-md shadow-lg"
            />

            <motion.div
              className="mt-4 text-center text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <button
                onClick={() => navigate("/password/forgot")}
                className="text-primary-dark hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
      <Toaster richColors />
    </div>
  );
}

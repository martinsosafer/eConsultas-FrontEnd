import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react"; // Changed icon import
import logo from "../../../public/logo.png";
import Button from "@/components/button";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/context/AuthProvider"; // Added Auth context
import Cookies from "js-cookie";
export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login from context

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const disableButtonTemporarily = () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use context login instead of direct service call
      await login(username, password);
      navigate("/"); // Redirect after successful login
    } catch (err) {
      console.error("Login error:", err);
      setError("Credenciales inválidas. Por favor intente nuevamente.");
      toast.warning("Credenciales inválidas. Por favor intente nuevamente.");
      disableButtonTemporarily();
    } finally {
      setIsLoading(false);
    }
  };

  // Add auto-redirect if already logged in
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-primary-light">
      <div className="flex w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] bg-white rounded-2xl overflow-hidden shadow-xl">
        {/* Left Section */}
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
            Bienvenido a Nuestra Plataforma
          </motion.h1>
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
            <LogIn className="inline-block mr-2 h-8 w-8" /> {/* Added icon */}
            Iniciar sesión
          </motion.h2>

          {/* ... (rest of the form remains unchanged) ... */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Email/DNI/Phone Input */}
            <div className="flex flex-col">
              <label className="text-primary-dark font-medium mb-1">
                Email, DNI o teléfono
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Escribe tus datos"
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <label className="text-primary-dark font-medium mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Escribe tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M6.585 6.585a4 4 0 115.656 5.656m0 0l1.531-1.531M4 20L20 4"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button
              label={isLoading ? "Procesando..." : "Iniciar sesión"}
              type="primary"
              disabled={isLoading || isButtonDisabled}
              className="w-full py-3 font-bold rounded-md shadow-lg"
              buttonType="submit"
            />
          </motion.form>
        </motion.div>
      </div>
      <Toaster richColors />
    </div>
  );
}

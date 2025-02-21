import { motion } from "framer-motion";
import logo from "../../../public/logo.png";
import { RevealText } from "../animations/RevealText";
import Button from "../button";
import { useNavigate } from "react-router-dom";

type ButtonType =
  | "primary"
  | "secondary"
  | "accent"
  | "secondary-accent"
  | "danger"
  | "custom";

interface ButtonConfig {
  label: string;
  type: ButtonType;
  onClick?: () => void;
}

interface ButtonsConfig {
  [key: string]: ButtonConfig[];
}

const HeroBlock = ({
  TipoDePersona,
  nombre,
  apellido,
}: {
  TipoDePersona: string;
  nombre?: string;
  apellido?: string;
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const buttonsConfig: ButtonsConfig = {
    "": [
      {
        label: "Login",
        type: "primary",
        onClick: handleLogin,
      },
    ],
    Paciente: [
      { label: "Mis Consultas", type: "primary" },
      { label: "Historial", type: "secondary" },
      { label: "Agendar Cita", type: "accent" },
    ],
    Medico: [
      { label: "Agenda", type: "primary" },
      { label: "Pacientes", type: "secondary" },
      { label: "Reportes", type: "accent" },
    ],
  };

  const buttons = buttonsConfig[TipoDePersona] || [];

  return (
    <div className="mt-6 mb-5 flex flex-col-reverse sm:flex-row justify-between items-start p-8 bg-accent-light rounded-xl shadow-lg border border-secondary-dark">
      {/* Left Section - Becomes second on mobile */}
      <div className="flex-1 sm:pr-8 mt-6 sm:mt-0">
        <RevealText>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
            Bienvenido a Consultas Médicas
          </h1>
          {nombre && apellido && (
            <h2 className="text-xl sm:text-3xl font-semibold text-primary-dark mb-6">
              Hola, {nombre} {apellido}
            </h2>
          )}
          <div className="flex gap-4 sm:gap-6 flex-wrap">
            {buttons.map((button) => (
              <Button
                key={button.label}
                label={button.label}
                type={button.type}
                onClick={button.onClick || (() => {})}
                className="text-sm sm:text-base"
              />
            ))}
          </div>
        </RevealText>
      </div>

      {/* Right Section - Becomes first on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: -15 }}
        transition={{
          type: "tween",
          duration: 0.8,
          ease: "easeOut",
        }}
        className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-center sm:justify-start mb-6 sm:mb-0 sm:mr-56"
      >
        <img
          src={logo}
          alt="App Logo"
          className="w-24 h-24 sm:w-32 sm:h-32 transform transition-transform duration-300 hover:scale-105"
        />
        <span className="text-3xl sm:text-5xl font-bold text-primary-DEFAULT">
          Consultas
        </span>
      </motion.div>
    </div>
  );
};

export default HeroBlock;

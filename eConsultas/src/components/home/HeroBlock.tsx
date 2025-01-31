import { motion } from "framer-motion";
import logo from "../../../public/logo.png";
import { RevealText } from "../animations/RevealText";
import Button from "../button";

const HeroBlock = ({ TipoDePersona }: { TipoDePersona: string }) => {
  const buttonsConfig = {
    "": [{ label: "Login", type: "primary" }],
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

  const buttons =
    buttonsConfig[TipoDePersona as keyof typeof buttonsConfig] || [];

  return (
    <div className="mt-6 mb-5 flex justify-between items-start p-8 bg-accent-light rounded-xl shadow-lg border border-secondary-dark">
      {/* Left Section */}
      <div className="flex-1 pr-8">
        <RevealText>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Bienvenido a Consultas Médicas
          </h1>

          <div className="flex gap-6 flex-wrap">
            {buttons.map((button) => (
              <Button
                key={button.label}
                label={button.label}
                type={button.type}
                onClick={() => {
                  /* Add click handler */
                }}
              />
            ))}
          </div>
        </RevealText>
      </div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: -15 }} // Reduced from -30 to -15
        transition={{
          type: "tween",
          duration: 0.8,
          ease: "easeOut",
        }}
        className="flex items-center gap-6 h-auto  justify-start mr-56" // Reduced from -mr-10 to -mr-6
      >
        <img
          src={logo}
          alt="App Logo"
          className="w-32 h-32 transform transition-transform duration-300 hover:scale-105"
        />
        <span className="text-5xl font-bold text-primary-DEFAULT">
          Consultas
        </span>
      </motion.div>
    </div>
  );
};
export default HeroBlock;

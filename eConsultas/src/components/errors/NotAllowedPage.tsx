import { useNavigate } from "react-router-dom";
import Button from "@/components/button";
import notAllowedImage from "../../../public/NotAllowedImage.jpg";

const NotAllowed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-lightest to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="animate-float mx-auto">
          <img 
            src={notAllowedImage} 
            alt="Acceso no autorizado" 
            className="w-100 h-80 mx-auto drop-shadow-2xl hover:scale-105 transition-transform"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary-dark font-pixel">403</h1>
          <p className="text-xl text-gray-600 mb-4 max-w-md mx-auto">
            ¡Acceso denegado! No tienes permisos para ver esta página.
          </p>
          
          <Button
            type="primary"
            label="Volver a terreno seguro"
            onClick={() => navigate(-1)}
            className="mx-auto px-8 py-3 rounded-lg hover:bg-primary-dark transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default NotAllowed;
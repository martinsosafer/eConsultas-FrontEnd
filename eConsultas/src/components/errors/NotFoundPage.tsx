import { useNavigate } from "react-router-dom";
import Button from "@/components/button";
import notFoundImage from "../../../public/404ErrorImage.jpg"

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-lightest to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="animate-float mx-auto">
          <img 
            src={notFoundImage} 
            alt="404 Pixel Art" 
            className="w-128 h-128 mx-auto drop-shadow-2xl hover:scale-105 transition-transform"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary-dark font-pixel">404</h1>
          <p className="text-xl text-gray-600 mb-4 max-w-md mx-auto">
            ¡Ups! La página que buscas parece que no existe...
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

export default NotFoundPage;
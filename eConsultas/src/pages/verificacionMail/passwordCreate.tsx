// PasswordCreate.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { updatePassword } from "../../api/passwordCreateApi";
import Button from "../../components/button";

const PasswordCreate: React.FC = () => {
  const { email, code } = useParams<{ email: string; code: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      alert("Faltan datos en la URL.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await updatePassword(email, password, code);
      alert("Contraseña actualizada correctamente.");
      console.log(response);
    } catch (error) {
      alert("Error al actualizar la contraseña.");
      console.error(error);
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-2xl font-semibold mb-8">Crear Contraseña</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Nueva Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <Button label="Crear contraseña" type="primary" onClick={() => {}} />
        </div>

      </form>
    </div>
  );
};

export default PasswordCreate;

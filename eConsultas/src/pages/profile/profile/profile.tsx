import { useAuth } from "@/context/AuthProvider";
import React from "react";

export default function Profile() {
  const { personaData } = useAuth();
  console.log("PERSONA", personaData);
  return (
    <div>
      {personaData && (
        <>
          <h2>{personaData.nombre}</h2>
          <p>Role: {personaData.tipoPersona}</p>
          {/* Render role-specific data */}
        </>
      )}
    </div>
  );
}

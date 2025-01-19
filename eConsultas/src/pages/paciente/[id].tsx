import { useParams } from "react-router-dom";

export default function DatosPaciente() {
  const { id } = useParams();

  return (
    <div className="prose">
      <h1>Este es el paciente = {id}</h1>
      <p>estos son los estudios medicos del paciente {id}.</p>
    </div>
  );
}

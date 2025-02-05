import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { personaApi } from "@/api/personaApi";
import ProfileComponent from "./profile/profile";
import { Medico, Paciente } from "@/api/models/models";

function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { personaData } = useAuth();
  const [profileData, setProfileData] = useState<Medico | Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!username) throw new Error("Username no proporcionado");


        if (personaData?.credenciales.username === username) {
          setProfileData(personaData);
        } else {

          const data = await personaApi.getPersonaByUsername(username);
          setProfileData(data);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, personaData]);

  if (loading) return <div>Buscando perfil...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profileData) return <div>Perfil no encontrado</div>;

  return <ProfileComponent patient={profileData} />;
}

export default ProfilePage;
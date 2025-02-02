import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../pages";
import About from "../pages/about.tsx";
import BloquePaciente from "../pages/paciente/index.tsx";
import DatosPaciente from "../pages/paciente/[id].tsx";
import ColorSystemShowcase from "../pages/colorshowcase/index.tsx";
import PasswordCreate from "../pages/verificacionMail/PasswordCreate.tsx";
import Login from "@/pages/login/login.tsx";
import Cuenta from "@/pages/cuenta/cuenta.tsx"; // Nuevo componente
import EditarCuenta from "@/pages/cuenta/editarCuenta.tsx"; // Nuevo componente
import ProfilePage from "@/pages/profile/index.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "about",
        element: <About />,
      },

      {
        path: "paciente",
        children: [
          {
            index: true,
            element: <BloquePaciente />,
          },
          {
            path: ":id",
            element: <DatosPaciente />,
          },
        ],
      },
      {
        path: "colorshowcase",
        element: <ColorSystemShowcase />,
      },
      {
        path: "crear-password/:email/:code",
        element: <PasswordCreate />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "cuenta",
        children: [
          {
            index: true,
            element: <Cuenta />,
          },
          {
            path: "editar/:id",
            element: <EditarCuenta />,
          },
        ],
      },
    ],
  },
]);

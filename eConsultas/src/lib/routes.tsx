import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../pages";
import About from "../pages/about.tsx";
import BloquePaciente from "../pages/paciente/index.tsx";
import DatosPaciente from "../pages/paciente/[id].tsx";
import ColorSystemShowcase from "../pages/colorshowcase/index.tsx";
import PasswordCreate from "@/pages/crearContraseña/index.tsx";
import Login from "@/pages/login/index.tsx";


import ProfilePage from "@/pages/profile/index.tsx";
import DashboardAdminPage from "@/pages/adminDashboard/index.tsx";
import ManejarPersonalPage from "@/pages/adminDashboard/manejarPersonalPage/index.tsx";
import EditProfile from "@/pages/profile/profile/editProfile/editProfile.tsx";

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
        path: "about",
        element: <About />,
      },
      {
        path: "/dashboard-admin",
        element: <DashboardAdminPage />,

        children: [
          {
            path: "manejar-personal",
            element: <ManejarPersonalPage />,
          },
        ],
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
        path: "profile",
        children: [
          {
            path: ":username",
            children: [
              {
                index: true,
                element: <ProfilePage />,
              },
              {
                path: "edit",
                element: <EditProfile />,
              }
            ]
          }
        ],
      },
    ],
  },
]);

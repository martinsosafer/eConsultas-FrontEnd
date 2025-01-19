import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../pages";
import About from "../pages/about.tsx";
import BloquePaciente from "../pages/paciente/index.tsx";
import DatosPaciente from "../pages/paciente/[id].tsx";
import ColorSystemShowcase from "../pages/colorshowcase/index.tsx";

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
    ],
  },
]);

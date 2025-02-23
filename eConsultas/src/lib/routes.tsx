import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../components/layout";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PayConsulta } from "@/pages/consultas/payConsulta/index.tsx";
import { ComprobantesPage } from "@/pages/consultas/payConsulta/ComprobantesPage/index.tsx";
import { ProtectedProfile } from "./TypesOfRoutes/ProtectedProfile.tsx";
import { AdminRoute } from "./TypesOfRoutes/AdminRoute.tsx";
import { OwnerRoute } from "./TypesOfRoutes/OwnerRoute.tsx";
import { UnauthenticatedRoute } from "./TypesOfRoutes/UnauthenticatedRoute.tsx";
import { CheckProfileAccess } from "./TypesOfRoutes/CheckProfileAccess.tsx";

// Importaciones directas para el dashboard admin y así no ralentizamos esa parte :p
import DashboardAdminPage from "@/pages/adminDashboard/index.tsx";
import ManejarPersonalPage from "@/pages/adminDashboard/manejarPersonalPage/index.tsx";
import ReportesManagement from "@/pages/adminDashboard/reportes/index.tsx";
import ConsultasAdminPage from "@/pages/adminDashboard/consultas/index.tsx";
import ServiciosPage from "@/pages/adminDashboard/todosServicios/index.tsx";
import PaquetesPage from "@/pages/adminDashboard/paquetes/index.tsx";
import NotAllowed from "@/components/errors/NotAllowed.tsx";

// Importaciones lazy para el resto de componentes : D
const Home = lazy(() => import("../pages"));
const About = lazy(() => import("../pages/about.tsx"));
const BloquePaciente = lazy(() => import("../pages/paciente/index.tsx"));
const DatosPaciente = lazy(() => import("../pages/paciente/[id].tsx"));
const ColorSystemShowcase = lazy(() => import("../pages/colorshowcase/index.tsx"));
const PasswordCreate = lazy(() => import("@/pages/passwordManagement/index.tsx"));
const Login = lazy(() => import("@/pages/login/index.tsx"));
const ProfilePage = lazy(() => import("@/pages/profile/index.tsx"));
const EditProfile = lazy(() => import("@/pages/profile/profile/editProfile/editProfile.tsx"));
const ConsultasPage = lazy(() => import("@/pages/profile/consultasPage/index.tsx"));
const ConsultaDetailPage = lazy(() => import("@/pages/profile/consultasPage/seeConsultaComplete/index.tsx")); 
const FilesBrowserWrapper = lazy(() => import("@/pages/profile/profile/FilesOfUser/FilesBrowserWrapper.tsx"));
const ForgotPassword = lazy(() => import("@/pages/passwordManagement/forgotPassword.tsx/index.tsx"));
const NotFoundPage = lazy(() => import("@/components/errors/NotFoundPage.tsx"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "dashboard-admin",
        element: (
          <AdminRoute>
            <DashboardAdminPage />
          </AdminRoute>
        ),
        children: [
          {
            path: "manejar-personal",
            element: <ManejarPersonalPage />,
          },
          {
            path: "reportes",
            element: <ReportesManagement />,
          },
          {
            path: "consultas",
            element: <ConsultasAdminPage />,
          },
          {
            path: "servicios",
            element: <ServiciosPage />,
          },
          {
            path: "paquetes",
            element: <PaquetesPage />,
          },
        ],
      },
      {
        path: "paciente",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <BloquePaciente />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DatosPaciente />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "colorshowcase",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ColorSystemShowcase />
          </Suspense>
        ),
      },
      {
        path: "password",
        element: (
          <UnauthenticatedRoute>
            <Outlet />
          </UnauthenticatedRoute>
        ),
        children: [
          {
            path: "create/:email/:code",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PasswordCreate isChangeMode={false} />
              </Suspense>
            ),
          },
          {
            path: "change/:email/:code",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PasswordCreate isChangeMode={true} />
              </Suspense>
            ),
          },
          {
            path: "forgot",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ForgotPassword />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "consultas",
        element: (
          <AdminRoute>
            <Outlet />
          </AdminRoute>
        ),
        children: [
          {
            path: "pay/:id",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PayConsulta />
              </Suspense>
            ),
          },
          {
            path: "comprobantes/:id",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ComprobantesPage />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ConsultaDetailPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "profile",
        element: (
          <ProtectedProfile>
            <Outlet />
          </ProtectedProfile>
        ),
        children: [
          {
            path: ":username",
            element: (
              <CheckProfileAccess>
                <Outlet />
              </CheckProfileAccess>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProfilePage />
                  </Suspense>
                ),
              },
              {
                path: "edit",
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <OwnerRoute>
                      <EditProfile />
                    </OwnerRoute>
                  </Suspense>
                ),
              },
              {
                path: "consultas",
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <CheckProfileAccess>
                      <ConsultasPage />
                    </CheckProfileAccess>
                  </Suspense>
                ),
              },
              {
                path: "files",
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <CheckProfileAccess>
                      <FilesBrowserWrapper />
                    </CheckProfileAccess>
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
      {
        path: "unauthorized",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotAllowed />
          </Suspense>
        ),
      },
    ],
  },
]);
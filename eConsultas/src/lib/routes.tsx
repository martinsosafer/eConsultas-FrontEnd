import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../components/layout";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PayConsulta } from "@/pages/consultas/payConsulta/index.tsx";
import { ComprobantesPage } from "@/pages/consultas/payConsulta/ComprobantesPage/index.tsx";
import { ProtectedProfile } from "./ProtectedProfile";
import { AdminRoute } from "./AdminRoute";

const Home = lazy(() => import("../pages"));
const About = lazy(() => import("../pages/about.tsx"));
const BloquePaciente = lazy(() => import("../pages/paciente/index.tsx"));
const DatosPaciente = lazy(() => import("../pages/paciente/[id].tsx"));
const ColorSystemShowcase = lazy(() => import("../pages/colorshowcase/index.tsx"));
const PasswordCreate = lazy(() => import("@/pages/passwordManagement/index.tsx"));
const Login = lazy(() => import("@/pages/login/index.tsx"));
const ProfilePage = lazy(() => import("@/pages/profile/index.tsx"));
const DashboardAdminPage = lazy(() => import("@/pages/adminDashboard/index.tsx"));
const ManejarPersonalPage = lazy(() => import("@/pages/adminDashboard/manejarPersonalPage/index.tsx"));
const EditProfile = lazy(() => import("@/pages/profile/profile/editProfile/editProfile.tsx"));
const ServiciosPage = lazy(() => import("@/pages/adminDashboard/todosServicios/index.tsx"));
const PaquetesPage = lazy(() => import("@/pages/adminDashboard/paquetes/index.tsx"));
const ConsultasPage = lazy(() => import("@/pages/profile/consultasPage/index.tsx"));
const ConsultaDetailPage = lazy(() => import("@/pages/profile/consultasPage/seeConsultaComplete/index.tsx")); 
const FilesBrowserWrapper = lazy(() => import("@/pages/profile/profile/FilesOfUser/FilesBrowserWrapper.tsx"));
const ReportesManagement = lazy(() => import("@/pages/adminDashboard/reportes/index.tsx"));
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
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardAdminPage />
          </Suspense>
        ),
        children: [
          {
            path: "manejar-personal",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ManejarPersonalPage />
              </Suspense>
            ),
          },
          {
            path: "reportes",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ReportesManagement />
              </Suspense>
            ),
          },
          {
            path: "consultas",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ConsultasPage />
              </Suspense>
            ),
          },
          {
            path: "servicios",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ServiciosPage />
              </Suspense>
            ),
          },
          {
            path: "paquetes",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PaquetesPage />
              </Suspense>
            ),
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
          <Suspense fallback={<LoadingSpinner />}>
            <AdminRoute />
          </Suspense>
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
                <ComprobantesPage/>
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
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedProfile />
          </Suspense>
        ),
        children: [
          {
            path: ":username",
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
                    <EditProfile />
                  </Suspense>
                ),
              },
              {
                path: "consultas",
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <ConsultasPage />
                  </Suspense>
                ),
              },
              {
                path: "files",
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <FilesBrowserWrapper />
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
    ],
  },
]);
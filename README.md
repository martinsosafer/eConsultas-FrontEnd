![Logo de la App](./eConsultas/public/fullLogo.png)

# Proyecto eConsultas: Gestión de Consultas Médicas

eConsultas es una aplicación web diseñada para gestionar de manera integral las operaciones de una clínica médica. El sistema permite administrar servicios médicos, paquetes de servicios, registros de pacientes, médicos y consultas, además de gestionar facturación y generar reportes de ganancias en tiempo real. La aplicación se desarrolló siguiendo las consignas del concurso, donde podemos destacar la implementación de un entorno real de trabajo, con todas las operaciones ABML (Altas, Bajas, Modificaciones y Lecturas) necesarias, solicitudes a la API bien manejadas y manejo de cookies/Local Storage correctos.

---
## Nuestra web
 [Clickea aquí para ver nuestra web](https://e-consultas-front-end.vercel.app/)

## Concurso HackaCode y TodoCode

Este proyecto participa en el concurso [HackaCode](https://hackacode.todocodeacademy.com/) orientado a desarrolladores semisenior, junior y trainees. La iniciativa busca brindar a los nuevos talentos la oportunidad de trabajar en proyectos reales y adquirir experiencia práctica en desarrollo y trabajo en equipo. Asimismo, contamos con el apoyo y guía de el magnífico canal de [TodoCode](https://youtube.com/TodoCode) y a la profesora [Luisina de Paula](https://www.linkedin.com/in/luisinaadp/?originalSubdomain=ar) que nos inspira a superar desafíos y aprender en cada paso.

---

## Participantes del Equipo

- **Irving Meza** (Backend)  
  [Ver Github](https://github.com/IrvingMeza95) • [Ver Linkedin](https://www.linkedin.com/in/irving-meza/)

- **Francisco Carrizo** (Fullstack)  
  [Ver Github](https://github.com/FrancarriYT) • [Ver Linkedin](https://www.linkedin.com/in/francisco-carrizo-4016ab25b/)

- **Martín Sosa** (Frontend)  
  [Ver Github](https://github.com/martinsosafer) • [Ver Linkedin](https://www.linkedin.com/in/mart%C3%ADn-fernandez-53917b245/)

---

## Tecnologías Utilizadas

- **React con TypeScript**  
  Utilizamos React por la facilidad de reutilización de componentes y su robustez para construir interfaces dinámicas. Con TypeScript, implementamos una programación orientada a objetos (POO) rigurosa, lo que nos permite definir modelos de datos claros y un control de errores efectivo para lograr un código escalable y seguro que es necesario debido a la estructura compleja de nuestra aplicación.

- **TailwindCSS**  
  Empleamos TailwindCSS para lograr estilos modernos y responsivos de manera eficiente, permitiendo personalizar el diseño de la aplicación de forma rápida y consistente.

- **Vite**  
  Vite es nuestra herramienta de build, que optimiza el proceso de desarrollo gracias a su rapidez y eficiencia en la compilación.

- **Vercel**  
  La aplicación se despliega en [Vercel](https://vercel.com), lo que garantiza un entorno de producción rápido y seguro.

---

## Librerías y Utilidades

- [**ReactPDFReader**](https://react-pdf.org/)  
  Esta librería se utiliza para la generación dinámica de PDFs, facilitando la creación de facturas y recibos de forma automatizada.

- [**ShadCN**](https://ui.shadcn.com/)  
  Proporciona componentes accesibles y de alta calidad que mejoran significativamente la experiencia de usuario, asegurando una interfaz intuitiva y estéticamente agradable.

- [**ReactTanstackTable**](https://tanstack.com/table/latest)  
  Implementamos ReactTanstackTable para generar gráficos y tablas interactivas, especialmente en el bonus point de reportes, permitiendo una visualización clara y detallada de datos.

- [**Axios**](https://axios-http.com/es/docs/intro)  
  Axios se utiliza para gestionar las solicitudes a APIs. Gracias a esta librería, hemos configurado un proxy inverso que nos permite comunicar de manera segura una API HTTP (Don Web Cloud) con Vercel HTTPS, garantizando conexiones seguras y eficientes.

---

## Estructura del Proyecto

### API
- **Classes apis:**  
  Sección donde se encuentran los archivos TS de manejo de nuestra API, aparte de las originales de la consigna (Paquete, persona, consulta, servicio) podemos encontrar unas extras (Files, Médico, Turno).
  
- **Dashboard:**  
  Sección donde se encuentran los archivos TS del dashboard de nuestra aplicación, con otras solicitudes API, aparte de las originales de las consigna, podemos encontrar unas extras (Reporte y Variedad).
  - **Misc:**  
  Sección donde se encuentran los archivos TS de miscalneo, ya sea manejo de errores, csvExporter o templateEmail.
  - **Models**  
  Sección donde se encuentran los archivos TS de nuestras clases y modelos, aparte de los modelos originales de la consigna, podemos encontrar extras (turnoModels y reporteModels).

  _Todo extra que se encuentre dentro de esta carpeta de API son o los archivos axios, o verificación de contraseña, etc._

### Components
  - Animations: Animaciones.
  - Classes components: Componentes de clases de la consigna (Ya sea como selectors o cards de estos).
  - errors: Componentes de páginas de errores como NotAllowedPage (error 401) o NotFoundPage (error404).
  - Home: Componentes del home.
### Context
  Configuración del AuthProvider.
### Hooks
  Hooks varios como useAuth.
### Lib
  Archivos o componentes de utilidades como util.ts o routes.tsx (Con carpeta de sus subrutas protegidas).
### Pages
  Resto de páginas de la aplicación.


## Véase También

- [Repositorio Backend](https://github.com/IrvingMeza95/eConsulta-API)

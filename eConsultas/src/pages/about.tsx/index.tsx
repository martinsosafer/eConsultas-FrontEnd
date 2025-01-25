import { useState } from "react";

export default function About() {
  const [image, setImage] = useState<string | null>(null); // Ajuste del tipo

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL); // Ahora esto funciona
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-primary-light text-primary-dark flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-primary text-white py-8 text-center shadow-lg">
        <h1 className="text-5xl font-bold">Sobre Nosotros</h1>
        <p className="mt-2 text-lg">Cuidamos de ti, porque tu salud es nuestra pasión.</p>
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center w-[90%] md:w-[80%] lg:w-[70%] bg-white shadow-xl rounded-xl mt-10 p-6">
        {/* Image Section */}
        <section className="w-full flex flex-col items-center mb-8">
          <div className="w-full h-64 bg-secondary-light rounded-lg overflow-hidden flex items-center justify-center shadow-md">
            {image ? (
              <img
                src={image}
                alt="Imagen personalizada"
                className="object-cover w-full h-full"
              />
            ) : (
              <p className="text-secondary-dark">Sube una imagen para personalizar esta sección</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-md cursor-pointer shadow-md hover:bg-primary-hover"
          />
        </section>

        {/* About Content */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-primary-dark">Nuestra Clínica</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Somos una clínica comprometida con brindar servicios médicos de alta calidad, 
            combinando tecnología de punta y un enfoque humano. Nuestro equipo de profesionales 
            trabaja incansablemente para asegurarse de que cada paciente reciba la atención que 
            merece, en un ambiente cálido y confiable.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ofrecemos una amplia gama de servicios, desde consultas generales hasta tratamientos 
            especializados, diseñados para satisfacer las necesidades de nuestros pacientes. 
            Tu bienestar es nuestra misión, y estamos aquí para acompañarte en cada paso de tu 
            camino hacia la salud.
          </p>
        </section>

        {/* Values Section */}
        <section className="w-full mt-10 space-y-6">
          <h3 className="text-2xl font-bold text-primary">Nuestros Valores</h3>
          <ul className="list-disc list-inside text-left text-gray-700 leading-relaxed">
            <li>
              <span className="font-semibold text-primary-dark">Compromiso:</span> Dedicados a tu salud en todo momento.
            </li>
            <li>
              <span className="font-semibold text-primary-dark">Calidez:</span> Un trato humano que te hace sentir como en casa.
            </li>
            <li>
              <span className="font-semibold text-primary-dark">Innovación:</span> Tecnología avanzada para diagnósticos y tratamientos precisos.
            </li>
            <li>
              <span className="font-semibold text-primary-dark">Excelencia:</span> Nos esforzamos por superar tus expectativas.
            </li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 mt-10 bg-primary text-white">
        <p className="text-sm">
          <strong>Nota:</strong> Esta página es una simulación creada exclusivamente para la Hackacode 2025.
        </p>
      </footer>
    </div>
  );
}

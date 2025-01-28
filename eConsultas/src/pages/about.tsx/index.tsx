import { useState } from "react";

export default function About() {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-white to-primary-light/20 text-primary-dark flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-primary to-primary-dark py-12 text-center shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in-down">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-primary-light/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Cuidamos de ti, porque tu salud es nuestra pasión.
          </p>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center w-[90%] md:w-[80%] lg:w-[70%] bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl -mt-8 p-8 mb-12 transition-all duration-300 hover:shadow-3xl">
        {/* Image Section */}
        <section className="w-full flex flex-col items-center mb-10">
          <div className="w-full h-72 bg-secondary-light/20 rounded-xl overflow-hidden flex items-center justify-center shadow-lg group relative transition-all duration-300 hover:shadow-xl">
            {image ? (
              <img
                src={image}
                alt="Imagen personalizada"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="space-y-4 text-center">
                <div className="mx-auto text-secondary-dark/60">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-secondary-dark/70 font-medium">Sube una imagen para personalizar esta sección</p>
              </div>
            )}
          </div>
          <label className="mt-6 bg-primary/90 hover:bg-primary text-white px-6 py-3 rounded-lg cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <span>Subir Imagen</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </section>

        {/* About Content */}
        <section className="text-center space-y-8 mb-12">
          <h2 className="text-4xl font-bold text-primary-dark/90 mb-6">
            Nuestra Clínica
            <div className="w-16 h-1.5 bg-primary/50 rounded-full mx-auto mt-4" />
          </h2>
          <div className="space-y-6 text-lg text-gray-700/90 leading-relaxed max-w-3xl mx-auto">
            <p className="bg-gradient-to-r from-primary-light/10 to-transparent p-6 rounded-xl">
              Somos una clínica comprometida con brindar servicios médicos de alta calidad, 
              combinando <span className="font-semibold text-primary-dark">tecnología de punta</span> y un 
              <span className="font-semibold text-primary-dark"> enfoque humano</span>. Nuestro equipo de profesionales 
              trabaja incansablemente para asegurarse de que cada paciente reciba la atención que 
              merece, en un ambiente cálido y confiable.
            </p>
            <p className="bg-gradient-to-l from-primary-light/10 to-transparent p-6 rounded-xl">
              Ofrecemos una amplia gama de servicios, desde consultas generales hasta tratamientos 
              especializados, diseñados para satisfacer las necesidades de nuestros pacientes. 
              Tu bienestar es nuestra misión, y estamos aquí para acompañarte en cada paso de tu 
              camino hacia la salud.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full mt-8 space-y-8">
          <h3 className="text-3xl font-bold text-primary-dark/90 text-center mb-8">
            Nuestros Valores
            <div className="w-12 h-1 bg-primary/40 rounded-full mx-auto mt-3" />
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { title: "Compromiso", content: "Dedicados a tu salud en todo momento." },
              { title: "Calidez", content: "Un trato humano que te hace sentir como en casa." },
              { title: "Innovación", content: "Tecnología avanzada para diagnósticos y tratamientos precisos." },
              { title: "Excelencia", content: "Nos esforzamos por superar tus expectativas." },
            ].map((value, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-primary/50">
                <h4 className="text-xl font-semibold text-primary-dark mb-3">{value.title}</h4>
                <p className="text-gray-600/90 leading-relaxed">{value.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-8 bg-gradient-to-r from-primary to-primary-dark text-white/90 mt-4">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-medium">
            <strong>Nota:</strong> Esta página es una simulación creada exclusivamente para la Hackacode 2025.
          </p>
        </div>
      </footer>
    </div>
  );
}
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
];

export default function AboutUs() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Acerca de Nosotros
      </h1>

      <div className="relative mb-8">
        <img
          src={images[currentImage]}
          alt={`La Olla imagen ${currentImage + 1}`}
          className="w-full h-64 object-cover rounded-lg"
        />
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-2">Nuestra Historia</h2>
          <p>
            La Olla nació en el corazón de nuestra ciudad hace más de dos
            décadas, con la visión de ofrecer comidas caseras de calidad a
            precios accesibles. Lo que comenzó como un pequeño negocio familiar
            se ha convertido en un referente gastronómico de la zona,
            manteniendo siempre la esencia y el sabor de lo casero.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">Nuestra Filosofía</h2>
          <p>
            En La Olla, creemos que la buena comida tiene el poder de unir a las
            personas. Por eso, nos esforzamos cada día por ofrecer platos que no
            solo alimenten el cuerpo, sino también el alma. Utilizamos
            ingredientes frescos y de calidad, y preparamos cada plato con el
            mismo cuidado y amor que lo haríamos para nuestra propia familia.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">Nuestro Compromiso</h2>
          <p>
            Nos enorgullece ser parte de esta comunidad y nos comprometemos a
            seguir ofreciendo el mejor servicio y la mejor calidad en cada uno
            de nuestros platos. Ya sea que vengas por nuestras famosas pizzas,
            nuestras deliciosas comidas caseras o nuestro servicio de catering
            para eventos, en La Olla siempre encontrarás un pedacito de hogar en
            cada bocado.
          </p>
        </section>
      </div>
    </div>
  );
}

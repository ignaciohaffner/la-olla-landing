import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/components/ui/button";
import pizzaparty from "../assets/laolla/pizzaparty.jpg";
import pizzaparty2 from "../assets/laolla/pizzaparty2.jpeg";
import pizzaparty3 from "../assets/laolla/pizzaparty3.jpeg";
import pizzaparty4 from "../assets/laolla/pizzaparty4.jpeg";

const images = [pizzaparty, pizzaparty2, pizzaparty3, pizzaparty4];

export default function PizzaParty() {
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
      <h1 className="text-4xl font-bold text-center mb-8">
        Servicio de Pizza Party
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="lg:w-1/3">
          <div className="relative aspect-[3/4] w-full">
            <img
              src={images[currentImage]}
              alt={`Pizza Party imagen ${currentImage + 1}`}
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <button
                onClick={prevImage}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              ¿Qué es nuestro Pizza Party?
            </h2>
            <p className="text-lg">
              Nuestro servicio de Pizza Party es la solución perfecta para tus
              eventos y celebraciones. Llevamos la experiencia de La Olla
              directamente a tu hogar o lugar de evento, ofreciendo una amplia
              variedad de nuestras deliciosas pizzas artesanales para que tú y
              tus invitados disfruten de una experiencia gastronómica única.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                ¿Qué incluye nuestro servicio?
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Empanadas de copetin de entrada</li>
                <li>13 Variedades de pizza</li>
                <li>Horno móvil para cocción en el lugar del evento</li>
                <li>Platos, servilletas y cubiertos incluidos</li>
                <li>Servicio de 3 horas de duración</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">¿Qué no incluye?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Bebidas</li>
                <li>Mesas y sillas</li>
                <li>Vasos</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Extras disponibles</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Hora adicional de servicio</li>
                <li>Servicio de mozos adicionales</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                ¿Listo para hacer tu Pizza Party realidad?
              </h2>
              <p className="text-lg mb-4">
                Contáctanos para obtener más información, verificar
                disponibilidad y recibir un presupuesto personalizado.
              </p>
              <Button size="lg" asChild className="w-full">
                <a href="/contacto">Solicitar Información</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

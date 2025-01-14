import { Calendar, Clock } from "lucide-react";
import { Button } from "../components/components/ui/button";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../components/components/ui/accordion";

// const menuSemanal = {
//   lunes: [
//     "Milanesa con puré",
//     "Pollo al horno con papas",
//     "Fideos con salsa boloñesa",
//   ],
//   martes: [
//     "Pastel de papa",
//     "Pollo a la portuguesa",
//     "Sorrentinos de jamón y queso",
//   ],
//   miercoles: [
//     "Bife a la criolla con ensalada",
//     "Suprema napolitana con puré",
//     "Ravioles de verdura",
//   ],
//   jueves: [
//     "Carne al horno con papas",
//     "Milanesa de pollo con ensalada",
//     "Tallarines con estofado",
//   ],
//   viernes: [
//     "Pescado al horno con puré",
//     "Suprema de pollo con ensalada rusa",
//     "Ñoquis con salsa filetto",
//   ],
// };

export default function Viandas() {
  // const [activeDay, setActiveDay] = useState("lunes");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Servicio de Viandas Semanales
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">¿Cómo funciona?</h2>
          <div className="space-y-4">
            <p className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Servicio de lunes a viernes
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Entrega diaria en horario del mediodía
            </p>
            <p>
              Nuestro servicio de viandas está pensado para quienes buscan una
              alimentación casera, variada y nutritiva. Cada semana ofrecemos un
              menú diferente con opciones para todos los gustos.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Beneficios</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Comida casera y nutritiva</li>
            <li>Menú variado todas las semanas</li>
            <li>Porciones abundantes</li>
            <li>Delivery</li>
            <li>Precios especiales por semana completa</li>
          </ul>
        </div>
      </div>

      {/* <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Menú de la Semana</h2>
          <Accordion type="single" collapsible>
            {Object.entries(menuSemanal).map(([dia, platos]) => (
              <AccordionItem key={dia} value={dia}>
                <AccordionTrigger className="capitalize">{dia}</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2">
                    {platos.map((plato, index) => (
                      <li key={index}>{plato}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div> */}

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          ¿Interesado en nuestro servicio de viandas?
        </h2>
        <p className="text-lg mb-6">
          Contáctanos para más información sobre precios y disponibilidad.
        </p>
        <Button size="lg" asChild>
          <a href="/contacto">Consultar</a>
        </Button>
      </div>
    </div>
  );
}

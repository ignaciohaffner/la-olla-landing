import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-b from-green-800 to-green-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logolaolla%20(1)-sOuVSlk4TfJBrfkB3tcN0lV5xd1Q9Q.png"
              alt="La Olla Logo"
              className="w-32 h-32 mb-6"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Bienvenidos a Rotiseria La Olla
            </h1>
            <p className="text-xl mb-8">
              Las mejores comidas caseras y pizza party
            </p>
            <Link
              to="/menu"
              className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors"
            >
              Ver Menú
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nuestras Especialidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="src\assets\laolla\chuletaconpapas.jpeg?height=200&width=300"
                alt="Comidas"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Comidas Caseras</h3>
                <p className="text-gray-600">
                  Deliciosas opciones de comida casera preparada con los mejores
                  ingredientes.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="src\assets\pizzapalmitos.jpeg"
                alt="Pizzas"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Pizzas Artesanales</h3>
                <p className="text-gray-600">
                  Las mejores pizzas con una gran variedad de ingredientes
                  frescos.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="src\assets\laolla\pizzaparty2.jpeg?height=200&width=300"
                alt="Pizza Party"
                className="w-full h-64 object-cover object-top"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Pizza Party</h3>
                <p className="text-gray-600">
                  Servicio de catering para eventos con las mejores pizzas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

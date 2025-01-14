import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Contacto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Información de contacto</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="w-6 h-6 mr-2 text-green-600" />
              <span>3446-410459</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-6 h-6 mr-2 text-green-600" />
              <span>info@laolla.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-green-600" />
              <span>Doello Jurado 1050, Gualeguaychu.</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            Síguenos en redes sociales
          </h2>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=100054471429554"
              className="text-blue-600 hover:text-blue-800"
            >
              <Facebook className="w-8 h-8" />
            </a>
            <a
              href="https://www.instagram.com/rotiserialaolla/"
              className="text-pink-600 hover:text-pink-800"
            >
              <Instagram className="w-8 h-8" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Envíanos un mensaje</h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Nuestra ubicación</h2>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.634845906748!2d-58.52205112448532!3d-33.01340127356574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95baa82f524100a3%3A0xcf27bf028014240f!2sRotiseria%20La%20Olla!5e0!3m2!1ses-419!2sar!4v1736866733765!5m2!1ses-419!2sar"
            width="600"
            height="600"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full rounded-lg shadow-md"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

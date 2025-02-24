import type React from "react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { Button } from "./components/ui/button";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface PriceListImageProps {
  menuItems: MenuItem[];
}

const PriceListImage: React.FC<PriceListImageProps> = ({ menuItems }) => {
  const exportRef1 = useRef<HTMLDivElement>(null);
  const exportRef2 = useRef<HTMLDivElement>(null);

  const downloadImage = (blob: string, fileName: string) => {
    const fakeLink = window.document.createElement("a");
    fakeLink.style.display = "none";
    fakeLink.download = fileName;
    fakeLink.href = blob;
    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);
    fakeLink.remove();
  };

  const exportAsImage = async (element: HTMLElement, imageFileName: string) => {
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: "#1a1a1a",
      width: 1200,
      height: 1000,
    });
    const image = canvas.toDataURL("image/png", 1.0);
    downloadImage(image, imageFileName);
  };

  const handleDownload = (
    ref: React.RefObject<HTMLDivElement>,
    fileName: string
  ) => {
    if (ref.current) {
      exportAsImage(ref.current, fileName);
    }
  };

  const empanadasFlavors = [
    "Carne salada",
    "Carne dulce",
    "Jamon y queso",
    "Cebolla y queso",
    "Verdura",
    "Choclo",
    "Pollo",
    "Queso dulce",
  ];

  const pastaTypes = ["Tallarines", "Ñoquis", "Ravioles", "Sorrentinos"];
  const sauceTypes = ["con Salsa", "con Bolognesa", "con Estofado"];

  const getPastaPrice = (pastaType: string, sauceType: string) => {
    const pasta = menuItems.find(
      (item) =>
        item.category === "Pastas" &&
        item.name.toLowerCase() ===
          `${pastaType.toLowerCase()} ${sauceType.toLowerCase()}`
    );
    return pasta?.price || 0;
  };

  const empanadasPrice =
    menuItems.find((item) => item.category === "Empanadas")?.price || 0;
  const empanadasDozenPrice =
    menuItems.find((item) => item.name.toLowerCase().includes("Docena"))
      ?.price || 0;

  const renderPizzasList = () => (
    <div
      ref={exportRef1}
      className="bg-[#1a1a1a] text-white p-12 rounded-lg w-[1200px] h-[1000px]"
    >
      <div className="flex justify-center mb-8">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logolaolla%20(1)-sOuVSlk4TfJBrfkB3tcN0lV5xd1Q9Q.png"
          alt="La Olla Logo"
          className="w-32 h-32"
        />
      </div>
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">Pizzas</h2>
          <div className="space-y-3">
            {menuItems
              .filter((item) => item.category === "pizzas")
              .map((item) => (
                <div key={item.id} className="flex justify-between text-lg">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Tartas</h2>
          <div className="space-y-3">
            {menuItems
              .filter((item) => item.category === "Tartas")
              .map((item) => (
                <div key={item.id} className="flex justify-between text-lg">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
          </div>
          <h2 className="text-3xl font-bold mt-8 mb-6">Empanadas</h2>
          <div className="space-y-2 text-lg">
            {empanadasFlavors.map((flavor, index) => (
              <div key={index}>{flavor}</div>
            ))}
          </div>
          <div className="mt-4 text-xl font-bold">
            ${empanadasDozenPrice} DOCENA - ${empanadasPrice} C/U
          </div>
        </div>
      </div>
    </div>
  );

  const renderFoodList = () => (
    <div
      ref={exportRef2}
      className="bg-[#1a1a1a] text-white p-12 rounded-lg w-[1200px] h-[1000px]"
    >
      <div className="flex justify-center mb-8">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logolaolla%20(1)-sOuVSlk4TfJBrfkB3tcN0lV5xd1Q9Q.png"
          alt="La Olla Logo"
          className="w-32 h-32"
        />
      </div>
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">Comidas</h2>
          <div className="space-y-3">
            {menuItems
              .filter((item) => item.category === "comidas")
              .map((item) => (
                <div key={item.id} className="flex justify-between text-lg">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Pastas</h2>
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-white">
                <th className="text-left py-2">Pasta</th>
                {sauceTypes.map((sauce, index) => (
                  <th key={index} className="text-right py-2">
                    {sauce.split(" ")[1]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pastaTypes.map((pasta, index) => (
                <tr key={index} className="border-b border-white/20">
                  <td className="py-3">{pasta}</td>
                  {sauceTypes.map((sauce, sauceIndex) => (
                    <td key={sauceIndex} className="text-right py-3">
                      ${getPastaPrice(pasta, sauce)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Guarniciones</h2>
          <div className="space-y-3">
            {menuItems
              .filter((item) => item.category === "Guarnición")
              .map((item) => (
                <div key={item.id} className="flex justify-between text-lg">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Lista de Pizzas, Tartas y Empanadas
        </h3>
        {renderPizzasList()}
        <Button
          onClick={() =>
            handleDownload(exportRef1, "lista_precios_pizzas_la_olla.png")
          }
          className="mt-4"
        >
          Descargar Lista de Pizzas
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">
          Lista de Comidas y Pastas
        </h3>
        {renderFoodList()}
        <Button
          onClick={() =>
            handleDownload(exportRef2, "lista_precios_comidas_la_olla.png")
          }
          className="mt-4"
        >
          Descargar Lista de Comidas
        </Button>
      </div>
    </div>
  );
};

export default PriceListImage;

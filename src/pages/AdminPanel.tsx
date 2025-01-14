import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "../components/components/ui/button";
import { Input } from "../components/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/components/ui/select";
import { Textarea } from "../components/components/ui/textarea";
import { Toaster } from "../components/components/ui/toaster";
import { useToast } from "../components/hooks/use-toast";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string | null;
}

export default function AdminPanel() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    price: 0,
    category: "",
    description: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [priceChanges, setPriceChanges] = useState<{ [key: number]: number }>(
    {}
  );
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;

      setMenuItems(data || []);
      const uniqueCategories = [
        ...new Set(data?.map((item) => item.category) || []),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los ítems del menú",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateMenuItem(id: number, updates: Partial<MenuItem>) {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setMenuItems(
        menuItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
      toast({
        title: "Éxito",
        description: "Ítem actualizado correctamente",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el ítem",
        variant: "destructive",
      });
    }
  }

  async function createMenuItem() {
    if (!newItem.name || !newItem.category) {
      toast({
        title: "Error",
        description: "El nombre y la categoría son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("menu_items")
        .insert([newItem])
        .select();

      if (error) throw error;

      setMenuItems([...menuItems, data[0]]);
      if (!categories.includes(newItem.category)) {
        setCategories([...categories, newItem.category]);
      }
      setNewItem({ name: "", price: 0, category: "", description: "" });
      toast({
        title: "Éxito",
        description: "Nuevo ítem creado correctamente",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el nuevo ítem",
        variant: "destructive",
      });
    }
  }

  async function deleteMenuItem(id: number) {
    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);

      if (error) throw error;

      setMenuItems(menuItems.filter((item) => item.id !== id));
      toast({
        title: "Éxito",
        description: "Ítem eliminado correctamente",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el ítem",
        variant: "destructive",
      });
    }
  }

  function handlePriceChange(id: number, newPrice: number) {
    setPriceChanges((prev) => ({ ...prev, [id]: newPrice }));
  }

  async function saveAllChanges() {
    try {
      const updates = await Promise.all(
        Object.entries(priceChanges).map(async ([id, price]) => {
          const { data, error } = await supabase
            .from("menu_items")
            .update({ price: price })
            .eq("id", parseInt(id))
            .select();

          if (error) throw error;
          return data[0];
        })
      );

      if (updates.length > 0) {
        setMenuItems(
          menuItems.map((item) => {
            const updatedItem = updates.find((u) => u.id === item.id);
            return updatedItem ? { ...item, ...updatedItem } : item;
          })
        );
        setPriceChanges({});
        toast({
          title: "Éxito",
          description: "Todos los cambios guardados correctamente",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    }
  }

  function addNewCategory() {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewItem({ ...newItem, category: newCategory });
      setNewCategory("");
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Ítem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Nombre del ítem"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Precio"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: parseFloat(e.target.value) })
            }
          />
          <Select
            value={newItem.category}
            onValueChange={(value) =>
              setNewItem({ ...newItem, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              placeholder="Nueva categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={addNewCategory}>Agregar</Button>
          </div>
          <Textarea
            placeholder="Descripción"
            value={newItem.description || ""}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
          />
        </div>
        <Button className="mt-4" onClick={createMenuItem}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Ítem
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div key={category} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
            <ul className="space-y-4">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2"
                  >
                    <div className="flex-grow mr-4">
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          updateMenuItem(item.id, { name: e.target.value })
                        }
                        className="font-semibold mb-2 sm:mb-0"
                      />
                    </div>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={
                          priceChanges[item.id] !== undefined
                            ? priceChanges[item.id] === null
                              ? ""
                              : priceChanges[item.id]
                            : item.price === null
                            ? ""
                            : item.price
                        }
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (newValue === "") {
                            handlePriceChange(item.id, null);
                          } else {
                            const newPrice = parseFloat(newValue);
                            if (!isNaN(newPrice)) {
                              handlePriceChange(item.id, newPrice);
                            }
                          }
                        }}
                        className="w-24 mr-2"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteMenuItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <Button
        onClick={saveAllChanges}
        className="mt-8"
        disabled={Object.keys(priceChanges).length === 0}
      >
        <Save className="mr-2 h-4 w-4" /> Guardar cambios
      </Button>
      <Toaster />
    </div>
  );
}

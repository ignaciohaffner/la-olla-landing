import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { MenuItem } from "../types/menu";
import { Loader2 } from "lucide-react";

export default function Menu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category");

      if (error) throw error;

      setMenu(data || []);
      const uniqueCategories = [
        ...new Set(data?.map((item) => item.category) || []),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold text-center mb-8">Nuestro Menú</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
            <div className="space-y-2">
              {menu
                .filter((item) => item.category === category)
                .map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-bold">${item.price}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

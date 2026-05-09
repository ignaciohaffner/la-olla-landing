import { findAvailableMenuWithCategories } from '../repositories/menu.repository';
import { findAllCategories } from '../repositories/category.repository';

export const getGroupedMenu = async () => {
  const categories = await findAvailableMenuWithCategories();
  return categories
    .filter((c) => c.items.length > 0)
    .map((c) => ({
      category: { id: c.id, name: c.name, slug: c.slug },
      items: c.items,
    }));
};

export const getCategories = () => findAllCategories();

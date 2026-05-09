import { findWeeklyMenuByWeekStart } from '../repositories/weeklyMenu.repository';

function getCurrentWeekStart(): Date {
  const now = new Date();
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  return monday;
}

export const getCurrentWeekMenu = () =>
  findWeeklyMenuByWeekStart(getCurrentWeekStart());

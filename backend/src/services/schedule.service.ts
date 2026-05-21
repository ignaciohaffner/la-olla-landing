import { findAllSchedule } from '../repositories/schedule.repository';

function getArgentinaTime(): { day: number; time: string } {
  const argNow = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const hh = String(argNow.getUTCHours()).padStart(2, '0');
  const mm = String(argNow.getUTCMinutes()).padStart(2, '0');
  return { day: argNow.getUTCDay(), time: `${hh}:${mm}` };
}

export const getScheduleWithOpenNow = async () => {
  const rows = await findAllSchedule();
  const { day, time } = getArgentinaTime();
  return rows.map((row) => ({
    ...row,
    isOpenNow:
      row.dayOfWeek === day &&
      row.isOpen &&
      (
        (time >= row.openTime && time < row.closeTime) ||
        (row.openTime2 != null && row.closeTime2 != null &&
          time >= row.openTime2 && time < row.closeTime2)
      ),
  }));
};

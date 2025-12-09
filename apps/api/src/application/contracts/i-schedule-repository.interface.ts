export type TimeSlot = {
  time: string;
};

export interface IScheduleRepository {
  get_slots_by_day(user_id: string, date: Date): Promise<TimeSlot[]>;
}

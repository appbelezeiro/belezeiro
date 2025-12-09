import { IScheduleRepository, TimeSlot } from '@/application/contracts/i-schedule-repository.interface';

export class InMemoryScheduleRepository implements IScheduleRepository {
  async get_slots_by_day(user_id: string, date: Date): Promise<TimeSlot[]> {
    // Mock implementation - retorna slots de exemplo
    return [
      { time: '09:00' },
      { time: '10:00' },
      { time: '11:00' },
      { time: '14:00' },
      { time: '15:00' },
      { time: '16:00' },
    ];
  }
}

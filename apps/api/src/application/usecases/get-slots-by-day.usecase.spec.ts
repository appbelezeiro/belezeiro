import { GetSlotsByDayUseCase } from './get-slots-by-day.usecase';
import { InMemoryScheduleRepository } from '@/infra/repositories/in-memory/in-memory-schedule.repository';

describe('GetSlotsByDayUseCase', () => {
  let sut: GetSlotsByDayUseCase;
  let schedule_repository: InMemoryScheduleRepository;

  beforeEach(() => {
    schedule_repository = new InMemoryScheduleRepository();
    sut = new GetSlotsByDayUseCase(schedule_repository);
  });

  it('should return available slots for a given day', async () => {
    const input = {
      user_id: 'user-1',
      date: new Date('2024-06-15'),
    };

    const slots = await sut.execute(input);

    expect(slots).toEqual([
      { time: '09:00' },
      { time: '10:00' },
      { time: '11:00' },
      { time: '14:00' },
      { time: '15:00' },
      { time: '16:00' },
    ]);
  });
});
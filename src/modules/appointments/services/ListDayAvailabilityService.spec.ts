import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListDayAvailabilityService from './ListDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listDayAvailabilityService: ListDayAvailabilityService;

describe('ListMonthAvaliability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listDayAvailabilityService = new ListDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list the day avaliability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availiability = await listDayAvailabilityService.execute({
      user_id: 'user',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availiability).toEqual(
      expect.arrayContaining([
        { hour: 8, avaliable: false },
        { hour: 9, avaliable: false },
        { hour: 10, avaliable: false },
        { hour: 13, avaliable: true },
        { hour: 14, avaliable: false },
        { hour: 15, avaliable: false },
        { hour: 16, avaliable: true },
      ]),
    );
  });
});

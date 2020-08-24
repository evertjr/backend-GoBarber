import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'userid',
      provider_id: 'providerid',
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('providerid');
  });

  it('should not be able to create two appointments on the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointmentDate = new Date(2020, 4, 10, 12);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'userid',
      provider_id: 'providerid',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'userid',
        provider_id: 'providerid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'userid',
        provider_id: 'providerid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment with self', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'sameid',
        provider_id: 'sameid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment outside the working hours 8h-17h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: 'sameid',
        provider_id: 'providerid',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        user_id: 'sameid',
        provider_id: 'providerid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IGetFullProviderMonthDTO from '@modules/appointments/dtos/IGetFullProviderMonthDTO';
import IGetFullProviderDayDTO from '@modules/appointments/dtos/IGetFullProviderDayDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(ap =>
      isEqual(ap.date, date),
    );

    return findAppointment;
  }

  public async getFullProviderMonth({
    provider_id,
    month,
    year,
  }: IGetFullProviderMonthDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      ap =>
        ap.provider_id === provider_id &&
        getMonth(ap.date) + 1 === month &&
        getYear(ap.date) === year,
    );

    return appointments;
  }

  public async getFullProviderDay({
    provider_id,
    month,
    day,
    year,
  }: IGetFullProviderDayDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      ap =>
        ap.provider_id === provider_id &&
        getDate(ap.date) === day &&
        getMonth(ap.date) + 1 === month &&
        getYear(ap.date) === year,
    );

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id,
      user_id,
    });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;

import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IGetFullProviderMonthDTO from '../dtos/IGetFullProviderMonthDTO';
import IGetFullProviderDayDTO from '../dtos/IGetFullProviderDayDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  getFullProviderMonth(data: IGetFullProviderMonthDTO): Promise<Appointment[]>;
  getFullProviderDay(data: IGetFullProviderDayDTO): Promise<Appointment[]>;
}

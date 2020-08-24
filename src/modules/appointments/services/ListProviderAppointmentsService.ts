import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  user_id: string;
  month: number;
  year: number;
  day: number;
}

@injectable()
class ListProviderAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    year,
    month,
    day,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${user_id}:${year}-${month}-${day}`;
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.getFullProviderDay({
        day,
        provider_id: user_id,
        month,
        year,
      });

      await this.cacheProvider.save(cacheKey, appointments);
    }

    return appointments;
  }
}

export default ListProviderAppointmentService;

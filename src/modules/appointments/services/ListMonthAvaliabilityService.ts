import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  user_id: string;
  month: number;
  year: number;
}

type IResponse = {
  day: number;
  avaliable: boolean;
}[];

@injectable()
class ListMonthAvaliabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ user_id, year, month }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.getFullProviderMonth(
      {
        provider_id: user_id,
        year,
        month,
      },
    );

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eatchDayArray = Array.from(
      { length: daysInMonth },
      (value, index) => index + 1,
    );

    const avaliability = eatchDayArray.map(day => {
      const appointmentsInDay = appointments.filter(a => {
        return getDate(a.date) === day;
      });

      return {
        day,
        avaliable: appointmentsInDay.length < 10,
      };
    });

    return avaliability;
  }
}

export default ListMonthAvaliabilityService;

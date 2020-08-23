import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListDayAvailabilityService from '@modules/appointments/services/ListDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.params.id;
    const { month, day, year } = request.body;

    const listDayAvailability = container.resolve(ListDayAvailabilityService);

    const availability = await listDayAvailability.execute({
      user_id: provider_id,
      day,
      month,
      year,
    });

    return response.json(availability);
  }
}

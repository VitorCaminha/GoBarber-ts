import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '../../typeorm/repositories/AppointmentsRepository';

export default class AppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const appointmentsRepository = new AppointmentsRepository();

    const appointments = await appointmentsRepository.find();

    return res.json(appointments);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const { provider_id, date } = req.body;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      provider_id,
      date,
      user_id,
    });

    return res.json(appointment);
  }
}

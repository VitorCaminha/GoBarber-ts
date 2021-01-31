import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({
      except_user_id: user_id,
    });

    const providersWithoutPassword = providers.map(provider => {
      const { password: _, ...providerWithoutPassword } = provider;

      return providerWithoutPassword;
    });

    return res.json(providersWithoutPassword);
  }
}

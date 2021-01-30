import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({
      user_id,
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.json(userWithoutPassword);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const { name, email, password, oldPassword } = req.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      oldPassword,
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.json(userWithoutPassword);
  }
}

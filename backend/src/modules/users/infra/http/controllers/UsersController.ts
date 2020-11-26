import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const usersRepository = new UsersRepository();
    const users = await usersRepository.find();

    const usersWithoutPassword = users.map(user => {
      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    });

    return res.json(usersWithoutPassword);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    const { password: _, ...userWithoutPassword } = user;

    return res.json(userWithoutPassword);
  }
}

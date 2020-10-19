import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import User from '../models/User';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRoutes = Router();
const upload = multer(uploadConfig);

usersRoutes.get('/', async (req, res) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.find();

  const usersWithoutPassword = users.map(user => {
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  });

  return res.json(usersWithoutPassword);
});

usersRoutes.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({ name, email, password });

  const { password: _, ...userWithoutPassword } = user;

  return res.json(userWithoutPassword);
});

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.json(userWithoutPassword);
  },
);

export default usersRoutes;

import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to create avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const newUser = await fakeUsersRepository.create({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'teste.jpg',
    });

    expect(user.avatar).toBe('teste.jpg');
  });

  it('should not be able to update avatar from user with non existing id', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: '1',
        avatarFilename: 'teste.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able delete old avatar when updating to new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const newUser = await fakeUsersRepository.create({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'teste.jpg',
    });

    const user = await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'teste2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('teste.jpg');
    expect(user.avatar).toBe('teste2.jpg');
  });
});

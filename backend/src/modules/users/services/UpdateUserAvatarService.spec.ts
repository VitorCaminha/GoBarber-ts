import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create avatar', async () => {
    const newUser = await fakeUsersRepository.create({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    const user = await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'teste.jpg',
    });

    expect(user.avatar).toBe('teste.jpg');
  });

  it('should not be able to update avatar from user with non existing id', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: '1',
        avatarFilename: 'teste.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able delete old avatar when updating to new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const newUser = await fakeUsersRepository.create({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

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

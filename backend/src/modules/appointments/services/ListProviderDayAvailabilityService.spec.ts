import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('it should be able to list the providers day availability', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 10, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 29, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: '1',
      day: 30,
      month: 1,
      year: 2021,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ]),
    );
  });

  it('it should be able to list past date availability as false', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 30, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: '1',
      day: 30,
      month: 1,
      year: 2021,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});

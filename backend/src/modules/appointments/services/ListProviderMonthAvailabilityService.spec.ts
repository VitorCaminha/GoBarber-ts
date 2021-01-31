import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('it should be able to list the providers month availability', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 13, 0, 0),
    });

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

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 30, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '1',
      user_id: 'user_id',
      date: new Date(2021, 0, 31, 17, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: '1',
      month: 1,
      year: 2021,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 30, available: false },
        { day: 31, available: true },
        { day: 29, available: true },
      ]),
    );
  });
});

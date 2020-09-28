import AppError from '../err/AppError';
import FakeCodeIdProvider from '../providers/fakes/FakeCodeIdProvider';
import FakeLinkRepository from '../repositories/fakes/FakeLinkRepository';
import CreateLinkService from './CreateLinkService';

describe('create a short link', () => {
  let fakeLinkRepository: FakeLinkRepository;
  let fakeCodeIdProvier: FakeCodeIdProvider;
  let createLink: CreateLinkService;

  beforeEach(() => {
    fakeLinkRepository = new FakeLinkRepository();
    fakeCodeIdProvier = new FakeCodeIdProvider();
    createLink = new CreateLinkService(fakeLinkRepository, fakeCodeIdProvier);
  });
  it('should be able to create a short link', async () => {
    const link = await createLink.execute({
      link: 'https://www.google.com',
      code: 'codeExemple',
    });

    expect(link.originLink).toBe('https://www.google.com');
    expect(link.codeLink).toBe('codeExemple');
  });

  it('should not be able to create a short link if with same codeLink', async () => {
    await createLink.execute({
      link: 'https://www.google.com',
      code: 'duplicateCode',
    });

    await expect(
      createLink.execute({
        link: 'https://www.google.com',
        code: 'duplicateCode',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a short link without a codeLink', async () => {
    const link = await createLink.execute({
      link: 'https://www.google.com',
    });

    expect(link.originLink).toBe('https://www.google.com');
    expect(link.codeLink).toBe('fakECoDe');
  });

  it('should be able to create a short link without a formated http link but your origin link has been formated', async () => {
    const link = await createLink.execute({
      link: 'www.google.com',
    });

    expect(link.originLink).toBe('http://www.google.com');
  });

  it('should not be able to create a short link with a invalid link', async () => {
    await expect(
      createLink.execute({
        link: 'invalidexemplelink',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createLink.execute({
        link: 'www.invalidexemplelink',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createLink.execute({
        link: 'http://www.invalidexemplelink',
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createLink.execute({
        link: 'http://invalidexemplelink',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

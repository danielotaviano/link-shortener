import { v4 } from 'uuid';
import shortid from 'shortid';

// error
class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message?: string, statusCode?: number) {
    Object.assign(this, { message, statusCode });
  }
}

// Entitie
interface ILink {
  id?: string;
  originLink: string;
  codeLink: string;
}

class Link {
  public readonly id: string;
  public readonly originLink: string;
  public readonly codeLink: string;

  constructor({ originLink, id, codeLink }: ILink) {
    Object.assign(this, { originLink, id, codeLink });

    if (!id) {
      this.id = v4();
    }
  }
}

// DTOS

interface ICreateLinkDTO {
  originLink: string;
  codeLink?: string;
}

// Repository

interface ILinkRepository {
  create(data: ICreateLinkDTO): Promise<Link>;
  findByCodeLink(codeLink: string): Promise<Link | undefined>;
}

class FakeLinkRepository implements ILinkRepository {
  private links: Link[] = [];
  public async create({ originLink, codeLink }: ICreateLinkDTO): Promise<Link> {
    const link = new Link({ codeLink, originLink });

    this.links.push(link);

    return link;
  }

  public async findByCodeLink(codeLink: string): Promise<Link | undefined> {
    const link = this.links.find(link => link.codeLink === codeLink);

    return link;
  }
}

// Providers
interface ICodeIdProvider {
  create(): Promise<string>;
}

class FakeCodeIdProvider implements ICodeIdProvider {
  public async create(): Promise<string> {
    return 'fakECoDe';
  }
}

// Utius
function isValidUrl(url: string): boolean {
  const isValid = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return isValid !== null;
}

// Service
interface IRequest {
  link: string;
  code?: string;
}

class CreateLinkService {
  constructor(
    private linkRepository: ILinkRepository,
    private codeIdProvider: ICodeIdProvider,
  ) {}

  public async execute({ link, code }: IRequest): Promise<Link> {
    let codeLink: string = code;
    let originLink: string = link;

    const isUrl = isValidUrl(originLink);

    if (!isUrl) {
      throw new AppError('This link is not valid');
    }

    if (!codeLink) {
      codeLink = await this.codeIdProvider.create();
    }

    const existingLinkWithSameCode = await this.linkRepository.findByCodeLink(
      code,
    );

    if (existingLinkWithSameCode) {
      throw new AppError('This codeLink is already in use');
    }

    const regExp = new RegExp('^(http|https)://', 'i');

    const isOriginLinkAHttpFormated = regExp.test(originLink);

    if (!isOriginLinkAHttpFormated) {
      originLink = `http://${originLink}`;
    }

    const newLink = await this.linkRepository.create({
      originLink,
      codeLink,
    });

    return newLink;
  }
}

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

    expect(link).toHaveProperty('id');

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

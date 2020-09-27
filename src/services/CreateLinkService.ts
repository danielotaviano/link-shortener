import Link from '../entities/Link';
import AppError from '../err/AppError';
import ICodeIdProvider from '../providers/models/ICodeIdProvider';
import ILinkRepository from '../repositories/ILinkRepository';
import isValidUrl from '../utils/isValidUrl';

interface IRequest {
  link: string;
  code?: string;
}

export default class CreateLinkService {
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

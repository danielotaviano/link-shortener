import { inject, injectable } from 'tsyringe';
import AppError from '../err/AppError';
import Link from '../infra/typeorm/entities/Link';
import ICodeIdProvider from '../providers/models/ICodeIdProvider';
import ILinkRepository from '../repositories/ILinkRepository';
import isValidUrl from '../utils/isValidUrl';

interface IRequest {
  link: string;
  code?: string;
}

@injectable()
export default class CreateLinkService {
  constructor(
    @inject('LinkRepository')
    private linkRepository: ILinkRepository,
    @inject('CodeIdProvider')
    private codeIdProvider: ICodeIdProvider,
  ) {}

  public async execute({ link, code }: IRequest): Promise<Link> {
    let codeLink = code;
    let originLink: string = link;

    const isUrl = isValidUrl(originLink);

    if (!isUrl) {
      throw new AppError('This link is not valid');
    }

    if (!codeLink) {
      codeLink = await this.codeIdProvider.create();
    }

    const existingLinkWithSameCode = await this.linkRepository.findByCodeLink(
      codeLink,
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

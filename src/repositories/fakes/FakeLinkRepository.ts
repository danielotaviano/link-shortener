import ICreateLinkDTO from '../../dtos/ICreateLinkDTO';
import Link from '../../entities/Link';
import ILinkRepository from '../ILinkRepository';

export default class FakeLinkRepository implements ILinkRepository {
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

import ICreateLinkDTO from '../dtos/ICreateLinkDTO';
import Link from '../entities/Link';

export default interface ILinkRepository {
  create(data: ICreateLinkDTO): Promise<Link>;
  findByCodeLink(codeLink: string): Promise<Link | undefined>;
}

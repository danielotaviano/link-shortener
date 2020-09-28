import { getMongoRepository, MongoRepository } from 'typeorm';
import ICreateLinkDTO from '../../../dtos/ICreateLinkDTO';
import ILinkRepository from '../../../repositories/ILinkRepository';
import Link from '../entities/Link';

export default class LinksRepository implements ILinkRepository {
  private mongoManager: MongoRepository<Link>;
  constructor() {
    this.mongoManager = getMongoRepository(Link);
  }

  public async create({ codeLink, originLink }: ICreateLinkDTO): Promise<Link> {
    const link = this.mongoManager.create({ codeLink, originLink });
    await this.mongoManager.save(link);

    return link;
  }

  public async findByCodeLink(codeLink: string): Promise<Link | undefined> {
    const link = await this.mongoManager.findOne({ where: { codeLink } });

    return link;
  }
}

import { container } from 'tsyringe';
import LinksRepository from '../infra/typeorm/repositories/LinksRepository';
import CodeIdProvider from '../providers/implementations/CodeIdProvider';

container.registerSingleton('LinkRepository', LinksRepository);

container.registerSingleton('CodeIdProvider', CodeIdProvider);

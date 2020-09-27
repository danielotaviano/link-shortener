import ICodeIdProvider from '../models/ICodeIdProvider';

export default class FakeCodeIdProvider implements ICodeIdProvider {
  public async create(): Promise<string> {
    return 'fakECoDe';
  }
}

import shortid from 'shortid';
import ICodeIdProvider from '../models/ICodeIdProvider';

export default class CodeIdProvider implements ICodeIdProvider {
  public async create(): Promise<string> {
    const codeId = shortid();
    return codeId;
  }
}

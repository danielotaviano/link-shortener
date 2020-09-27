import { v4 } from 'uuid';

interface ILink {
  id?: string;
  originLink: string;
  codeLink: string;
}

export default class Link {
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

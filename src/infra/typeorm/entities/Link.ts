import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('links')
export default class Link {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  originLink: string;

  @Column()
  codeLink: string;
}

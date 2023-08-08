import { Column, Entity } from 'typeorm';

@Entity('fruit', { schema: 'public' })
export class FruitEntity {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;
  @Column('character varying', { name: 'name', nullable: false, length: 50 })
  name: string;
  @Column('decimal', { name: 'weight', nullable: true })
  weight: number;
}

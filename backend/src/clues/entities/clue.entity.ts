import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Case } from '../../cases/entities/case.entity'; 

@Entity('clues')
export class Clue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  url!: string;

  @CreateDateColumn()
  createdAt!: Date;


  @ManyToOne(() => Case, (caseEntity) => caseEntity.clues, { onDelete: 'CASCADE' })
  case!: Case;
}
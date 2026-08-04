import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, RelationId } from 'typeorm';
import { Case } from '../../cases/entities/case.entity'; 

@Entity('clues')
export class Clue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  // Изменено на 'mediumtext'/'longtext' для MySQL, в PostgreSQL это автоматически останется как text.
  // Это гарантирует, что тяжелые скриншоты высокого разрешения не будут обрезаться базой.
  @Column({ type: 'text' })
url!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Добавляем явное поле caseId, чтобы TypeORM мог легко сопоставлять UUID из вашего CreateClueDto
  @Column({ type: 'uuid' })
  caseId!: string;

  @ManyToOne(() => Case, (caseEntity) => caseEntity.clues, { onDelete: 'CASCADE' })
  case!: Case;
}

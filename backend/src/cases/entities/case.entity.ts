import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Clue } from '../../clues/entities/clue.entity';
@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    title!: string;

    @CreateDateColumn()
    createdAt!: Date;
    // Означает, что это поле может быть пустым (null
     @Column('text', { array: true, nullable: true })
  tags?: string[];

    
    @OneToMany(() => Clue, (clue) => clue.case)
    clues!: Clue[];
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PermissionRequest } from './permission-request.entity';
import { AttendanceRecord } from './attendance-record.entity';

@Entity('offices')
export class Office {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description!: string | null;

  @Column({ type: 'bigint', nullable: true })
  parentId!: string | null;

  @ManyToOne(() => Office, (office) => office.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parentId' })
  parent!: Office | null;

  @OneToMany(() => Office, (office) => office.parent)
  children!: Office[];

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @OneToMany(() => User, (user) => user.office)
  users!: User[];

  @OneToMany(() => PermissionRequest, (request) => request.office)
  permissionRequests!: PermissionRequest[];

  @OneToMany(() => AttendanceRecord, (record) => record.office)
  attendanceRecords!: AttendanceRecord[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

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
import { Office } from './office.entity';
import { PermissionRequest } from './permission-request.entity';
import { AttendanceRecord } from './attendance-record.entity';
import { UserRole } from './user-role.entity';
import { UserSchedule } from './user-schedule.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  firstName!: string;

  @Column({ type: 'varchar', length: 120 })
  lastName!: string;

  @Column({ type: 'varchar', length: 8, unique: true })
  dni!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender!: string | null;

  @Column({ type: 'date', nullable: true })
  birthDate!: string | null;

  @Column({ type: 'bigint' })
  officeId!: string;

  @ManyToOne(() => Office, (office) => office.users, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'officeId' })
  office!: Office;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @OneToMany(() => PermissionRequest, (request) => request.user)
  permissionRequests!: PermissionRequest[];

  @OneToMany(() => PermissionRequest, (request) => request.reviewer)
  reviewedRequests!: PermissionRequest[];

  @OneToMany(() => AttendanceRecord, (record) => record.user)
  attendanceRecords!: AttendanceRecord[];

  @OneToMany(() => UserRole, (item) => item.user)
  userRoles!: UserRole[];

  @OneToMany(() => UserSchedule, (item) => item.user)
  userSchedules!: UserSchedule[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

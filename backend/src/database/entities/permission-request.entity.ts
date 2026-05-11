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
import { Office } from './office.entity';
import { PermissionType } from './permission-type.entity';
import { AttendanceRecord } from './attendance-record.entity';

export enum PermissionRequestStatus {
  PENDIENTE = 'Pendiente',
  AUTORIZADO = 'Autorizado',
  RECHAZADO = 'Rechazado',
  ANULADO = 'Anulado',
}

@Entity('permission_requests')
export class PermissionRequest {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  code!: string | null;

  @Column({ type: 'bigint' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.permissionRequests, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'bigint', nullable: true })
  officeId!: string | null;

  @ManyToOne(() => Office, (office) => office.permissionRequests, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'officeId' })
  office!: Office | null;

  @Column({ type: 'bigint' })
  permissionTypeId!: string;

  @ManyToOne(() => PermissionType, (permissionType) => permissionType.permissionRequests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'permissionTypeId' })
  permissionType!: PermissionType;

  @Column({ type: 'date' })
  requestDate!: string;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'enum',
    enum: PermissionRequestStatus,
    default: PermissionRequestStatus.PENDIENTE,
  })
  status!: PermissionRequestStatus;

  @Column({ type: 'bigint', nullable: true })
  reviewedBy!: string | null;

  @ManyToOne(() => User, (user) => user.reviewedRequests, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reviewedBy' })
  reviewer!: User | null;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt!: Date | null;

  @OneToMany(() => AttendanceRecord, (record) => record.permissionRequest)
  attendanceRecords!: AttendanceRecord[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Office } from './office.entity';
import { PermissionRequest } from './permission-request.entity';

export enum AttendanceMarkType {
  ENTRADA = 'Entrada',
  SALIDA = 'Salida',
  SALIDA_PAPELETA = 'Salida de papeleta',
  RETORNO_PAPELETA = 'Retorno de papeleta',
}

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.attendanceRecords, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'bigint', nullable: true })
  officeId!: string | null;

  @ManyToOne(() => Office, (office) => office.attendanceRecords, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'officeId' })
  office!: Office | null;

  @Column({ type: 'timestamp' })
  markDatetime!: Date;

  @Column({
    type: 'enum',
    enum: AttendanceMarkType,
  })
  markType!: AttendanceMarkType;

  @Column({ type: 'bigint', nullable: true })
  permissionRequestId!: string | null;

  @ManyToOne(() => PermissionRequest, (request) => request.attendanceRecords, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'permissionRequestId' })
  permissionRequest!: PermissionRequest | null;

  @CreateDateColumn()
  createdAt!: Date;
}

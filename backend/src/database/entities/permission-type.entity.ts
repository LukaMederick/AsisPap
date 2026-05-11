import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionRequest } from './permission-request.entity';

@Entity('permission_types')
export class PermissionType {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color!: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  icon!: string | null;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @OneToMany(() => PermissionRequest, (request) => request.permissionType)
  permissionRequests!: PermissionRequest[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

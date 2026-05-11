import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Schedule } from './schedule.entity';

@Entity('user_schedules')
export class UserSchedule {
  @PrimaryColumn({ type: 'bigint' })
  userId!: string;

  @PrimaryColumn({ type: 'bigint' })
  scheduleId!: string;

  @PrimaryColumn({ type: 'date' })
  validFrom!: string;

  @Column({ type: 'date', nullable: true })
  validTo!: string | null;

  @ManyToOne(() => User, (user) => user.userSchedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Schedule, (schedule) => schedule.userSchedules, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'scheduleId' })
  schedule!: Schedule;
}

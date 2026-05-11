import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreDataController } from './core-data.controller';
import { CoreDataService } from './core-data.service';
import { Office } from '../database/entities/office.entity';
import { User } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { Permission } from '../database/entities/permission.entity';
import { Schedule } from '../database/entities/schedule.entity';
import { PermissionType } from '../database/entities/permission-type.entity';
import { PermissionRequest } from '../database/entities/permission-request.entity';
import { AttendanceRecord } from '../database/entities/attendance-record.entity';
import { UserRole } from '../database/entities/user-role.entity';
import { RolePermission } from '../database/entities/role-permission.entity';
import { UserSchedule } from '../database/entities/user-schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Office,
      User,
      Role,
      Permission,
      Schedule,
      PermissionType,
      PermissionRequest,
      AttendanceRecord,
      UserRole,
      RolePermission,
      UserSchedule,
    ]),
  ],
  controllers: [CoreDataController],
  providers: [CoreDataService],
})
export class CoreDataModule {}

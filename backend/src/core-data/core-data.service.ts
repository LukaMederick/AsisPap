import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
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

@Injectable()
export class CoreDataService {
  constructor(
    @InjectRepository(Office) private readonly officeRepo: Repository<Office>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(Schedule) private readonly scheduleRepo: Repository<Schedule>,
    @InjectRepository(PermissionType)
    private readonly permissionTypeRepo: Repository<PermissionType>,
    @InjectRepository(PermissionRequest)
    private readonly permissionRequestRepo: Repository<PermissionRequest>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepo: Repository<AttendanceRecord>,
    @InjectRepository(UserRole) private readonly userRoleRepo: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
    @InjectRepository(UserSchedule)
    private readonly userScheduleRepo: Repository<UserSchedule>,
  ) {}

  private async updateOne<T extends { id: string }>(
    repo: Repository<T>,
    id: string,
    payload: DeepPartial<T>,
  ): Promise<T> {
    const current = await repo.findOne({ where: { id } as never });
    if (!current) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }
    return repo.save(repo.merge(current, payload));
  }

  async findAllOffices() {
    return this.officeRepo.find({ relations: ['parent'], order: { createdAt: 'DESC' } });
  }
  async createOffice(payload: DeepPartial<Office>) {
    return this.officeRepo.save(this.officeRepo.create(payload));
  }
  async updateOffice(id: string, payload: DeepPartial<Office>) {
    return this.updateOne(this.officeRepo, id, payload);
  }
  async deleteOffice(id: string) {
    return this.officeRepo.delete(id);
  }

  async findAllUsers() {
    return this.userRepo.find({ relations: ['office'], order: { createdAt: 'DESC' } });
  }
  async createUser(payload: DeepPartial<User>) {
    return this.userRepo.save(this.userRepo.create(payload));
  }
  async updateUser(id: string, payload: DeepPartial<User>) {
    return this.updateOne(this.userRepo, id, payload);
  }
  async deleteUser(id: string) {
    return this.userRepo.delete(id);
  }

  async findAllRoles() {
    return this.roleRepo.find({ order: { createdAt: 'DESC' } });
  }
  async createRole(payload: DeepPartial<Role>) {
    return this.roleRepo.save(this.roleRepo.create(payload));
  }
  async updateRole(id: string, payload: DeepPartial<Role>) {
    return this.updateOne(this.roleRepo, id, payload);
  }
  async deleteRole(id: string) {
    return this.roleRepo.delete(id);
  }

  async findAllPermissions() {
    return this.permissionRepo.find({ order: { createdAt: 'DESC' } });
  }
  async createPermission(payload: DeepPartial<Permission>) {
    return this.permissionRepo.save(this.permissionRepo.create(payload));
  }
  async updatePermission(id: string, payload: DeepPartial<Permission>) {
    return this.updateOne(this.permissionRepo, id, payload);
  }
  async deletePermission(id: string) {
    return this.permissionRepo.delete(id);
  }

  async findAllSchedules() {
    return this.scheduleRepo.find({ order: { createdAt: 'DESC' } });
  }
  async createSchedule(payload: DeepPartial<Schedule>) {
    return this.scheduleRepo.save(this.scheduleRepo.create(payload));
  }
  async updateSchedule(id: string, payload: DeepPartial<Schedule>) {
    return this.updateOne(this.scheduleRepo, id, payload);
  }
  async deleteSchedule(id: string) {
    return this.scheduleRepo.delete(id);
  }

  async findAllPermissionTypes() {
    return this.permissionTypeRepo.find({ order: { createdAt: 'DESC' } });
  }
  async createPermissionType(payload: DeepPartial<PermissionType>) {
    return this.permissionTypeRepo.save(this.permissionTypeRepo.create(payload));
  }
  async updatePermissionType(id: string, payload: DeepPartial<PermissionType>) {
    return this.updateOne(this.permissionTypeRepo, id, payload);
  }
  async deletePermissionType(id: string) {
    return this.permissionTypeRepo.delete(id);
  }

  async findAllPermissionRequests() {
    return this.permissionRequestRepo.find({
      relations: ['user', 'office', 'permissionType', 'reviewer'],
      order: { createdAt: 'DESC' },
    });
  }
  async createPermissionRequest(payload: DeepPartial<PermissionRequest>) {
    return this.permissionRequestRepo.save(this.permissionRequestRepo.create(payload));
  }
  async updatePermissionRequest(id: string, payload: DeepPartial<PermissionRequest>) {
    return this.updateOne(this.permissionRequestRepo, id, payload);
  }
  async deletePermissionRequest(id: string) {
    return this.permissionRequestRepo.delete(id);
  }

  async findAllAttendanceRecords() {
    return this.attendanceRepo.find({
      relations: ['user', 'office', 'permissionRequest'],
      order: { createdAt: 'DESC' },
    });
  }
  async createAttendanceRecord(payload: DeepPartial<AttendanceRecord>) {
    return this.attendanceRepo.save(this.attendanceRepo.create(payload));
  }
  async updateAttendanceRecord(id: string, payload: DeepPartial<AttendanceRecord>) {
    return this.updateOne(this.attendanceRepo, id, payload);
  }
  async deleteAttendanceRecord(id: string) {
    return this.attendanceRepo.delete(id);
  }

  async listUserRoles() {
    return this.userRoleRepo.find({ relations: ['user', 'role'] });
  }
  async createUserRole(payload: DeepPartial<UserRole>) {
    return this.userRoleRepo.save(this.userRoleRepo.create(payload));
  }
  async deleteUserRole(userId: string, roleId: string) {
    return this.userRoleRepo.delete({ userId, roleId });
  }

  async listRolePermissions() {
    return this.rolePermissionRepo.find({ relations: ['role', 'permission'] });
  }
  async createRolePermission(payload: DeepPartial<RolePermission>) {
    return this.rolePermissionRepo.save(this.rolePermissionRepo.create(payload));
  }
  async deleteRolePermission(roleId: string, permissionId: string) {
    return this.rolePermissionRepo.delete({ roleId, permissionId });
  }

  async listUserSchedules() {
    return this.userScheduleRepo.find({ relations: ['user', 'schedule'] });
  }
  async createUserSchedule(payload: DeepPartial<UserSchedule>) {
    return this.userScheduleRepo.save(this.userScheduleRepo.create(payload));
  }
  async deleteUserSchedule(userId: string, scheduleId: string, validFrom: string) {
    return this.userScheduleRepo.delete({ userId, scheduleId, validFrom });
  }
}

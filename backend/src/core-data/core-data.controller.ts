import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CoreDataService } from './core-data.service';
import { CreatePermissionRequestDto } from './dto/create-permission-request.dto';

@Controller('api')
export class CoreDataController {
  constructor(private readonly coreDataService: CoreDataService) {}

  @Get('offices')
  getOffices() {
    return this.coreDataService.findAllOffices();
  }
  @Post('offices')
  createOffice(@Body() body: Record<string, unknown>) {
    return this.coreDataService.createOffice(body);
  }
  @Patch('offices/:id')
  updateOffice(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.coreDataService.updateOffice(id, body);
  }
  @Delete('offices/:id')
  deleteOffice(@Param('id') id: string) {
    return this.coreDataService.deleteOffice(id);
  }

  @Get('users')
  getUsers() {
    return this.coreDataService.findAllUsers();
  }
  @Post('users')
  createUser(@Body() body: Record<string, unknown>) {
    return this.coreDataService.createUser(body);
  }
  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.coreDataService.updateUser(id, body);
  }
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.coreDataService.deleteUser(id);
  }

  @Get('roles')
  getRoles() {
    return this.coreDataService.findAllRoles();
  }
  @Post('roles')
  createRole(@Body() body: Record<string, unknown>) {
    return this.coreDataService.createRole(body);
  }
  @Patch('roles/:id')
  updateRole(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.coreDataService.updateRole(id, body);
  }
  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.coreDataService.deleteRole(id);
  }

  @Get('permissions')
  getPermissions() {
    return this.coreDataService.findAllPermissions();
  }
  @Post('permissions')
  createPermission(@Body() body: Record<string, unknown>) {
    return this.coreDataService.createPermission(body);
  }
  @Patch('permissions/:id')
  updatePermission(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.coreDataService.updatePermission(id, body);
  }
  @Delete('permissions/:id')
  deletePermission(@Param('id') id: string) {
    return this.coreDataService.deletePermission(id);
  }

  @Get('schedules')
  getSchedules() {
    return this.coreDataService.findAllSchedules();
  }
  @Post('schedules')
  createSchedule(@Body() body: Record<string, unknown>) {
    return this.coreDataService.createSchedule(body);
  }
  @Patch('schedules/:id')
  updateSchedule(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.coreDataService.updateSchedule(id, body);
  }
  @Delete('schedules/:id')
  deleteSchedule(@Param('id') id: string) {
    return this.coreDataService.deleteSchedule(id);
  }

  @Get('permission-types')
  getPermissionTypes() {
    return this.coreDataService.findAllPermissionTypes();
  }
  @Post('permission-types')
  createPermissionType(@Body() body: Record<string, unknown>) {
    return this.coreDataService.createPermissionType(body);
  }
  @Patch('permission-types/:id')
  updatePermissionType(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.coreDataService.updatePermissionType(id, body);
  }
  @Delete('permission-types/:id')
  deletePermissionType(@Param('id') id: string) {
    return this.coreDataService.deletePermissionType(id);
  }

  @Get('permission-requests')
  getPermissionRequests() {
    return this.coreDataService.findAllPermissionRequests();
  }
  @Post('permission-requests')
  createPermissionRequest(@Body() body: CreatePermissionRequestDto) {
    const payload = {
      ...body,
      userId: String(body.userId),
      permissionTypeId: String(body.permissionTypeId),
      officeId: body.officeId === null || body.officeId === undefined ? null : String(body.officeId),
    };
    return this.coreDataService.createPermissionRequest(payload);
  }
  @Patch('permission-requests/:id')
  updatePermissionRequest(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.coreDataService.updatePermissionRequest(id, body);
  }
  @Delete('permission-requests/:id')
  deletePermissionRequest(@Param('id') id: string) {
    return this.coreDataService.deletePermissionRequest(id);
  }

  @Get('attendance-records')
  getAttendanceRecords() {
    return this.coreDataService.findAllAttendanceRecords();
  }
  @Post('attendance-records')
  createAttendanceRecord(@Body() body: Record<string, unknown>) {
    return this.coreDataService.createAttendanceRecord(body);
  }
  @Patch('attendance-records/:id')
  updateAttendanceRecord(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.coreDataService.updateAttendanceRecord(id, body);
  }
  @Delete('attendance-records/:id')
  deleteAttendanceRecord(@Param('id') id: string) {
    return this.coreDataService.deleteAttendanceRecord(id);
  }

  @Get('user-roles')
  getUserRoles() {
    return this.coreDataService.listUserRoles();
  }
  @Post('user-roles')
  createUserRole(@Body() body: { userId: string; roleId: string }) {
    return this.coreDataService.createUserRole(body);
  }
  @Delete('user-roles/:userId/:roleId')
  deleteUserRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.coreDataService.deleteUserRole(userId, roleId);
  }

  @Get('role-permissions')
  getRolePermissions() {
    return this.coreDataService.listRolePermissions();
  }
  @Post('role-permissions')
  createRolePermission(@Body() body: { roleId: string; permissionId: string }) {
    return this.coreDataService.createRolePermission(body);
  }
  @Delete('role-permissions/:roleId/:permissionId')
  deleteRolePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.coreDataService.deleteRolePermission(roleId, permissionId);
  }

  @Get('user-schedules')
  getUserSchedules() {
    return this.coreDataService.listUserSchedules();
  }
  @Post('user-schedules')
  createUserSchedule(
    @Body() body: { userId: string; scheduleId: string; validFrom: string; validTo?: string },
  ) {
    return this.coreDataService.createUserSchedule(body);
  }
  @Delete('user-schedules/:userId/:scheduleId/:validFrom')
  deleteUserSchedule(
    @Param('userId') userId: string,
    @Param('scheduleId') scheduleId: string,
    @Param('validFrom') validFrom: string,
  ) {
    return this.coreDataService.deleteUserSchedule(userId, scheduleId, validFrom);
  }
}

import { UsersSchemaClass } from '../users.schema';
import { Gender, Nation, Role } from '../users.type';

export const userMock: UsersSchemaClass = {
  name: 'name',
  gender: Gender.MALE,
  nation: Nation.VIET_NAM,
  role: Role.MANAGER,
  point: 0,
  active: true,
  isDeleted: false,
};

export const OBJECT_ID_MOCK = '65067925c36808ac1933aaab';

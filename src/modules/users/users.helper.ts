import { UsersSchemaClass } from './users.schema';
import { Gender, Nation, Role } from './users.type';
// import {
//   MappingGenderAdditionalPoint,
//   MappingNationAdditionalPoint,
//   MappingRoleAdditionalPoint,
// } from './users.type';

export class UserHelpers {
  static calculatePoints(
    point: number,
    user: Pick<UsersSchemaClass, 'gender' | 'nation' | 'role'>,
  ) {
    const { gender, nation, role } = user;
    let additionalPoint = 0;
    if (gender === Gender.FEMALE) {
      additionalPoint += 1;
    }
    if (nation === Nation.VIET_NAM) {
      additionalPoint += 1;
    }
    if (role === Role.MANAGER) {
      additionalPoint += 1;
    }
    // const additionalPoint =
    //   (MappingRoleAdditionalPoint.get(role) || 0) +
    //   (MappingGenderAdditionalPoint.get(gender) || 0) +
    //   (MappingNationAdditionalPoint.get(nation) || 0);

    return point + additionalPoint;
  }
}

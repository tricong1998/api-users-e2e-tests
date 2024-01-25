export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  ANOTHER = 'another',
}

export enum Role {
  MANAGER = 'manager',
  MEMBER = 'member',
}

export enum Nation {
  VIET_NAM = 'viet-nam',
  ANOTHER = 'another',
}

// export const MappingRoleAdditionalPoint = new Map<Role, number>([[Role.MANAGER, 1]]);
// export const MappingGenderAdditionalPoint = new Map<Gender, number>([[Gender.FEMALE, 1]]);
// export const MappingNationAdditionalPoint = new Map<Nation, number>([[Nation.VIET_NAM, 1]]);

export const FREEZE_TIME = 2592000000; // 1000 * 60 * 60 * 24 * 30 => 30 days

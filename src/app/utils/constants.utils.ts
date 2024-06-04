export const ROLES = { ADMIN: 'admin', USER: 'user', RECLUITER: 'recluiter' };
export const PERMISSIONS = {
  // CATALOG
  MANAGE_CATALOG: 'manage:catalog',
  CREATE_CATALOG: 'create:catalog',
  READ_CATALOG: 'read:catalog',
  UPDATE_CATALOG: 'update:catalog',
  DELETE_CATALOG: 'delete:catalog',
  // USER
  MANAGE_USER: 'manage:user',
  CREATE_USER: 'create:user',
  READ_USER: 'read:user',
  UPDATE_USER: 'update:user',
  DELETE_USER: 'delete:user',
  // PERSON
  MANAGE_PERSON: 'manage:person',
  CREATE_PERSON: 'create:person',
  READ_PERSON: 'read:person',
  UPDATE_PERSON: 'update:person',
  DELETE_PERSON: 'delete:person',
  // ROLE
  MANAGE_ROLE: 'manage:role',
  CREATE_ROLE: 'create:role',
  READ_ROLE: 'read:role',
  UPDATE_ROLE: 'update:role',
  DELETE_ROLE: 'delete:role',
  // PERMISSION
  MANAGE_PERMISSION: 'manage:permission',
  CREATE_PERMISSION: 'create:permission',
  READ_PERMISSION: 'read:permission',
  UPDATE_PERMISSION: 'update:permission',
  DELETE_PERMISSION: 'delete:permission',
  // UNLOCK REQUEST
  READ_UNLOCK_REQUEST: 'read:unlock-request',
  UNLOCK_USER: 'unlock:user',
  // JOB APPLICATION
  MANAGE_APPLICATION: 'manage:application',
  CREATE_APPLICATION: 'create:application',
  READ_APPLICATION: 'read:application',
  UPDATB_APPLICATION: 'update:application',
  DELETE_APPLICATION: 'delete:application',
  // CANDIDATE
  MANAGE_CANDIDATE: 'manage:candidate',
  CREATE_CANDIDATE: 'create:candidate',
  READ_CANDIDATE: 'read:candidate',
  UPDATE_CANDIDATE: 'update:candidate',
  DELETE_CANDIDATE: 'delete:candidate',
  // JOB
  MANAGE_JOB: 'manage:job',
  CREATE_JOB: 'create:job',
  READ_JOB: 'read:job',
  UPDATE_JOB: 'update:job',
  DELETE_JOB: 'delete:job',
  // COMPANY
  MANAGE_COMPANY: 'manage:company',
  CREATE_COMPANY: 'create:company',
  READ_COMPANY: 'read:company',
  UPDATE_COMPANY: 'update:company',
  DELETE_COMPANY: 'delete:company',
};

export const LOCAL_STORAGE = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  PERSON: 'person',
  COMPANY: 'company',
};

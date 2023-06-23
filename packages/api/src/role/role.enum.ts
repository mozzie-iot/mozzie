// Note: roles below must exactly match those listed in role.entity.ts

export enum RoleEnum {
  // USERS
  user_read = 'user_read',
  user_write = 'user_write',
  user_delete = 'user_delete',
  // API KEYS
  api_key_read = 'api_key_read',
  api_key_write = 'api_key_write',
  api_key_delete = 'api_key_delete',
  // ROLES
  role_read = 'role_read',
  role_write = 'role_write',
  role_delete = 'role_delete',
  // NODES
  node_read = 'node_read',
  node_write = 'node_write',
}

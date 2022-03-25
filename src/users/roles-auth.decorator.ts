import { SetMetadata } from "@nestjs/common"

export type RoleType='ADMIN' | 'USER'

export const RoleKey='roles'

export const Roles=(role:RoleType)=>SetMetadata(RoleKey,role)
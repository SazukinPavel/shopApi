import { SetMetadata } from "@nestjs/common"

export const RoleKey='roles'

export const Roles=(role:string)=>SetMetadata(RoleKey,role)
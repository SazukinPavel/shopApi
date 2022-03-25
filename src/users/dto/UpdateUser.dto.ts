import { RoleType } from "../roles-auth.decorator";

export interface UpdateUserDto{
    role?:RoleType
    name?:string
    password?:string
    id?:string
}
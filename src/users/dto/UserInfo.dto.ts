import { RoleType } from "../roles-auth.decorator"

export default interface UserInfoDto{
    name:string
    role:RoleType
    basketItemCount:number
    id:string
}
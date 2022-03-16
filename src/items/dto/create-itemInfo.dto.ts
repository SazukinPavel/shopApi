import { Item } from "src/entitys/item.entity";

export default interface CreateItemInfoDto{
    name:string
    description:string
    item?:Item
}
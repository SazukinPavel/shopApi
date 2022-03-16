import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn} from "typeorm";
import { Item } from "./item.entity";


@Entity('Categories')
export class Category{
    @PrimaryColumn()
    id:string

    @Column({unique:true})
    name:string

    @OneToMany(()=>Item,(item)=>item.id)
    items:Item[]
}
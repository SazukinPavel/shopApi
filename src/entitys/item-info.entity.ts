import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Item } from "./item.entity";

@Entity("ItemInfos")
export class ItemInfo{

    @PrimaryColumn()
    id:string

    @Column()
    name:string

    @Column()
    description:string

    @ManyToOne(()=>Item,(item)=>item.id)
    @JoinColumn()
    item:Item | string

}
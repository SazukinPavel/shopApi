import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import Basket from "./basket.entity";
import { Item } from "./item.entity";

@Entity('BasketItems')
export default class BasketItem{
    @PrimaryColumn()
    id:string

    @ManyToOne(()=>Basket,(basket)=>basket.id)
    @JoinColumn()
    basket:Basket | string

    @ManyToOne(()=>Item,(item)=>item.id)
    @JoinColumn()
    item:Item | string

    @Column({default:1})
    kolvo:number

}
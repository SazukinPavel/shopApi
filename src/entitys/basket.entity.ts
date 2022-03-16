import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import BasketItem from "./basket-item.entity";
import User from "./user.entity";

@Entity('Basket')
export default class Basket{
    @PrimaryColumn()
    id:string

    @OneToOne(()=>User,(user)=>user.id)
    @JoinColumn()
    user:User | string

    @OneToMany(()=>BasketItem,(basketItem)=>basketItem.id)
    @JoinColumn()
    items:BasketItem[]
    

}
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import BasketItem from "./basket-item.entity";
import Basket from "./basket.entity";
import { Category } from "./category.entity";
import { ItemInfo } from "./item-info.entity";

@Entity("Items")
export class Item{

    @PrimaryColumn()
    id:string

    @Column()
    name:string

    @Column()
    price:number

    @Column()
    img:string

    @CreateDateColumn()
    createDate?:Date

    @OneToMany((type)=>ItemInfo,(inf)=>inf.id)
    infos?:ItemInfo[]

    @ManyToOne((type)=>Category,(category)=>category.id)
    @JoinColumn()
    category:Category

}


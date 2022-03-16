import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import Basket from "./basket.entity";

@Entity('Users')
export default class User{

    @PrimaryColumn('uuid')
    id:string

    @Column({unique:true})
    name:string

    @Column()
    password:string

    @Column()
    role:string

    @OneToOne(()=>Basket,basket=>basket.id)
    @JoinColumn()
    basket:Basket | string

}
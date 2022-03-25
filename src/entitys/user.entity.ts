import { RoleType } from "src/users/roles-auth.decorator";
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
    role:RoleType

    @OneToOne(()=>Basket,basket=>basket.id,{cascade:true})
    @JoinColumn()
    basket:Basket | string

}
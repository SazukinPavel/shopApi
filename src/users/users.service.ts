import { UpdateUserDto } from './dto/UpdateUser.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo, userInfo } from 'os';
import User from 'src/entitys/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { v4 } from 'uuid';
import BasketService from './basket.service';
import CreateUserDto from './dto/CreateUser.dto';
import UserInfoDto from './dto/UserInfo.dto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private users:Repository<User>,
    private basketService:BasketService,
    ){}


    createUser(dto:CreateUserDto){
        return this.users.save({...dto,role:"USER",id:v4()})
    }

    async deleteUserById(id:string){
        return this.users.delete({id})
    }

    findByNameUser(name:string){
        return this.users.findOne({where:{name}})
    }

    private findById(id:string){
        return this.users.findOne({where:{id}})
    }

    private async getUserWithItemCount(user:User):Promise<UserInfoDto>{
        const count=await this.basketService.getBasketItemCountByUser(user)
        return {basketItemCount:count,...user}
    }

    async getAllUserWithBasketItemCount(take:number=0,page:number=0){
        const options:FindManyOptions<User>={}
        if(page>0 && take>0){
            options.take=take
            options.skip=page*take
        }else if(take){
            options.take=take
        }
        const users=await this.users.find(options)
        return await Promise.all(users.map(user=>this.getUserWithItemCount(user)))
    }

    async getAllUsersCount(){
        return this.users.count()
    }

    updateUser(id:string,dto:UpdateUserDto){
        if(!id || !dto){
            throw new Error('Id or body is null')
        }
        return this.users.update(id,{...dto})
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entitys/user.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import CreateUserDto from './dto/CreateUser.dto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private users:Repository<User> ){}


    createUser(dto:CreateUserDto){
        return this.users.save({...dto,role:"USER",id:v4()})
    }

    deleteUserById(id:string){
        return this.users.delete({id})
    }

    findByNameUser(name:string){
        return this.users.findOne({where:{name}})
    }
    findById(id:string){
        return this.users.findOne({where:{id}})
    }
}

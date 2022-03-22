import {HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import CreateUserDto from "./dto/CreateUser.dto";
import {compare, hash} from 'bcryptjs'
import User from "src/entitys/user.entity";
import { UsersService } from "./users.service";

@Injectable()
export default class AuthService{

    constructor(private userService:UsersService,private jwtService:JwtService){}

    async login(dto:CreateUserDto){
        const user=await this.validateUser(dto)
        return {token:this.generateToken(user),user:{name:user.name,id:user.id,role:user.role}}
    }
    async registration(dto:CreateUserDto){
        const user=await this.userService.findByNameUser(dto.name)
        if(user){
            throw new HttpException('Пользователь с таким именем уже существует.',HttpStatus.BAD_REQUEST)
        }
        const hashPasswod=await hash(dto.password,5);
        const newUser=await this.userService.createUser({name:dto.name,password:hashPasswod})
        return {token:this.generateToken(newUser),user:{name:newUser.name,id:newUser.id,role:newUser.role}}
    }

    private async validateUser(dto:CreateUserDto){
        const user=await this.userService.findByNameUser(dto.name)
        if(!user){
            throw new UnauthorizedException('Такого пользователя не существует')
        }
        const passwordEquals=await compare(dto.password,user?.password)
        if(passwordEquals){
            return user
        }
        throw new UnauthorizedException('Неправильный пароль.')
    }

    private generateToken(user:User){
        const payload={id:user.id,name:user.name,role:user.role}
        return this.jwtService.sign(payload)       
    }
}
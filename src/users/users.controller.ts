import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, Param, ParseBoolPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import User from 'src/entitys/user.entity';
import JwtAuthGuard from './auth.guard';
import AuthService from './auth.service';
import BasketService from './basket.service';
import CreateBasketItemDto from './dto/CreateBasketItemDto';
import CreateUserDto from './dto/CreateUser.dto';
import { Roles } from './roles-auth.decorator';

@Controller('users')
export class UsersController {

    constructor(private authService:AuthService,
        private basketService:BasketService,
        private usersService:UsersService,
        ){}

    @Post('login')
    login(@Body() dto:CreateUserDto){
        return this.authService.login(dto)
    }

    @Post('register')
    register(@Body() dto:CreateUserDto){
        return this.authService.registration(dto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('checkToken')
    checkToken(@Req() req){
        return req.user
    }

    @UseGuards(JwtAuthGuard)
    @Roles('USER')
    @Get('basket')
    async getBasketItems(@Req() req,@Query('limit') limit:number,@Query('allPrice') allPrice:boolean,@Query('page') page:number,@Query('count') count:boolean){
        if(allPrice){
            return this.basketService.getAllPriceUserBasket(req.user as User)
        }
        if(count){
            return this.basketService.getBasketItemCountByUser(req.user as User)
        }
        return this.basketService.getBasketItemsByUser(req.user as User,limit,page)
    }

    @UseGuards(JwtAuthGuard)
    @Roles('USER')
    @Post('basket')
    addItemToBasket(@Req() req,@Body() dto:CreateBasketItemDto){
        return this.basketService.addToBasket(req.user as User,dto)
    }

    @UseGuards(JwtAuthGuard)
    @Roles('USER')
    @Get('basket/:id')
    getBasketItemByItemId(@Param('id') id:string,@Req() req,@Query('kolvo',ParseBoolPipe) kolvo:boolean){
        if(kolvo){
            return this.basketService.getBasketItemByItemIdKolvo(req.user as User,id)
        }
        return this.basketService.getBasketItemByItemId(req.user as User,id)
    }

    @UseGuards(JwtAuthGuard)
    @Roles('USER')
    @Delete('basket/:id')
    deleteFromBasket(@Param('id') id:string,@Req() req,@Query('all',ParseBoolPipe) all:boolean){
        if(all){
            return this.basketService.deleteFromBasketByItem(req.user as User,id)
        }
        return this.basketService.deleteOneFromBasket(req.user as User,id)
    }

    @UseGuards(JwtAuthGuard)
    @Roles('ADMIN')
    @Get()
    async getAllUsers(@Req() req,@Query('limit') limit:number,@Query('page') page:number,@Query('count') count:boolean){
        const adminId=(req.user as User).id
        if(count){
            return this.usersService.getAllUsersCount()
        }
        return (await this.usersService.getAllUserWithBasketItemCount(limit,page)).filter((u)=>u.id!==adminId)
    }

    @UseGuards(JwtAuthGuard)
    @Roles('ADMIN')
    @Delete(':name')
    deleteUserById(@Param('name') name:string){
        return this.usersService.deleteUserById(name)
    }

    @UseGuards(JwtAuthGuard)
    @Roles('ADMIN')
    @Put()
    updateUser(@Body() {id,...dto}:UpdateUserDto){
        return this.usersService.updateUser(id,dto)
    }

}

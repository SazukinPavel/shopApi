import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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
        private basketService:BasketService){}

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
    getBasketItems(@Req() req,@Query('limit') limit:number,@Query('allPrice') allPrice:boolean,@Query('page') page:number,@Query('count') count:boolean){
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
        return this.basketService.addToBasket(req.user as User,dto).then((b)=>{basketItemId:b.id})
    }

    @UseGuards(JwtAuthGuard)
    @Roles('User')
    @Delete('basket/:id')
    deleteFromBasket(@Param('id') id:string,@Req() req,@Query('all') all:boolean){
        return this.basketService.deleteFromBasket(req.user as User,id,all)
    }

}

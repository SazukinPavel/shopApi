import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import BasketItem from 'src/entitys/basket-item.entity';
import Basket from 'src/entitys/basket.entity';
import User from 'src/entitys/user.entity';
import AuthService from './auth.service';
import BasketService from './basket.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [AuthService,UsersService,BasketService], 
  imports:[JwtModule.register({secret:'Secret',signOptions:{expiresIn:'24h'}}),TypeOrmModule.forFeature([User,Basket,BasketItem])],
  exports:[AuthService,JwtModule]
})
export class UsersModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entitys/category.entity';
import { ItemInfo } from './entitys/item-info.entity';
import { Item } from './entitys/item.entity';
import { CategoryService } from './items/category.service';
import { ItemsInfoService } from './items/item-info.service';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({autoLoadEntities:true}),TypeOrmModule.forFeature([Item,ItemInfo,Category]), UsersModule],
  controllers: [ItemsController],
  providers: [ItemsService,CategoryService,ItemsInfoService],
})
export class AppModule {}

import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import CreateItemDto from './dto/create-item.dto';
import CreateItemInfoDto from './dto/create-itemInfo.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {

    constructor(private itemsService:ItemsService,private categoryService:CategoryService){}

    @Get()
    getAllItems(@Query('page') page:number,@Query('limit') limit:number,@Query('count')count:boolean){
        if(count){
            return this.itemsService.getItemCount()
        }
        return this.itemsService.getAllItems(page,limit)
    }

    @Get('categories/:category')
    getByCategoryName(@Param('category') category:string,@Query('count') count:boolean,@Query('page') page:number,@Query('limit') limit:number){
        if(count){
            return this.itemsService.getItemsByCategoryCount(category)
        }
        return this.itemsService.getItemsByCategory(category,limit,page)
    }

    @Get('categories')
    async getAllCategory(@Query('withCount') withCount:boolean){
        return this.categoryService.getAllCategory()
    }
    
    @Get(':id')
    getItemById(@Param('id') id:string){
        return this.itemsService.getItemByIdWithInfo(id)
    }

    @Post()
    addItems(@Body() dto:CreateItemDto){
        return this.itemsService.addItem(dto)
    }

    @Post(':id')
    addItemInfoToItem(@Param('id') id:string,@Body() dto:CreateItemInfoDto){
        return this.itemsService.addItemInfoToItem(id,dto)
    }


}

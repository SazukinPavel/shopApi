import { HttpException, HttpStatus } from '@nestjs/common';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entitys/item.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { ItemsInfoService } from './item-info.service';
import {v4} from 'uuid';
import CreateItemInfoDto from './dto/CreateItemInfo.dto';
import CreateItemDto from './dto/CreateItem.dto';

@Injectable()
export class ItemsService {
    

    constructor(@InjectRepository(Item) private items:Repository<Item>,
    @Inject(forwardRef(() => CategoryService)) private categories:CategoryService,
    private infos:ItemsInfoService){}

    async addItem({infos,category:categoryDto,...itemDto}:CreateItemDto){
        const category= await this.categories.addCategoryOrFind(categoryDto)
        const item=await this.items.save({...itemDto,category,id:v4()})
        infos.forEach((i)=>{
            this.infos.addItemInfo({...i,item})
        })
        return item
    }

    async addItemInfoToItem(id:string,dto:CreateItemInfoDto){
        const item=await this.getItemById(id)
        return this.infos.addItemInfo({...dto,item})
    }

    getItemCount(){
        return this.items.count()
    }

    async getAllItems(page:number,limit:number){
        const options:FindManyOptions<Item>={relations:['category']}
        if(page>0 && limit>0){
            options.take=limit
            options.skip=page*limit
        }else if(limit){
            options.take=limit
        }
        return this.items.find(options)
    }

    async getItemByIdWithInfo(id:string){
        const infos=this.infos.getByUserId(id)
        return this.items.findOne({id}).then(async (item)=>{
            item.infos=await infos
            return item
        })
    }
    
    getItemById(id:string){
        return this.items.findOne({id})
    }

    async getItemsByCategoryCount(category:string){
        const count= await this.items.count({where:{category:await this.categories.getCategoryByName(category)}})
        if(count){
            return count
        }
        throw new HttpException('No items!',HttpStatus.BAD_REQUEST)
    }

    async getItemsByCategory(name:string,take:number,page:number){
        const options:FindManyOptions<Item>={where:{category:await this.categories.getCategoryByName(name)}}
        if(page>0 && take>0){
            options.take=take
            options.skip=page*take
        }else if(take){
            options.take=take
        }
        return this.items.find(options)
    }


}

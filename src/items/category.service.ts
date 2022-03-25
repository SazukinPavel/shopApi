import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entitys/category.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import CategoryWithCountDto from './dto/CategoryWithCount.dto';
import { ItemsService } from './items.service';

@Injectable()
export class CategoryService {
    

    constructor(@InjectRepository(Category) private categories:Repository<Category>,
    @Inject(forwardRef(() => ItemsService)) private itemsService:ItemsService){}

    async addCategoryOrFind(name:string){
        const category= await this.categories.findOne({name}) 
        if(category){
            return category
        }
        return this.categories.save({name,id:v4()})
    }

    getCategoryByName(name:string){
       return this.categories.findOne({name})
    }

    getAllCategory(){
        return this.categories.find()
    }

    async getAllCategoryWithCount(){
        const categories= await this.categories.find()
        const categoriesWithCount:CategoryWithCountDto[]=await Promise.all(categories.map<Promise<CategoryWithCountDto>>(async(c)=>{
            return {name:c.name,count:await this.itemsService.getItemsByCategoryCount(c.name)}
        }))
        return categoriesWithCount
         
    }
}

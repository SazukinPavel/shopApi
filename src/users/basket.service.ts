import { ItemsService } from './../items/items.service';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BasketItem from 'src/entitys/basket-item.entity';
import Basket from 'src/entitys/basket.entity';
import { Item } from 'src/entitys/item.entity';
import User from 'src/entitys/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { v4 } from 'uuid';
import BasketItemsCountDto from './dto/basket-items-count.dto';
import CreateBasketItemDto from './dto/CreateBasketItemDto';

@Injectable()
export default class BasketService {
    constructor(@InjectRepository(Basket) private baskets:Repository<Basket>,
    @InjectRepository(BasketItem) private basketItems:Repository<BasketItem>,
    ){}

    private async findByUserOrCreate(user:User){
        const basket=await this.baskets.findOne({where:{user},relations:['user']})
        if(basket){
            return basket
        }
        return this.baskets.save({id:v4(),user,items:[]})
    }

    private createBasketItem(basket:Basket | string,item:Item | string){
        return this.basketItems.save({id:v4(),item,basket})
    }

    private async addItemToBasket(dto:CreateBasketItemDto,basket:Basket | string){
        const basketItem=await this.basketItems.findOne({where:{basket,item:dto.itemId}})
        if(basketItem){
            basketItem.kolvo=basketItem.kolvo+1;
            return this.basketItems.save(basketItem)
        }
        return this.createBasketItem(basket,dto.itemId)
    }

    async addToBasket(user:User,dto:CreateBasketItemDto):Promise<BasketItem>{
        const basket=await this.findByUserOrCreate(user)
        return this.addItemToBasket(dto,basket)
    }

    private deleteBasketItem(id:string){
        return this.basketItems.delete({id})
    }

    async deleteOneFromBasket(user:User,itemId:string){
        const basket=await this.getBasketByUserId(user.id)
        const basketItem= await this.basketItems.findOne({where:{basket,item:itemId}})
        if(!basketItem){
            throw new HttpException("Item not found in basket",500)
        }
        if(basketItem.kolvo===1){
            return this.deleteBasketItem(basketItem.id)
        }
        basketItem.kolvo-=1;
        return this.basketItems.update(basketItem.id,basketItem)
    }

    async deleteFromBasketByItem(user:User,itemId:string){
        const basket=await this.getBasketByUserId(user.id)
        const basketItem= await this.basketItems.findOne({where:{basket,item:itemId}})
        if(!basketItem){
            throw new HttpException("Item not found in basket",500)
        }
        return this.deleteBasketItem(basketItem.id)
    }

    private getBasketItemsByBasket(options:FindManyOptions<BasketItem>){
        return this.basketItems.find(options)
    }

    async getBasketItemsByUser(user:User,limit:number,page:number){
        const options:FindManyOptions<BasketItem>={where:{},relations:['item']}
        if(page>0 && limit>0){
            options.take=limit
            options.skip=page*limit
        }else if(limit){
            options.take=limit
        }
        const basket= await this.getBasketByUserId(user.id)
        options.where['basket']=basket;
        return this.getBasketItemsByBasket(options)
    }
    async getBasketItemCountByUser(user:User){
        const basket= await this.getBasketByUserId(user.id)
        return this.basketItems.count({where:{basket}})
    }

    private getBasketByUserId(id:string){
        return this.baskets.findOne({where:{user:id}})
    }

    private async getAllUserItems(user:User){
        const basket=await this.getBasketByUserId(user.id)
        return this.basketItems.find({where:{basket},relations:['item']})
    }

    async getAllPriceUserBasket(user:User){
        const items=await this.getAllUserItems(user)
        const dto:BasketItemsCountDto={
            price:items.reduce((sum,bi)=>sum+((bi.item as Item).price*bi.kolvo),0),
            count:items.reduce((sum,bi)=>sum+bi.kolvo,0)
        }
        return dto
    }

    async getBasketItemByItemId(user:User,itemId:string){
        const basket=await this.getBasketByUserId(user.id)
        return this.basketItems.findOne({where:{basket,item:itemId}})
    }

    async getBasketItemByItemIdKolvo(user:User,itemId:string){
        const basket=await this.getBasketByUserId(user.id)
        const basketItem=await this.basketItems.findOne({where:{basket,item:itemId}})
        if(basketItem){
            return basketItem.kolvo
        }
        return 0
    }
}
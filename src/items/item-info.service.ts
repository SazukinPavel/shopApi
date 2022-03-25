import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemInfo } from 'src/entitys/item-info.entity';
import { Repository } from 'typeorm';
import {v4} from 'uuid'
import CreateItemInfoDto from './dto/CreateItemInfo.dto';

@Injectable()
export class ItemsInfoService {
    

    constructor(@InjectRepository(ItemInfo) private infos:Repository<ItemInfo>){}

    addItemInfo(infoDto:CreateItemInfoDto){
        return this.infos.save({...infoDto,id:v4()})
    }

    getByUserId(itemId:string){
        return this.infos.find({item:itemId})
    }

}

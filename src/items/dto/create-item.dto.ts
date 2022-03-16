
interface ItemInfoDto{
    name:string
    description:string
}

export default interface CreateItemDto{
    name:string
    price:number
    img:string
    infos?:ItemInfoDto[]
    category:string
}
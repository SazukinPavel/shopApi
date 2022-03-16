import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export default class JwtAuthGuard implements CanActivate{

    constructor(private jwtService:JwtService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try{
            const req=context.switchToHttp().getRequest()
            if(!req.headers.authorization){
                throw new UnauthorizedException()
            }
            const user=this.jwtService.verify(req.headers.authorization)
            req.user=user
            return true
        }catch{
            throw new UnauthorizedException()
        }
    }

}
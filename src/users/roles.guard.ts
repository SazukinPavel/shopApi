import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { RoleKey } from "./roles-auth.decorator";

@Injectable()
export default class RoleGuard implements CanActivate{


    constructor(private jwtService:JwtService,
        private reflector:Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try{
            const role=this.reflector.getAllAndOverride(RoleKey,[context.getHandler(),context.getClass()])
            const req=context.switchToHttp().getRequest()
            if(!req.headers.authorization){
                throw new UnauthorizedException()
            }
            const user=this.jwtService.verify(req.headers.authorization)
            req.user=user
            return user.role==role
        }catch{
            throw new UnauthorizedException()
        }
    }

}
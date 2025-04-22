import Roles from "../models/roles.models";
import {IRoleRepository} from "./interfaces/IRoleRepository.interface"

export class RoleRepository implements IRoleRepository
{
    constructor (){}
    async findRole(name:string): Promise<any | null> {
       return Roles.findOne({where: {Name: name}});
    }
}
import User from "../models/user.models";
import {v4 as uuidv4} from 'uuid';
import { RoleRepository } from "./role.repository";
import {IUserRepository} from "./interfaces/IUserRepository.interface"



export class UserRepository implements IUserRepository{
  protected role:RoleRepository; 
  
  public constructor(){
      this.role = new RoleRepository();
   }

  protected async getDefaultUserRole(roleName: string): Promise<any>{
    return await this.role.findRole(roleName);  
   }

  public async findUser(email:string): Promise<any | null> {
    return await User.findOne({where: {Email:email}});
  }

  public async createUser(newUser:any, hashedPassword:string, roleName:string): Promise<any> {
    try{
      const roleId:any = await this.getDefaultUserRole(roleName);
      await User.create({
            Id: uuidv4(),
            Name: newUser.username,
            Email: newUser.email,
            RoleId: roleId.dataValues.Id,
            Password: hashedPassword
      });
      return true;
  }catch(err:any){
     return err;
  }  
 }
}
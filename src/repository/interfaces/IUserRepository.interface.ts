export interface IUserRepository
{
   createUser(newUser:any,hashedPassword:string,roleName:string):Promise<void>;
   findUser(username:string):Promise<any | null>;
}
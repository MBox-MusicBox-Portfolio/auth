export interface IRoleRepository{
  findRole(roleName:string):Promise<any | null>;
}
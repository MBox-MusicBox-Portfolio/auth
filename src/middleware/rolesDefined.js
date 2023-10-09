import User from "../models/user.js";
import Bands from "../models/band.js";
import Producer from "../models/producer.js";
import Roles from "../models/roles.js"

/***
 * Определяет какой конкретно юзер зашёл  на сервиси чьи к данные пользователя кодировать в токен
 */
export async function getDefinedUserRole(Emailbox, role=0) {
  if (Emailbox) {
    switch (role) {
      case 'user':
        const userData = await User.findOne({ where: { Email: Emailbox }, attributes: ['Id', 'Name', 'Avatar', 'Email', 'RoleId', 'IsBlocked', 'IsEmailVerify', 'Birthday', 'Password'] });
        const {RoleId, Password, ...restDataValues } = userData.dataValues;
        const userObject = {  
           ...restDataValues, 
        Role: role,
        };
        return userObject; 
        break;

      case 'producer':
        const producerData = await User.findAll({
          where: { Email: Emailbox },
          attributes: ['Id', 'Name', 'Avatar', 'Email', 'IsBlocked', 'IsEmailVerify', 'Birthday', 'Password'],
          include: {
            model: Producer,
            include: {
              model: Bands,
              attributes: ['Id', 'Name', 'Avatar', 'CreatedAt', 'FullInfo', 'IsBlocked'],
            },
          }
        });
        const parsedProducers = producerData.map((user) => ({
          ...user.toJSON(),
          Roles: role,
          Producers: user.Producers.map((producer) => ({
            ...producer.toJSON(),
            Bands: producer.Bands.map((band) => band.toJSON())
          })),
      
          ...(user.RoleId ? { RoleId: user.RoleId } : {}),
        }));
         return JSON.stringify(parsedProducers, null, 2);
        break;

      case 'musician':
        //const isMusician
        break;

      default:
        console.log("Unknown role");
        /*
         ctx.status=403;
         ctx.body={success:false, value:{ message:"Unknown service roles! Access Denied"}}
         */
        break;
    }
  } else {

  }
}

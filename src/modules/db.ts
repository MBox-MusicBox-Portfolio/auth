'use strict';
import { ConnectionError, Sequelize} from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config({path:'.env'});

export const db = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PASSWORD}`, {
                                   dialect: "mysql",
                                   host: `${process.env.DB_HOST}`,
                                   port:  parseInt(`${process.env.DB_PORT}`),
                                   define: {timestamps: false}});


export async function dbConnect()
{
     await db.sync();
    db.authenticate()
    .then(() => {
      console.log(`[${new Date().toLocaleString()}]   : DB Module : Db connect successfully`);})
    .catch((error) => {
      (error instanceof ConnectionError) ? console.error(`[${new Date().toLocaleString()}] : DB module [Service] : Service is unavailable. Retry again ...`) 
                                         : console.error(`[${new Date().toLocaleString()}] : DB module [Service] : An error occurred during database authentication.\n Reason: Please check your access rules or login credentials`);});
}

export default dbConnect;
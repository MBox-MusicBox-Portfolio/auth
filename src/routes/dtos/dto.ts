import * as yup from 'yup'

const userSchema: any = yup.object().shape({
   Username: yup.string().required("Entry fields with username"),
   Email: yup.string().email().required("Entry field with email"),
   Password: yup.string().required("Entry fields with password")
});

const userSchemaAuth : any = yup.object().shape({
   Email:yup.string().required("Entry fields with emails"),
   Password:yup.string().required("Entry fields with password")}); 

/**
 * Валидация пользователя
 */
export async function validateUser(object:any) : Promise<any>{
    try{
        const validate = userSchema.validateSync(object,{abortEarly: false });
        const isValidate  = validate !== null ? true : false
        return isValidate;
    }catch(error:any){
        return error.errors;
    }
}

/**
 * Валидация авторизации
 */
export async function validateAuth(object:any) : Promise<any>
{
    try{
        const validateAuth=userSchemaAuth.validateSync(object,{abortEalt:false});
        const isValidate = validateAuth !== null ? true:false 
        return isValidate;
    }catch(error:any){
        return error.errors;
    }
}

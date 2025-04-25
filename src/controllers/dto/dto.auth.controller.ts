export interface IAuthDTO {
    success: boolean;
    value:any;
    accessToken?: string;
    message?:string;
    validationErrors?: any;
    appErrorValidation?: any; 
}

export const authDTO = (
    successOperation: boolean,
    token: string | null = null,
    message:string| null = null,
    validationErrors: any = null,
    appValidation:any = null,
): IAuthDTO => {

    const dtoAuth: IAuthDTO = { success: successOperation, value:null};
    if (successOperation && token) {
        dtoAuth.value = {accessToken:token};
    } else if (!successOperation && validationErrors) {
        dtoAuth.value = {validationError:validationErrors};
    }else if(!successOperation && appValidation){
        dtoAuth.value = {appErrorValidation:appValidation}
    }else if(successOperation && message){
        dtoAuth.value = {message:message};
    }
    return dtoAuth;
};

export function handleValidationError(errorContext:string):IAuthDTO {
    return authDTO(false,null,null,errorContext);
}

export function handleAppValidationError(errorContext:string):IAuthDTO {
    return authDTO(false,null,null,null,errorContext);
}    

export function handleAuthSuccess(jwt:string):IAuthDTO {
    return authDTO(true,jwt);
}

export function handleSuccessMessage(message:string):IAuthDTO {
    return authDTO(true,null,message);
}
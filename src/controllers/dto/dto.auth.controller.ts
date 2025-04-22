interface IAuthDTO {
    success: boolean;
    value:any;
    accessToken?: string;
    message?:string;
    validationErrors?: any;
    appValidation?: any;
}

export const authDTO = (
    successOperation: boolean,
    token: string | null = null,
    message:string| null = null,
    validationErrors: any = null,
    appValidation:any = null
): IAuthDTO => {

    const dtoAuth: IAuthDTO = { success: successOperation, value:null};
    if (successOperation && token) {
        dtoAuth.value = {accessToken:token};
    } else if (!successOperation && validationErrors) {
        dtoAuth.value = {validationError:validationErrors};
    }else if(!successOperation && appValidation){
        dtoAuth.value = {appValidation:appValidation}
    }else if(successOperation && message){
        dtoAuth.value = {message:message};
    }
    return dtoAuth;
};
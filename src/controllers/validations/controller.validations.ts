import * as yup from 'yup'
import { ValidationMessages } from '../../utils/ValidationMessage.util';

const userRegisterSchema = yup.object().shape({
    username: yup.string()
                 .nonNullable(ValidationMessages.EmptyUserNameField)
                 .required(ValidationMessages.RequiredNameField),
    email:yup.string()
                 .nonNullable(ValidationMessages.EmptyEmailField)
                 .email(ValidationMessages.InvalidEmailFormat)
                 .required(ValidationMessages.RequiredEmailField),
    password: yup.string()
                 .nonNullable(ValidationMessages.EmptyPasswordField)
                 .required(ValidationMessages.RequiredPasswordField)
                 .min(5,ValidationMessages.PasswordLength)
                 .max(20)
                 .matches(/[a-z]/, ValidationMessages.ValidationPasswordLetter)
                 .matches(/[A-Z]/, ValidationMessages.ValidationPasswordUppercase)
                 .matches(/\d/, ValidationMessages.ValidationPasswordNumber)
                 //.matches(/[^a-zA-Z0-9]/, ValidationMessages.ValidationPasswordSpecial)
});

// Схема авторизации
const userSchemaAuth = yup.object().shape({
    email: yup.string()
              .nonNullable(ValidationMessages.EmptyEmailField)
              .email(ValidationMessages.InvalidEmailFormat)
              .required(ValidationMessages.RequiredEmailField),
    password: yup.string()
              .nonNullable(ValidationMessages.EmptyPasswordField)
              .required(ValidationMessages.RequiredPasswordField)
});

/**
 * Валидация нового пользователя
 */
export async function validateNewUser(object: any): Promise<any> {
    try {
        await userRegisterSchema.validate(object, { abortEarly: false });
        return true;  
    } catch (error: any) {
        return error.errors;  
    }
}

/**
 * Валидация авторизации
 */
export async function validateAuth(object: any): Promise<any> {
    try {
        await userSchemaAuth.validate(object, { abortEarly: false });
        return true;  
    } catch (error: any) {
        return error.errors; 
    }
}

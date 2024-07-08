import * as yup from 'yup'

const userRegisterSchema = yup.object().shape({
    username: yup.string().required("Entry fields with username"),
    email: yup.string().email().required("Entry field with email"),
    password: yup.string().required("Entry fields with password")
});

const userSchemaAuth = yup.object().shape({
    email: yup.string().required("Entry fields with emails"),
    password: yup.string().required("Entry fields with password")
});

/**
 * Валидация пользователя
 */
export async function validateUser(object: any): Promise<any> {
    try {
        const validate = await userRegisterSchema.validate(
            object,
            {abortEarly: false},
        );
        return validate !== null;
    } catch (error: any) {
        return error.errors;
    }
}

/**
 * Валидация авторизации
 */
export async function validateAuth(object: any): Promise<any> {
    try {
        const validateAuth = await userSchemaAuth.validate(
            object,
            {abortEarly: false},
        );
        return validateAuth !== null;
    } catch (error: any) {
        return error.errors;
    }
}

export enum AuthMessages {
    UserCreatedSuccessfully = "Your account has been created successfully! Please check your email to confirm it.",
    UserAlreadyExists = "User already exists!",
    EmailIsConfirmed = "Your email has already been confirmed!",
    EmailIsNotConfirmed = "Your email has not been confirmed yet! Please check your email to confirm it.",
    UserNotFound = "The user does not exist. Please check your Email",
    UserIsBanned = "You have been banned because your actions violate our platform's policy and rules. Please contact the administrator to receive more details about this.",
    IncorrectPassword = "Incorrect password. Please check your password",
    RestorePassword= "We’ve sent you an email with instructions to reset your password!",
    InternalServerError="An internal server error occurred. Please contact the administrator!",
    MissingToken ="Token not recieved",
    TokenExpired="Authentication terms is expired",
    LogoutSuccess="Logout successful!",
    LogoutFailed="Logout failed: token does not exist"
} 

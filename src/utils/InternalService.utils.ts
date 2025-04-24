export enum InternalServiceMessage{
    RabbitMQModuleTitle="RabbitMQ module: ",
    RabbitMQConnectionError= RabbitMQModuleTitle   + "Missing connection object",
    RabbitMQCreateChannelError=RabbitMQModuleTitle + "RabbitMQ can't create channel: ",
    RabbitMQConnectionSuccess=RabbitMQModuleTitle  + "RabbitMQ connection success",
    RabbitMQChannelError=RabbitMQModuleTitle +"RabbitMQ channel error: ",
    RabbitMQChannelSuccess=RabbitMQModuleTitle +"RabbitMQ channel success",
    RabbitMQMessageError=RabbitMQModuleTitle + "RabbitMQ message error: ",
    RabbitMQMessageSuccess=RabbitMQModuleTitle +"RabbitMQ message success",
    RabbitMQCloseConnectionError=RabbitMQModuleTitle + "RabbitMQ close connection error: ",
    RabbitMQCloseConnectionSuccess=RabbitMQModuleTitle +"RabbitMQ close connection success",
    RabbitMQSendMessageError=RabbitMQModuleTitle + "RabbitMQ can't to send message : ",
    RabbitMQSendMessageSuccess=RabbitMQModuleTitle + "RabbitMQ send message success ...",
}
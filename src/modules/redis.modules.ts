import * as dotenv from 'dotenv';
import {createClient} from 'redis';

dotenv.config();

const redis = createClient({url: `${process.env.CONNECTION_URI_REDIS}`});

redis.on('error', () => {
    console.error(`[${new Date().toLocaleString()}]   : Redis module:[As Service] Connect refused check available service`);
});
redis.on("connect", () => {
    console.log(`[${new Date().toLocaleString()}]   : Redis module:[ As Service] Connection successfull`);
})

export async function RedisConnection(): Promise<void> {
    try {
        await redis.connect()
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}]   : Redis module:[ As Service] Exceptions happens, because:` + error)
    }
}

/**
 * Создаёт ключ и значение ключа
 * Create new redis key and set key-value too
 * @param {*} key
 * @param {*} object
 */
export async function RedisSetValue(key: string, object: any): Promise<void> {
    try {
        await redis.set(key, JSON.stringify(object), {
            EX: 36600,
            NX: true
        });
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] : Redis module::RedisSetValue function + ${error}`);
        throw error;
    }
}

/**
 * An current function checking key
 * Проверяет существует ключ или нет
 * @param {*} key
 */
export async function RedisExistKey(key: string): Promise<any> {
    try {
        const keyRedis = await redis.exists(key);
        const existKey = keyRedis ? keyRedis : `[${new Date().toLocaleString()}] : Redis module::RedisExistsKey function : Redis key  has not found!`;
        return existKey;
    } catch (ex) {
        console.error(`[${new Date().toLocaleString()}] : Redis module::RedisExistsKey function : `, `${ex}`);
    }
}

/**
 * An current function removed key
 * Удаляет ключ
 * @param {*} key
 * @returns
 */
export async function RedisDelKey(key: string): Promise<any> {
    try {
        return (await redis.del(key));
    } catch (err) {
        return err
    }
}

/**
 * Get key value
 * Получает значение ключа
 * @param {*} key
 * @returns
 */

export async function RedisGetValue(key: string): Promise<any> {
    try {
        return (await redis.get(key));
    } catch (ex) {
        console.error(`[${new Date().toLocaleString()}] : Redis module::RedisGetValue function: ${ex}`);
    }
}



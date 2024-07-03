import * as bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';

export const generateHash = (str: string):Promise<string> => new Promise((res, rej) => {
    bcrypt.hash(str, 10, (err: any, hash: string) => {
        if (err) {
            rej(err)
            return
        }
        res(hash)
    });
})

export const generateRndHash = () => uuidv4()
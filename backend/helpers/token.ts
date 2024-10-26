import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config'
import { create } from 'domain';

// Return signed JWT from user data


interface Payload{
    id: number;
    username: string;
    isAdmin: boolean;
}

function createToken(user): {} {
    console.assert(user.isAdmin !== undefined, "createtoken passwed without isAdmin property")

    let payload: Payload = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin || false
    }

    return jwt.sign(payload, SECRET_KEY)
}

export default createToken
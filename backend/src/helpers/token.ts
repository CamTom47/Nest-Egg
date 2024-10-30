import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config'

// Return signed JWT from user data

interface Payload{
    id: number;
    username: string;
    isAdmin: boolean;
}

function createToken(user: {id: number, username: string, isAdmin: boolean}): {} {
    console.assert(user.isAdmin !== undefined, "createtoken passwed without isAdmin property")

    let payload: Payload = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin || false
    }

    return jwt.sign(payload, SECRET_KEY)
}

export default createToken
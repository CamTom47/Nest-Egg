import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config'

// Return signed JWT from user data

interface Payload{
    id: number;
    username: string;
    isAdmin: boolean;
}

function createToken({id, username, isAdmin}: Payload): {} {
    console.assert(isAdmin !== undefined, "createtoken passwed without isAdmin property")

    let payload = {
        "id": id,
        "username": username,
        "isAdmin": isAdmin || false
    }
    return jwt.sign(payload, SECRET_KEY)
}

export default createToken
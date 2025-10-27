import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET||"default-secret"

export const generateToken =(user)=>{
    return jwt.sign({user},secret,{expiresIn:'1h'})
}

export const checkToken = (token)=>{
    jwt.verify(token, secret,(err, decode)=>{
        if(err){
            throw new Error("Error en el token, token invalido");
        }
        return decode
    })
}
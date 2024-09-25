const JWT = require('jsonwebtoken')

const GenerateToken = (user)=>{
    const paylod = {
        fullname:user.fullName,
        _id:user._id,
        email:user.email,
        password:user.password,
        profileImageURL:user.profileImageURL,
        Role:user.role
    }

    const token = JWT.sign(paylod,process.env.JWT_SECRETE,{
        expiresIn:process.env.JWT_EXPIRY
    })

    return token

}


const ValidateToken = (token)=>{
    const paylod = JWT.verify(token,process.env.JWT_SECRETE)
    return paylod
}

 
module.exports={
    ValidateToken,
    GenerateToken
}
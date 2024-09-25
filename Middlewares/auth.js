const { ValidateToken } = require("../Utils/authentication")



const checkusertoken = async (TokenName)=>{
    return (req,res,next)=>{
        const token = req.user.cookies[TokenName]
        if(!token){
            return next()
        }
    
    try {
        const userPaylod = ValidateToken(token)
        req.user = userPaylod
    } catch (error) {
        return next()
    }
}
}

module.exports = checkusertoken
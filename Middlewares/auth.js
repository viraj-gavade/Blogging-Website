const { ValidateToken } = require("../Utils/authentication")

const checkusertoken = (TokenName)=>{
    return (req,res,next)=>{
        const token = req.cookies[TokenName]
        if(!token){
         next()
        }
    
    try {
        const userPaylod = ValidateToken(token)
        req.user = userPaylod
    } catch (error) {
        console.log(error)
    }
    next()
}
}

module.exports = {checkusertoken}
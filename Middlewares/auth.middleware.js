const jwt = require('jsonwebtoken'); // Import JSON Web Token library
// Middleware to verify the JWT token
const VerifyJwt =async (req, res, next) => {
    try {
        // Get the token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

        // If no token is found, render the signup page (unauthorized request)
        if (!token) {
            return res.render('signup');
        }

        // Verify the token using the secret key
        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE);

        // Find the user from the database using the decoded token's id
        const user = await findUser(decodedtoken.id);

        // If user is not found, render the signup page (invalid token)
        if (!user) {
            return res.render('signup');
        }

        // Attach the user object to the request so that it can be accessed later
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (error) {
        // Log the error and throw a custom API error for unauthorized access
        console.log(error);
        throw new CustomApiError(401, error?.message || 'Invalid access');
    }
};

module.exports = VerifyJwt; // Export the middleware for use in routes

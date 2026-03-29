const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiresIn = "1h";
const algorithm = "HS256";

const generateToken = (data) => {
    const payload = {
        id: data._id,
        name: data.name,
        email: data.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn, algorithm });
    return token;
};

const jwtAuthMiddleWare = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret, (decoded) => {
        req.user = decoded;
        next();
    });
};

module.exports = { generateToken, jwtAuthMiddleWare };
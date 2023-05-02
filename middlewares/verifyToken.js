import customErrorHandler from "../services/customErrorHandler.js";
import jwtService from "../services/jwtService.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers;
  if (!req.cookies.token) {
    return next(customErrorHandler.unAuthorized());
  }

  const accessToken = req.cookies.token;
  const obj = jwtService.verifyToken(accessToken);

  req._id = obj._id;
  next();
};

export default verifyToken;

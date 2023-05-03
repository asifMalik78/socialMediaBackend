import customErrorHandler from "../services/customErrorHandler.js";
import jwtService from "../services/jwtService.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers;

  if (!authHeader.token) {
    return next(customErrorHandler.unAuthorized());
  }

  const accessToken = authHeader.token.split(' ')[1];
  const obj = jwtService.verifyToken(accessToken);
  req._id = obj._id;
  next();
};

export default verifyToken;

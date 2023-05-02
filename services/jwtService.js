import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";
class jwtService {
  static createToken(payload, expiry = "1y", secret = JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  static verifyToken(token, secret = JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}

export default jwtService;

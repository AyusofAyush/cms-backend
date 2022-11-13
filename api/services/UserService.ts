import User from "../model/User";
import * as jwt from "jsonwebtoken";
import IUser from "../model/IUser";
const bcrypt = require("bcrypt");
import redisClient from "../redis";

class UserService {
  private readonly __jwtSecret: any = "topsecret123";
  private redisClient: any = new redisClient();

  async register({ email, password }: IUser) {
    if (!(email && password)) return Promise.reject("Invalid Creds");

    const cacheUser: any = await this.redisClient.get(email);
    if (cacheUser) {
      return Promise.reject("User Already Exist");
    }
    // const userExist = await User.findOne({ email: email });

    // if (userExist) return Promise.reject("User Already Exist");

    const user = new User({ email, password });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    user.save((err, user) => {
      if (err) {
        console.log("Error while saving User", err);
        return Promise.reject(err);
      }
      this.redisClient.set(user.email, JSON.stringify(user));
      console.log("Save User in DB", user.email);
      return Promise.resolve(user.email);
    });
  }

  async login({ email, password }: IUser) {
    const cacheLogin = await this.redisClient.get(`${email}-login`);
    if (cacheLogin) return cacheLogin;
    const user = await User.findOne({ email: email });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        console.log("User Successfully logged in", email);
        const signature = await jwt.sign(
          {
            id: user._id,
            email: user.email,
            iat: Date.now(),
            iss: "intuit",
          },
          this.__jwtSecret,
        );
        await this.redisClient.set(
          `${email}-login`,
          JSON.stringify({ token: signature }),
        );
        return Promise.resolve({
          token: signature,
        });
      } else {
        return Promise.reject("Invalid Email/Password");
      }
    } else {
      return Promise.reject("User does not exist");
    }
  }
  // Used for middleware
  verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      try {
        const decoded: any = jwt.verify(token, this.__jwtSecret);
        if (decoded) {
          resolve(true);
        }
      } catch (err) {
        // console.log("err while decoded token", err);
        reject(false);
      }
    });
  }
}

export default new UserService();

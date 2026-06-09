import { User } from "@/entities/users/users.entity";


declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
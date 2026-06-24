import { User } from "@/entities/users/users.entity";


export interface UserDTO extends Omit<User, 'id' | 'password' | 'isConfirmed' | 'sessions' | 'docs'> { }
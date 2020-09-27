import { User } from "./user";

export interface Message {
    id: string;
    author: User['username'];
    to: User['username'];
    timestamp: number;
    contents: string;
}
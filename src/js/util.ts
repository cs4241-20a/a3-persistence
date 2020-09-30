import { Base64 } from "js-base64";
import { Auth, AuthenticatedUser } from "./types/user";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function hashString(str: string) {
    return decoder.decode(await crypto.subtle.digest("SHA-512", encoder.encode(str)));
} 

export function authHeader(user: Auth & {username: string}) {
    if (user.authKind === 'local') {
        return {
            Authorization: `Basic ${Base64.encode(`${user.username}:${user.hash}`)}`
        };
    }
    throw "Invalid auth kind: " + user.authKind;
}

export const jsonHeader = {'Content-Type': 'application/json'};
export interface User {
    username: string;
    displayName: string;
}

export interface LocalAuth {
    hash: string;
    authKind: 'local';
}

/** @deprecated Unused */
export interface GithubAuth {
    token: string;
    authKind: 'github';
}

export type Auth = LocalAuth | GithubAuth;
export type AuthenticatedUser<T extends Auth = Auth> = User & T;
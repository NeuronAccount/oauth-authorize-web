export interface FetchAPI {
    (url: string, init?: any): Promise<any>;
}
export interface FetchArgs {
    url: string;
    options: any;
}
export declare class BaseAPI {
    basePath: string;
    fetch: FetchAPI;
    constructor(fetch?: FetchAPI, basePath?: string);
}
export interface AuthorizationCode {
    "code"?: string;
    "expiresSeconds"?: number;
}
export interface InlineResponseDefault {
    "status"?: string;
    /**
     * Error code
     */
    "code"?: string;
    /**
     * Error message
     */
    "message"?: string;
    /**
     * Errors
     */
    "errors"?: Array<InlineResponseDefaultErrors>;
}
export interface InlineResponseDefaultErrors {
    /**
     * field name
     */
    "field"?: string;
    /**
     * error code
     */
    "code"?: string;
    /**
     * error message
     */
    "message"?: string;
}
/**
 * DefaultApi - fetch parameter creator
 */
export declare const DefaultApiFetchParamCreator: {
    authorize(params: {
        "jwt": string;
        "responseType": string;
        "clientId": string;
        "redirectUri": string;
        "scope": string;
        "state": string;
    }, options?: any): FetchArgs;
};
/**
 * DefaultApi - functional programming interface
 */
export declare const DefaultApiFp: {
    authorize(params: {
        "jwt": string;
        "responseType": string;
        "clientId": string;
        "redirectUri": string;
        "scope": string;
        "state": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<AuthorizationCode>;
};
/**
 * DefaultApi - object-oriented interface
 */
export declare class DefaultApi extends BaseAPI {
    /**
     *
     * @summary
     * @param jwt
     * @param responseType
     * @param clientId
     * @param redirectUri
     * @param scope
     * @param state
     */
    authorize(params: {
        "jwt": string;
        "responseType": string;
        "clientId": string;
        "redirectUri": string;
        "scope": string;
        "state": string;
    }, options?: any): Promise<AuthorizationCode>;
}
/**
 * DefaultApi - factory interface
 */
export declare const DefaultApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    authorize(params: {
        "jwt": string;
        "responseType": string;
        "clientId": string;
        "redirectUri": string;
        "scope": string;
        "state": string;
    }, options?: any): Promise<AuthorizationCode>;
};

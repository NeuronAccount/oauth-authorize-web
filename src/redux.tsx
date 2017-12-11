import { AnyAction, combineReducers } from 'redux';
import { AuthorizationCode, DefaultApiFactory } from './api/oauth-private/gen/api';
import { isUndefined } from 'util';
import { Dispatchable } from './_common/common';

const oauthApi = DefaultApiFactory(fetch, 'http://127.0.0.1:8085/api-private/v1/oauth' );

export interface RootState {
    authorizationCode: AuthorizationCode;
}

export interface ApiError {
    status: number;
    code: string;
    message: string;
}

const ON_ERROR_MESSAGE = 'ON_ERROR_MESSAGE';
export function errorMessage( params: {message: string} ): AnyAction {
    return {
        type: ON_ERROR_MESSAGE,
        error: true,
        payload: {
            errorMessage: params.message
        },
    };
}

export function dispatchResponseError(dispatch: (action: AnyAction) => void , actionType: string, payload: {}) {
    dispatch({type: actionType, error: true, payload: payload});
    dispatch(errorMessage({message: JSON.stringify(payload)}));
}

export function errorFromResponse(response: {}): Promise<ApiError> {
    if (response instanceof Response) {
        return response.json().then((json: ApiError) => {
            return json;
        }).catch((err: {}) => {
            return {status: response.status, code: 'NetworkException', message: err.toString()};
        });
    } else if (response instanceof TypeError) {
        if (response.message === 'Failed to fetch') {
            return new Promise(function (resolve: (err: ApiError) => void) {
                resolve({status: 8193, code: 'NetworkException', message: '连接失败，请检查网络'});
            });
        } else {
            return new Promise(function (resolve: (err: ApiError) => void) {
                resolve({status: 8193, code: 'NetworkException', message: response.toString()});
            });
        }
    } else {
        return new Promise(function (resolve: (err: ApiError) => void) {
            resolve({status: 8193, code: 'NetworkException', message: '未知错误 response:' + response});
        });
    }
}

export interface AuthorizeParams {
    jwt: string;
    responseType: string;
    clientId: string;
    redirectUri: string;
    scope: string;
    state: string;
}

export const AUTHORIZE_REQUEST = 'AUTHORIZE_REQUEST';
export const AUTHORIZE_SUCCESS = 'AUTHORIZE_SUCCESS';
export const AUTHORIZE_FAILURE = 'AUTHORIZE_FAILURE';
export function apiAuthorize(params: AuthorizeParams): Dispatchable {
    console.log('apiAuthorize', params);
    return function (dispatch: (action: AnyAction) => void) {
        dispatch({type: AUTHORIZE_REQUEST});
        return oauthApi.authorize(params)
            .then((data) => {
                dispatch({type: AUTHORIZE_SUCCESS, payload: data});
            })
            .catch((response) => {
                errorFromResponse(response).then((err) => {
                    dispatchResponseError(dispatch, AUTHORIZE_FAILURE, err);
                });
            });
    };
}

function authorizationCode(state: AuthorizationCode, action: AnyAction): AuthorizationCode {
    if (isUndefined(state)) {
        return {};
    }

    switch (action.type) {
        case AUTHORIZE_SUCCESS: {
            return action.payload;
        }
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    authorizationCode
});
import { AnyAction, combineReducers } from 'redux';
import { isUndefined } from 'util';
import { Dispatchable } from './_common/action';
import {
    AuthorizationCode, authorizeParams, DefaultApiFactory
} from './api/oauth-private/gen';

const oauthApi = DefaultApiFactory(undefined, fetch, 'http://127.0.0.1:8085/api-private/v1/oauth');

const AUTHORIZE_SUCCESS = 'AUTHORIZE_SUCCESS';

export interface RootState {
    authorizationCode: AuthorizationCode;
}

export const apiAuthorize = (p: authorizeParams): Dispatchable => (dispatch) => {
    return oauthApi.authorize(p.accountJwt, p.responseType, p.clientId, p.redirectUri, p.scope, p.state)
        .then((data) => {
            dispatch({type: AUTHORIZE_SUCCESS, payload: data});
        })
        .catch((err) => {
            console.log(err);
        });
};

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
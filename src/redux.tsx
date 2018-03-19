import { AnyAction, combineReducers } from 'redux';
import { Dispatchable } from './_common/action';
import {
    AuthorizationCode, authorizeParams, DefaultApiFactory
} from './api/oauth-private/gen';
import { env } from './env';

const oauthApi = DefaultApiFactory(undefined, fetch, env.host + '/api-private/v1/oauth');

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

const authorizationCode = (state: AuthorizationCode= {}, action: AnyAction): AuthorizationCode => {
    switch (action.type) {
        case AUTHORIZE_SUCCESS: {
            return action.payload;
        }
        default:
            return state;
    }
};

export const rootReducer = combineReducers<RootState>({
    authorizationCode
});
import { AnyAction, combineReducers } from 'redux';
import {
    AuthorizationCode, authorize_SUCCESS, AuthorizeParams,
    DefaultApiFactory
} from './api/oauth-private/gen/api';
import { isUndefined } from 'util';
import { Dispatchable, StandardAction } from './_common/action';
import { Dispatch } from 'react-redux';

const oauthApi = DefaultApiFactory(fetch, 'http://127.0.0.1:8085/api-private/v1/oauth' );

export interface RootState {
    authorizationCode: AuthorizationCode;
}

export function apiAuthorize(params: AuthorizeParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return oauthApi.authorize(params)
            .then((data) => {
                dispatch({type: authorize_SUCCESS, payload: data});
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

function authorizationCode(state: AuthorizationCode, action: AnyAction): AuthorizationCode {
    if (isUndefined(state)) {
        return {};
    }

    switch (action.type) {
        case authorize_SUCCESS: {
            return action.payload;
        }
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    authorizationCode
});
import { AnyAction, combineReducers } from 'redux';

export interface RootState {
    hello: string;
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

function hello(h: string, action: AnyAction): string {
    return 'hello';
}

export const rootReducer = combineReducers({
    hello
});
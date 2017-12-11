import { isUndefined } from 'util';
import { AnyAction } from 'redux';

export function  valueOrDefault(s: string|undefined): string {
    return isUndefined(s) ? '' : s;
}

export function isNullOrEmpty(s: string|undefined|null): boolean {
    if (isUndefined(s)) {
        return true;
    }

    if (s == null || s === '') {
        return true;
    }

    return false;
}

export interface Dispatchable {
    (dispatch: (action: AnyAction) => void): void;
}

export function parseQueryString(search: string): Map<string, string> {
    let m = new Map<string, string>();
    if (search.startsWith('?')) {
        search.substring(1).split('&').forEach((pair) => {
            const tokens = pair.split('=');
            if (tokens.length > 1) {
                m.set(tokens[0], tokens[1]);
            } else {
                m.set(tokens[0], '');
            }
        });
    }
    return m;
}
import * as React from 'react';
import { apiAuthorize, AuthorizeParams, RootState } from '../redux';
import { isNullOrEmpty, parseQueryString, valueOrDefault } from '../_common/common';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { AuthorizationCode } from '../api/oauth-private/gen/api';

interface Props {
    authorizationCode: AuthorizationCode;

    apiAuthorize(p: AuthorizeParams): (dispatch: (action: AnyAction) => void) => void;
}

interface State {
    queryParams: Map<string, string>;
    requestParamError: RequestParamError | null;
    responseType: string;
    clientId: string;
    redirectUri: string;
    scope: string;
    state: string;
}

interface RequestParamError {
    paramName: string;
    errorCode: string;
    errorMessage: string;
    helpLink: string;
}

class AuthorizePage extends React.Component <Props, State> {
    componentWillMount() {
        const query = parseQueryString(window.location.search);

        let requestParamError = this.checkRequestParams(query);

        let state: State = {
            queryParams: query,
            requestParamError: requestParamError,
            responseType: valueOrDefault(query.get('response_type')),
            clientId: valueOrDefault(query.get('client_id')),
            scope: valueOrDefault(query.get('scope')),
            redirectUri: valueOrDefault(query.get('redirect_uri')),
            state: valueOrDefault(query.get('state')),
        };

        this.setState(state);

        window.addEventListener('message', (e: MessageEvent): void => {
            console.log('message', e.data);

            switch (e.data.type) {
                case 'onLoginSuccess':
                    return this.msgOnLoginSuccess(e.data.payload);
                default:
                    return;
            }
        });
    }

    requestParamError(paramName: string): RequestParamError {
        return {
            paramName: paramName,
            errorCode: 'InvalidQueryParam',
            errorMessage: '无效的' + paramName,
            helpLink: 'http://qq.com'
        };
    }

    checkRequestParams(query: Map<string, string>): RequestParamError | null {
        const responseType = query.get('response_type');
        if (isNullOrEmpty(responseType)) {
            return this.requestParamError('response_type');
        }

        const clientId = query.get('client_id');
        if (isNullOrEmpty(clientId)) {
            return this.requestParamError('client_id');
        }

        const scope = query.get('scope');
        if (isNullOrEmpty(scope)) {
            return this.requestParamError('scope');
        }

        const redirectUri = query.get('redirect_uri');
        if (isNullOrEmpty(redirectUri)) {
            return this.requestParamError('redirect_uri');
        }

        const state = query.get('state');
        if (isNullOrEmpty(state)) {
            return this.requestParamError('state');
        }

        return null;
    }

    msgOnLoginSuccess(jwt: string) {
        const query = this.state.queryParams;

        let authorizeParams: AuthorizeParams;
        authorizeParams = {
            jwt: jwt,
            clientId: valueOrDefault(query.get('client_id')),
            redirectUri: valueOrDefault(query.get('redirect_uri')),
            responseType: valueOrDefault(query.get('response_type')),
            scope: valueOrDefault(query.get('scope')),
            state: valueOrDefault(query.get('state')),
        };

        this.props.apiAuthorize(authorizeParams);
    }

    renderRequestParamsError(e: RequestParamError) {
        return (
            <div>
                <div
                    style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        maxWidth: '721px',
                    }}
                >
                    <div style={{marginTop: '200px'}}>
                        <label
                            style={{
                                textAlign: 'center',
                                display: 'block',
                            }}
                        >
                            {'请求参数错误：' + e.errorMessage}
                        </label>
                    </div>
                    <div
                        style={{
                            marginTop: '100px', float: 'right'
                        }}
                    >
                        <a
                            href="http://localhost:3003/"
                            target="_blank"
                            style={{textDecoration: 'none'}}
                        >
                            点此报错
                        </a>
                        <label>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                        <a
                            href="http://qq.com"
                            target="_blank"
                            style={{textDecoration: 'none'}}
                        >
                            解决方案
                        </a>
                        <label>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                        <a
                            href="http://localhost:3003/"
                            target="_blank"
                            style={{textDecoration: 'none'}}
                        >
                            注册帐号
                        </a>
                        <label>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                        <a
                            href="http://qq.com"
                            target="_blank"
                            style={{textDecoration: 'none'}}
                        >
                            意见反馈
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    renderHeader() {
        return (
            <div
                id={'header'}
                style={{width: '100%', height: '48px', backgroundColor: '#444'}}
            >
                <div
                    id={'header-inner'}
                    style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        backgroundColor: '#333',
                        maxWidth: '721px',
                    }}
                >
                    <div
                        id={'title'}
                        style={{float: 'left', marginLeft: '25%'}}
                    >
                        <label style={{color: '#FFF', fontSize: '200%'}}>火星登录</label>
                    </div>
                    <div
                        id={'links'}
                        style={{float: 'right', marginTop: '20px'}}
                    >
                        <a
                            href="http://qq.com"
                            target="_blank"
                            style={{textDecoration: 'none'}}
                        >
                            <label style={{color: '#FFF'}}>？火星登录</label>
                        </a>
                        <label style={{color: '#FFF'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                        <a
                            href="http://qq.com"
                            target="_blank"
                            style={{textDecoration: 'none'}}
                        >
                            <label style={{color: '#FFF'}}>授权管理</label>
                        </a>
                        <label style={{color: '#FFF'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                        <a
                            href="http://qq.com"
                            target="_blank"
                            style={{textDecoration: 'none'}}
                        >
                            <label style={{color: '#FFF'}}>申请接入</label>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    renderContent() {
        return (
            <div
                id={'content'}
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    backgroundColor: '#333',
                    maxWidth: '721px',
                }}
            >
                <div
                    id={'content-left'}
                    style={{
                        width: '480px',
                        float: 'left',
                        borderRight: '1px dotted rgb(227, 227, 227)',
                    }}
                >
                    <iframe
                        id={'login-iframe'}
                        style={{width: '480px', height: '400px', border: '0'}}
                        src={'http://localhost:3001/?fromOrigin=' + window.location.origin}
                    />
                </div>
                <div
                    id={'content-right'}
                    style={{
                        width: '240px',
                        float: 'left',
                    }}
                >
                    <div
                        id={'accredit-panel'}
                        style={{marginLeft: '32px', marginTop: '30px'}}
                    >
                        <label style={{fontSize: 'small'}}>该网站已有一百万用户登录火星</label>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (this.props.authorizationCode != null && !isNullOrEmpty(this.props.authorizationCode.code)) {
            window.location.href = this.state.redirectUri
                + '?code=' + this.props.authorizationCode.code
                + '&state=' + this.state.state;
            return;
        }

        return (
            <div>
                {this.renderHeader()}
                {this.state.requestParamError == null ? this.renderContent()
                    : this.renderRequestParamsError(this.state.requestParamError)}
            </div>
        );
    }
}

function selectProps(state: RootState) {
    return {
        authorizationCode: state.authorizationCode
    };
}

export default connect(
    selectProps, {
        apiAuthorize
    })(AuthorizePage);
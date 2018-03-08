import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { parseQueryString } from '../_common/common';
import { AuthorizationCode, authorizeParams } from '../api/oauth-private/gen';
import { apiAuthorize, RootState } from '../redux';

interface Props {
    authorizationCode: AuthorizationCode;
    apiAuthorize(p: authorizeParams): Dispatchable;
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
    public componentWillMount() {
        const query = parseQueryString(window.location.search);

        this.checkRequestParams(query);

        window.addEventListener('message', (e: MessageEvent): void => {
            console.log('message', e.data);

            switch (e.data.type) {
                case 'onLoginCallback':
                    return this.msgOnLoginSuccess(e.data.payload);
                default:
                    return;
            }
        });
    }

    public requestParamError(paramName: string) {
        const requestParamError = {
            paramName,
            errorCode: 'InvalidQueryParam',
            errorMessage: '无效的' + paramName,
            helpLink: 'http://qq.com'
        };

        this.setState({requestParamError});
    }

    public checkRequestParams(queryParams: Map<string, string>) {
        const responseType = queryParams.get('response_type');
        if (!responseType || responseType === '') {
            return this.requestParamError('response_type');
        }

        const clientId = queryParams.get('client_id');
        if (!clientId || clientId === '') {
            return this.requestParamError('client_id');
        }

        const scope = queryParams.get('scope');
        if (!scope || scope === '') {
            return this.requestParamError('scope');
        }

        const redirectUri = queryParams.get('redirect_uri');
        if (!redirectUri || redirectUri === '') {
            return this.requestParamError('redirect_uri');
        }

        const state = queryParams.get('state');
        if (!state || state === '') {
            return this.requestParamError('state');
        }

        this.setState({
            queryParams,
            responseType,
            clientId,
            scope,
            redirectUri,
            state,
            requestParamError: null
        });
    }

    public msgOnLoginSuccess(jwt: string) {
        const {clientId, redirectUri, responseType, scope, state} = this.state;

        this.props.apiAuthorize({
            accountJwt: jwt,
            clientId,
            redirectUri,
            responseType,
            scope,
            state,
        });
    }

    public renderRequestParamsError(e: RequestParamError) {
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
                            href="http://qq.com"
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
                            href="http://localhost:3002/"
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

    public renderHeader() {
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

    public renderContent() {
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
                        src={'http://localhost:3001/?fromOrigin=' + encodeURIComponent(window.location.origin)}
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

    public render() {
        if (this.props.authorizationCode != null
            && this.props.authorizationCode.code != null
            && this.props.authorizationCode.code !== '') {
            window.location.href =
                decodeURIComponent(this.state.redirectUri)
                + '?code=' + encodeURIComponent(this.props.authorizationCode.code)
                + '&state=' + encodeURIComponent(this.state.state);

            return null;
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
    selectProps,
    {
        apiAuthorize
    })
(AuthorizePage);
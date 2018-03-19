import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { parseQueryString } from '../_common/common';
import { AuthorizationCode, authorizeParams } from '../api/oauth-private/gen';
import { env } from '../env';
import { apiAuthorize, RootState } from '../redux';

interface Props {
    authorizationCode: AuthorizationCode;
    apiAuthorize: (p: authorizeParams) => Dispatchable;
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
    private static renderHeader() {
        return (
            <div style={{
                width: '100%', height: '48px', backgroundColor: '#444',
            }}>
                {AuthorizePage.renderTitle()}
                {AuthorizePage.renderHeaderLinks()}
            </div>
        );
    }

    private static renderTitle() {
        return (
            <div style={{marginLeft: '8px', float: 'left', display: 'block'}}>
                <label style={{color: '#FFF', fontSize: '200%'}}>火星登录</label>
            </div>
        );
    }

    private static renderHeaderLinks() {
        return (
            <div style={{marginRight: '8px', float: 'right', display: 'block', marginTop: '24px'}}>
                <a
                    href="https://www.aliyun.com/"
                    target="_blank"
                    style={{textDecoration: 'none'}}
                >
                    <label style={{color: '#FFF'}}>？火星登录</label>
                </a>
                <label style={{color: '#FFF'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                <a
                    href="https://www.aliyun.com/"
                    target="_blank"
                    style={{textDecoration: 'none'}}
                >
                    <label style={{color: '#FFF'}}>授权管理</label>
                </a>
                <label style={{color: '#FFF'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                <a
                    href="https://www.aliyun.com/"
                    target="_blank"
                    style={{textDecoration: 'none'}}
                >
                    <label style={{color: '#FFF'}}>申请接入</label>
                </a>
            </div>
        );
    }

    private static renderContent() {
        return (
            <div style={{}}>
                {this.renderContentLeft()}
                {this.renderContentRight()}
            </div>
        );
    }

    private static renderContentLeft() {
        return (
            <div style={{
                width: '420px',
                float: 'left' ,
                borderRightStyle: 'solid',
                borderRightColor: '#eee',
                borderRightWidth: '1px'
            }}>
                <iframe
                    style={{width: '300px', height: '360px', border: '0', float: 'right', marginRight: '60px'}}
                    src={env.host + '/web/accounts/login/?fromOrigin=' + encodeURIComponent(window.location.origin)}
                />
            </div>
        );
    }

    private static renderContentRight() {
        return (
            <div style={{width: '300px', float: 'left'}}>
                <div style={{marginLeft: '60px', marginTop: '24px'}}>
                    <label style={{fontSize: 'small'}}>该网站已有一百万用户登录火星</label>
                </div>
            </div>
        );
    }

    private static renderRequestParamsError(e: RequestParamError) {
        return (
            <div style={{paddingTop: '144px'}}>
                <label style={{textAlign: 'center', display: 'block'}}>
                    {'请求参数错误：' + e.errorMessage}
                </label>
                {AuthorizePage.renderErrorLinks()}
            </div>
        );
    }

    private static renderErrorLinks() {
        return (
            <div style={{marginTop: '96px'}}>
                <a
                    href="https://www.aliyun.com/"
                    target="_blank"
                    style={{textDecoration: 'none'}}
                >
                    点此报错
                </a>
                <label>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                <a
                    href="https://www.aliyun.com/"
                    target="_blank"
                    style={{textDecoration: 'none'}}
                >
                    解决方案
                </a>
                <label>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                <a
                    href={env.host + '/web/accounts/signup'}
                    target="_blank"
                    style={{textDecoration: 'none'}}
                >
                    注册帐号
                </a>
                <label>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
                <a
                    href="https://www.aliyun.com/"
                    target="_blank"
                    style={{textDecoration: 'none'}}
                >
                    意见反馈
                </a>
            </div>
        );
    }

    public componentWillMount() {
        const query = parseQueryString(window.location.search);

        this.onLoginFrameMessage = this.onLoginFrameMessage.bind(this);

        this.checkRequestParams(query);

        window.addEventListener('message', this.onLoginFrameMessage);
    }

    public render() {
        const {code} = this.props.authorizationCode;
        if (code && code !== '') {
            this.redirect(code);
            return null;
        }

        const {requestParamError} = this.state;

        return (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                {AuthorizePage.renderHeader()}
                {requestParamError == null ? AuthorizePage.renderContent()
                    : AuthorizePage.renderRequestParamsError(requestParamError)}
            </div>
        );
    }

    private requestParamError(paramName: string) {
        const requestParamError = {
            paramName,
            errorCode: 'InvalidQueryParam',
            errorMessage: '无效的' + paramName,
            helpLink: 'https://www.aliyun.com'
        };

        this.setState({requestParamError});
    }

    private checkRequestParams(queryParams: Map<string, string>) {
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

    private onLoginFrameMessage(e: MessageEvent) {
        switch (e.data.type) {
            case 'onLoginCallback':
                return this.msgOnLoginSuccess(e.data.payload);
            default:
                return;
        }
    }

    private msgOnLoginSuccess(jwt: string) {
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

    private redirect(authorizationCode: string) {
        const {redirectUri, state} = this.state;

        window.location.href =
            decodeURIComponent(redirectUri)
            + '?code=' + encodeURIComponent(authorizationCode)
            + '&state=' + encodeURIComponent(state);
    }
}

const selectProps = (state: RootState) => ({
    authorizationCode: state.authorizationCode
});

export default connect(selectProps, {
    apiAuthorize
})(AuthorizePage);
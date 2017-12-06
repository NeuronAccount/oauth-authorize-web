import * as React from 'react';

class AuthorizePage extends React.Component {
    componentWillMount() {
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

    msgOnLoginSuccess(jwt: string) {
        console.log('msgOnLoginSuccess', jwt);
    }

    render() {
        return (
            <div>
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
                            style={{float: 'left', marginLeft: '24%'}}
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
                            src="http://localhost:3001/"
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
            </div>
        );
    }
}

export default AuthorizePage;
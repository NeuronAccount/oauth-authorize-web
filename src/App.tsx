import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';
import AuthorizePage from './authorizePage/AuthorizePage';

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route path="/" component={AuthorizePage}/>
            </BrowserRouter>
        );
    }
}
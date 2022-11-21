import React from 'react';
import ReactDOM from 'react-dom/client';
import ProjX from './proj'
import Dashboard from './dashboard'
import Dbrdm from './dbrdM'
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';
import { Switch } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Switch/>
        <Route path='/' exact><ProjX /></Route>
        <Route path='/dbrd' exact><Dashboard /></Route>
        <Route path='/dbrdm' exact><Dbrdm /></Route>
</BrowserRouter>
);

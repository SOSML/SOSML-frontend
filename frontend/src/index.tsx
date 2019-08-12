import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import RootPage from './components/RootPage';
import register from './registerServiceWorker';

ReactDOM.render(
    <RootPage />,
    document.getElementById('root') as HTMLElement
);

register();

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import RootPage from './components/RootPage';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <RootPage />,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();

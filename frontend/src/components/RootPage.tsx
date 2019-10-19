import * as React from 'react';
// import './MiniWindow.css';
import MenuBar from './MenuBar';
import Editor from './Editor';
import Files from './Files';
import Help from './Help';
import Landing from './Landing';
import Settings from './Settings';
import FileIntermediate from './FileIntermediate';
import { getInterfaceSettings } from '../storage';
import { renderTheme, getTheme } from '../theme';
// import ShareIntermediate from './ShareIntermediate';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import './RootPage.css';

class RootPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        let settings = getInterfaceSettings();
        let theme = renderTheme(getTheme(settings.theme, settings.autoSelectTheme ?
                                         settings.darkTheme : undefined));
        return (
            <Router>
                <div className="rootPage">
                    <style>{theme}</style>
                    <MenuBar />
                    <Route exact={true} path="/" component={Landing} />
                    <Route path="/editor" component={Editor} />
                    <Route path="/files" component={Files} />
                    <Route path="/help" component={Help} />
                    <Route path="/settings" component={Settings} />

                    <Route path="/file/:name" component={FileIntermediate} />
                    <Route path="/examplefile/:name" component={FileIntermediate} />
                    <Route path="/share/:hash" component={Editor} />
                    <div className="footer">
                        © 2019 <a href="https://github.com/SOSML">The SOSML developers</a> | <a
                        href="https://github.com/SOSML/SOSML">Sources on GitHub</a> | <a
                        href="https://github.com/SOSML/SOSML/issues">Report a bug</a> | <a
                        href="https://www.uni-saarland.de/footer/dialog/impressum.html">Imprint</a>
                    </div>
                </div>
            </Router>
        );
    }
}

export default RootPage;

import * as React from 'react';

import MiniWindow from './MiniWindow';
import ShareModal from './ShareModal';
import CodeMirrorWrapper from './CodeMirrorWrapper';
import { Button , Glyphicon } from 'react-bootstrap';
import './Playground.css';
import { API as WebserverAPI } from '../API';
var SplitterLayout = require('react-splitter-layout').default; // MEGA-HAX because of typescript
SplitterLayout.prototype.componentDidUpdate = function(prevProps: any, prevState: any) {
    if (this.props.onUpdate && this.state.secondaryPaneSize !== prevState.secondaryPaneSize) {
        this.props.onUpdate(this.state.secondaryPaneSize);
    }
};
import { CONFIG } from '../config';

interface State {
    output: string;
    code: string;
    sizeAnchor: any;
    useServer: boolean;
    shareLink: string;
    interpreterTimeout: number;

    errorColor: string;
    successColor1: string;
    successColor2: string;
}

interface Props {
    readOnly: boolean;
    onCodeChange?: (x: string) => void;
    initialCode: string;
    fileControls: any;
}

const SHARE_LINK_ERROR = ':ERROR';
const OUTPUT_MARKUP_SPECIALS = ['\\*', '\\_'];

class Playground extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            output: '', code: '', sizeAnchor: 0, useServer: false,
            shareLink: '', interpreterTimeout: 5000,
            errorColor: '', successColor1: '',
            successColor2: ''
        };

        this.handleLeftResize = this.handleLeftResize.bind(this);
        this.handleRightResize = this.handleRightResize.bind(this);
        this.handleRun = this.handleRun.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleSplitterUpdate = this.handleSplitterUpdate.bind(this);
        this.handleBrowserResize = this.handleBrowserResize.bind(this);
        this.handleOutputChange = this.handleOutputChange.bind(this);
        this.handleSwitchMode = this.handleSwitchMode.bind(this);
        this.handleShare = this.handleShare.bind(this);
        this.modalCloseCallback = this.modalCloseCallback.bind(this);
        this.handleBrowserKeyup = this.handleBrowserKeyup.bind(this);
    }

    render() {
        let lines: string[] = this.state.output.split('\n');
        var key = 0;
        let lineItems = lines.map((line) => {
            return this.parseLine(line, key++);
        });
        let code: string = this.props.initialCode;
        let executeOnServer: JSX.Element | undefined;
        if (this.state.useServer) {
            executeOnServer = (
                <div className="inlineBlock">
                    <div className="miniSpacer" />
                    <Button bsSize="small" bsStyle="primary" onClick={this.handleRun}>
                        <Glyphicon glyph={'play'} /> Ausführen
                    </Button>
                </div>
            );
        }
        let modal: JSX.Element | undefined;
        if (this.state.shareLink !== '') {
            modal = (
                <ShareModal error={this.state.shareLink === SHARE_LINK_ERROR}
                    link={this.state.shareLink} closeCallback={this.modalCloseCallback} />
            );
        }
        let shareElements: JSX.Element | undefined;
        if (!this.props.readOnly && CONFIG.sharingEnabled) {
            shareElements = (
                <div className="inlineBlock">
                    <div className="miniSpacer" />
                    <Button bsSize="small" bsStyle="primary" onClick={this.handleShare}>
                        <Glyphicon glyph={'link'} /> Teilen
                    </Button>
                </div>
            );
        }
        let extraCSS = '';
        if (this.state.errorColor !== '') {
            extraCSS += '.eval-fail { background-color: ' + this.state.errorColor + ' !important; }';
        }
        if (this.state.errorColor !== '') {
            extraCSS += '.eval-success { background-color: ' + this.state.successColor1 + ' !important; }';
        }
        if (this.state.errorColor !== '') {
            extraCSS += '.eval-success-odd { background-color: ' + this.state.successColor2 + ' !important; }';
        }
        return (
            <div className="playground">
                <style>{extraCSS}</style>
                <SplitterLayout onUpdate={this.handleSplitterUpdate}>
                    <div className="flexcomponent flexy">
                        <MiniWindow content={(
                                <CodeMirrorWrapper flex={true} onChange={this.handleCodeChange} code={code}
                                readOnly={this.props.readOnly} outputCallback={this.handleOutputChange}
                                useInterpreter={!this.state.useServer} timeout={this.state.interpreterTimeout} />
                            )}
                            header={(
                            <div className="headerButtons">
                                {this.props.fileControls}
                                {shareElements}
                            </div>
                        )} title="SML" className="flexy" updateAnchor={this.state.sizeAnchor} />
                    </div>
                    <div className="flexcomponent flexy">
                        <MiniWindow content={
                            <div>{lineItems}</div>}
                        title="Ausgabe" className="flexy" updateAnchor={this.state.sizeAnchor}
                        />
                    </div>
                </SplitterLayout>
                {modal}
            </div>
        );
    }

    modalCloseCallback() {
        this.setState({
            shareLink: ''
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleBrowserResize);
        window.addEventListener('keyup', this.handleBrowserKeyup);

        let interfaceSettings: string | null = localStorage.getItem('interfaceSettings');
        if (typeof interfaceSettings === 'string') {
            let settings = JSON.parse(interfaceSettings);
            if (settings.fullscreen) {
                this.getBodyClassList().add('fullscreen');
            }

            if (settings.timeout) {
                this.setState({interpreterTimeout: settings.timeout});
            }
            if (settings.errorColor) {
                this.setState({errorColor: settings.errorColor});
            }
            if (settings.successColor1) {
                this.setState({successColor1: settings.successColor1});
            }
            if (settings.successColor2) {
                this.setState({successColor2: settings.successColor2});
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleBrowserResize);
        window.removeEventListener('keyup', this.handleBrowserKeyup);
        this.getBodyClassList().remove('fullscreen');
    }

    handleSplitterUpdate(sizeAnchor: any) {
        this.setState({sizeAnchor});
    }

    handleLeftResize() {
        // Block is empty!
    }

    handleRightResize() {
        // Block is empty?
    }

    handleBrowserResize() {
        if (this.state.sizeAnchor === -2) {
            this.setState({sizeAnchor: -1});
        } else {
            this.setState({sizeAnchor: -2});
        }
    }

    handleBrowserKeyup(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.getBodyClassList().remove('fullscreen');
        } else if (evt.key === 'F11') {
            this.getBodyClassList().add('fullscreen');
        }
    }

    handleRun() {
        WebserverAPI.fallbackInterpreter(this.state.code).then((val) => {
            this.setState({output: val.replace(/\\/g, '\\\\')});
        }).catch(() => {
            this.setState({output: 'Fehler: Es konnte keine Verbindung zum Server hergestellt werden.'});
        });
    }

    handleCodeChange(newCode: string) {
        this.setState(prevState => {
            return {code: newCode};
        });
        if (this.props.onCodeChange) {
            this.props.onCodeChange(newCode);
        }
    }

    handleOutputChange(newOutput: string) {
        this.setState(prevState => {
            let ret: any = {output: newOutput};
            return ret;
        });
    }

    handleShare() {
        WebserverAPI.shareCode(this.state.code).then((hash) => {
            this.setState(prevState => {
                return {shareLink: window.location.host + '/share/' + hash};
            });
        }).catch(() => {
            this.setState({shareLink: SHARE_LINK_ERROR});
        });
    }

    handleSwitchMode() {
        this.setState(prevState => {
            return {useServer: !prevState.useServer, output: ''};
        });
    }

    private getBodyClassList() {
        let body = document.getElementsByTagName('body')[0];
        return body.classList;
    }

    private parseLine(line: string, key: number): JSX.Element {
        let start = 0;
        let items: any[] = [];
        if (line.startsWith('>')) {
            let regex = /^>( *).*$/g;
            let match = regex.exec(line);
            if (match != null) {
                if (match[1].length > 1) {
                    start = match[1].length + 1;
                    items.push('>');
                    for (let i = 0; i < match[1].length; i++) {
                        items.push((
                            <div key={i} style={{display: 'inline-block'}}>&nbsp;</div>
                        ));
                    }
                }
            }
        }
        while (true) {
            let indexList = OUTPUT_MARKUP_SPECIALS.map((x: string) => {
                return line.indexOf(x, start);
            });
            let index = indexList[0];
            let ii = 0;
            for (let i = 0; i < indexList.length; i++) {
                if (indexList[i] !== -1 && (indexList[i] < index || index === -1)) {
                    index = indexList[i];
                    ii = i;
                }
            }
            if (index !== -1) {
                let current = OUTPUT_MARKUP_SPECIALS[ii];
                let before = line.substring(start, index);
                if (before.length > 0) {
                    items.push(before.replace(/\\\\/g, '\\'));
                }
                let next = line.indexOf(current, index + 2);
                if (next === -1) {
                    next = line.length - 1;
                }
                let content = line.substring(index + 2, next)
                    .replace(/\\\\/g, '\\');
                if (current === '\\*') {
                    items.push(<b key={start}>{content}</b>);
                } else {
                    items.push(<i key={start}>{content}</i>);
                }
                start = next + 2;
            } else {
                let after = line.substring(start);
                if (after.length > 0) {
                    items.push(after.replace(/\\\\/g, '\\'));
                }
                break;
            }
        }
        if (items.length === 0) {
            return <div key={line + (key++)}><div className="miniSpacer" /></div>;
        } else {
            return <div key={line + (key++)}>{items}</div>;
        }
    }
}

export default Playground;

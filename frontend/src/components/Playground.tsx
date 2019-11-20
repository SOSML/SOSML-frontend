import * as React from 'react';

import MiniWindow from './MiniWindow';
import ShareModal from './ShareModal';
import ContractModal from './ContractModal';
import CodeMirrorWrapper from './CodeMirrorWrapper';
import { Button, Glyphicon } from 'react-bootstrap';
import './Playground.css';
import { API as WebserverAPI } from '../api';
import { getColor } from '../theme';
import { Database, InterfaceSettings, getInterfaceSettings } from '../storage';
import { SHARING_ENABLED } from '../config';

var SplitterLayout = require('react-splitter-layout').default; // MEGA-HAX because of typescript
SplitterLayout.prototype.componentDidUpdate = function(prevProps: any, prevState: any) {
    if (this.props.onUpdate && this.state.secondaryPaneSize !== prevState.secondaryPaneSize) {
        this.props.onUpdate(this.state.secondaryPaneSize);
    }
};

interface State {
    output: string;
    code: string;
    sizeAnchor: any;
    useServer: boolean;
    shareLink: string;

    formContract: boolean;
    interfaceSettings: InterfaceSettings;
}

interface Props {
    readOnly: boolean;
    onCodeChange?: (x: string) => void;
    onResize?: () => void;
    initialCode: string;
    fileControls: any;
}

const SHARE_LINK_ERROR = ':ERROR';
const SHARE_LINK_ERROR_NO_CONTRACT = ':ERROR_CONTRACT';
const OUTPUT_MARKUP_SPECIALS = ['\\*', '\\_'];

class Playground extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            output: '', code: '', sizeAnchor: 0, useServer: false,
            shareLink: '', formContract: false,
            interfaceSettings: getInterfaceSettings()
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
        this.handleShareWrapper = this.handleShareWrapper.bind(this);
        this.modalCloseCallback = this.modalCloseCallback.bind(this);
        this.modalFormContractCallback = this.modalFormContractCallback.bind(this);
        this.modalCreateContractCallback = this.modalCreateContractCallback.bind(this);
        this.handleBrowserKeyup = this.handleBrowserKeyup.bind(this);
    }

    render() {
        let cleanedOutput = this.state.output;
        if (cleanedOutput.endsWith('\n')) {
            cleanedOutput = cleanedOutput.substr(0, cleanedOutput.length - 1);
        }
        let lines: string[] = cleanedOutput.split('\n');
        var key = 0;
        var markingColor = 0;
        let lineItems = lines.map((line) => {
            let data: [JSX.Element, number] = this.parseLine(line, key++, markingColor);
            markingColor = data[1];
            return data[0];
        });
        let code: string = this.props.initialCode;
        let modal: JSX.Element | undefined;
        if (this.state.shareLink !== '') {
            if (this.state.formContract) {
                modal = (
                    <ContractModal closeCallback={this.modalCloseCallback}
                        createCallback={this.modalCreateContractCallback}/>
                );
            } else {
                modal = (
                    <ShareModal error={this.state.shareLink === SHARE_LINK_ERROR
                        || this.state.shareLink === SHARE_LINK_ERROR_NO_CONTRACT}
                        link={this.state.shareLink} closeCallback={this.modalCloseCallback}
                        enocontract={this.state.shareLink === SHARE_LINK_ERROR_NO_CONTRACT}
                        formContractCallback={this.modalFormContractCallback}/>
                );
            }
        }
        let spacer: JSX.Element | undefined;
        let shareElements: JSX.Element | undefined;
        if (!this.props.readOnly && SHARING_ENABLED) {
            spacer = (
                <div className="miniSpacer" />
            );
            shareElements = (
                <Button bsSize="small" bsStyle="pri-alt" onClick={this.handleShareWrapper}>
                <Glyphicon glyph={'link'} /> Share
                </Button>
            );
        }
        let style: any = {};
        style.marginRight = '-3px';
        style.marginTop = '-.5px';
        let inputHeadBar: JSX.Element = (
            <div className="inlineBlock" style={style}>
                {this.props.fileControls}
                {spacer}
                {shareElements}
            </div>
        );

        let extraCSS = '';
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;
        if (dt === undefined) {
            extraCSS += '.eval-fail { background-color: '
            + this.state.interfaceSettings.errorColor + ' !important; }';
            extraCSS += '.eval-success { background-color: '
            + this.state.interfaceSettings.successColor1 + ' !important; }';
            extraCSS += '.eval-success-odd { background-color: '
            + this.state.interfaceSettings.successColor2 + ' !important; }';
        } else {
            extraCSS += '.eval-fail { background-color: '
            + getColor(settings.theme, dt, 'error') + ' !important; }';
            extraCSS += '.eval-success { background-color: '
            + getColor(settings.theme, dt, 'success') + ' !important; }';
            extraCSS += '.eval-success-odd { background-color: '
            + getColor(settings.theme, dt, 'success_alt') + ' !important; }';
        }

        let width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
        let height = (window.innerHeight > 0) ? window.innerHeight : window.screen.height;

        let codemirror = (
            <div className="flexcomponent flexy">
                <MiniWindow content={(
                    <CodeMirrorWrapper flex={true}
                    onChange={this.handleCodeChange} code={code}
                    readOnly={this.props.readOnly} outputCallback={this.handleOutputChange}
                    useInterpreter={!this.state.useServer}
                    timeout={this.state.interfaceSettings.timeout} />
                )} header={(
                    <div className="headerButtons">
                        {inputHeadBar}
                    </div>
                )} title="SML" className="flexy" updateAnchor={this.state.sizeAnchor} />
            </div>
        );
        let output = (
            <div className="flexcomponent flexy">
                <MiniWindow content={<div>{lineItems}</div>}
                    title="Output" className="flexy" updateAnchor={this.state.sizeAnchor}/>
            </div>
        );

        if (width < height && getInterfaceSettings().useMobile) {
            return (
                <div className="playground">
                    <style>{extraCSS}</style>
                    <SplitterLayout vertical={true}
                        onUpdate={this.handleSplitterUpdate} primaryIndex={1}
                        percentage={true}>
                        {output}
                        {codemirror}
                    </SplitterLayout>
                    {modal}
                </div>
            );
        } else {
            return (
                <div className="playground">
                    <style>{extraCSS}</style>
                    <SplitterLayout
                        onUpdate={this.handleSplitterUpdate} primaryIndex={0}
                        percentage={true}>
                        {codemirror}
                        {output}
                    </SplitterLayout>
                    {modal}
                </div>
            );
        }
    }

    modalCloseCallback() {
        this.setState({
            shareLink: '',
            formContract: false
        });
    }

    modalFormContractCallback() {
        this.setState({
            formContract: true
        });
    }

    modalCreateContractCallback() {
        this.setState({
            formContract: false,
            shareLink: ''
        });

        if (this.state.interfaceSettings.userContributesEnergy !== undefined) {
            // eslint-disable-next-line
            this.state.interfaceSettings.userContributesEnergy = true;
            localStorage.setItem('interfaceSettings',
                                 JSON.stringify(this.state.interfaceSettings));
        }
        this.handleShare(true);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleBrowserResize, {passive: true});
        window.addEventListener('keyup', this.handleBrowserKeyup, {passive: true});

        let settings: InterfaceSettings = getInterfaceSettings();
        this.setState({'interfaceSettings': settings});

        if (settings.fullscreen) {
            this.getBodyClassList().add('fullscreen');
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
        if (this.props.onResize) {
            this.props.onResize();
        }
    }

    handleBrowserKeyup(evt: KeyboardEvent) {
        let newval: boolean = false;
        if (evt.key === 'Escape') {
            this.getBodyClassList().remove('fullscreen');
            newval = false;
        } else if (evt.key === 'F11') {
            // Toggle the fullscreen mode
            if (this.getBodyClassList().contains('fullscreen')) {
                this.getBodyClassList().remove('fullscreen');
                newval = false;
            } else {
                this.getBodyClassList().add('fullscreen');
                newval = true;
            }
        }

        if (this.state.interfaceSettings.fullscreen !== undefined) {
            // eslint-disable-next-line
            this.state.interfaceSettings.fullscreen = newval;
            localStorage.setItem('interfaceSettings',
                                 JSON.stringify(this.state.interfaceSettings));
        }
    }

    handleRun() {
        WebserverAPI.fallbackInterpreter(this.state.code).then((val) => {
            this.setState({output: val.replace(/\\/g, '\\\\')});
        }).catch(() => {
            this.setState({output: 'Error: Server connection failed'});
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

    handleShareWrapper() {
        this.handleShare(false);
    }

    handleShare(forceAllow: boolean = false) {
        if (this.state.interfaceSettings.userContributesEnergy || forceAllow) {
            // We have the user's soul, so we can get "energy"
            WebserverAPI.shareCode(this.state.code).then((hash) => {
                this.setState(prevState => {
                    return {shareLink: window.location.host + '/share/' + hash};
                });

                // Store the share file locally
                Database.getInstance().then((db: Database) => {
                    return db.saveShare(hash, this.state.code, true);
                });
            }).catch(() => {
                this.setState({shareLink: SHARE_LINK_ERROR});
            });
        } else {
            this.setState({shareLink: SHARE_LINK_ERROR_NO_CONTRACT});
        }
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

    private parseLine(line: string, key: number, markingColor: number): [JSX.Element, number] {
        let start = 0;
        let items: any[] = [];
        if (line.startsWith('\\1')) {
            line = line.substring(2);
            markingColor = 1;
        } else if (line.startsWith('\\2')) {
            line = line.substring(2);
            markingColor = 2;
        } else if (line.startsWith('\\3')) {
            line = line.substring(2);
            markingColor = 3;
        }
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
            // eslint-disable-next-line
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
        let addClass = 'pre-reset ';
        if (this.state.interfaceSettings.outputHighlight) {
            switch (markingColor) {
                case 1:
                    addClass += 'eval-success';
                    break;
                case 2:
                    addClass += 'eval-success-odd';
                    break;
                case 3:
                    addClass += 'eval-fail';
                    break;
                default:
                    break;
            }
        }
        if (items.length === 0) {
            return [(
                <pre className={addClass} key={line + (key++)}>
                    <div className="miniSpacer" />
                </pre>
            ), markingColor];
        } else {
            return [(
                <pre className={addClass} key={line + (key++)}>
                    {items}
                </pre>
            ), markingColor];
        }
    }
}

export default Playground;

import * as React from 'react';
import { Alert, Tooltip, OverlayTrigger, Button, Glyphicon, Checkbox } from 'react-bootstrap';
import { REF_NAME, PIPELINE_ID } from './Version';
import { getColor, getTheme } from '../theme';
import { DEFAULT_THEME } from '../config';

declare global {
    interface Window {
        isUpdateAvailable: Promise<boolean>;
        serviceWorker: any;
    }
}

export interface InterpreterSettings {
    allowUnicodeInStrings: boolean;
    allowVector: boolean;
    allowSuccessorML: boolean;
    disableElaboration: boolean;
    disableEvaluation: boolean;
    allowLongFunctionNames: boolean;
    allowStructuresAnywhere: boolean;
    allowSignaturesAnywhere: boolean;
    allowFunctorsAnywhere: boolean;
    strictMode: boolean;
}

export interface InterfaceSettings {
    fullscreen: boolean;
    timeout: number;
    errorColor: string;
    successColor1: string;
    successColor2: string;
    outputHighlight: boolean;
    autoIndent: boolean;
    userContributesEnergy: boolean;
    theme: string;
}

const UPDATE_UNKNOWN = 0;
const UPDATE_UPDATE = 1;
const UPDATE_NONE = 2;

interface State {
    inter: InterpreterSettings;
    front: InterfaceSettings;
    updateStatus: number;
    updateAvailable: boolean;
    lastUpdateCheck: string;
}

function fillObjectWithString(obj: any, str: string | null) {
    if (typeof str === 'string') {
        let data: any = JSON.parse(str);
        for (let name in data) {
            if (data.hasOwnProperty(name)) {
                obj[name] = data[name];
            }
        }
    }
}

export function getInterpreterSettings(): InterpreterSettings {
    let str: string | null = localStorage.getItem('interpreterSettings');
    let ret: InterpreterSettings = {
        allowUnicodeInStrings: false,
        allowSuccessorML : false,
        disableElaboration: false,
        disableEvaluation: false,
        allowVector: false,
        allowLongFunctionNames: false,
        allowStructuresAnywhere: false,
        allowSignaturesAnywhere: false,
        allowFunctorsAnywhere: false,
        strictMode: true
    };
    fillObjectWithString(ret, str);
    return ret;
}

export function getInterfaceSettings(): InterfaceSettings {
    let str: string | null = localStorage.getItem('interfaceSettings');
    let ret: InterfaceSettings = {
        fullscreen: false,
        timeout: 5000,
        errorColor: getColor(DEFAULT_THEME, 'error'),
        successColor1: getColor(DEFAULT_THEME, 'success'),
        successColor2: getColor(DEFAULT_THEME, 'success_alt'),
        outputHighlight: true,
        autoIndent: true,
        userContributesEnergy: false,
        theme: DEFAULT_THEME
    };
    fillObjectWithString(ret, str);
    return ret;
}

class Settings extends React.Component<any, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            inter: getInterpreterSettings(),
            front: getInterfaceSettings(),
            updateStatus: UPDATE_UNKNOWN,
            updateAvailable: false,
            lastUpdateCheck: ''
        };

        this.timeoutChangeHandler = this.timeoutChangeHandler.bind(this);
        this.resetColorsToDefault = this.resetColorsToDefault.bind(this);
        this.themeChangeHandler = this.themeChangeHandler.bind(this);
    }

    componentDidMount() {
        this.checkForUpdates();
    }

    render() {
        let style: any = {};
        style.textAlign = 'right';
        style.width = '4.5em';
        style.border = 'none';
        let style2: any = {};
        style2.display = 'inline';

        let updateString: any = '...who is update?';
        if (this.state.updateStatus === UPDATE_UPDATE) {
            if (this.state.updateAvailable) {
                updateString = (
                    <p style={style2}>
                        ; there is a newer <em>SOSML</em> available!
                    </p>
                );
            } else {
                if (window.serviceWorker !== undefined) {
                    updateString = '; I am updating.';
                } else {
                    updateString = '; I am not updating. You should be worried.';
                }
            }
        } else if (this.state.updateStatus === UPDATE_NONE) {
            updateString = (
                <p style={style2}>
                    ; I am the newest <em>SOSML</em> available.
                </p>
            );
        }

        let updateAlert: any = (
            <hr/>
        );
        if (this.state.updateStatus === UPDATE_UPDATE) {
            if (this.state.updateAvailable) {
                updateAlert = (
                    <Alert bsStyle="info" style={{marginTop: '20px'}}><strong>Warning: </strong>
                        There is a newer version of SOSML available. Before you proceed,
                        store any currently opened files that you want to keep.
                        If you are ready, you may <Button onClick={(evt: any) => {
                            window.serviceWorker.postMessage({ type: 'SKIP_WAITING' });
                            this.checkForUpdates();
                        }}>
                        <Glyphicon glyph="refresh"/>&nbsp;start using the new version.</Button>
                    </Alert>
                );
            }
        }

        return (
            <div className="container flexy">
            <h2>Settings</h2>
                {updateAlert}
                <p>
                My name is <q>Q{PIPELINE_ID}B{REF_NAME}</q>.
               <br/>
                You can enable some additional features and extensions here.
                Things may break so be warned, though.
                </p>
                <br/>
                <h4>Interpreter Settings</h4>
                <Checkbox defaultChecked={this.state.inter.allowUnicodeInStrings}
                    onChange={this.changeHandler('inter', 'allowUnicodeInStrings')}>
                    Allow Unicode symbols in strings
                </Checkbox>
                <Checkbox checked={this.state.inter.allowStructuresAnywhere}
                    onChange={this.changeHandler('inter', 'allowStructuresAnywhere')}>
                    Allow structures to be defined in local declaration expressions.
                </Checkbox>
                <Checkbox checked={this.state.inter.allowSignaturesAnywhere}
                    onChange={this.changeHandler('inter', 'allowSignaturesAnywhere')}>
                    Allow signatures to be defined in all non top-level declarations.
                </Checkbox>
                <Checkbox checked={this.state.inter.allowFunctorsAnywhere}
                    onChange={this.changeHandler('inter', 'allowFunctorsAnywhere')}>
                    Allow functors to be defined in all non top-level declarations.
                </Checkbox>
                <Checkbox checked={this.state.inter.allowVector}
                    onChange={this.changeHandler('inter', 'allowVector')}>
                    Allow vector patterns and expressions.
                </Checkbox>
                <Checkbox checked={this.state.inter.allowSuccessorML}
                    onChange={this.changeHandler('inter', 'allowSuccessorML')}>
                    Enable support for 'SuccessorML' (experimental)
                </Checkbox>
                <Checkbox checked={this.state.inter.strictMode}
                    onChange={this.changeHandler('inter', 'strictMode')}>
                    Enforce single-typed results
                </Checkbox>
                <Checkbox checked={this.state.inter.disableElaboration}
                    onChange={this.changeHandler('inter', 'disableElaboration')}>
                    <b>Disable</b> elaboration.
                </Checkbox>
                <Checkbox checked={this.state.inter.disableEvaluation}
                    onChange={this.changeHandler('inter', 'disableEvaluation')}>
                    <b>Disable</b> evaluation. (Use this if your childhood friend SOSML takes too
                        long to compute its feelings for you but you really care about
                        of what type an answer would be.)
                </Checkbox>
                Abort evaluation after <input type="number" min="0" step="100"
                    value={this.state.front.timeout} style={style}
                    onChange={this.timeoutChangeHandler} placeholder="9029"/> ms.
                <br/><br/>
                <h4>Editor Settings</h4>
                Using general theme <input placeholder={this.state.front.theme}
                style={style} onChange={this.themeChangeHandler} />.<br/>
                Background color for erroneous code: <input type="color" value={this.state.front.errorColor}
                    onChange={this.colorChangeHandler('errorColor')}/><br/>
                Background color for evaluated code: <input type="color" value={this.state.front.successColor1}
                    onChange={this.colorChangeHandler('successColor1')}/><br/>
                Alternative background color for evaluated code: <input type="color"
                value={this.state.front.successColor2}
                    onChange={this.colorChangeHandler('successColor2')}/><br /><br />
                <Button bsStyle="dng-alt" onClick={this.resetColorsToDefault}>
                    <Glyphicon glyph="repeat" /> Reset colors to theme default
                </Button> <br /><br />
                <Checkbox checked={this.state.front.outputHighlight}
                    onChange={this.changeHandler('front', 'outputHighlight')}>
                    Enable colored output
                </Checkbox>
                <Checkbox checked={this.state.front.autoIndent}
                    onChange={this.changeHandler('front', 'autoIndent')}>
                    Enable auto-indent
                </Checkbox>
                <Checkbox checked={this.state.front.fullscreen}
                    onChange={this.changeHandler('front', 'fullscreen')}>
                    Switch editor into fullscreen mode (Use ESC to return to the normal mode.)
                </Checkbox>

                <br/>
                Checking for updates{updateString} <OverlayTrigger
                overlay={
                    <Tooltip id="0">
                    { this.state.lastUpdateCheck !== '' ?
                        'Last checked on ' + this.state.lastUpdateCheck + '.' : ''} Check again.
                    </Tooltip>}><a onClick={(evt: any) => {
                    this.checkForUpdates();
                }} style={{cursor: 'pointer'}}>&nbsp;<Glyphicon glyph="refresh"/>
                </a></OverlayTrigger>

                <br/> <br/>
            </div>
        );
    }

    resetColorsToDefault() {
        this.setState((oldState) => {
            let deepCopy: any = this.deepCopy(oldState);
            deepCopy.front.errorColor = getColor(deepCopy.front.theme, 'error');
            deepCopy.front.successColor1 = getColor(deepCopy.front.theme, 'success');
            deepCopy.front.successColor2 = getColor(deepCopy.front.theme, 'success_alt');
            return deepCopy;
        }, () => {
            this.saveState();
        });
    }

    private checkForUpdates() {
        window.isUpdateAvailable.then((updateAvailable: boolean) => {
            this.setState({
                updateAvailable: updateAvailable,
                updateStatus: !updateAvailable ? UPDATE_NONE : UPDATE_UPDATE,
                lastUpdateCheck: Date()
            });
        });
        this.setState({
            lastUpdateCheck: Date()
        });
    }

    private changeHandler(scope: string, property: string) {
        return () => {
            this.setState((oldState) => {
                let deepCopy: any = this.deepCopy(oldState);
                deepCopy[scope][property] = !this.state[scope][property];
                return deepCopy;
            }, () => {
                this.saveState();
            });
        };
    }

    private colorChangeHandler(propName: string) {
        return (evt: React.ChangeEvent<HTMLInputElement>) => {
            let value = evt.target.value;
            this.setState((oldState) => {
                let deepCopy: any = this.deepCopy(oldState);
                deepCopy.front[propName] = value;
                return deepCopy;
            }, () => {
                this.saveState();
            });
        };
    }

    private timeoutChangeHandler(evt: React.ChangeEvent<HTMLInputElement>) {
        let value = parseInt(evt.target.value, 10);
        if (value < 0) {
            return;
        }
        this.setState((oldState) => {
            let deepCopy: any = this.deepCopy(oldState);
            deepCopy.front.timeout = value;
            return deepCopy;
        }, () => {
            this.saveState();
        });
    }

    private themeChangeHandler(evt: React.ChangeEvent<HTMLInputElement>) {
        let value = evt.target.value;

        if (!getTheme(value) || this.state.front.theme === value) {
            return;
        }

        this.setState((oldState) => {
            let deepCopy: any = this.deepCopy(oldState);
            deepCopy.front.theme = value;
            return deepCopy;
        }, () => {
            this.saveState();
        });
        evt.target.value = '';
        window.location.reload();
    }

    private deepCopy(json: any): any {
        return JSON.parse(JSON.stringify(json));
    }

    private saveState() {
        localStorage.setItem('interpreterSettings', JSON.stringify(this.state.inter));
        let inter = this.deepCopy(this.state.front);
        if (inter.timeout === null || isNaN(inter.timeout)) {
            inter.timeout = 5000;
        }
        localStorage.setItem('interfaceSettings', JSON.stringify(inter));
    }

}

export default Settings;

import * as React from 'react';
import { Checkbox } from 'react-bootstrap';
import { REF_NAME, COMMIT_SHA, PIPELINE_ID, BUILD_DATE } from './Version';

interface InterpreterSettings {
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

interface InterfaceSettings {
    fullscreen: boolean;
    timeout: number;
    errorColor: string;
    successColor1: string;
    successColor2: string;
    outputHighlight: boolean;
    autoIndent: boolean;
}

interface State {
    inter: InterpreterSettings;
    front: InterfaceSettings;
}

const DEFAULT_ERROR_COLOR = '#ffdcdc';
const DEFAULT_SUCCESS_COLOR1 = '#d2ffd2';
const DEFAULT_SUCCESS_COLOR2 = '#dcffff';

class Settings extends React.Component<any, State> {
    constructor() {
        super({});
        this.state = {
            inter: this.getInterpreterSettings(),
            front: this.getInterfaceSettings()
        };

        this.timeoutChangeHandler = this.timeoutChangeHandler.bind(this);
        this.resetColorsToDefault = this.resetColorsToDefault.bind(this);
    }

    render() {
        return (
            <div className="container flexy">
            <h2>Interpreter settings</h2>
                <hr/>
                <p>
                My name is "{REF_NAME}-{COMMIT_SHA} run {PIPELINE_ID}/{BUILD_DATE}" aka. FRONTEND.
                    <br/>
                You can enable some additional features and extensions here.
                Things may break so be warned, though.
                </p>
                <br/>
                <h4>Interpreter settings</h4>
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
                Abort evaluation after <input type="number" min="0" step="100" value={this.state.front.timeout}
                    onChange={this.timeoutChangeHandler} placeholder="9029"/> ms.
                <br/>
                <h4>Editor settings</h4>
                Background color for erroneous code: <input type="color" value={this.state.front.errorColor}
                    onChange={this.colorChangeHandler('errorColor')}/><br/>
                Background color for evaluated code: <input type="color" value={this.state.front.successColor1}
                    onChange={this.colorChangeHandler('successColor1')}/><br/>
                Alternative background color for evaluated code: <input type="color"
                value={this.state.front.successColor2}
                    onChange={this.colorChangeHandler('successColor2')}/><br />
                <input type="button" value="Reset colors"
                    onClick={this.resetColorsToDefault} /> <br />
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
            </div>
        );
    }

    resetColorsToDefault() {
        this.setState((oldState) => {
            let deepCopy: any = this.deepCopy(oldState);
            deepCopy.front.errorColor = DEFAULT_ERROR_COLOR;
            deepCopy.front.successColor1 = DEFAULT_SUCCESS_COLOR1;
            deepCopy.front.successColor2 = DEFAULT_SUCCESS_COLOR2;
            return deepCopy;
        }, () => {
            this.saveState();
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

    private getInterpreterSettings(): InterpreterSettings {
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
        this.fillObjectWithString(ret, str);
        return ret;
    }

    private getInterfaceSettings(): InterfaceSettings {
        let str: string | null = localStorage.getItem('interfaceSettings');
        let ret: InterfaceSettings = {
            fullscreen: false,
            timeout: 5000,
            errorColor: DEFAULT_ERROR_COLOR,
            successColor1: DEFAULT_SUCCESS_COLOR1,
            successColor2: DEFAULT_SUCCESS_COLOR2,
            outputHighlight: true,
            autoIndent: true
        };
        this.fillObjectWithString(ret, str);
        return ret;
    }

    private fillObjectWithString(obj: any, str: string | null) {
        if (typeof str === 'string') {
            let data: any = JSON.parse(str);
            for (let name in data) {
                if (data.hasOwnProperty(name)) {
                    obj[name] = data[name];
                }
            }
        }
    }
}

export default Settings;

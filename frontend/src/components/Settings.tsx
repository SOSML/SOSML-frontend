import * as React from 'react';
import { Glyphicon, Checkbox } from 'react-bootstrap';
import { REF_NAME, COMMIT_SHA, PIPELINE_ID, BUILD_DATE } from './Version';
import { getColor, getTheme } from '../theme';
import { InterpreterSettings, InterfaceSettings, getInterpreterSettings,
    getInterfaceSettings } from '../storage';

interface State {
    inter: InterpreterSettings;
    front: InterfaceSettings;
}

class Settings extends React.Component<any, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            inter: getInterpreterSettings(),
            front: getInterfaceSettings()
        };

        this.timeoutChangeHandler = this.timeoutChangeHandler.bind(this);
        this.resetColorsToDefault = this.resetColorsToDefault.bind(this);
        this.themeChangeHandler = this.themeChangeHandler.bind(this);
    }

    render() {
        return (
            <div className="container flexy">
            <h2>Settings</h2>
                <hr/>
                <p>
                My name is "{REF_NAME}-{COMMIT_SHA} run {PIPELINE_ID}/{BUILD_DATE}" aka. FRONTEND.
                    <br/>
                You can enable some additional features and extensions here.
                Things may break so be warned, though.
                </p>
                <br/>
                {this.renderSettings(this.state.front.advancedMode)}
                <br/> <br/>
            </div>
        );
    }

    resetColorsToDefault() {
        this.setState((oldState) => {
            let deepCopy: any = this.deepCopy(oldState);
            deepCopy.front.errorColor = getColor(deepCopy.front.theme, undefined, 'error');
            deepCopy.front.successColor1 = getColor(deepCopy.front.theme, undefined, 'success');
            deepCopy.front.successColor2 = getColor(deepCopy.front.theme, undefined, 'success_alt');
            return deepCopy;
        }, () => {
            this.saveState();
        });
    }

    private renderSettings(advanced: boolean): any[] {
        let style: any = {};
        style.textAlign = 'right';
        style.width = '4.5em';
        style.border = 'none';

        let result: any[] = [];
        result.push(
            <h4 key={0}>Interpreter Settings</h4>
        );
        if (advanced) {
            result.push(
                <Checkbox key={2} checked={this.state.inter.allowStructuresAnywhere}
                    onChange={this.changeHandler('inter', 'allowStructuresAnywhere')}>
                    Allow structures to be defined in local declaration expressions.
                </Checkbox>
            );
            result.push(
                <Checkbox key={3} checked={this.state.inter.allowSignaturesAnywhere}
                    onChange={this.changeHandler('inter', 'allowSignaturesAnywhere')}>
                    Allow signatures to be defined in all non top-level declarations.
                </Checkbox>
            );
            result.push(
                <Checkbox key={4} checked={this.state.inter.allowFunctorsAnywhere}
                    onChange={this.changeHandler('inter', 'allowFunctorsAnywhere')}>
                    Allow functors to be defined in all non top-level declarations.
                </Checkbox>
            );
            result.push(
                <Checkbox key={5} checked={this.state.inter.allowVector}
                    onChange={this.changeHandler('inter', 'allowVector')}>
                    Allow vector patterns and expressions.
                </Checkbox>
            );
            result.push(
                <Checkbox key={6} checked={this.state.inter.allowSuccessorML}
                    onChange={this.changeHandler('inter', 'allowSuccessorML')}>
                    Enable support for 'SuccessorML' (experimental)
                </Checkbox>
            );
            result.push(
                <Checkbox key={7} checked={this.state.inter.strictMode}
                    onChange={this.changeHandler('inter', 'strictMode')}>
                    Enforce single-typed results
                </Checkbox>
            );
        }
        result.push(
            <Checkbox key={8} checked={this.state.inter.disableElaboration}
                onChange={this.changeHandler('inter', 'disableElaboration')}>
                <b>Disable</b> elaboration.
            </Checkbox>
        );
        result.push(
            <Checkbox key={9} checked={this.state.inter.disableEvaluation}
                onChange={this.changeHandler('inter', 'disableEvaluation')}>
                <b>Disable</b> evaluation.
            </Checkbox>
        );
        result.push(
            <p key={10}>
                Abort evaluation after <input type="number" min="0" step="100"
                value={this.state.front.timeout} style={style}
                onChange={this.timeoutChangeHandler} placeholder="9029"/> ms.
                <br/><br/>
            </p>
        );
        result.push(
            <h4 key={11}>Editor Settings</h4>
        );
        result.push(
            <div key={12}>
                Using general {this.state.front.autoSelectTheme ? '(light)' : ''} theme <input
                placeholder={this.state.front.theme}
                style={style} onChange={this.themeChangeHandler} />.<br/>
            </div>
        );
        result.push(
            <Checkbox key={17} checked={this.state.front.autoSelectTheme}
                onChange={this.changeHandler('front', 'autoSelectTheme', true)}>
                Try to detect a system-wide dark mode and correspondingly adjust the theme used.
            </Checkbox>
        );
        if (!this.state.front.autoSelectTheme) {
            result.push(
                <div key={121}>
                    Background color for erroneous code: <input type="color" value={this.state.front.errorColor}
                        onChange={this.colorChangeHandler('errorColor')}/><br/>
                    Background color for evaluated code: <input type="color" value={this.state.front.successColor1}
                        onChange={this.colorChangeHandler('successColor1')}/><br/>
                    Alternative background color for evaluated code: <input type="color"
                    value={this.state.front.successColor2}
                        onChange={this.colorChangeHandler('successColor2')}/><br /><br />
                    <button className="btn btn-dng-alt" onClick={this.resetColorsToDefault} type="button">
                        <Glyphicon glyph="repeat" /> Reset colors to theme default
                    </button> <br /><br />
                </div>
            );
        }

        result.push(
            <Checkbox key={13} checked={this.state.front.outputHighlight}
                onChange={this.changeHandler('front', 'outputHighlight')}>
                Enable colored output
            </Checkbox>
        );
        result.push(
            <Checkbox key={14} checked={this.state.front.autoIndent}
                onChange={this.changeHandler('front', 'autoIndent')}>
                Enable auto-indent
            </Checkbox>
        );
        if (advanced) {
            result.push(
                <Checkbox key={140} checked={this.state.front.showHiddenFiles}
                    onChange={this.changeHandler('front', 'showHiddenFiles')}>
                    Display hidden files.
                </Checkbox>
            );
            result.push(
                <Checkbox key={141} checked={this.state.front.globalLastCache}
                    onChange={this.changeHandler('front', 'globalLastCache')}>
                    Show last edited code when opening the editor.
                </Checkbox>
            );
        }
        result.push(
            <Checkbox key={15} checked={this.state.front.fullscreen}
                onChange={this.changeHandler('front', 'fullscreen')}>
                Switch editor into fullscreen mode (Use ESC to return to the normal mode.)
            </Checkbox>
        );
        result.push(
            <Checkbox key={16} checked={this.state.front.advancedMode}
                onChange={this.changeHandler('front', 'advancedMode')}>
                Show <em>more</em> things to break.
            </Checkbox>
        );
        return result;
    }

    private changeHandler(scope: string, property: string, needsReload: boolean = false) {
        return () => {
            this.setState((oldState) => {
                let deepCopy: any = this.deepCopy(oldState);
                deepCopy[scope][property] = !this.state[scope][property];
                return deepCopy;
            }, () => {
                this.saveState();
            });
            if (needsReload) {
                window.location.reload();
            }
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

        if (!getTheme(value, undefined) || this.state.front.theme === value) {
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

import * as React from 'react';
import { Checkbox } from 'react-bootstrap';

interface InterpreterSettings {
    allowUnicodeInStrings: boolean;
    allowSuccessorML: boolean;
    disableElaboration: boolean;
    allowLongFunctionNames: boolean;
    allowStructuresAnywhere: boolean;
    allowSignaturesAnywhere: boolean;
    allowFunctorsAnywhere: boolean;
}

interface InterfaceSettings {
    fullscreen: boolean;
    timeout: number;
    errorColor: string;
    successColor1: string;
    successColor2: string;
    outputHighlight: boolean;
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
        super();
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
            <h2>Einstellungen für den Interpreter</h2>
                <hr/>
                <p>
                Auf dieser Seite kannst Du einige Einstellungen am Interpreter vornehmen
                und optionale Features aktivieren.
                </p>
                <br/>
                <h4>Einstellungen für den Parser</h4>
                <Checkbox checked={this.state.inter.allowUnicodeInStrings}
                    onChange={this.changeHandler('inter', 'allowUnicodeInStrings')}>
                    Erlaube Unicode-Symbole in Zeichenketten.
                </Checkbox>
                <Checkbox checked={this.state.inter.allowStructuresAnywhere}
                    onChange={this.changeHandler('inter', 'allowStructuresAnywhere')}>
                    Erlaube, dass Strukturen in lokalen Deklarationen defeniert werden können.
                </Checkbox>
                <Checkbox checked={this.state.inter.allowSignaturesAnywhere}
                    onChange={this.changeHandler('inter', 'allowSignaturesAnywhere')}>
                    Erlaube, dass Signaturen auch außerhalb der obersten Programmebene definiert werden können.
                </Checkbox>
                <Checkbox checked={this.state.inter.allowFunctorsAnywhere}
                    onChange={this.changeHandler('inter', 'allowFunctorsAnywhere')}>
                    Erlaube, dass Funktoren auch außerhalb der obersten Programmebene definiert werden können.
                </Checkbox>
                <br/>
                <h4>Verschiedenes</h4>
                Farbe für falschen Code: <input type="color" value={this.state.front.errorColor}
                    onChange={this.colorChangeHandler('errorColor')}/><br/>
                Erste Farbe für korrekten Code:<input type="color" value={this.state.front.successColor1}
                    onChange={this.colorChangeHandler('successColor1')}/><br/>
                Zweite Farbe für korrekten Code:<input type="color" value={this.state.front.successColor2}
                    onChange={this.colorChangeHandler('successColor2')}/><br />
                <input type="button" value="Farben auf Standardwerte zurücksetzen"
                    onClick={this.resetColorsToDefault} /> <br />
                <Checkbox checked={this.state.front.outputHighlight}
                    onChange={this.changeHandler('front', 'outputHighlight')}>
                    Farbige Ausgabe aktivieren
                </Checkbox> <br />
                <Checkbox checked={this.state.inter.disableElaboration}
                    onChange={this.changeHandler('inter', 'disableElaboration')}>
                    Elaborierung <b>abschalten</b>. (Benutze diese Option, falls der Interpreter komische Geräusche
                        macht oder versucht, wegzurennen.)
                </Checkbox>
                Interpreter Timeout: <input type="number" min="0" step="100" value={this.state.front.timeout}
                    onChange={this.timeoutChangeHandler} placeholder="5000" /> Millisekunden.
                <Checkbox checked={this.state.front.fullscreen}
                    onChange={this.changeHandler('front', 'fullscreen')}>
                    Vollbildmodus im Editor akitivieren (Beenden mit ESC).
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
            allowLongFunctionNames: false,
            allowStructuresAnywhere: false,
            allowSignaturesAnywhere: false,
            allowFunctorsAnywhere: false
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
            outputHighlight: true
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

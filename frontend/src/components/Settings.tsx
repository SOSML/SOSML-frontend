import * as React from 'react';
import { Checkbox } from 'react-bootstrap';

interface State {
    allowUnicodeInStrings: boolean;
    allowSuccessorML: boolean;
    disableElaboration: boolean;
    allowLongFunctionNames: boolean;
    allowStructuresAnywhere: boolean;
    allowSignaturesAnywhere: boolean;
    allowFunctorsAnywhere: boolean;
}

class Settings extends React.Component<any, State> {
    constructor() {
        super();
        this.state = this.getSettings();
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
                <Checkbox defaultChecked={this.state.allowUnicodeInStrings}
                    onChange={this.changeHandler('allowUnicodeInStrings')}>
                    Erlaube Unicode-Symbole in Zeichenketten.
                </Checkbox>
                <Checkbox checked={this.state.allowStructuresAnywhere}
                    onChange={this.changeHandler('allowStructuresAnywhere')}>
                    Erlaube, dass Strukturen in lokalen Deklarationen defeniert werden können.
                </Checkbox>
                <Checkbox checked={this.state.allowSignaturesAnywhere}
                    onChange={this.changeHandler('allowSignaturesAnywhere')}>
                    Erlaube, dass Signaturen auch außerhalb der obersten Programmebene definiert werden können.
                </Checkbox>
                <Checkbox checked={this.state.allowFunctorsAnywhere}
                    onChange={this.changeHandler('allowFunctorsAnywhere')}>
                    Erlaube, dass Funktoren auch außerhalb der obersten Programmebene definiert werden können.
                </Checkbox>
                <h4>Verschiedenes</h4>
                <Checkbox checked={this.state.disableElaboration}
                    onChange={this.changeHandler('disableElaboration')}>
                    Elaborierung <b>abschalten</b>. (Benutze diese Option, falls der Interpreter komische Geräusche
                        macht oder versucht, wegzurennen.)
                </Checkbox>
            </div>
        );
    }

    private changeHandler(property: string) {
        return () => {
            let setty: any = {};
            setty[property] = !this.state[property];
            this.setState(setty, () => {
                this.saveState();
            });
        };
    }

    private saveState() {
        localStorage.setItem('interpreterSettings', JSON.stringify(this.state));
    }

    private getSettings(): State {
        let str: string | null = localStorage.getItem('interpreterSettings');
        let ret: State = {
            allowUnicodeInStrings: false,
            allowSuccessorML : false,
            disableElaboration: false,
            allowLongFunctionNames: false,
            allowStructuresAnywhere: false,
            allowSignaturesAnywhere: false,
            allowFunctorsAnywhere: false
        };
        if (typeof str === 'string') {
            let data: any = JSON.parse(str);
            for (let name in data) {
                if (data.hasOwnProperty(name)) {
                    ret[name] = data[name];
                }
            }
        }
        return ret;
    }
}

export default Settings;

import * as React from 'react';
import { Checkbox } from 'react-bootstrap';

interface State {
    allowUnicodeInStrings: boolean;
    allowSuccessorML: boolean;
    disableElaboration: boolean;
    allowLongFunctionNames: boolean;
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
                <Checkbox defaultChecked={this.state.allowUnicodeInStrings}
                    onChange={this.changeHandler('allowUnicodeInStrings')}>
                    Unicode Zeichen in Strings erlauben
                </Checkbox>
                <Checkbox checked={this.state.allowSuccessorML}
                    onChange={this.changeHandler('allowSuccessorML')}>
                    'SuccessorML' aktivieren
                </Checkbox>
                <Checkbox checked={this.state.disableElaboration}
                    onChange={this.changeHandler('disableElaboration')}>
                    Elaborierung <b>deaktivieren</b>
                </Checkbox>
                <Checkbox checked={this.state.allowLongFunctionNames}
                    onChange={this.changeHandler('allowLongFunctionNames')}>
                    'Lange Funktionsnamen' aktivieren
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
            allowLongFunctionNames: false
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

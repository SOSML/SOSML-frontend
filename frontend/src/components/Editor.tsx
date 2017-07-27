import * as React from 'react';

import Playground from './Playground';
import { Form , Alert, Button } from 'react-bootstrap';
import { Database, API } from '../API';
import './Editor.css';

interface State {
    shareReadMode: boolean;
    shareHash: string;
    code: string;
    initialCode: string;
    fileName: string;
}

class Editor extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = { shareReadMode: false, code: '', fileName: '',
            initialCode: this.unNullify(localStorage.getItem('tmpCode')),
            shareHash: ''
        };

        this.onFileNameBlur = this.onFileNameBlur.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleFileNameChange = this.handleFileNameChange.bind(this);
        this.handleRedirectToEdit = this.handleRedirectToEdit.bind(this);
    }

    componentDidMount() {
        if (this.props.history && this.props.history.location.state) {
            let state: any = this.props.history.location.state;
            if (state.fileName) {
                Database.getInstance().then((db: Database) => {
                    return db.getFile(state.fileName);
                }).then((content: string) => {
                    this.setState((oldState) => {
                        return {initialCode: content, fileName: state.fileName};
                    });
                    this.props.history.replace('/', {});
                });
                return;
            } else if (state.shareHash) {
                API.loadSharedCode(state.shareHash).then((content: string) => {
                    this.setState((oldState) => {
                        return {initialCode: content};
                    });
                    this.props.history.replace('/', {});
                });
                return;
            }
        }
        if (this.props.match && this.props.match.params && this.props.match.params.hash) {
            API.loadSharedCode(this.props.match.params.hash).then((content: string) => {
                this.setState((oldState) => {
                    return {initialCode: content, shareReadMode: true, shareHash: this.props.match.params.hash};
                });
            });
        }
    }

    render() {
        let topBar: any;
        if (this.state.shareReadMode) {
            topBar = (
                <Alert bsStyle="info">
                    Du betrachtest eine geteilte Datei. Um deine eigene Version dieser zu erstellen
                    <Button bsStyle="success" onClick={this.handleRedirectToEdit}>klicke hier</Button>
                </Alert>
            );
        } else {
            topBar = (
                <Form inline={true}>
                    Dateiname: <input className="form-control" type="text" onBlur={this.onFileNameBlur}
                        value={this.state.fileName} onChange={this.handleFileNameChange} />
                </Form>
            );
        }
        return (
            <div className="flexy flexcomponent">
                {topBar}
                <Playground readOnly={this.state.shareReadMode} onCodeChange={this.handleCodeChange}
                    initialCode={this.state.initialCode} />
            </div>
        );
    }

    handleRedirectToEdit() {
        this.props.history.push('/', {shareHash: this.state.shareHash});
    }

    handleFileNameChange(evt: any) {
        let name = evt.target.value;
        this.setState(prevState => {
            return {fileName: name};
        });
    }

    handleCodeChange(newCode: string) {
        if (this.state.shareReadMode) {
            return;
        }
        this.setState(prevState => {
            return {code: newCode};
        });
        if (this.state.fileName !== '') {
            Database.getInstance().then((db: Database) => {
                return db.saveFile(this.state.fileName, this.state.code);
            });
        } else {
            localStorage.setItem('tmpCode', this.state.code);
        }
    }

    onFileNameBlur(evt: any) {
        // save now!
        if (this.state.fileName !== '') {
            Database.getInstance().then((db: Database) => {
                return db.saveFile(this.state.fileName, this.state.code);
            });
        } else {
            localStorage.setItem('tmpCode', this.state.code);
        }
    }

    private unNullify(str: string | null): string {
        if (typeof str === 'string') {
            return str;
        } else {
            return '';
        }
    }

}

export default Editor;
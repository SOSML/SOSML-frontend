import * as React from 'react';

import Playground from './Playground';
import { Form , Alert, Button, Glyphicon } from 'react-bootstrap';
import { API } from '../api';
import { getColor } from '../theme';
import { getInterfaceSettings, Database, getTabId, setTabId,
         getLastCachedFile, setLastCachedFile } from '../storage';
import './Editor.css';

const FEEDBACK_NONE = 0;
const FEEDBACK_SUCCESS = 1;
const FEEDBACK_FAIL = 2;

let fileInCache: string | undefined = undefined;

interface State {
    shareReadMode: boolean;
    shareHash: string;
    code: string;
    initialCode: string;
    fileName: string;
    savedFeedback: number;
    savedFeedbackTimer: any;
}

class Editor extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            shareReadMode: false,
            code: '',
            fileName: '',
            initialCode: '',
            shareHash: '',
            savedFeedback: FEEDBACK_NONE,
            savedFeedbackTimer: null,
        };

        this.onResize = this.onResize.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleFileNameChange = this.handleFileNameChange.bind(this);
        this.handleRedirectToEdit = this.handleRedirectToEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let parts = this.props.location.search.split(/[?|&]/);
            let dfn = decodeURI(this.props.location.search.substr(2 + parts[1].length));

            if (parts.length < 2 || isNaN(+parts[1])) {
                // Not a valid GRFSD, don't do anything
                return;
            }

            let tabId = +parts[1];
            setTabId(tabId);
            let fileName = tabId + '/' + dfn;

            Database.getInstance().then((db: Database) => {
                return db.getFile(fileName, true);
            }).then((content: string) => {
                this.setState((oldState) => {
                    return {initialCode: content, fileName: dfn};
                });
            });
            return;
        }

        if (this.props.history && this.props.history.location.state) {
            let state: any = this.props.history.location.state;

            if (state.fileName) {
                let promis: Promise<String>;
                if (state.example) {
                    promis = API.getCodeExample(state.fileName);
                } else {
                    promis = Database.getInstance().then((db: Database) => {
                        return db.getFile(state.fileName);
                    });
                }
                promis.then((content: string) => {
                    this.setState((oldState) => {
                        return {initialCode: content, fileName: state.fileName};
                    });
                });
                return;
            } else if (state.shareHash) {
                API.loadSharedCode(state.shareHash).then((content: string) => {
                    this.setState((oldState) => {
                        return {initialCode: content};
                    });
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
            return;
        }

        let lfic = getLastCachedFile();
        if (fileInCache !== undefined || lfic !== undefined) {
            let fileName: string = '';
            let pfileName: string = '';
            if (fileInCache !== undefined) {
                fileName = fileInCache;
                pfileName = getTabId() + '/' + fileInCache;
            } else if (lfic !== undefined) {
                fileName = lfic.substr(lfic.indexOf('/') + 1);
                pfileName = lfic;
            }

            Database.getInstance().then((db: Database) => {
                return db.getFile(pfileName, true);
            }).then((content: string) => {
                this.setState((oldState) => {
                    return {initialCode: content, fileName: fileName};
                });
            });
            return;
        }
    }

    render() {
        let topBar: any;
        let fileForm: any;
        if (this.state.shareReadMode) {
            let style: any = {};
            style.margin = '0 3px 3px';
            topBar = (
                <Alert bsStyle="info" style={style}>
                    <b>Warning: </b>
                    You are viewing a read-only file. To create your own editable copy,
                    <div className="miniSpacer" />
                    <Button bsStyle="suc-alt" onClick={this.handleRedirectToEdit}>click here.</Button>
                </Alert>
            );
        } else {
            let style: any = {};
            let settings = getInterfaceSettings();
            let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;

            if (this.state.savedFeedback === FEEDBACK_SUCCESS) {
                style.backgroundColor = getColor(settings.theme, dt, 'success');
            } else if (this.state.savedFeedback === FEEDBACK_FAIL) {
                style.backgroundColor = getColor(settings.theme, dt, 'error');
            }
            fileForm = (
                <Form inline={true} className="inlineBlock" onSubmit={this.handleFormSubmit}>
                    <input className="form-control" type="text"
                        value={this.state.fileName} onChange={this.handleFileNameChange}
                        style={style} placeholder="File name"/>
                    <Button bsSize="small" bsStyle="pri-alt" onClick={this.handleSave}>
                        <Glyphicon glyph="file" /> Store
                    </Button>
                </Form>
            );
        }
        return (
            <div className="flexy flexcomponent">
                {topBar}
                <Playground readOnly={this.state.shareReadMode} onCodeChange={this.handleCodeChange}
                    onResize={this.onResize} initialCode={this.state.initialCode}
                    fileControls={fileForm}  />
            </div>
        );
    }

    handleFormSubmit(e: any) {
        e.preventDefault();
        this.handleSave();
    }

    handleRedirectToEdit() {
        this.props.history.push('/editor', {shareHash: this.state.shareHash});
    }

    handleFileNameChange(evt: any) {
        let name = evt.target.value;
        this.setState(prevState => {
            return {fileName: name};
        });
    }

    restartFeedbackClear(feedback: number) {
        if (this.state.savedFeedbackTimer !== null) {
            clearTimeout(this.state.savedFeedbackTimer);
        }
        let timer = setTimeout(() => {
            this.setState({savedFeedback: FEEDBACK_NONE, savedFeedbackTimer: null});
        }, 1300);
        this.setState({savedFeedback: feedback, savedFeedbackTimer: timer});
    }

    handleSave() {
        let fileName = this.state.fileName.trim();
        if (fileName !== '') {
            Database.getInstance().then((db: Database) => {
                return db.saveFile(fileName, this.state.code);
            }).then(() => {
                this.restartFeedbackClear(FEEDBACK_SUCCESS);
            }).catch(() => {
                this.restartFeedbackClear(FEEDBACK_FAIL);
            });
        } else {
            this.restartFeedbackClear(FEEDBACK_FAIL);
        }
    }

    handleCodeChange(newCode: string) {
        if (this.state.shareReadMode) {
            return;
        }
        this.setState(prevState => {
            return {code: newCode};
        });

        this.props.history.replace('/editor?' + getTabId() + '&' + this.state.fileName);

        Database.getInstance().then((db: Database) => {
            return db.saveFile(getTabId() + '/' + this.state.fileName,
                               this.state.code, true);
        });

        fileInCache = this.state.fileName;
        setLastCachedFile(getTabId() + '/' + fileInCache);
    }

    onResize() {
        if (state.shareHash === undefined) {
            this.setState(prevState => {
                return {initialCode: prevState.code};
            });
        }
    }
}

export default Editor;

import * as React from 'react';

import { Grid, Table, Button, Glyphicon } from 'react-bootstrap';
import { File, Database, API } from '../API';
import './Files.css';
import { Link } from 'react-router-dom';

const FileSaver = require('file-saver');

const EXAMPLES_LOADING = 0;
const EXAMPLES_LOADED = 1;
const EXAMPLES_FAILED = 2;

interface State {
    files: File[];
    examples: string[];
    examplesStatus: number;
    shareLink: string;
}

class Files extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            files: [],
            examples: [],
            examplesStatus: EXAMPLES_LOADING,
            shareLink: ''
        };

        this.modalCloseCallback = this.modalCloseCallback.bind(this);
    }

    componentDidMount() {
        this.refreshFiles();
    }

    render() {
        let filesView = this.state.files.map((file) => {
            return (
                <tr key={file.name}>
                    <td>
                        <Link to={'/file/' + file.name}>{file.name}</Link>
                    </td>
                    <td>
                        <Button bsStyle="pri-alt" onClick={this.downloadHandlerFor(file.name)}>
                            <Glyphicon glyph={'download-alt'} /> Download
                        </Button>
                        <div className="miniSpacer" />
                        <Button bsStyle="dng-alt" onClick={this.deleteHandlerFor(file.name)} >
                            <Glyphicon glyph={'trash'} /> Delete
                        </Button>
                    </td>
                </tr>
            );
        });
        let examplesView: any;
        if (this.state.examplesStatus === EXAMPLES_LOADED) {
            let examples = this.state.examples.map((example) => {
                return (
                    <tr key={example}>
                        <td>
                            <Link to={'/examplefile/' + example}>{example}</Link>
                        </td>
                    </tr>
                );
            });

            if (this.state.examples.length === 0) {
                examplesView = (
                    <p>There is no such thing as a sample file.</p>
                );
            } else {
                examplesView = (
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examples}
                        </tbody>
                    </Table>
                );
            }
        } else if (this.state.examplesStatus === EXAMPLES_FAILED) {
            examplesView = (
                <p>Sample files unavailable.</p>
            );
        } else {
            examplesView = (
                <p>Loading sample files...</p>
            );
        }

        if (this.state.files.length === 0) {
            return (
                <Grid className="flexy">
                <h2>Local files</h2>
                <hr/>
                <p>
                Files saved from the editor will appear here.
                </p>
                <br/>
                <h2>Sample files</h2>
                <hr/>
                {examplesView}
                </Grid>
            );
        }

        return (
            <Grid className="flexy">
                    <h2>Local Files</h2>
                    <hr/>
                    <p>
                    You can find your saved files here. Click on a file name to load it into the editor.
                    </p>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filesView}
                    </tbody>
                </Table>
                <br/>
                <h2>Sample files</h2>
                <hr/>
                {examplesView}
            </Grid>
        );
    }

    modalCloseCallback() {
        this.setState({
            shareLink: ''
        });
    }

    private refreshFiles() {
        Database.getInstance().then((db: Database) => {
            return db.getFiles();
        }).then((data: File[]) => {
            this.setState({files: data});
            return API.getCodeExamplesList();
        }).then((list: string[]) => {
            list.sort((s1: string, s2: string) => {
                if (s1 === s2) {
                    return 0; // don't need to handle this later
                }
                let rex = /^(\d+.)+\d+$/;
                let t1 = rex.test(s1);
                let t2 = rex.test(s2);
                if (t1 && t2) {
                    let split1 = s1.split('.');
                    let split2 = s2.split('.');
                    for (let i = 0; i < Math.min(split1.length, split2.length); i++) {
                        let p1 = parseInt(split1[i], 10);
                        let p2 = parseInt(split2[i], 10);
                        if (p1 !== p2) {
                            return Math.sign(p1 - p2);
                        }
                    }
                    return 0;
                } else if (t1 !== t2) {
                    return (t1) ? -1 : 1;
                } else {
                    return s1.localeCompare(s2);
                }
            });
            this.setState({examples: list, examplesStatus: EXAMPLES_LOADED});
        }).catch((e) => {
            this.setState({examplesStatus: EXAMPLES_FAILED});
        });
    }

    private downloadHandlerFor(fileName: string): (evt: any) => void {
        return (evt: any) => {
            Database.getInstance().then((db: Database) => {
                return db.getFile(fileName);
            }).then((content: string) => {
                let blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
                fileName += '.sml';
                FileSaver.saveAs(blob, fileName);
            });
        };
    }

    private deleteHandlerFor(fileName: string): (evt: any) => void {
        return (evt: any) => {
            Database.getInstance().then((db: Database) => {
                return db.deleteFile(fileName);
            }).then((ok: boolean) => {
                if (ok) {
                    this.refreshFiles();
                }
            });
        };
    }
}

export default Files;

import * as React from 'react';

import ShareModal from './ShareModal';
import { Grid , Table, Button, Glyphicon } from 'react-bootstrap';
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

const SHARE_LINK_ERROR = ':ERROR';

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
                    <td>Lokal</td>
                    <td>
                        <Button bsStyle="primary" onClick={this.downloadHandlerFor(file.name)}>
                            <Glyphicon glyph={'download-alt'} /> Herunterladen
                        </Button>
                        <div className="miniSpacer" />
                        <Button bsStyle="primary" onClick={this.shareHandlerFor(file.name)}>
                            <Glyphicon glyph={'link'} /> Teilen
                        </Button>
                        <div className="miniSpacer" />
                        <Button bsStyle="danger" onClick={this.deleteHandlerFor(file.name)} >
                            <Glyphicon glyph={'trash'} /> Löschen
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
        } else if (this.state.examplesStatus === EXAMPLES_FAILED) {
            examplesView = (
                <p>Beispieldateien konnten nicht geladen werden.</p>
            );
        } else {
            examplesView = (
                <p>Beispieldateien werden geladen...</p>
            );
        }

        let modal: JSX.Element | undefined;
        if (this.state.shareLink !== '') {
            modal = (
                <ShareModal error={this.state.shareLink === SHARE_LINK_ERROR}
                    link={this.state.shareLink} closeCallback={this.modalCloseCallback} />
            );
        }

        if (this.state.files.length === 0) {
            return (
                <Grid className="flexy">
                    <h2>Lokale Dateien und Programmbeispiele</h2>
                    <hr/>
                    <h4>Lokale Dateien</h4>
                    <p>
                    Du hast noch keine Dateien gespeichert.
                    </p>
                    <h4>Beispieldateien</h4>
                    {examplesView}
                    {modal}
                </Grid>
            );
        }

        return (
            <Grid className="flexy">
                    <h2>Lokale Dateien und Programmbeispiele</h2>
                    <hr/>
                    <h4>Lokale Dateien</h4>
                    <p>
                    Du findest hier Deine gespeicherten Programme. Clicke auf einen Dateinamen, um eine
                    Datei in den Editor zu laden.
                    </p>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Typ</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filesView}
                    </tbody>
                </Table>
                <h4>Beispieldateien</h4>
                {examplesView}
                {modal}
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
                if (fileName.indexOf('.') === -1) {
                    fileName = fileName + '.sml';
                }
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

    private shareHandlerFor(fileName: string): (evt: any) => void {
        return (evt: any) => {
            Database.getInstance().then((db: Database) => {
                return db.getFile(fileName);
            }).then((content: string) => {
                return API.shareCode(content);
            }).then((hash: string) => {
                this.setState({
                    shareLink: window.location.host + '/share/' + hash
                });
            }).catch((e: any) => {
                this.setState({
                    shareLink: SHARE_LINK_ERROR
                });
            });
        };
    }
}

export default Files;

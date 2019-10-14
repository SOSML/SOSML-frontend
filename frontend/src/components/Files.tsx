import * as React from 'react';

import { Fade, Button, OverlayTrigger, Tooltip, Grid, Table, Glyphicon } from 'react-bootstrap';
import { File, FileType, Database, API } from '../API';
import './Files.css';
import { SAMPLE_FILES_ENABLED } from '../config';
import { getColor } from '../themes';
import { getInterfaceSettings } from './Settings';

const FileSaver = require('file-saver');

const EXAMPLES_LOADING = 0;
const EXAMPLES_LOADED = 1;
const EXAMPLES_FAILED = 2;

interface State {
    files: File[];
    examples: File[];
    examplesStatus: number;
    shareLink: string;
    folder: any;
}

class Files extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            files: [],
            examples: [],
            examplesStatus: EXAMPLES_LOADING,
            shareLink: '',
            folder: {}
        };

        this.modalCloseCallback = this.modalCloseCallback.bind(this);
    }

    componentDidMount() {
        this.refreshFiles();
    }

    render() {
        if (this.state.files.length === 0) {
            return (
                <Grid className="flexy">
                    <h2>Files</h2>
                    <hr/>
                    <h4>Local Files</h4>
                    <p>
                        Files saved from the editor will appear here.
                    </p>
                    {this.renderExamples()}
                </Grid>
            );
        }

        let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        let files = this.deepCopy(this.state.files);
        files.sort((f1: File, f2: File) => {
            return collator.compare(f1.name, f2.name);
        });

        return (
            <Grid className="flexy">
                    <h2>Files</h2>
                    <hr/>
                    <h4>Local Files</h4>
                    <p>
                    You can find your saved files here.
                        Clicking on a file will load it into the editor.
                    </p>
                    {this.renderFileList(files)}
                    {this.renderExamples()}
                    <br/> <br/>
            </Grid>
        );
    }

    modalCloseCallback() {
        this.setState({
            shareLink: ''
        });
    }

    private renderExamples() {
        if (!SAMPLE_FILES_ENABLED) {
            return '';
        }

        let examplesView: any[] = [];
        examplesView.push(
            <br key="1"/>
        );
        examplesView.push(
            <h4 key="2">Sample Files</h4>
        );
        if (this.state.examplesStatus === EXAMPLES_LOADED) {
            let examples = this.renderFileList(this.state.examples);

            if (this.state.examples.length === 0) {
                examplesView.push(
                    <p key="3">There is no such thing as a sample file.</p>
                );
            } else {
                examplesView.push(
                    <Table key="3" hover={true}>
                        <tbody>
                            {examples}
                        </tbody>
                    </Table>
                );
            }
        } else if (this.state.examplesStatus === EXAMPLES_FAILED) {
            examplesView.push(
                <p key="3">Sample files unavailable.</p>
            );
        } else {
            examplesView.push(
                <p key="3">Loading sample files...</p>
            );
        }

        return examplesView;
    }

    private renderFileList(files: File[], prefix: string = ''): any {
        let style: any = {};
        style.textAlign = 'center';
        // let filesView = this.state.files.map((file) => { return this.renderFile(file); });
        let filesView: any[] = [];

        let currentFolder: File[] = [];
        let currentFolderName: string = '';

        for (let i = 0; i < files.length; ++i) {
            // If filename starts with '<string>/', render it as part of a folder
            let currentName = files[i].name.substr(prefix.length).split('/');
            if (currentName.length > 1 && currentName[0] !== '') {
                let newFolder = currentName[0];
                if (currentFolderName === newFolder) {
                    currentFolder.push(files[i]);
                } else {
                    if (currentFolderName !== '') {
                        if (currentFolder.length > 1) {
                            filesView.push(this.renderFolder(currentFolderName,
                                                             currentFolder, i - 1, prefix));
                        } else {
                            filesView.push(this.renderFile(currentFolder[0], i - 1, prefix));
                        }
                        filesView.push(this.renderFile(undefined, files.length + i - 1));
                    }
                    currentFolder = [files[i]];
                    currentFolderName = newFolder;
                }
                continue;
            } else if (currentFolder.length > 0) {
                if (currentFolder.length > 1) {
                    filesView.push(this.renderFolder(currentFolderName,
                                                     currentFolder, i - 1, prefix));
                } else {
                    filesView.push(this.renderFile(currentFolder[0], i - 1, prefix));
                }
                filesView.push(this.renderFile(undefined, files.length + i - 1));
                currentFolder = [];
                currentFolderName = '';
            }

            filesView.push(this.renderFile(files[i], i, prefix));
            if (i < files.length - 1) {
                filesView.push(this.renderFile(undefined, files.length + i));
            }
        }
        if (currentFolder.length > 0) {
            if (currentFolder.length > 1) {
                if (currentFolder.length === files.length && prefix !== '') {
                    // Folder only contains subfolder
                    return undefined;
                }
                filesView.push(this.renderFolder(currentFolderName,
                                                 currentFolder, files.length - 1, prefix));
            } else {
                filesView.push(this.renderFile(currentFolder[0], files.length - 1, prefix));
            }
        }

        return (
            <Table hover={true}>
                <tbody>
                    {filesView}
                </tbody>
            </Table>
        );
    }

    private renderFolder(name: string, files: File[], key: number, prefix: string = ''): any {
        let renderedFiles = this.renderFileList(files, prefix + name + '/');
        if (renderedFiles === undefined) {
            // Folder contains only a single subfolder
            let newPrefix = files[0].name.substr(prefix.length).split('/')[1];
            return this.renderFolder(name + '/' + newPrefix, files, key, prefix);
        }

        let folderState: boolean = this.state.folder[prefix + name + files[0].type];

        let style4: any = {};
        style4.borderRight = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style4.borderLeft = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style4.borderBottom = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style4.borderTop = 'none';
        let style3: any = {};
        style3.marginTop = '-8.8px';
        style3.marginRight = '-9px';
        style3.marginLeft = '8px';
        let style2: any = {};
        style2.borderTop = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style2.borderRight = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        if (!folderState) {
            style2.borderBottom = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        }
        style2.whiteSpace = 'nowrap';
        style2.textAlign = 'right';
        style2.verticalAlign = 'top';
        let style: any = {};
        style.borderTop = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style.borderLeft = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        if (!folderState) {
            style.borderBottom = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        }
        style.whiteSpace = 'nowrap';
        style.overflow = 'hidden';
        style.textOverflow = 'ellipsis';
        style.maxWidth = '8em';

        let space = (
            <div className="miniSpacer" />
        );
        let deleteBtn = (
            <Button bsSize="small" bsStyle="dng-alt"
                onClick={this.deleteHandlerForAll(files)} style={style3}>
                <Glyphicon glyph={'trash'} /> Delete All
            </Button>
        );

        let tooltip = (
            <Tooltip id={'tooltip' + key}>
                {name}
            </Tooltip>
        );

        let result: any[] = [];
        result.push(
            <tr key={key}>
                <td style={style} onClick={this.toggleFolder(prefix + name + files[0].type)}>
                    <OverlayTrigger overlay={tooltip}>
                    <Glyphicon glyph={folderState ? 'folder-open' : 'folder-close'} />
                    </OverlayTrigger>
                    {space}
                    {name}
                </td>
                <td style={style2} onClick={this.toggleFolder(prefix + name + files[0].type)}>
                    <Button bsSize="small" bsStyle="suc-alt"
                    onClick={this.toggleFolder(prefix + name + files[0].type)} style={style3}>
                        <Glyphicon glyph={folderState ? 'folder-close' : 'folder-open'} />
                        {space}
                        {(folderState ? 'Hide ' : 'Show ') + files.length + ' Files'}
                    </Button>
                    {files.length >= 1 && files[0].type === FileType.LOCAL ? space : ''}
                    {files.length >= 1 && files[0].type === FileType.LOCAL ? deleteBtn : ''}
                </td>
            </tr>
        );
        result.push(
            <Fade in={folderState} unmountOnExit={true} timeout={10}>
            <tr key={key + 't1'} className="no-hover">
                <td colSpan={2} style={style4}>
                    <div>
                    {renderedFiles}
                    </div>
                </td>
            </tr>
            </Fade>
        );
        return result;
    }

    private renderFile(file: File | undefined, key: number, prefix: string = '') {
        let style4: any = {};
        style4.padding = '2.5px';
        let style3: any = {};
        style3.marginTop = '-8.8px';
        style3.marginRight = '-9px';
        style3.marginLeft = '8px';
        let style2: any = {};
        style2.borderTop = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style2.borderRight = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style2.borderBottom = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style2.whiteSpace = 'nowrap';
        style2.textAlign = 'right';
        style2.verticalAlign = 'top';
        let style: any = {};
        style.borderTop = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style.borderLeft = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style.borderBottom = '1px solid ' + getColor(getInterfaceSettings().theme, 'border');
        style.whiteSpace = 'nowrap';
        style.overflow = 'hidden';
        style.textOverflow = 'ellipsis';
        style.maxWidth = '8em';
        style.verticalAlign = 'bottom';

        if (file === undefined) {
            return (
                <tr key={key} className="no-hover">
                    <td style={style4}/>
                    <td style={style4}/>
                </tr>
            );
        }

        let printName = file.name.substr(prefix.length);

        let space = (
            <div className="miniSpacer" />
        );
        let deleteBtn = (
            <Button bsSize="small" bsStyle="dng-alt"
                onClick={this.deleteHandlerFor(file.name)} style={style3}>
                <Glyphicon glyph={'trash'} /> Delete
            </Button>
        );

        let tooltip = (
            <Tooltip id={'tooltip' + key}>
                {printName}
            </Tooltip>
        );

        return (
            <tr key={key}>
                <td style={style} onClick={this.openHandlerFor(file)}>
                <OverlayTrigger overlay={tooltip}>
                        <Glyphicon glyph={'file'} />
                    </OverlayTrigger>
                    {space}
                    {printName}
                </td>
                <td style={style2} onClick={this.openHandlerFor(file)}>
                    <Button bsSize="small" bsStyle="suc-alt"
                    onClick={this.openHandlerFor(file)} style={style3}>
                        <Glyphicon glyph={'open'} /> Load
                    </Button>
                    <div className="miniSpacer" />
                    <Button bsSize="small" bsStyle="pri-alt"
                    onClick={this.downloadHandlerFor(file)} style={style3}>
                        <Glyphicon glyph={'download-alt'} /> Save
                    </Button>
                    {file.type === FileType.LOCAL ? space : ''}
                    {file.type === FileType.LOCAL ? deleteBtn : ''}
                </td>
            </tr>
        );
    }

    private refreshFiles() {
        if (SAMPLE_FILES_ENABLED) {
            Database.getInstance().then((db: Database) => {
                return db.getFiles();
            }).then((data: File[]) => {
                this.setState({files: data});
                return API.getCodeExamplesList();
            }).then((list: string[]) => {
                let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
                list.sort(collator.compare);

                this.setState({examples: list.map((file) => {
                    return {
                        'name': file,
                        'info': '',
                        'type': FileType.SERVER
                    };
                }), examplesStatus: EXAMPLES_LOADED});
            }).catch((e) => {
                this.setState({examplesStatus: EXAMPLES_FAILED});
            });
        } else {
            Database.getInstance().then((db: Database) => {
                return db.getFiles();
            }).then((data: File[]) => {
                this.setState({files: data});
                return 0;
            });
        }
    }

    private deepCopy(json: any): any {
        return JSON.parse(JSON.stringify(json));
    }

    private toggleFolder(folderName: string): (evt: any) => void {
        return (evt: any) => {
            this.setState((oldState) => {
                let deepCopy: any = this.deepCopy(oldState);
                deepCopy.folder[folderName] = !deepCopy.folder[folderName];
                return deepCopy;
            });
            evt.stopPropagation();
        };
    }

    private openHandlerFor(file: File): (evt: any) => void {
        return (evt: any) => {
            this.props.history.push('/editor', {fileName: file.name,
                                    example: file.type === FileType.SERVER });
            evt.stopPropagation();
        };
    }

    private downloadHandlerFor(file: File): (evt: any) => void {
        return (evt: any) => {
            let promis: any;
            if (file.type === FileType.LOCAL) {
                promis = Database.getInstance().then((db: Database) => {
                    return db.getFile(file.name);
                });
            } else {
                promis = API.getCodeExample(file.name);
            }

            promis.then((content: string) => {
                let blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
                file.name += '.sml';
                FileSaver.saveAs(blob, file.name);
            });
            evt.stopPropagation();
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
            evt.stopPropagation();
        };
    }

    private deleteHandlerForAll(files: File[]): (evt: any) => void {
        return (evt: any) => {
            files.forEach((file: File) => {
                Database.getInstance().then((db: Database) => {
                    return db.deleteFile(file.name);
                });
            });
            this.refreshFiles();
            evt.stopPropagation();
        };
    }
}

export default Files;

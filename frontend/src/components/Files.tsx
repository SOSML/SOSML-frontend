import * as React from 'react';

import { Fade, Button, OverlayTrigger, Tooltip, Container, Table } from 'react-bootstrap';
import { API } from '../api';
import { SAMPLE_FILES_ENABLED, SHARING_ENABLED } from '../config';
import ShareModal from './ShareModal';
import { getColor } from '../theme';
import { displayName, getInterfaceSettings, File, FileType, Database } from '../storage';

const FileSaver = require('file-saver');

const EXAMPLES_LOADING = 0;
const EXAMPLES_LOADED = 1;
const EXAMPLES_FAILED = 2;

const MINIMODE_LB = 450;

interface State {
    files: File[];
    shares: File[];
    examples: File[];
    examplesStatus: number;
    shareLink: string;
    folder: any;
    miniMode: boolean;
}

class Files extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            files: [],
            shares: [],
            examples: [],
            examplesStatus: EXAMPLES_LOADING,
            shareLink: '',
            folder: {},
            miniMode: false
        };

        this.modalCloseCallback = this.modalCloseCallback.bind(this);
        this.handleBrowserResize = this.handleBrowserResize.bind(this);
    }

    componentDidMount() {
        this.refreshFiles();
        let width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
        this.setState({miniMode: (width < MINIMODE_LB)});
        window.addEventListener('resize', this.handleBrowserResize, {passive: true});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleBrowserResize);
    }

    render() {
        let modal: JSX.Element | undefined;
        if (this.state.shareLink !== '') {
            modal = (
                <ShareModal error={false}
                    link={this.state.shareLink} closeCallback={this.modalCloseCallback}
                    enocontract={false} formContractCallback={this.modalCloseCallback}/>
            );
        }


        if (this.state.files.length === 0) {
            return (
                <Container className="flexy">
                    <h2>Files</h2>
                    <hr/>
                    <h4>Local Files</h4>
                    <p>
                        Files saved from the editor will appear here.
                    </p>
                    {this.renderShares()}
                    {this.renderExamples()}
                    {modal}
                    <br/> <br/>
                </Container>
            );
        }

        let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        let files = this.deepCopy(this.state.files);
        files.sort((f1: File, f2: File) => {
            return collator.compare(displayName(f1), displayName(f2));
        });

        return (
            <Container className="flexy">
                    <h2>Files</h2>
                    <hr/>
                    <h4>Local Files</h4>
                    <p>
                    You can find your saved files here.
                        Click on a file to load it into the editor.
                    </p>
                    {this.renderFileList(files)}
                    {this.renderShares()}
                    {this.renderExamples()}
                    {modal}
                    <br/> <br/>
            </Container>
        );
    }

    modalCloseCallback() {
        this.setState({
            shareLink: ''
        });
    }

    private handleBrowserResize() {
        let nwidth = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
        this.setState({miniMode: (nwidth < MINIMODE_LB)});
    }

    private renderShares() {
        if (!SHARING_ENABLED) {
            return '';
        }

        let sharesView: any[] = [];
        sharesView.push(
            <br key="s@1"/>
        );
        sharesView.push(
            <h4 key="s@2">Shared Files</h4>
        );
        sharesView.push(
            <p key="s@3">Below you can find the share links you created
            (denoted by <span className="glyphicon glyphicon-upload"/>), as well
            as external share links you opened (denoted by <span className="glyphicon glyphicon-download" />).
                Click on a file to view it in the editor.
            </p>
        );

        let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        let shares = this.deepCopy(this.state.shares);

        if (shares.length === 0) {
            return '';
        }

        shares.sort((f1: File, f2: File) => {
            return collator.compare(displayName(f1), displayName(f2));
        });

        sharesView.push(
            <div key="s@4">
                {this.renderFileList(shares)}
            </div>
        );
        return sharesView;
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
                <p key="3">Loading sample files…</p>
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
            let currentName = displayName(files[i]).substr(prefix.length).split('/');
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
            let newPrefix = displayName(files[0]).substr(prefix.length).split('/')[1];
            return this.renderFolder(name + '/' + newPrefix, files, key, prefix);
        }

        let folderState: boolean = this.state.folder[prefix + name + files[0].type];
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;

        let style4: any = {};
        style4.borderRight = '1px solid ' + getColor(settings.theme, dt, 'border');
        style4.borderLeft = '1px solid ' + getColor(settings.theme, dt, 'border');
        style4.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        style4.borderTop = 'none';
        let style3: any = {};
        style3.marginTop = '-8.8px';
        style3.marginRight = '-9px';
        style3.marginLeft = '8px';
        let style2: any = {};
        style2.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.borderRight = '1px solid ' + getColor(settings.theme, dt, 'border');
        if (!folderState) {
            style2.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        }
        style2.whiteSpace = 'nowrap';
        style2.textAlign = 'right';
        style2.verticalAlign = 'top';
        style2.fontFamily = 'monospace';
        let style: any = {};
        style.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.borderLeft = '1px solid ' + getColor(settings.theme, dt, 'border');
        if (!folderState) {
            style.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        }
        style.whiteSpace = 'nowrap';
        style.overflow = 'hidden';
        style.textOverflow = 'ellipsis';
        style.maxWidth = '8em';
        style.fontFamily = 'monospace';

        let space = (
            <div className="miniSpacer" />
        );
        let deleteBtn = (
            <Button size="sm" className="button btn-dng-alt"
                onClick={this.deleteHandlerForAll(files)} style={style3}>
                <span className="glyphicon glyphicon-trash" /> { this.state.miniMode ? '' :
                    (files.length >= 1 && files[0].type
                    === FileType.SHARE ? "Forget All" : "Delete All")}
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
                    <div className={'glyphicon glyphicon-'
                        + (folderState ? 'folder-open' : 'folder-close')} />
                    </OverlayTrigger>
                    {space}
                    {name}
                </td>
                <td style={style2} onClick={this.toggleFolder(prefix + name + files[0].type)}>
                    <Button size="sm" className="button btn-suc-alt"
                    onClick={this.toggleFolder(prefix + name + files[0].type)} style={style3}>
                        <div className={'glyphicon glyphicon-'
                            + (folderState ? 'folder-close' : 'folder-open')} />
                        {space}
                        {(folderState ? 'Hide ' : 'Show ') + files.length + ' Files'}
                    </Button>
                    {files.length >= 1 && files[0].type !== FileType.SERVER ? space : ''}
                    {files.length >= 1 && files[0].type !== FileType.SERVER ? deleteBtn : ''}
                </td>
            </tr>
        );
        result.push(
            <Fade key={key + 'fade1'} in={folderState} unmountOnExit={true} timeout={10}>
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
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;

        let style4: any = {};
        style4.padding = '2.5px';
        let style3: any = {};
        style3.marginTop = '-8.8px';
        style3.marginRight = '-9px';
        style3.marginLeft = '8px';
        let style2: any = {};
        style2.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.borderRight = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.whiteSpace = 'nowrap';
        style2.textAlign = 'right';
        style2.verticalAlign = 'top';
        style2.fontFamily = 'monospace';
        let style: any = {};
        style.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.borderLeft = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.whiteSpace = 'nowrap';
        style.overflow = 'hidden';
        style.textOverflow = 'ellipsis';
        style.maxWidth = '8em';
        style.verticalAlign = 'bottom';
        style.fontFamily = 'monospace';

        if (file === undefined) {
            return (
                <tr key={key} className="no-hover">
                    <td style={style4}/>
                    <td style={style4}/>
                </tr>
            );
        }

        let printName = displayName(file).substr(prefix.length);

        let space = (
            <div className="miniSpacer" />
        );
        let deleteBtn = (
            <Button size="sm" className="button btn-dng-alt"
                onClick={this.deleteHandlerFor(file.name)} style={style3}>
                <span className="glyphicon glyphicon-trash" /> {this.state.miniMode ? "" : "Delete"}
            </Button>
        );
        let forgetBtn = (
            <Button size="sm" className="button btn-dng-alt"
                onClick={this.deleteHandlerFor(file.name, true)} style={style3}>
                <span className="glyphicon glyphicon-trash" /> {this.state.miniMode ? "" : "Forget"}
            </Button>
        );
        let linkBtn = (
            <Button size="sm" className="button btn-pri-alt"
                onClick={this.linkHandlerFor(file)} style={style3}>
                <span className="glyphicon glyphicon-link" /> {this.state.miniMode ? "" : "Link"}
            </Button>
        );

        let tooltip = (
            <Tooltip id={'tooltip' + key}>
                {printName}
            </Tooltip>
        );

        let glicon = 'file';

        if (file.type === FileType.SHARE) {
            glicon = 'download';

            if (file.info !== undefined && file.info.origin !== undefined
                && file.info.origin === FileType.LOCAL) {
                glicon = 'upload';
            }
        }

        return (
            <tr key={key}>
                <td style={style} onClick={this.openHandlerFor(file)}>
                <OverlayTrigger overlay={tooltip}>
                        <div className={'glyphicon glyphicon-' + glicon} />
                    </OverlayTrigger>
                    {space}
                    {printName}
                </td>
                <td style={style2} onClick={this.openHandlerFor(file)}>
                    <Button size="sm" className="button btn-suc-alt"
                    onClick={this.openHandlerFor(file)} style={style3}>
                        <div className={'glyphicon glyphicon-' +
                            (file.type === FileType.SHARE ? 'search'
                            : 'pencil')} /> {this.state.miniMode ? "" :
                            (file.type === FileType.SHARE ? "View" : "Edit")}
                    </Button>
                    {file.type === FileType.SHARE ? space : ''}
                    {file.type === FileType.SHARE ? linkBtn : ''}
                    <div className="miniSpacer" />
                    <Button size="sm" className="button btn-pri-alt"
                    onClick={this.downloadHandlerFor(file)} style={style3}>
                        <span className="glyphicon glyphicon-download-alt" /> {this.state.miniMode ? "" : "Save"}
                    </Button>
                    {file.type !== FileType.SERVER ? space : ''}
                    {file.type === FileType.LOCAL ? deleteBtn : ''}
                    {file.type === FileType.SHARE ? forgetBtn : ''}
                </td>
            </tr>
        );
    }

    private refreshFiles() {
        if (SAMPLE_FILES_ENABLED) {
            Database.getInstance().then((db: Database) => {
                return db.getFiles(getInterfaceSettings().showHiddenFiles, true);
            }).then((data: File[]) => {
                this.setState({files: data.filter((f: File) => f.type !== FileType.SHARE)});
                this.setState({shares: data.filter((f: File) => f.type === FileType.SHARE)});
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
                return db.getFiles(getInterfaceSettings().showHiddenFiles, true);
            }).then((data: File[]) => {
                this.setState({files: data.filter((f: File) => f.type !== FileType.SHARE)});
                this.setState({shares: data.filter((f: File) => f.type === FileType.SHARE)});
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

    private linkHandlerFor(file: File): (evt: any) => void {
        return (evt: any) => {
            this.setState({
                shareLink: window.location.origin + '/share/' + file.name
            });
            evt.stopPropagation();
        };
    }

    private openHandlerFor(file: File): (evt: any) => void {
        if (file.type === FileType.SHARE) {
            return (evt: any) => {
                this.props.history.push('/share/' + file.name);
                evt.stopPropagation();
            };
        }
        return (evt: any) => {
            this.props.history.push('/editor', {fileName: file.name,
                                    example: file.type === FileType.SERVER});
            evt.stopPropagation();
        };
    }

    private downloadHandlerFor(file: File): (evt: any) => void {
        return (evt: any) => {
            let promis: any;
            if (file.type !== FileType.SERVER) {
                promis = Database.getInstance().then((db: Database) => {
                    return db.getFile(file.name, false, file.type === FileType.SHARE);
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

    private deleteHandlerFor(fileName: string, isShare: boolean = false): (evt: any) => void {
        return (evt: any) => {
            Database.getInstance().then((db: Database) => {
                return db.deleteFile(fileName, false, isShare);
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
                    return db.deleteFile(file.name, false, file.type === FileType.SHARE);
                });
            });
            this.refreshFiles();
            evt.stopPropagation();
        };
    }
}

export default Files;

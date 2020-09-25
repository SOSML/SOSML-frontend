import * as React from 'react';

import { Fade, Button, OverlayTrigger, Tooltip, Container, Table } from 'react-bootstrap';
// import { API } from '../api';
// import { SAMPLE_FILES_ENABLED, SHARING_ENABLED } from '../config';
import { getColor } from '../theme';
import { getInterfaceSettings, InterpreterSettings } from '../storage';

// const FileSaver = require('file-saver');

const WISHES_LOADING = 0;
// const WISHES_LOADED = 1;
// const WISHES_FAILED = 2;

const MINIMODE_LB = 450;

interface InterpretationField {
    interpreterFlags: InterpreterSettings;
    beforeCode: string; // code to be executed before any user-entered code
    userDefaultCode: string; // default code displayed
    afterCode: string; // code used to check the user's input for correctness
}

interface WishPart {
    description: string;
    code: InterpretationField;
}

interface Wish {
    id: string;
    name: string; // Name of the wish
    prerequesites: string[]; // names of the wishes that should be completed before this wish
    parts: WishPart[];
}

interface WishSeries {
    id: string;
    name: string;
    description: string;
    wishes: Wish[];
}

interface State {
    wishes: WishSeries[]; // wish series shipped with SOSML-frontend
    externalWishes: WishSeries[]; // wishes available on the server
    sharedWishes: WishSeries[]; // invisible/shared online wishes only obtainable via share link
    externalWishesStatus: number;
    miniMode: boolean; // shrink everything on small screens
    folder: any;

    wish: Wish | null; // currently opened Wish
    wishPart: number | null; // currently opened wish part
}

class Wishes extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            wishes: [],
            externalWishes: [],
            sharedWishes: [],
            externalWishesStatus: WISHES_LOADING,
            miniMode: false,
            folder: {},

            wish: null,
            wishPart: null,
        };

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
        let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        let wishes = this.deepCopy(this.state.wishes);
        wishes.sort((q1: WishSeries, q2: WishSeries) => {
            return collator.compare(q1.id, q2.id);
        });

        wishes = [
            {
                id: "test1",
                name: "Test Series",
                description: `This is a **test** wish series.
                And __this__ is its description.
                And \`\`val x = "Hello World";\`\` is some sample code.`,
                wishes: [
                    {
                    id: "1",
                    name: "Test Wish 1",
                    prerequesites: [],
                    parts: [
                        {
                            description: "Description of some task",
                            code: {

                            }
                        },
                        {
                            description: "Description of some task",
                            code: {

                            }
                        }
                    ]
                },
                    {
                    name: "Test Wish 2",
                    prerequesites: [],
                    id: "2",
                    parts: [
                        {
                            description: "Description of some task",
                            code: {

                            }
                        },
                        {
                            description: "Description of some task",
                            code: {

                            }
                        }
                    ]
                }]
            },
            {
                id: "test2",
                name: "Test Series 2",
                description: "This is a second test wish series.\nAnd this is its description.",
                wishes: []
            }
        ];

        if( this.state.wish === null || this.state.wishPart === null ) {
            // User is not currently working on a wish
            return (
                <Container className="flexy">
                        <h2>Wishes</h2>
                        <hr/>
                        {this.renderWishList(wishes)}
                        {this.renderExternalWishes()}
                        {this.renderSharedWishes()}
                        <br/> <br/>
                </Container>
            );
        } else {
            // Render the current wish (part)
            return (
                <Container className="flexy">
                        <h2>Wishes: {this.state.wish.name}</h2>
                        <br/> <br/>
                </Container>
            );
        }
    }

    private parseDescriptionString(description: string, key: string, endDelim: string = ''): any {
        let descr: any[] = [];

        let pos = 0;
        let curpart = "";
        while (pos < description.length) {
            switch(description[pos]) {
                case '\n':
                    descr.push(<span key={'td@' + key + '@' + pos}>
                               {curpart}
                               </span>);
                    descr.push(<br key={'tdb@' + key + '@' + pos }/>);
                    curpart = "";
                    break;
                default:
                    break;
            }
            if(pos + 1 < description.length) {
                if( description[pos] + description[pos + 1] === endDelim) {
                    break;
                }
                let found = false;
                switch(description[pos] + description[pos + 1]) {
                    case '**':
                    case '__':
                    case '``':
                        found = true;
                        break;
                    default:
                        break;
                }
                if( found ) {
                    let inner = this.parseDescriptionString(description.substr(pos + 2), key,
                                description[pos] + description[pos + 1]);
                    descr.push(<span key={'td@' + key + '@' + pos}> {curpart} </span>);
                    curpart = "";
                    switch(description[pos] + description[pos + 1]) {
                    case '**':
                        descr.push(<b key={'tdbold@' + key + '@' + pos }> {inner[0]} </b>);
                        break;
                    case '__':
                        descr.push(<i key={'tdit@' + key + '@' + pos }> {inner[0]} </i>);
                        break;
                    case '``':
                        descr.push(<code key={'tdcode@' + key + '@' + pos }> {inner[0]} </code>);
                        break;
                    default:
                       break;
                    }
                    pos += inner[1] + 4;
                }
            }

            curpart += description[pos];
            pos++;
        }

        descr.push(<span key={'td@' + key + '@' + pos}>{curpart}</span>);
        return [descr, pos];
    }

    private renderExternalWishes() : any {
    }

    private renderSharedWishes() : any {
    }

    private renderFolder(name: string, description: string, inner: any, key: string): any {
        let folderState: boolean = this.state.folder[name + key];
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;

        let style5: any = {};
        style5.borderRight = '1px solid ' + getColor(settings.theme, dt, 'border');
        style5.borderLeft = '1px solid ' + getColor(settings.theme, dt, 'border');
        if( !folderState)
            style5.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
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
        if( description !== '' || !folderState )
            style2.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.whiteSpace = 'nowrap';
        style2.textAlign = 'right';
        style2.verticalAlign = 'top';
        let style: any = {};
        style.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.borderLeft = '1px solid ' + getColor(settings.theme, dt, 'border');
        if( description !== '' || !folderState )
            style.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.whiteSpace = 'nowrap';
        style.overflow = 'hidden';
        style.textOverflow = 'ellipsis';
        style.maxWidth = '8em';
        if( description !== '' ) {
            style.fontSize = 'large';
        }
        style.fontFamily = 'monospace';

        let space = (
            <div className="miniSpacer" />
        );

        let tooltip = (
            <Tooltip id={'tooltip' + key}>
                {name}
            </Tooltip>
        );

        let desc = (
            <div key={"sd@" + key}>
                {this.parseDescriptionString(description, key)[0]}
            </div>
        );

        let result: any[] = [];

        result.push(
            <tr key={key}>
                <td style={style} onClick={this.toggleFolder(name + key)}>
                    <OverlayTrigger overlay={tooltip}>
                    <div className={'glyphicon glyphicon-exclamation-sign'}
                        style={{'fontSize': '75%'}}/>
                    </OverlayTrigger>
                    {space}
                    {name}
                </td>
                <td style={style2} onClick={this.toggleFolder(name + key)}>
                    <Button
                        key={key + '@b1'}
                        size="sm" className="button btn-suc-alt"
                        onClick={this.toggleFolder(name + key)} style={style3}>
                        <div className={'glyphicon glyphicon-'
                            + (folderState ? 'folder-close' : 'folder-open')} />
                        {space}
                        {(folderState ? 'Hide' : 'Show') + ' Progress'}
                    </Button>
                </td>
            </tr>
        );
        if(description !== '') {
            result.push(
                <tr key={key + 't@1'} className="no-hover">
                    <td colSpan={2} style={style5}>
                        {desc}
                    </td>
                </tr>
            );
        }
        result.push(
            <Fade key={key + 'fade1'} in={folderState} unmountOnExit={true} timeout={10}>
                <tr key={key + 't1'} className="no-hover">
                    <td colSpan={2} style={style4}>
                        <div>
                        {inner}
                        </div>
                    </td>
                </tr>
            </Fade>
        );
        return result;
    }

    private renderWish(wish: Wish, key: string): any {
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

        let parts: any[] = [];
        let space = (
            <div className="miniSpacer" />
        );
        for( let i = 0; i < wish.parts.length; i++ ) {
            if (i > 0) {
                parts.push(space);
            }
            parts.push(
                <Button size="sm" className="button btn-suc-alt"
                    onClick={this.openHandlerFor(wish, i)}
                    key={key + '@b@' + i}
                    style={style3}>
                        <div className={'glyphicon glyphicon-exclamation-sign'} />
                    </Button>
            );
        }

        let currentPart = 0;

        let tooltip = (
            <Tooltip id={'tooltip' + key}>
                {wish.name}
            </Tooltip>
        );

        return (
            <Table key={'tbl1@wish@tbl@' + key + '@' + wish.id} hover={true}>
                <tbody>
                <tr key={'tbl@wish@' + key + '@' + wish.id}>
                <td style={style} onClick={this.openHandlerFor(wish, currentPart)}>
                <OverlayTrigger overlay={tooltip}>
                        <div className={'glyphicon glyphicon-exclamation-sign'} />
                    </OverlayTrigger>
                    {space}
                    {wish.name}
                </td>
                <td style={style2} onClick={this.openHandlerFor(wish, currentPart)}>
                    {parts}
                </td>
                </tr>
                <tr key={key} className="no-hover">
                    <td style={style4}/>
                    <td style={style4}/>
                </tr>
                </tbody>
            </Table>
        );
    }

    private renderWishList(wishSeries: WishSeries[]): any {
        return wishSeries.map((q: WishSeries) => { return this.renderWishSeries(q); } );
    }

    private renderWishSeries(wishSeries: WishSeries): any {
        let wishes: any[] = wishSeries.wishes.map((q: Wish) => {
            return this.renderWish(q, wishSeries.id);
        });
        let style4: any = {};
        style4.padding = '2.5px';
        return (
            <Table key={'tbl1@' + wishSeries.id} hover={true}>
                <tbody>
                {this.renderFolder(wishSeries.name, wishSeries.description, wishes, wishSeries.id)}
                <tr key={'tbl1@pad@' + wishSeries.id} className="no-hover">
                    <td style={style4}/>
                    <td style={style4}/>
                </tr>
                </tbody>
            </Table>
        );
    }

    private handleBrowserResize() {
        let nwidth = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
        this.setState({miniMode: (nwidth < MINIMODE_LB)});
    }

    private refreshFiles() {
  /*
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
*/
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

    private openHandlerFor(wish: Wish, wishPart: number): (evt: any) => void {
        return (evt: any) => {
            this.props.history.push('/wishes', {wish: wish, wishPart: wishPart});
            evt.stopPropagation();
        };
    }
}

export default Wishes;

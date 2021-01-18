import * as React from 'react';

import Playground from './Playground';
import { Fade, Button, OverlayTrigger, Tooltip, Container, Table } from 'react-bootstrap';
// import { API } from '../api';
// import { SAMPLE_FILES_ENABLED, SHARING_ENABLED } from '../config';
import { getColor } from '../theme';
import { getInterfaceSettings, Database, getWishStatus, setWishStatus, WishPart, Wish,
         WishSeries, DEFAULT_WISHES } from '../storage';

const Modal = require('react-bootstrap').Modal;
// const FileSaver = require('file-saver');

const WISHES_LOADING = 0;
// const WISHES_LOADED = 1;
// const WISHES_FAILED = 2;

const MINIMODE_LB = 768;

const TEST_START_STRING = '--- Checking your solution ---';
const TEST_COMPLETE_STRING = '--- All checks passed. Part complete! ---';

interface State {
    wishes: WishSeries[]; // wish series shipped with SOSML-frontend
    externalWishes: WishSeries[]; // wishes available on the server
    sharedWishes: WishSeries[]; // invisible/shared online wishes only obtainable via share link
    externalWishesStatus: number;
    miniMode: boolean; // shrink everything on small screens
    folder: any;

    initialCode: string | undefined;
    code: string | undefined;
    wishSeries: WishSeries | undefined; // currently opened wish series
    wish: Wish | undefined; // currently opened Wish
    wishPart: number | undefined; // currently opened wish part
    wishPartSolved: boolean | undefined; // true if the user solved the current part
    wishPartNotification: boolean | undefined; // show a notification for

}

class Wishes extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            wishes: DEFAULT_WISHES,
            externalWishes: [],
            sharedWishes: [],
            externalWishesStatus: WISHES_LOADING,
            miniMode: false,
            folder: {},

            initialCode: undefined,
            code: undefined,
            wishSeries: undefined,
            wish: undefined,
            wishPart: undefined,
            wishPartSolved: undefined,
            wishPartNotification: undefined,
        };

        this.markCurrentTaskSolved = this.markCurrentTaskSolved.bind(this);
        this.checkWishComplete = this.checkWishComplete.bind(this);
        this.onWishCodeChange = this.onWishCodeChange.bind(this);
        this.handleBrowserResize = this.handleBrowserResize.bind(this);
        this.handleResetWish = this.handleResetWish.bind(this);
    }

    componentDidMount() {
        if (this.props.history && this.props.history.location.state) {
            let state: any = this.props.history.location.state;

            if (state.wish && state.wishPart) {
                this.setState({wish: state.wish, wishPart: state.wishPart});
            }
        }

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

        if (this.state.wishSeries === undefined
            || this.state.wish === undefined || this.state.wishPart === undefined) {
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
                <Container key={this.state.wish.name + '@' + this.state.wishPart} className="flexy">
                        {this.state.wishPartNotification ?
                            this.renderWishPartCompleted(this.state.wishSeries,
                                                         this.state.wish,
                                                         this.state.wishPart) : ''}
                        <h2><span style={{fontSize: 'smaller'}}>{this.state.wishSeries.name}
                        :</span> {this.state.wish.name}</h2>
                        <hr/>
                        {this.renderWishProgress(this.state.wishSeries, this.state.wish,
                                                 this.state.wishPart)}
                        <br/>
                        {this.renderCurrentWish(this.state.wishSeries, this.state.wish,
                                                this.state.wishPart)}
                        <br/> <br/>
                </Container>
            );
        }
    }

    isWishCompleted(wishSeries: WishSeries, wish: Wish) {
        return getWishStatus(wishSeries.id, wish.name) >= wish.parts.length;
    }

    private renderWishPartCompleted(wishSeries: WishSeries, wish: Wish, part: number): any {
        // Shows a modal informing the user that they completed a (part of a) wish for the
        // first time.
        // Also informs about the current progress in the current wish and has a button to
        // the next part / wish

        let headerText = 'Your Wish Has Not Yet Been Granted';
        let nxtbtn: any = (
            <button className="btn btn-suc-alt" type="button"
            onClick={this.openHandlerFor(wishSeries, wish, part + 1)}
            >I Wish to Proceed</button>
        );
        let nxtbody: any = (
            <Modal.Body>
                Congratulations! You successufully completed
                Part {part + 1} of this Wish.<br/>
                But there is more: {wish.parts.length - part - 1} more
                part{wish.parts.length - part === 1 ? '' : 's'} await you!
            </Modal.Body>
        );

        if (wish.parts.length === part + 1) {
            headerText = 'A Part of Your Wish Has Been Fulfilled';
            nxtbtn = (
                <button className="btn btn-suc-alt" type="button"
                onClick={(evt) => {this.setState({wishSeries: undefined, wish: undefined,
                    wishPart: undefined})}}>Return to the Wishes Overview</button>
            );
            nxtbody = (
                <Modal.Body>
                    Congratulations! You successfully completed all tasks of this Wish.<br/>
                    Check out the Wishes Overview to find new Wishes to work on!
                </Modal.Body>
            );
        }

        return (
            <Modal show={true} onHide={() => { this.setState({wishPartNotification: false}); } }>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{headerText}</Modal.Title>
                </Modal.Header>
                {nxtbody}
                <Modal.Footer>
                    <button className="btn btn-def-alt" type="button"
                    onClick={() => {this.setState({wishPartNotification: false});}}>Dismiss</button>
                    {nxtbtn}
                </Modal.Footer>
            </Modal>
        );
    }

    private renderWishProgress(wishSeries: WishSeries, wish: Wish, part: number): any {
        let qnbtn: any[] = [];
        let partsCompleted = getWishStatus(wishSeries.id, wish.name);

        let space = (key: number) => { return (
                <div key={'wpr@spacer@' + key} className="miniSpacer" />
            );
        };
        qnbtn.push(
            <span key={'lbl'} style={{fontFamily: 'monospace'}}>
                Select a Part:
            </span>
        );
        for (let i = 0; i < wish.parts.length; i++) {
            qnbtn.push(space(i));
            let btnType = 'button btn-suc-alt';
            let icon = 'glyphicon-ok-sign'
            if (i > partsCompleted) {
                btnType = 'button btn-dng-alt';
                icon = 'glyphicon-lock'
            } else if (i === partsCompleted) {
                btnType = 'button btn-pri-alt';
                icon = 'glyphicon-exclamation-sign';
            }

            qnbtn.push(
                <Button size="sm" className={btnType}
                    onClick={this.openHandlerFor(wishSeries, wish, i)}
                    key={'quicknav@b@' + i}
                    disabled={i > partsCompleted || part === i}>
                        <div className={'glyphicon ' + icon} />
                    </Button>
            );
        }

        return(
            <Table>
            <tbody>
            <tr>
                <td style={{border: 'none', padding: 'unset'}}>
                    <Button size="sm" className="button btn-suc-alt"
                    onClick={(evt) => {this.setState({wishSeries: undefined, wish: undefined,
                    wishPart: undefined})}}>
                        Return to the Wishes Overview
                    </Button>
                </td>
                <td style={{border: 'none', padding: 'unset', textAlign: 'right'}}>
                    {qnbtn}
                </td>
            </tr>
            </tbody>
            </Table>
        );
    }

    private markCurrentTaskSolved( ): void {
        if (this.state.wishSeries === undefined
            || this.state.wish === undefined
            || this.state.wishPart === undefined) {
            return;
        }

        let wishSeriesId = (this.state.wishSeries as WishSeries).id;
        let wishId = (this.state.wish as Wish).name;
        let wishPart = (this.state.wishPart as number);

        let wasSolved: boolean = this.state.wishPartSolved === true; // guard against undefined
        this.setState({
            wishPartNotification: !wasSolved,
            wishPartSolved: true
        });

        if (!wasSolved) {
            setWishStatus(wishSeriesId, wishId,
                          Math.max(getWishStatus(wishSeriesId, wishId), wishPart + 1));
        }
    }

    private checkWishComplete(output: string, complete: boolean): void {
        if (!complete) {
            return;
        }

        if (output.endsWith('\n')) {
            output = output.substr(0, output.length - 1);
        }
        let lines: string[] = output.split('\n');

        // Find the last line that contains the string TEST_START_STRING
        // (This is were the tests start)

        let teststart = lines.length - 1;

        for (; teststart >= 0; teststart--) {
            if (lines[teststart].includes(TEST_START_STRING)) {
                break;
            }
        }

        if (teststart < 0) {
            return;
        }

        // Check that no errors were encountered after that point
        for (; teststart < lines.length; ++teststart) {
            if (lines[teststart].startsWith('\\3')) {
                // Found an error / failed test
                return;
            }
        }

        this.markCurrentTaskSolved( );
    }

    private renderCurrentWish(wishSeries: WishSeries, wish: Wish, part: number): any {
        if(part >= wish.parts.length) { return []; }

        let curPart: WishPart = wish.parts[part];

        let res: any[] = [];

        // Description of the current part (containing the task/explanation/etc.)
        res.push(
            <div key={wish.name + '@des'}>
                {this.parseDescriptionString(curPart.description.join(''), wish.name)[0]}
            </div>
        );
        res.push(
            <br key={wish.name + '@br'}/>
        );


        // Code field
        res.push(
            <div className="flexy flexcomponent" style={{minHeight: '500px'}}
                key={wish.name + '@code@' + this.state.initialCode}>
                <Playground readOnly={this.state.wishPartNotification === true}
                onCodeChange={this.onWishCodeChange}
                initialCode={this.state.initialCode as string}
                outputCallback={this.checkWishComplete}
                onReset={this.handleResetWish}
                interpreterSettings={curPart.code.interpreterSettings}
                beforeCode={curPart.code.beforeCode === undefined ? undefined :
                    curPart.code.beforeCode.join('')}
                afterCode={'\n local val _ = printLn "' + TEST_START_STRING + '" in end; local\n'
                    + (curPart.code.afterCode === undefined ? '' : curPart.code.afterCode.join(''))
                    + '\n val _ = printLn "' + TEST_COMPLETE_STRING + '"; in end;' } />
            </div>
        );

        return res;
    }

    handleResetWish() {
        if (this.state.wishSeries === undefined
            || this.state.wish === undefined || this.state.wishPart === undefined) {
            // There is no code, this method should  not have been called at all...
            return;
        }

        let initCode: string = '';
        if(this.state.wish.parts[this.state.wishPart].code.userDefaultCode !== undefined) {
            initCode = (this.state.wish.parts[this.state.wishPart].code.userDefaultCode as string[]).join('');
        }

        this.setState({initialCode: initCode, code: initCode});
    }

    onWishCodeChange(newCode: string) {
        if (this.state.wishSeries === undefined
            || this.state.wish === undefined || this.state.wishPart === undefined) {
            // There is no code, this method should  not have been called at all...
            return;
        }

        this.setState({code: newCode});

        Database.getInstance().then((db: Database) => {
            return db.saveFile(this.getFileName(this.state.wishSeries as WishSeries,
                               this.state.wish as Wish,
                               this.state.wishPart as number), this.state.code as string, true);
        });
    }

    private parseDescriptionString(description: string, key: string, endDelim: string = ''): any {
        if(description === undefined) { return '<undefined>'; }

        let descr: any[] = [];

        let pos = 0;
        let curpart = "";
        while (pos < description.length) {
            switch(description[pos]) {
                case '\n':
                    descr.push(<span key={'td@' + key + '@' + pos}>{curpart}</span>);
                    descr.push(<br key={'tdb@' + key + '@' + pos }/>);
                    curpart = "";
                    break;
                case '\t':
                    descr.push(<span key={'td@' + key + '@' + pos}>{curpart}</span>);
                    descr.push(<span key={'tbs@' + key + '@' + pos }>&nbsp;&nbsp;&nbsp;&nbsp;</span>);
                    curpart = "";
                    break;
                default:
                    break;
            }
            if (pos + 1 < description.length) {
                if (description[pos] + description[pos + 1] === endDelim) {
                    break;
                }
                let found = false;
                switch (description[pos] + description[pos + 1]) {
                    case '**':
                    case '__':
                    case '``':
                        found = true;
                        break;
                    default:
                        break;
                }
                if (found) {
                    let inner = this.parseDescriptionString(description.substr(pos + 2), key,
                                description[pos] + description[pos + 1]);
                    descr.push(<span key={'td@' + key + '@' + pos}>{curpart}</span>);
                    curpart = "";
                    switch(description[pos] + description[pos + 1]) {
                    case '**':
                        descr.push(<b key={'tdbold@' + key + '@' + pos }>{inner[0]}</b>);
                        break;
                    case '__':
                        descr.push(<i key={'tdit@' + key + '@' + pos }>{inner[0]}</i>);
                        break;
                    case '``':
                        descr.push(<code key={'tdcode@' + key + '@' + pos }>{inner[0]}</code>);
                        break;
                    default:
                       break;
                    }
                    pos += inner[1] + 4;
                    continue;
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

    private renderFolder(name: string, shortName: string,
                         description: string[], inner: any, key: string): any {
        let folderState: boolean = this.state.folder[name + key];
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;

        if(description === undefined) {
            description = [];
        }

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
        style3.cursor = 'pointer';
        let style2: any = {};
        style2.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.borderRight = '1px solid ' + getColor(settings.theme, dt, 'border');
        if(description.length > 0 || !folderState)
            style2.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.whiteSpace = 'nowrap';
        style2.textAlign = 'right';
        style2.verticalAlign = 'top';
        style2.cursor = 'pointer';
        let style: any = {};
        style.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.borderLeft = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.cursor = 'pointer';
        if(description.length > 0 || !folderState)
            style.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.whiteSpace = 'nowrap';
        style.overflow = 'hidden';
        style.textOverflow = 'ellipsis';
        style.maxWidth = '10em';
        if(description.length > 0) {
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
                {this.parseDescriptionString(description.join(''), key)[0]}
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
                    {this.state.miniMode ? shortName : name}
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
        if(description.length > 0) {
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

    private renderWish(wishSeries: WishSeries, wish: Wish, key: string): any {
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;

        let partsCompleted = getWishStatus(wishSeries.id, wish.name);

        let style4: any = {};
        style4.padding = '2.5px';
        let style3: any = {};
        style3.marginTop = '-8.8px';
        style3.marginRight = '-9px';
        style3.marginLeft = '8px';
        style3.cursor = 'pointer';
        let style2: any = {};
        style2.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.borderRight = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.whiteSpace = 'nowrap';
        style2.textAlign = 'right';
        style2.verticalAlign = 'top';
        style2.fontFamily = 'monospace';
        style2.cursor = 'pointer';
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
        style.cursor = 'pointer';

        let parts: any[] = [];
        let space = (
            <div className="miniSpacer" />
        );
        for (let i = 0; i < wish.parts.length; i++) {
            if (i > 0) {
                parts.push(space);
            }
            let btnType = 'button btn-suc-alt';
            let icon = 'glyphicon-ok-sign'
            if (i > partsCompleted) {
                btnType = 'button btn-dng-alt';
                icon = 'glyphicon-lock'
            } else if (i === partsCompleted) {
                btnType = 'button btn-pri-alt';
                icon = 'glyphicon-exclamation-sign';
            }
            parts.push(
                <Button size="sm" className={btnType}
                    onClick={this.openHandlerFor(wishSeries, wish, i)}
                    key={key + '@b@' + i}
                    disabled={i > partsCompleted}
                    style={style3}>
                        <div className={'glyphicon ' + icon} />
                    </Button>
            );
        }

        let tooltip = (
            <Tooltip id={'tooltip' + key}>
                {wish.name}
            </Tooltip>
        );

        if (partsCompleted >= wish.parts.length) {
            partsCompleted = wish.parts.length - 1;
        }

        return (
            <Table key={'tbl1@wish@tbl@' + key + '@' + wish.name} hover={true}>
                <tbody>
                <tr key={'tbl@wish@' + key + '@' + wish.name}>
                <td style={style} onClick={this.openHandlerFor(wishSeries, wish, partsCompleted)}>
                <OverlayTrigger overlay={tooltip}>
                        <div className={'glyphicon glyphicon-exclamation-sign'} />
                    </OverlayTrigger>
                    {space}
                    {wish.name}
                </td>
                <td style={style2} onClick={this.openHandlerFor(wishSeries, wish, partsCompleted)}>
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
        let wishes: any[] = wishSeries.wishes !== undefined ? wishSeries.wishes.map((q: Wish) => {
            return this.renderWish(wishSeries, q, wishSeries.id);
        }) : [];
        let style4: any = {};
        style4.padding = '2.5px';
        return (
            <Table key={'tbl1@' + wishSeries.id} hover={true}>
                <tbody>
                {this.renderFolder(wishSeries.name, wishSeries.shortName,
                                   wishSeries.description, wishes, wishSeries.id)}
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

    private getFileName(wishSeries: WishSeries,
                        wish: Wish, wishPart: number): string {
        return 'WSH/' + wishSeries.id + '/' + wish.name + '/' + wishPart;
    }

    private openHandlerFor(wishSeries: WishSeries,
                           wish: Wish, wishPart: number): (evt: any) => void {
        return (evt: any) => {
            this.setState((oldState) => ({
                wishSeries: wishSeries,
                wish: wish,
                wishPart: wishPart,
                wishPartNotification: false,
                wishPartSolved: getWishStatus(wishSeries.id, wish.name) > wishPart,
                initialCode: undefined
            }));

            Database.getInstance().then((db: Database) => {
                return db.getFile(this.getFileName(wishSeries, wish, wishPart), true);
            }).then((content: string) => {
                this.setState((oldState) => {
                    return {initialCode: content};
                });
            }).catch(err => { });
            if (this.state.initialCode === undefined) {
                // User has no code of previous attempts
                this.setState((oldState) => ({initialCode:
                              wish.parts[wishPart].code.userDefaultCode === undefined ? ''
                    : (wish.parts[wishPart].code.userDefaultCode as string[]).join('')}));
            }
            evt.stopPropagation();
        };
    }
}

export default Wishes;

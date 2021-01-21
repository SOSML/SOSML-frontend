import * as React from 'react';

import { Fade } from 'react-bootstrap';

import { getInterfaceSettings } from '../storage';
import { getColor } from '../theme';

import FileListItem from './FileListItem';
import FileListButton from './FileListButton';

interface Props {
    children: any[]; // rendered files in the folder
    headerButtons: any[]; // additional buttons after the open/close button
    folderName?: string;
    onClick?: any; // handler to open / close the folder
    isOpened: boolean; // children are only visible if the folder is opened
    keyHint: number | string;
    openCloseButtonText: string; // Text to be shown after the "Hide"/"Show"
    description?: any; // optional description for the folder
};

class FileListFolder extends React.Component<Props, any> {
    public static defaultProps = {
        children: [],
        headerButtons: [],
        fileName: undefined,
        onClick: undefined,
        isOpened: false,
    };

    render() {
        let folderState = this.props.isOpened;
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;

        let style5: any = {};
        style5.borderRight = '1px solid ' + getColor(settings.theme, dt, 'border');
        style5.borderLeft = '1px solid ' + getColor(settings.theme, dt, 'border');
        if (!folderState) {
            style5.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        }
        let style4: any = {};
        style4.borderRight = '1px solid ' + getColor(settings.theme, dt, 'border');
        style4.borderLeft = '1px solid ' + getColor(settings.theme, dt, 'border');
        style4.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        style4.borderTop = 'none';

        let result: any[] = [];
        result.push(
            <FileListItem bottomBorder={!folderState || (this.props.description !== undefined)}
                iconName={folderState ? 'folder-open' : 'folder-close'}
                onClick={this.props.onClick}
                fileName={this.props.folderName === undefined ? '' : this.props.folderName}
                key={this.props.keyHint + '@header1'}>
                <FileListButton btnType="suc" key={this.props.keyHint + '@th1'}
                    onClick={this.props.onClick}
                    iconName={folderState ? 'folder-close' : 'folder-open'}>
                        {(folderState ? 'Hide ' : 'Show ') + this.props.openCloseButtonText}
                </FileListButton>
                {this.props.headerButtons}
            </FileListItem>
        );
        if (this.props.description !== undefined) {
            result.push(
                <tr key={this.props.keyHint + 't@01'} className="no-hover">
                    <td colSpan={2} style={style5}>
                        {this.props.description}
                    </td>
                </tr>
            );
        }
        result.push(
            <Fade key={this.props.keyHint + '@fade1'} in={folderState} unmountOnExit={true} timeout={10}>
                <tr key={this.props.keyHint + '@t1'} className="no-hover">
                    <td colSpan={2} style={style4} key={this.props.keyHint + '@td0'}>
                        <div key={this.props.keyHint + '@d1'}>
                        {this.props.children}
                        </div>
                    </td>
                </tr>
            </Fade>
        );
        return result;
    }
}

export default FileListFolder;

import * as React from 'react';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { getInterfaceSettings } from '../storage';
import { getColor } from '../theme';

interface Props {
    children: any[]; // Buttons, etc to appea on the top left
    fileName?: string;
    iconName: string; // glyphicon name used as an icon for this file (default: file)
    onClick?: any;
    bottomBorder?: boolean; // show/hide the bottom border line
};

class FileListItem extends React.Component<Props, any> {
    public static defaultProps = {
        children: [],
        fileName: undefined,
        iconName: 'file',
        onClick: undefined,
        bottomBorder: true,
    };

    render() {
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;

        let style4: any = {};
        style4.padding = '2.5px';
        let style2: any = {};
        style2.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style2.borderRight = '1px solid ' + getColor(settings.theme, dt, 'border');
        if (this.props.bottomBorder) {
            style2.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        }
        style2.whiteSpace = 'nowrap';
        style2.textAlign = 'right';
        style2.verticalAlign = 'top';
        style2.fontFamily = 'monospace';
        style2.cursor = 'pointer';
        let style: any = {};
        style.borderTop = '1px solid ' + getColor(settings.theme, dt, 'border');
        style.borderLeft = '1px solid ' + getColor(settings.theme, dt, 'border');
        if (this.props.bottomBorder) {
            style.borderBottom = '1px solid ' + getColor(settings.theme, dt, 'border');
        }
        style.whiteSpace = 'nowrap';
        style.overflow = 'hidden';
        style.textOverflow = 'ellipsis';
        style.maxWidth = '8em';
        style.verticalAlign = 'bottom';
        style.fontFamily = 'monospace';
        style.cursor = 'pointer';

        if (this.props.fileName === undefined) {
            return (
                <tr className="no-hover">
                    <td style={style4}/>
                    <td style={style4}/>
                </tr>
            );
        }

        let printName = this.props.fileName as string;
        let tooltip = (
            <Tooltip id={'tooltip@file' + printName}>
                {printName}
            </Tooltip>
        );

        let space = (
            <div className="miniSpacer" />
        );

        let glicon = this.props.iconName;

        return (
            <tr>
                <td style={style} onClick={this.props.onClick}>
                    <OverlayTrigger overlay={tooltip}>
                        <div className={'glyphicon glyphicon-' + glicon} />
                    </OverlayTrigger>
                    {space}
                    {printName}
                </td>
                <td style={style2} onClick={this.props.onClick}>
                    {this.props.children}
                </td>
            </tr>
        );
    }
}

export default FileListItem;

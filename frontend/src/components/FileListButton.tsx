import * as React from 'react';

import { Button } from 'react-bootstrap';

interface Props {
    children: any; // Buttons, etc to appea on the top left
    iconName: string; // glyphicon name used as an icon for this file (default: file)
    onClick?: any;
    btnType: string; // type of the button (dng [default] {red}, pri {blue}, suc {green})
    disabled: boolean;
};

class FileListButton extends React.Component<Props, any> {
    public static defaultProps = {
        children: [],
        onClick: undefined,
        btnType: 'dng',
        iconName: 'trash',
        disabled: false,
    };

    render() {
        let style3: any = {};
        style3.marginTop = '-8.8px';
        style3.marginRight = '-9px';
        style3.marginLeft = '8px';
        style3.cursor = 'pointer';

        return (
            <Button size="sm" className={'button btn-' + this.props.btnType + '-alt'}
                onClick={this.props.onClick} style={style3} disabled={this.props.disabled}>
                <span className={'glyphicon glyphicon-' + this.props.iconName} /> {this.props.children}
            </Button>
        );
    }
}

export default FileListButton;

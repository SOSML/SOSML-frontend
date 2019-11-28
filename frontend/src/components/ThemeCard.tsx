import * as React from 'react';
import { Card } from 'react-bootstrap';

import { getTheme, getColor } from '../theme';
import { getInterfaceSettings } from '../storage';
import Icon from './Icon';

interface Props {
    themeName: string;
    activeLight: boolean;
    activeDark: boolean;
    changeTheme: (type: 'light' | 'dark', name: string) => void;
}

class ThemeCard extends React.Component<Props, any> {
    render() {
        let theme = getTheme(this.props.themeName, undefined);
        if (theme === undefined) {
            return '';
        }
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;
        let borderColor = getColor(settings.theme, dt, 'border');
        let bgColor = getColor(settings.theme, dt, 'background');
        let fgInvColor = getColor(settings.theme, dt, 'navbar_focus_fg');

        return (
            <Card>
                <div>
                <div style={{
                    fontSize: "16px",
                    display: "inline-block",
                    paddingTop: "4px",
                    paddingLeft: "5px"
                }}>{this.props.themeName}</div>
                <div className="inlineBlock" style={{
                    marginTop: "-1px", marginRight: "-1px",
                    position: "relative",
                    display: "flex",
                    float: "right"}}>
                    <div className={this.props.activeLight ? 'btn btn-def-inv' : 'btn btn-def-alt'}
                    style={{padding: "5px 5px 0px 5px"}}
                    onClick={(a: any) => this.props.changeTheme('light', this.props.themeName)}>
                        <Icon icon='sun' size="16pt"
                        stroke={this.props.activeLight ? fgInvColor : borderColor}
                        fill={this.props.activeLight ? fgInvColor : bgColor} />
                    </div>
                    <div className="miniSpacer" />
                    <div className={this.props.activeDark ? 'btn btn-def-inv' : 'btn btn-def-alt'}
                    style={{padding: "5px 5px 0px 5px"}}
                    onClick={(a: any) => this.props.changeTheme('dark', this.props.themeName)}>
                        <Icon icon='moon' size="16pt"
                        stroke={this.props.activeDark ? fgInvColor : borderColor}
                        fill={this.props.activeDark ? fgInvColor : bgColor} />
                    </div>
                </div>
                </div>
                <Card.Body>
                </Card.Body>
            </Card>
        );
    }
}

export default ThemeCard;

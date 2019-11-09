import * as React from 'react';

import { QrCode, Ecc } from '../qrcodegen';
import { getColor } from '../theme';
import { getInterfaceSettings } from '../storage';

interface Props {
    link: string;
}

class QRCode extends React.Component<Props, any> {
    render() {
        if (this.props.link) {
            return (
                <div className="qr">
                {this.renderCode(this.props.link)}
                </div>
            );
        }
        return (
            <div />
        );
    }

    private renderCode(text: string): any {
        let qr = QrCode.encodeText(text, Ecc.HIGH);
        let border = 1;
        let settings = getInterfaceSettings();
        let dt: string | undefined = settings.autoSelectTheme ? settings.darkTheme : undefined;
        let white = getColor(settings.theme, dt, 'qr_bg');
        let black = getColor(settings.theme, dt, 'qr_fg');
        let viewbox = `0 0 ${2 * border + qr.size} ${2 * border + qr.size}`;

        let parts: string[] = [];
        for (let y = 0; y < qr.size; y++) {
            for (let x = 0; x < qr.size; x++) {
                if (qr.getModule(x, y)) {
                    parts.push(`M${x + border},${y + border}h1v1h-1z`);
                }
            }
        }
        return (
            <svg viewBox={viewbox}>
                <rect width="100%" height="100%" fill={white}/>
                <path d={parts.join(' ')} fill={black}/>
            </svg>
        );
    }
}

export default QRCode;

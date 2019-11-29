import * as React from 'react';

interface Props {
    icon: string,
    size: string,
    fill: string,
    stroke: string
}

class Icon extends React.Component<Props, any> {
    public static defaultProps = {
        fill: '#000',
        stroke: '#fff'
    };

    render() {
        if (this.props.icon === 'sunmoon') {
            // google icon brightness-2 (mod) + sun
            return (
                <span className='icon icon-moon' style={{fontSize: this.props.size}}>
                    <svg viewBox="0 0 36 24" width={this.props.size}
                        style={{verticalAlign: 'middle'}}>
                          <path stroke={this.props.stroke} strokeWidth="2" fill={this.props.fill}
                                d="M6.76 4.84
                                   l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41z
                                   M4 10.5H1v2h3v-2z
                                   m9-9.95h-2V3.5h2V.55z
                                   m7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79z
                                   m-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z
                                   M20 10.5v2h3v-2h-3z
                                   m-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z
                                   m-1 16.95h2V19.5h-2v2.95z
                                   m-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"
                          />
                          <path stroke={this.props.stroke} strokeWidth="2" fill={this.props.fill}
                                d="M25 2
                                  c-1.05 0 -2.05 .16 -3 .46
                                  3.06 1.27 5.5 5.06 5.5 9.54
                                  0 3.48 -1.94 8.27 -5.5 9.54
                                  .95 .3 1.95 .46 3 .46
                                  5.52 0 10 -4.48 10 -10
                                  S30.52 2 25 2z"
                          />
                    </svg>
                </span>
            );
        }
        if (this.props.icon === 'moon') {
            // google icon brightness-2, modified
            return (
                <span className='icon icon-moon' style={{fontSize: this.props.size}}>
                    <svg viewBox="0 0 24 24" width={this.props.size}
                        style={{verticalAlign: 'middle'}}>
                        <path stroke={this.props.stroke} strokeWidth="1.5"
                        fill={this.props.fill}
                        d="M9 2
                        c-1.05 0 -2.05 .16 -3 .46
                        3.06 1.27 5.5 5.06 5.5 9.54
                        0 3.48 -1.94 8.27 -5.5 9.54
                        .95 .3 1.95 .46 3 .46
                        5.52 0 10 -4.48 10 -10
                        S14.52 2 9 2z"
                        />
                    </svg>
                </span>
            );
        }
        if (this.props.icon === 'sun') {
            // google icon sunny
            return (
                <span className='icon icon-sun' style={{fontSize: this.props.size}}>
                    <svg viewBox="0 0 24 24" width={this.props.size}
                        style={{verticalAlign: 'middle'}}>
                        <path stroke={this.props.stroke} strokeWidth="1.5"
                        fill={this.props.fill}
                        d="M6.76 4.84
                        l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41z
                        M4 10.5H1v2h3v-2z
                        m9-9.95h-2V3.5h2V.55z
                        m7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79z
                        m-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z
                        M20 10.5v2h3v-2h-3z
                        m-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z
                        m-1 16.95h2V19.5h-2v2.95z
                        m-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"
                        />
                    </svg>
                </span>
            )
        }
        if (this.props.icon === 'sosml') {
            return (
                <span className='icon icon-sosml' style={{verticalAlign: 'middle',
                    display: 'inline-block'}}>
                    <svg viewBox="0 0 52 52" width={this.props.size}>
                        <circle cx={26} cy={26} r={24} stroke={this.props.stroke} strokeWidth={1}
                            fill={this.props.fill} />
                         <circle cx={26} cy={26} r={10} stroke={this.props.stroke} strokeWidth={1}
                            fill={this.props.stroke} />
                        <circle cx={17} cy={15} r={7} stroke={this.props.stroke} strokeWidth={1}
                            fill="#fff" />
                    </svg>
                </span>
            );
        }
        return '';
    }
}

export default Icon;

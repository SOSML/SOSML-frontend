import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { Button } from 'react-bootstrap';

export type Theme = {
    'error': string;
    'success': string;
    'success_alt': string;

    'background': string;
    'foreground': string;
    'border': string;
    'navbar_hover': string;
    'navbar_bg': string;
    'navbar_fg': string;
    'navbar_focus_fg': string;
    'navbar_focus_bg': string;
    'link': string;
    'link_hover': string;
    'minihead_fg': string;
    'minihead_bg': string;
    'editor_fg': string;
    'editor_bg': string;

    'alert_fg': string;
    'alert_bg': string;
    'alert_border': string;
    'btn_pri_fg': string;
    'btn_pri_bg': string;
    'btn_pri_border': string;
    'btn_dng_fg': string;
    'btn_dng_bg': string;
    'btn_dng_border': string;
    'btn_suc_fg': string;
    'btn_suc_bg': string;
    'btn_suc_border': string;
    'btn_hover': string;
};
export type ThemeCollection = { [name: string]: Theme };

let THEMES: ThemeCollection = {
    'yachiyo': {
        'error': 'rgba(34,3,3,0.85)',
        'success': 'rgba(14,34,3,0.85)',
        'success_alt': 'rgba(6,43,45,0.85)',
        'background': '#021114',
        'foreground': '#20bedd',
        'border': '#029dbb',
        'navbar_hover': 'white',
        'navbar_bg': 'black',
        'navbar_fg': '#a1ecfb',
        'navbar_focus_bg': 'rgba(11, 124, 147, 0.65)',
        'navbar_focus_fg': 'white',
        'link': '#acf9fb',
        'link_hover': 'white',
        'minihead_bg': '#021114',
        'minihead_fg': '#a1ecfb',
        'editor_bg': '#021114',
        'editor_fg': 'rgba(11, 124, 147, 0.65)',
        'alert_fg': '#8bebfe',
        'alert_bg': '#021114',
        'alert_border': '#8bebfe',
        'btn_pri_fg': '#acf9fb',
        'btn_pri_bg': 'rgba(6,43,45,0.65)',
        'btn_pri_border': '#26dafd',
        'btn_dng_fg': '#df0000',
        'btn_dng_bg': 'rgba(34,3,3,0.65)',
        'btn_dng_border': '#e43f3a',
        'btn_suc_fg': '#00df00',
        'btn_suc_bg': 'rgba(14,34,3,0.65)',
        'btn_suc_border': '#00df00',
        'btn_hover': 'white',
    },
    'kyoko': {
        'error': 'black',
        'success': 'black',
        'success_alt': 'black',
        'background': 'black',
        'foreground': '#ccc',
        'border': 'crimson',
        'navbar_hover': 'lightcoral',
        'navbar_bg': 'black',
        'navbar_fg': 'crimson',
        'navbar_focus_bg': 'crimson',
        'navbar_focus_fg': 'black',
        'link': 'lightcoral',
        'link_hover': 'crimson',
        'minihead_bg': 'black',
        'minihead_fg': 'crimson',
        'editor_bg': 'black',
        'editor_fg': 'crimson',
        'alert_fg': 'deeppink',
        'alert_bg': 'black',
        'alert_border': 'crimson',
        'btn_pri_fg': '#ccc',
        'btn_pri_bg': 'black',
        'btn_pri_border': 'deeppink',
        'btn_dng_fg': 'crimson',
        'btn_dng_bg': 'black',
        'btn_dng_border': '#d43f3a',
        'btn_suc_fg': '#266726',
        'btn_suc_bg': 'black',
        'btn_suc_border': '#4cae4c',
        'btn_hover': 'lightcoral',
    },
    'madoka': {
        'error': '#ffdcdc',
        'success': '#d2ffd2',
        'success_alt': '#dcffff',
        'background': '#fefdfd',
        'foreground': '#883747',
        'border': 'deeppink',
        'navbar_hover': 'darkred',
        'navbar_bg': '#ffe4e8',
        'navbar_fg': 'crimson',
        'navbar_focus_bg': '#fd8da2',
        'navbar_focus_fg': '#fff',
        'link': 'lightcoral',
        'link_hover': 'crimson',
        'minihead_bg': '#fefdfd',
        'minihead_fg': 'crimson',
        'editor_bg': '#fefdfd',
        'editor_fg': 'deeppink',
        'alert_fg': 'crimson',
        'alert_bg': '#ffe4e8',
        'alert_border': 'deeppink',
        'btn_pri_fg': 'crimson',
        'btn_pri_bg': '#ffe4e8',
        'btn_pri_border': 'deeppink',
        'btn_dng_fg': '#ff9fb5',
        'btn_dng_bg': '#333',
        'btn_dng_border': '#d43f3a',
        'btn_suc_fg': '#266726',
        'btn_suc_bg': '#a9e7a9',
        'btn_suc_border': '#4cae4c',
        'btn_hover': '#23527c',
    },
    'sayaka': {
        'error': '#ffdcdc',
        'success_alt': '#d2ffd2',
        'success': '#dcffff',
        'background': '#fff',
        'foreground': '#333',
        'border': '#2f2f2f',
        'navbar_hover': '#fff',
        'navbar_bg': '#2f2f2f',
        'navbar_fg': '#bbb',
        'navbar_focus_bg': '#4f4f4f',
        'navbar_focus_fg': '#fff',
        'link': '#337ab7',
        'link_hover': '#23527c',
        'minihead_bg': '#fff',
        'minihead_fg': '#333',
        'editor_bg': '#fff',
        'editor_fg': '#31708f',
        'alert_fg': '#31708f',
        'alert_bg': '#bce8f1',
        'alert_border': '#2e6da4',
        'btn_pri_fg': '#fff',
        'btn_pri_bg': '#337ab7',
        'btn_pri_border': '#2f2f2f',
        'btn_dng_fg': '#fff',
        'btn_dng_bg': '#d9534f',
        'btn_dng_border': '#2f2f2f',
        'btn_suc_fg': '#fff',
        'btn_suc_bg': '#5cb85c',
        'btn_suc_border': '#2f2f2f',
        'btn_hover': '#23527c',
    },
    'homura': {
        'error': '#744040',
        'success': '#437440',
        'success_alt': '#4a8079',
        'background': '#4f4f4f',
        'foreground': '#ddd',
        'border': '#ddd',
        'navbar_hover': '#fff',
        'navbar_bg': '#2f2f2f',
        'navbar_fg': '#bbb',
        'navbar_focus_bg': '#4f4f4f',
        'navbar_focus_fg': '#fff',
        'link': '#c67fc6',
        'link_hover': 'mediumpurple',
        'minihead_bg': '#4f4f4f',
        'minihead_fg': '#ddd',
        'editor_bg': '#4f4f4f',
        'editor_fg': '#ddd',
        'alert_fg': '#d9edf7',
        'alert_bg': '#406b74',
        'alert_border': '#bce8f1',
        'btn_pri_fg': '#d9edf7',
        'btn_pri_bg': '#406b74',
        'btn_pri_border': '#bce8f1',
        'btn_dng_fg': '#f7d9d9',
        'btn_dng_bg': '#744040',
        'btn_dng_border': '#f1bcbc',
        'btn_suc_fg': '#d9f7dd',
        'btn_suc_bg': '#437440',
        'btn_suc_border': '#bcf1be',
        'btn_hover': 'mediumpurple',
    }
};

export function getTheme (name: string): Theme {
    return THEMES[name];
}

export function getColor (theme: string, color: string): string {
    return THEMES[theme][color];
}

function generateButton (name: string, fg: string, bg: string, bd: string, bda: string,
                         textbg: string): string {
    bootstrapUtils.addStyle(Button, name);

    return `
    .btn-${name} {
        color: ${fg};
        background-color: ${bg};
        border-color: ${bd};
    }
    .btn-${name}:hover,
    .btn-${name}:focus,
    .btn-${name}:active,
    .btn-${name}.active {
        color: ${fg};
        background-color: ${bg};
        background-color: ${bg}aa;
        border-color: ${bda};
    }
    .btn-${name}.disabled,
    .btn-${name}.disabled:hover,
    .btn-${name}.disabled:focus,
    .btn-${name}.disabled:active,
    .btn-${name}.disabled.active,
    .btn-${name}[disabled]:hover,
    .btn-${name}[disabled]:focus,
    .btn-${name}[disabled]:active,
    .btn-${name}[disabled].active,
    fieldset[disabled] .btn-${name},
    fieldset[disabled] .btn-${name}:hover,
    fieldset[disabled] .btn-${name}:focus,
    fieldset[disabled] .btn-${name}:active,
    fieldset[disabled] .btn-${name}.active {
        color: ${bg};
        background-color: unset;
        border-color: ${bd};
    }

    .btn-${name} .glyphicon{
        color: ${textbg};
        color: ${textbg}dd;
        text-shadow: -1px 0 ${bd}, 0 1px ${bd},
        1px 0 ${bd}, 0 -1px ${bd};
        text-shadow: -1px 0 ${bd}dd, 0 1px ${bd}dd,
        1px 0 ${bd}dd, 0 -1px ${bd}dd;
    }
    `;
}

export function renderTheme (theme: Theme): string {
    if (theme === undefined) {
        return `
        `;
    }

    return `
    .flexy { color: ${theme.foreground}; background-color: ${theme.background}; }
    .window-content { color: ${theme.foreground}; background-color: ${theme.background}; }
    .navbar-inverse {
        color: ${theme.navbar_fg};
        background-color: ${theme.navbar_bg};
        border-color: ${theme.navbar_bg};
    }
    .navbar-inverse .navbar-brand {
        color: ${theme.navbar_fg};
    }
    .navbar-inverse .navbar-nav > li > a:hover,
    .navbar-inverse .navbar-nav > li > a:focus,
    .navbar-inverse .navbar-brand:hover,
    .navbar-inverse .navbar-brand:focus,
    .navbar-inverse .navbar-nav > .open > a,
    .navbar-inverse .navbar-nav > .open > a:hover,
    .navbar-inverse .navbar-nav > .open > a:focus,
    .navbar-inverse .navbar-link:hover,
    .navbar-inverse .btn-link:hover,
    .navbar-inverse .btn-link:focus
    {
        color: ${theme.navbar_hover};
        background-color: transparent;
    }

    .navbar-inverse .navbar-nav > li > a:hover .glyphicon,
    .navbar-inverse .navbar-nav > li > a:focus .glyphicon,
    .navbar-inverse .navbar-brand:hover .glyphicon,
    .navbar-inverse .navbar-brand:focus .glyphicon,
    .navbar-inverse .navbar-nav > .open > a .glyphicon,
    .navbar-inverse .navbar-nav > .open > a:hover .glyphicon,
    .navbar-inverse .navbar-nav > .open > a:focus .glyphicon,
    .navbar-inverse .navbar-link:hover .glyphicon,
    .navbar-inverse .btn-link:hover .glyphicon,
    .navbar-inverse .btn-link:focus .glyphicon {
        text-shadow: -1px 0 ${theme.navbar_hover}, 0 1px ${theme.navbar_hover},
        1px 0 ${theme.navbar_hover}, 0 -1px ${theme.navbar_hover};
    }

    .navbar-inverse .navbar-toggle, hr {
        border-color: ${theme.border};
    }

    .navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:focus,
    .navbar-inverse .navbar-nav>.active>a:hover {
        color: ${theme.navbar_focus_fg};
        background-color: ${theme.navbar_focus_bg};
    }
    .navbar-inverse .navbar-nav>.active>a .glyphicon,
    .navbar-inverse .navbar-nav>.active>a:focus .glyphicon,
    .navbar-inverse .navbar-nav>.active>a:hover .glyphicon {
        color: ${theme.navbar_focus_bg};
        text-shadow: -1px 0 ${theme.navbar_focus_fg}, 0 1px ${theme.navbar_focus_fg},
        1px 0 ${theme.navbar_focus_fg}, 0 -1px ${theme.navbar_focus_fg};
    }

    .navbar-inverse .navbar-nav>li>a {
        color: ${theme.navbar_fg};
        background-color: ${theme.navbar_bg};
    }
    .navbar-inverse .navbar-nav>li>a .glyphicon {
        color: ${theme.navbar_bg};
        text-shadow: -1px 0 ${theme.navbar_fg}, 0 1px ${theme.navbar_fg},
        1px 0 ${theme.navbar_fg}, 0 -1px ${theme.navbar_fg};
    }

    .navbar-inverse .navbar-toggle:focus, .navbar-inverse .navbar-toggle:hover {
        color: ${theme.navbar_focus_fg};
        background-color: ${theme.navbar_focus_bg};
    }

    .tooltip-inner {
        border-color: ${theme.border};
        color: ${theme.foreground};
        background-color: ${theme.background};
    }

    .glyphicon {
        color: ${theme.background};
        text-shadow: -1px 0 ${theme.foreground}, 0 1px ${theme.foreground},
        1px 0 ${theme.foreground}, 0 -1px ${theme.foreground};
    }

    .footer { color: ${theme.foreground}; background-color: ${theme.background}; }
    a { color: ${theme.link}; }
    a .glyphicon{
        text-shadow: -1px 0 ${theme.link}, 0 1px ${theme.link},
        1px 0 ${theme.link}, 0 -1px ${theme.link};
    }

    a:focus, a:hover { color: ${theme.link_hover}; text-decoration: none; }
    a:focus .glyphicon, a:hover .glyphicon {
        text-shadow: -1px 0 ${theme.link_hover}, 0 1px ${theme.link_hover},
        1px 0 ${theme.link_hover}, 0 -1px ${theme.link_hover};
    }

    .alert-info {
        color: ${theme.alert_fg};
        background-color: ${theme.alert_bg};
        border-color: ${theme.alert_border};
    }

    .alert-info .glyphicon {
        color: ${theme.alert_bg};
        text-shadow: -1px 0 ${theme.alert_fg}, 0 1px ${theme.alert_fg},
        1px 0 ${theme.alert_fg}, 0 -1px ${theme.alert_fg};
    }

    .alert-info a .glyphicon {
        text-shadow: -1px 0 ${theme.link}, 0 1px ${theme.link},
        1px 0 ${theme.link}, 0 -1px ${theme.link};
    }
    .alert-info a:focus .glyphicon, .alert-info a:hover .glyphicon {
        text-shadow: -1px 0 ${theme.link_hover}, 0 1px ${theme.link_hover},
        1px 0 ${theme.link_hover}, 0 -1px ${theme.link_hover};
    }

    .window-header {
        color: ${theme.minihead_fg};
        background-color: ${theme.minihead_bg};
    }
    .mini-window { border-color: ${theme.border}; }
    .CodeMirror-lines, .CodeMirror-scroll, body {
        color: ${theme.foreground}; background-color: ${theme.background}; }
    .splitter-layout>.layout-splitter { background-color: ${theme.background}; }
    .CodeMirror-sizer, .CodeMirror-gutter,
    .CodeMirror-gutters, .CodeMirror-linenumber {
        color: ${theme.editor_fg};
        border-color: ${theme.editor_fg};
        background-color: ${theme.editor_bg};
    }
    .form-control, input {
        color: ${theme.foreground};
        background-color: ${theme.background};
        border-color: ${theme.border};
    }
    .form-control:focus {
        border-color: ${theme.link};
    }
    input[type=checkbox] {
        color: ${theme.foreground};
        background-color: ${theme.background};
        border-color: ${theme.border};
    }
    input[type=checkbox]:checked:after {
        color: ${theme.btn_suc_fg};
        background-color: ${theme.btn_suc_bg};
        border-color: ${theme.btn_suc_border};
    }
    pre {
        color: ${theme.foreground};
    }

    table, td, tr {
        border-color: ${theme.border};
    }

    .table-hover>tbody>tr:hover {
        color: ${theme.btn_suc_fg};
        background-color: ${theme.btn_suc_bg};
        background-color: ${theme.btn_suc_bg}99;
    }

    td:hover, tr:hover {
        border-color: ${theme.link_hover};
    }

    .modal-content {
        color: ${theme.foreground};
        background-color: ${theme.background};
        border-color: ${theme.border};
    }

    ${generateButton('def-alt', theme.foreground, theme.background,
                     theme.border, theme.link_hover, theme.background)}
    ${generateButton('pri-alt', theme.btn_pri_fg, theme.btn_pri_bg,
                     theme.btn_pri_border, theme.btn_hover, theme.background)}
    ${generateButton('suc-alt', theme.btn_suc_fg, theme.btn_suc_bg,
                     theme.btn_suc_border, theme.btn_hover, theme.background)}
    ${generateButton('dng-alt', theme.btn_dng_fg, theme.btn_dng_bg,
                     theme.btn_dng_border, theme.btn_hover, theme.background)}

    `;
}

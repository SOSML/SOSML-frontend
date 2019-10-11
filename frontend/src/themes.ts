export type Theme = {
    'error': string;
    'success': string;
    'success_alt': string;

    'background': string;
    'foreground': string;
    'border': string;
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
    'sayaka': {
        'error': '#ffdcdc',
        'success_alt': '#d2ffd2',
        'success': '#dcffff',
        'background': '#fff',
        'foreground': '#333',
        'border': '#ccc',
        'navbar_bg': '#2f2f2f',
        'navbar_fg': '#bbb',
        'navbar_focus_bg': '#4f4f4f',
        'navbar_focus_fg': '#fff',
        'link': '#337ab7',
        'link_hover': '#23527c',
        'minihead_bg': '#fff',
        'minihead_fg': '#333',
        'editor_bg': '#4f4f4f',
        'editor_fg': '#ddd',
        'alert_fg': '#31708f',
        'alert_bg': '#bce8f1',
        'alert_border': '#2e6da4',
        'btn_pri_fg': '#fff',
        'btn_pri_bg': '#337ab7',
        'btn_pri_border': '#2e6da4',
        'btn_dng_fg': '#fff',
        'btn_dng_bg': '#d9534f',
        'btn_dng_border': '#d43f3a',
        'btn_suc_fg': '#fff',
        'btn_suc_bg': '#5cb85c',
        'btn_suc_border': '#4cae4c',
        'btn_hover': '#23527c',
    },
    'homura': {
        'error': '#744040',
        'success': '#437440',
        'success_alt': '#4a8079',
        'background': '#4f4f4f',
        'foreground': '#ddd',
        'border': '#ddd',
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

function generateButton (name: string, fg: string, bg: string, bd: string, bda: string): string {
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
        background-color: ${bg}aa;
        border-color: ${bda};
    }
    .btn-${name}.disabled:hover,
    .btn-${name}.disabled:focus,
    .btn-${name}.disabled:active,
    .btn-${name}.disabled.active,
    .btn-${name}[disabled]:hover,
    .btn-${name}[disabled]:focus,
    .btn-${name}[disabled]:active,
    .btn-${name}[disabled].active,
    fieldset[disabled] .btn-${name}:hover,
    fieldset[disabled] .btn-${name}:focus,
    fieldset[disabled] .btn-${name}:active,
    fieldset[disabled] .btn-${name}.active {
        color: ${bg};
        background-color: ${fg};
        border-color: ${bd};
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
    .navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:focus,
    .navbar-inverse .navbar-nav>.active>a:hover {
        color: ${theme.navbar_focus_fg};
        background-color: ${theme.navbar_focus_bg};
    }
    .navbar-inverse .navbar-nav>li>a {
        color: ${theme.navbar_fg};
        background-color: ${theme.navbar_bg};
    }
    .footer { color: ${theme.foreground}; background-color: ${theme.background}; }
    a { color: ${theme.link}; }
    a:focus, a:hover { color: ${theme.link_hover}; text-decoration: none; }
    .alert-info {
        color: ${theme.alert_fg};
        background-color: ${theme.alert_bg};
        border-color: ${theme.alert_border};
    }
    .window-header {
        color: ${theme.minihead_fg};
        background-color: ${theme.minihead_bg};
    }
    .mini-window { border-color: ${theme.border}; }
    body { color: ${theme.foreground}; background-color: ${theme.background}; }
    .splitter-layout>.layout-splitter { background-color: ${theme.background}; }
    .CodeMirror { color: ${theme.editor_fg}; background-color: ${theme.editor_bg}; }
    .CodeMirror-scroll, .CodeMirror-sizer, .CodeMirror-gutter, .CodeMirror-gutters,
    .CodeMirror-linenumber {
        color: ${theme.foreground};
        background-color: ${theme.background};
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

    .modal-content {
        color: ${theme.foreground};
        background-color: ${theme.background};
        border-color: ${theme.border};
    }

    ${generateButton('def-alt', theme.foreground, theme.background,
                     theme.border, theme.link_hover)}
    ${generateButton('pri-alt', theme.btn_pri_fg, theme.btn_pri_bg,
                     theme.btn_pri_border, theme.btn_hover)}
    ${generateButton('suc-alt', theme.btn_suc_fg, theme.btn_suc_bg,
                     theme.btn_suc_border, theme.btn_hover)}
    ${generateButton('dng-alt', theme.btn_dng_fg, theme.btn_dng_bg,
                     theme.btn_dng_border, theme.btn_hover)}

    `;
}

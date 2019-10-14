import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { Button } from 'react-bootstrap';

import { THEMES } from './themes';

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

    'cm_builtin': string;
    'cm_comment': string;
    'cm_atom': string;
    'cm_number': string;
    'cm_prop': string;
    'cm_keyword': string;
    'cm_string': string;
    'cm_variable': string;
    'cm_variable_alt': string;
    'cm_def': string;
    'cm_bracket': string;
    'cm_tag': string;
    'cm_link': string;
    'cm_error': string;
};
export type ThemeCollection = { [name: string]: Theme };

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
    .CodeMirror-cursor {
        border-color: ${theme.border};
    }
    span.CodeMirror-matchingbracket {
        color: ${theme.link_hover} !important;
    }
    .cm-s-default span.cm-comment { color: ${theme.cm_comment}; }
    .cm-s-default span.cm-atom { color: ${theme.cm_atom}; }
    .cm-s-default span.cm-number { color: ${theme.cm_number}; }

    .cm-s-default span.cm-property, .cm-s-default span.cm-attribute { color: ${theme.cm_prop}; }
    .cm-s-default span.cm-keyword { color: ${theme.cm_keyword}; font-weight: bold }
    .cm-s-default span.cm-string { color: ${theme.cm_string}; }

    .cm-s-default span.cm-builtin { color: ${theme.cm_builtin}; }
    .cm-s-default span.cm-variable { color: ${theme.cm_variable}; }
    .cm-s-default span.cm-variable-2 { color: ${theme.cm_variable_alt}; }
    .cm-s-default span.cm-def { color: ${theme.cm_def}; }
    .cm-s-default span.cm-bracket { color: ${theme.cm_bracket}; }
    .cm-s-default span.cm-tag { color: ${theme.cm_tag}; }
    .cm-s-default span.cm-link { color: ${theme.cm_link}; }
    .cm-s-default span.cm-error { color: ${theme.cm_error}; }


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

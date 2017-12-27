// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("codemirror/lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
    else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    CodeMirror.defineMode('mllike', function(config, parserConfig) {
        var words = {
            'let': 'keyword',
            'rec': 'keyword',
            'in': 'keyword',
            'of': 'keyword',
            'and': 'keyword',
            'if': 'keyword',
            'then': 'keyword',
            'else': 'keyword',
            'for': 'keyword',
            'do': 'keyword',
            'of': 'keyword',
            'while': 'keyword',
            'fun': 'keyword',
            'val': 'keyword',
            'type': 'keyword',
            'match': 'keyword',
            'with': 'keyword',
            'try': 'keyword',
            'open': 'builtin',
            'begin': 'keyword',
            'end': 'keyword'
        };

        var extraWords = parserConfig.extraWords || {};
        for (var prop in extraWords) {
            if (extraWords.hasOwnProperty(prop)) {
                words[prop] = parserConfig.extraWords[prop];
            }
        }

        function tokenBase(stream, state) {
            var ch = stream.next();

            if (ch === '"') {
                state.tokenize = tokenString;
                return state.tokenize(stream, state);
            }
            if (ch === '(') {
                if (stream.eat('*')) {
                    state.commentLevel++;
                    state.tokenize = tokenComment;
                    return state.tokenize(stream, state);
                }
            }
            if (ch === '~') {
                stream.eatWhile(/\w/);
                return 'variable-2';
            }
            if (ch === '`') {
                stream.eatWhile(/\w/);
                return 'quote';
            }
            if (ch === '/' && parserConfig.slashComments && stream.eat('/')) {
                stream.skipToEnd();
                return 'comment';
            }
            if (/\d/.test(ch)) {
                stream.eatWhile(/[\d]/);
                if (stream.eat('.')) {
                    stream.eatWhile(/[\d]/);
                }
                return 'number';
            }
            if ( /[+\-*&%=<>!?|]/.test(ch)) {
                return 'operator';
            }
            if (/[\w\xa1-\uffff]/.test(ch)) {
                stream.eatWhile(/[\w\xa1-\uffff]/);
                var cur = stream.current();
                if (words.hasOwnProperty(cur)) {
                    if (stream.eol() && (cur == 'let' || cur == 'in' ||cur == 'local' || cur == 'struct' || cur == 'sig')) {
                        state.indentHint += config.indentUnit;
                    }
                    return words[cur];
                } else {
                    return 'variable';
                }
            }
            return null;
        }

        function tokenString(stream, state) {
            var next, end = false, escaped = false;
            while ((next = stream.next()) != null) {
                if (next === '"' && !escaped) {
                    end = true;
                    break;
                }
                escaped = !escaped && next === '\\';
            }
            if (end && !escaped) {
                state.tokenize = tokenBase;
            }
            return 'string';
        };

        function tokenComment(stream, state) {
            var prev, next;
            while(state.commentLevel > 0 && (next = stream.next()) != null) {
                if (prev === '(' && next === '*') state.commentLevel++;
                if (prev === '*' && next === ')') state.commentLevel--;
                prev = next;
            }
            if (state.commentLevel <= 0) {
                state.tokenize = tokenBase;
            }
            return 'comment';
        }

        return {
            startState: function() {return {tokenize: tokenBase, commentLevel: 0, indentHint: 0};},
            token: function(stream, state) {
                if (stream.sol()) {
                    state.indentHint = stream.indentation();
                }
                if (stream.eatSpace()) return null;
                return state.tokenize(stream, state);
            },
            indent: function(state, textAfter) {
                if ((textAfter === 'in' || textAfter == 'end') && state.indentHint > config.indentUnit) {
                    state.indentHint -= config.indentUnit;
                }
                return state.indentHint;
            },

            electricInput: /(in|end)$/,
            blockCommentStart: "(*",
            blockCommentEnd: "*)",
            lineComment: parserConfig.slashComments ? "//" : null
        };
    });

    CodeMirror.defineMIME('text/x-ocaml', {
        name: 'mllike',
        extraWords: {
            'succ': 'keyword',
            'trace': 'builtin',
            'exit': 'builtin',
            'print_string': 'builtin',
            'print_endline': 'builtin',
            'true': 'atom',
            'false': 'atom',
            'raise': 'keyword'
        }
    });

    CodeMirror.defineMIME('text/sml', {
        name: 'mllike',
        extraWords: {
            'datatype': 'keyword',
            'abstype': 'keyword',
            'exception': 'keyword',
            'local': 'keyword',
            'eqtype': 'keyword',
            'functor': 'keyword',
            'include': 'keyword',
            'sharing': 'keyword',
            'sig': 'keyword',
            'signature': 'keyword',
            'struct': 'keyword',
            'structure': 'keyword',
            'where': 'keyword',
            'andalso': 'keyword',
            'as': 'keyword',
            'case': 'keyword',
            'fn': 'keyword',
            'handle': 'keyword',
            'infix': 'keyword',
            'infixr': 'keyword',
            'nonfix': 'keyword',
            'op': 'keyword',
            'orelse': 'keyword',
            'raise': 'keyword',
            'rec': 'keyword',
            'withtype': 'keyword',
            ':>': 'keyword',
            '...': 'keyword',
            '_': 'keyword',

            'unit': 'builtin',
            'bool': 'builtin',
            'int': 'builtin',
            'word': 'builtin',
            'real': 'builtin',
            'string': 'builtin',
            'char': 'builtin',
            'list': 'builtin',
            'ref': 'builtin',
            'exn': 'builtin',

            'true': 'atom',
            'false': 'atom',
            'nil': 'atom',
            '::': 'atom',
            'Bind': 'atom',
            'div': 'atom',
            'mod': 'atom',
            'abs': 'atom',
            'Match': 'atom'
        }
    });

    CodeMirror.defineMIME('text/x-fsharp', {
        name: 'mllike',
        extraWords: {
            'abstract': 'keyword',
            'as': 'keyword',
            'assert': 'keyword',
            'base': 'keyword',
            'class': 'keyword',
            'default': 'keyword',
            'delegate': 'keyword',
            'downcast': 'keyword',
            'downto': 'keyword',
            'elif': 'keyword',
            'exception': 'keyword',
            'extern': 'keyword',
            'finally': 'keyword',
            'global': 'keyword',
            'inherit': 'keyword',
            'inline': 'keyword',
            'interface': 'keyword',
            'internal': 'keyword',
            'lazy': 'keyword',
            'let!': 'keyword',
            'member' : 'keyword',
            'module': 'keyword',
            'namespace': 'keyword',
            'new': 'keyword',
            'null': 'keyword',
            'override': 'keyword',
            'private': 'keyword',
            'public': 'keyword',
            'return': 'keyword',
            'return!': 'keyword',
            'select': 'keyword',
            'static': 'keyword',
            'struct': 'keyword',
            'upcast': 'keyword',
            'use': 'keyword',
            'use!': 'keyword',
            'val': 'keyword',
            'when': 'keyword',
            'yield': 'keyword',
            'yield!': 'keyword',

            'List': 'builtin',
            'Seq': 'builtin',
            'Map': 'builtin',
            'Set': 'builtin',
            'int': 'builtin',
            'string': 'builtin',
            'raise': 'builtin',
            'failwith': 'builtin',
            'not': 'builtin',
            'true': 'builtin',
            'false': 'builtin'
        },
        slashComments: true
    });

});

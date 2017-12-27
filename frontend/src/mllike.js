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
            'let': {
                type: 'keyword',
                indent: true
            },
            'rec': {
                type: 'keyword'
            },
            'in': {
                type: 'keyword',
                indent: true
            },
            'and': {
                type: 'keyword'
            },
            'if': {
                type: 'keyword'
            },
            'then': {
                type: 'keyword'
            },
            'else': {
                type: 'keyword'
            },
            'for': {
                type: 'keyword'
            },
            'do': {
                type: 'keyword'
            },
            'of': {
                type: 'keyword'
            },
            'while': {
                type: 'keyword'
            },
            'fun': {
                type: 'keyword'
            },
            'val': {
                type: 'keyword'
            },
            'type': {
                type: 'keyword'
            },
            'match': {
                type: 'keyword'
            },
            'with': {
                type: 'keyword'
            },
            'try': {
                type: 'keyword'
            },
            'open': {
                type: 'builtin'
            },
            'begin': {
                type: 'keyword'
            },
            'end': {
                type: 'keyword'
            }
        };

        var extraWords = parserConfig.extraWords || {};
        for (var prop in extraWords) {
            if (extraWords.hasOwnProperty(prop)) {
                words[prop] = parserConfig.extraWords[prop];
            }
        }

        function decreaseIndent (indentHint) {
            // decrease indent if it is possible
            return (indentHint >= config.indentUnit)
                ? indentHint - config.indentUnit : indentHint;
        }

        function increaseIndent (indentHint) {
            return indentHint + config.indentUnit;
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

                    var matchedObject = words[cur];
                    var shouldIndent = matchedObject.hasOwnProperty('indent')
                        && matchedObject.indent;

                    if (stream.eol() && shouldIndent) {
                        state.indentHint = increaseIndent(state.indentHint);
                    }
                    return matchedObject.type;
                } else {
                    return 'variable';
                }
            }

            // decrease the indent if no pattern matches
            state.indentHint = decreaseIndent(state.indentHint);

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
                if (textAfter === 'in' || textAfter == 'end') {
                    state.indentHint = decreaseIndent(state.indentHint);
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
            'succ': {
                type: 'keyword'
            },
            'trace': {
                type: 'builtin'
            },
            'exit': {
                type: 'builtin'
            },
            'print_string': {
                type: 'builtin'
            },
            'print_endline': {
                type: 'builtin'
            },
            'true': {
                type: 'atom'
            },
            'false': {
                type: 'atom'
            },
            'raise': {
                type: 'keyword'
            }
        }
    });

    CodeMirror.defineMIME('text/sml', {
        name: 'mllike',
        extraWords: {
            'datatype': {
                type: 'keyword'
            },
            'abstype': {
                type: 'keyword'
            },
            'exception': {
                type: 'keyword'
            },
            'local': {
                type: 'keyword',
                indent: true
            },
            'eqtype': {
                type: 'keyword'
            },
            'functor': {
                type: 'keyword'
            },
            'include': {
                type: 'keyword'
            },
            'sharing': {
                type: 'keyword'
            },
            'sig': {
                type: 'keyword',
                indent: true
            },
            'signature': {
                type: 'keyword'
            },
            'struct': {
                type: 'keyword',
                indent: true
            },
            'structure': {
                type: 'keyword'
            },
            'where': {
                type: 'keyword'
            },
            'andalso': {
                type: 'keyword'
            },
            'as': {
                type: 'keyword'
            },
            'case': {
                type: 'keyword'
            },
            'fn': {
                type: 'keyword'
            },
            'handle': {
                type: 'keyword'
            },
            'infix': {
                type: 'keyword'
            },
            'infixr': {
                type: 'keyword'
            },
            'nonfix': {
                type: 'keyword'
            },
            'op': {
                type: 'keyword'
            },
            'orelse': {
                type: 'keyword'
            },
            'raise': {
                type: 'keyword'
            },
            'rec': {
                type: 'keyword'
            },
            'withtype': {
                type: 'keyword'
            },
            ':>': {
                type: 'keyword'
            },
            '...': {
                type: 'keyword'
            },
            '_': {
                type: 'keyword'
            },

            'unit': {
                type: 'builtin'
            },
            'bool': {
                type: 'builtin'
            },
            'int': {
                type: 'builtin'
            },
            'word': {
                type: 'builtin'
            },
            'real': {
                type: 'builtin'
            },
            'string': {
                type: 'builtin'
            },
            'char': {
                type: 'builtin'
            },
            'list': {
                type: 'builtin'
            },
            'ref': {
                type: 'builtin'
            },
            'exn': {
                type: 'builtin'
            },

            'true': {
                type: 'atom'
            },
            'false': {
                type: 'atom'
            },
            'nil': {
                type: 'atom'
            },
            '::': {
                type: 'atom'
            },
            'Bind': {
                type: 'atom'
            },
            'div': {
                type: 'atom'
            },
            'mod': {
                type: 'atom'
            },
            'abs': {
                type: 'atom'
            },
            'Match': {
                type: 'atom'
            }
        }
    });

    CodeMirror.defineMIME('text/x-fsharp', {
        name: 'mllike',
        extraWords: {
            'abstract': {
                type: 'keyword'
            },
            'as': {
                type: 'keyword'
            },
            'assert': {
                type: 'keyword'
            },
            'base': {
                type: 'keyword'
            },
            'class': {
                type: 'keyword'
            },
            'default': {
                type: 'keyword'
            },
            'delegate': {
                type: 'keyword'
            },
            'downcast': {
                type: 'keyword'
            },
            'downto': {
                type: 'keyword'
            },
            'elif': {
                type: 'keyword'
            },
            'exception': {
                type: 'keyword'
            },
            'extern': {
                type: 'keyword'
            },
            'finally': {
                type: 'keyword'
            },
            'global': {
                type: 'keyword'
            },
            'inherit': {
                type: 'keyword'
            },
            'inline': {
                type: 'keyword'
            },
            'interface': {
                type: 'keyword'
            },
            'internal': {
                type: 'keyword'
            },
            'lazy': {
                type: 'keyword'
            },
            'let!': {
                type: 'keyword'
            },
            'member' : {
                type: 'keyword'
            },
            'module': {
                type: 'keyword'
            },
            'namespace': {
                type: 'keyword'
            },
            'new': {
                type: 'keyword'
            },
            'null': {
                type: 'keyword'
            },
            'override': {
                type: 'keyword'
            },
            'private': {
                type: 'keyword'
            },
            'public': {
                type: 'keyword'
            },
            'return': {
                type: 'keyword'
            },
            'return!': {
                type: 'keyword'
            },
            'select': {
                type: 'keyword'
            },
            'static': {
                type: 'keyword'
            },
            'struct': {
                type: 'keyword',
                indent: true
            },
            'upcast': {
                type: 'keyword'
            },
            'use': {
                type: 'keyword'
            },
            'use!': {
                type: 'keyword'
            },
            'val': {
                type: 'keyword'
            },
            'when': {
                type: 'keyword'
            },
            'yield': {
                type: 'keyword'
            },
            'yield!': {
                type: 'keyword'
            },

            'List': {
                type: 'builtin'
            },
            'Seq': {
                type: 'builtin'
            },
            'Map': {
                type: 'builtin'
            },
            'Set': {
                type: 'builtin'
            },
            'int': {
                type: 'builtin'
            },
            'string': {
                type: 'builtin'
            },
            'raise': {
                type: 'builtin'
            },
            'failwith': {
                type: 'builtin'
            },
            'not': {
                type: 'builtin'
            },
            'true': {
                type: 'builtin'
            },
            'false': {
                type: 'builtin'
            }
        },
        slashComments: true
    });

});
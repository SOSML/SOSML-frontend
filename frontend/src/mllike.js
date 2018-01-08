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
                indent: true,
                dedent: true
            },
            'and': {
                type: 'keyword'
            },
            'if': {
                type: 'keyword',
                indent: true
            },
            'then': {
                type: 'keyword',
                indent: true
            },
            'else': {
                type: 'keyword',
                indent: true,
                dedent: true
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
                type: 'keyword',
                indent: true
            },
            'val': {
                type: 'keyword',
                indent: true
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
                type: 'keyword',
                dedent: true
            }
        };

        var extraWords = parserConfig.extraWords || {};
        for (var prop in extraWords) {
            if (extraWords.hasOwnProperty(prop)) {
                words[prop] = parserConfig.extraWords[prop];
            }
        }

        var electricRegex = "(";
        //generate electricInput regular expression
        for (var word in words) {
            //go through all words and test if they have the dedent property set
            if (words.hasOwnProperty(word)) {
                var wordObject = words[word];

                //if it is set, add them to the regex
                if (wordObject.hasOwnProperty('dedent') && wordObject.dedent) {
                    electricRegex += word + '|';
                }

            }
        }

        //cut off the last trailing |
        var regexLength = electricRegex.length;
        //do not cut off the last character if no word has been added to the regex
        if (regexLength > 1) {
            //cut off the last character
            electricRegex = electricRegex.slice(0,-1);
        }
        //finish the regex
        electricRegex += ')$';

        /* Use large numbers to see easily possible misuse */
        const INDENT_OPTIONS = {INDENT: 10, DEDENT: 20, STAY: 30};

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

            /* match digits */
            if (/\d/.test(ch)) {
                stream.eatWhile(/[\d]/);
                /* match floating numbers */
                if (stream.eat('.')) {
                    stream.eatWhile(/[\d]/);
                }

                state.indentHint = INDENT_OPTIONS.STAY;

                return 'number';
            }
            if ( /[+\-*&%=<>!?|]/.test(ch)) {
                state.indentHint = INDENT_OPTIONS.INDENT;

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
                        state.indentHint = INDENT_OPTIONS.INDENT;
                    }
                    return matchedObject.type;
                } else {
                    //TODO: this will overwrite if expressions, because there will likely contain a variable
                    state.indentHint = INDENT_OPTIONS.STAY;

                    return 'variable';
                }
            }

            // decrease the indent if no pattern matches
            state.indentHint = INDENT_OPTIONS.DEDENT;

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
            startState: function() {
                return {
                    tokenize: tokenBase,
                    commentLevel: 0,
                    /*
                    This will be overwritten in the token function with
                    the indentation of the current line.
                     */
                    indent: 0,
                    /*
                    Since there are only three useful possibilities
                    (increase indent, decrease indent, same indent)
                    this should be enough. Following functions like
                    tokenBase() or indent() may overwrite this value
                    before indent() calculates the real indent of the
                    next line out of this value together with the indent
                    of the current line.
                    This property is only used at the beginning of the document
                     */
                    indentHint: INDENT_OPTIONS.STAY
                };
            },
            token: function(stream, state) {
                if (stream.sol()) {
                    //save the current indentation
                    state.indent = stream.indentation();
                    // overwrite the value after each line
                    state.indentHint = INDENT_OPTIONS.STAY;
                }
                if (stream.eatSpace()) return null;
                return state.tokenize(stream, state);
            },
            indent: function(state, textAfter) {

                if (words.hasOwnProperty(textAfter)) {

                    const matchedObject = words[textAfter];

                    const shouldDedent = matchedObject.hasOwnProperty('dedent')
                        && matchedObject.dedent;

                    if (shouldDedent) {
                        state.indentHint = INDENT_OPTIONS.DEDENT;
                    }
                }

                switch (state.indentHint) {
                    case INDENT_OPTIONS.DEDENT:
                        //decrease the indent if possible
                        return state.indent >= config.indentUnit ?
                            (state.indent - config.indentUnit)
                            : state.indent;

                    case INDENT_OPTIONS.INDENT:
                        return state.indent + config.indentUnit;

                    default:
                        return state.indent;
                }
            },

            electricInput: new RegExp(electricRegex),
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
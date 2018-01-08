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
                indentNewLine: true
            },
            'rec': {
                type: 'keyword'
            },
            'in': {
                type: 'keyword',
                indentNewLine: true,
                dedentCurrentLine: true
            },
            'and': {
                type: 'keyword'
            },
            'if': {
                type: 'keyword',
                indentNewLine: true
            },
            'then': {
                type: 'keyword',
                indentNewLine: true
            },
            'else': {
                type: 'keyword',
                indentNewLine: true,
                dedentCurrentLine: true
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
                indentNewLine: true
            },
            'val': {
                type: 'keyword',
                indentNewLine: true
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
                dedentCurrentLine: true,
                dedentNewLine: true
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
                if (wordObject.hasOwnProperty('dedentCurrentLine') && wordObject.dedentCurrentLine) {
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

                state.indentChange -= config.indentUnit;

                return 'number';
            }
            if ( /[+\-*&%=<>!?|]/.test(ch)) {

                state.indentChange += config.indentUnit;

                return 'operator';
            }

            if (/[\w\xa1-\uffff]/.test(ch)) {
                stream.eatWhile(/[\w\xa1-\uffff]/);
                var cur = stream.current();

                if (words.hasOwnProperty(cur)) {

                    var matchedObject = words[cur];
                    var shouldIndent = matchedObject.hasOwnProperty('indentNewLine')
                        && matchedObject.indentNewLine;

                    if (shouldIndent) {
                        state.indentChange += config.indentUnit;
                    }

                    var shouldDedent = matchedObject.hasOwnProperty('dedentNewLine')
                        && matchedObject.dedentNewLine;

                    if (shouldDedent) {
                        state.indentChange -= config.indentUnit;
                    }

                    return matchedObject.type;
                } else {

                    //prevent multiple - when functions they have arguments
                    if (state.indentChange > 0) {
                        state.indentChange -= config.indentUnit;
                    }

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
            startState: function() {
                return {
                    tokenize: tokenBase,
                    commentLevel: 0,
                    /*
                    This will be overwritten in the token function with
                    the indentation of the current line.
                     */
                    currentIndent: 0,
                    /*
                    The change for the next line will be saved here.
                    Following functions like tokenBase() or indent()
                    may overwrite this value before indent() calculates
                    the real indent of the next line out of this value
                    together with the indent of the current line.
                     */
                    indentChange: 0
                };
            },
            token: function(stream, state) {
                if (stream.sol()) {
                    //save the current indentation
                    state.currentIndent = stream.indentation();
                    //reset the indentation change from the line before
                    state.indentChange = 0;
                }
                if (stream.eatSpace()) return null;
                return state.tokenize(stream, state);
            },
            indent: function(state, textAfter) {

                if (words.hasOwnProperty(textAfter)) {

                    const matchedObject = words[textAfter];

                    const shouldDedent = matchedObject.hasOwnProperty('dedentCurrentLine')
                        && matchedObject.dedentCurrentLine;

                    if (shouldDedent) {
                        state.indentChange -= config.indentUnit;
                    }
                }

                const barPosition = textAfter.indexOf('|');

                //test if it is the only occurrence of |
                if (barPosition !== -1 && barPosition !== textAfter.lastIndexOf('|')) {
                    state.indentChange += config.indentUnit;
                }

                var newIndent = state.currentIndent + state.indentChange;

                //return 0 if the new indent is smaller than 0
                return newIndent < 0 ? 0 : newIndent;
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
                type: 'builtin',
                dedentNewLine: true
            },
            'bool': {
                type: 'builtin',
                dedentNewLine: true
            },
            'int': {
                type: 'builtin',
                dedentNewLine: true
            },
            'word': {
                type: 'builtin',
                dedentNewLine: true
            },
            'real': {
                type: 'builtin',
                dedentNewLine: true
            },
            'string': {
                type: 'builtin',
                dedentNewLine: true
            },
            'char': {
                type: 'builtin',
                dedentNewLine: true
            },
            'list': {
                type: 'builtin',
                dedentNewLine: true
            },
            'ref': {
                type: 'builtin'
            },
            'exn': {
                type: 'builtin'
            },

            'true': {
                type: 'atom',
                dedentNewLine: true
            },
            'false': {
                type: 'atom',
                dedentNewLine: true
            },
            'nil': {
                type: 'atom',
                dedentNewLine: true
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
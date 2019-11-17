// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

var Interpreter = require('@sosml/interpreter');
var CodeMirror = require('react-codemirror');

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("codemirror/lib/codemirror"));
    else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
    CodeMirror.defineMode('sml', function(config, parserConfig) {
        /*
        function decreaseIndentIfPositive (state) {
            if (state.indentChange >= 0) {
                state.indentChange -= config.indentUnit;
            }
        }

        function increaseIndent (state) {
            state.indentChange += config.indentUnit;
        }

        function decreaseIndent (state) {
            state.indentChange -= config.indentUnit;
        }
        */

        var initialState = Interpreter.getFirstState([], {});

        return {
            startState: function() {
                return {
                    remainder: '',
                    currentIndent: 0,
                    parenLevel: 0,
                    letLevel: 0,
                    indentChange: 0
                };
            },
            token: function(stream, state) {
                if (stream.eatSpace()) {
                    return null;
                }
                var token = undefined;
                try {
                    var posInRem = 0;
                    token = Interpreter.Lexer.nextToken({
                        'next': () => {
                            if (posInRem < state.remainder.length) {
                                ++posInRem;
                                return state.remainder.charAt(posInRem - 1);
                            }
                            if (stream.eol()) {
                                throw new Interpreter.Errors.IncompleteError('. . .');
                            }
                            return stream.next();
                        },
                        'eos': () => stream.eol(),
                        'peek': offset => {
                            if (offset === undefined) {
                                offset = 0;
                            }
                            if (posInRem + offset < state.remainder.length) {
                                return state.remainder.charAt(posInRem + offset);
                            }
                            offset -= state.remainder.length;
                            var res = stream.peek();
                            for (var i = 0; i < offset; ++i) {
                                if (stream.peek() === null) {
                                    stream.backup(i);
                                    return undefined;
                                }
                                stream.next();
                                res = stream.peek();
                            }
                            if (offset > 0) {
                                stream.backUp(offset);
                            }
                            return res;
                        }
                    }, {'allowCommentToken': true});
                    state.remainder = '';
                } catch (e) {
                    if (e.name === 'Input Incomplete') {
                        state.remainder += stream.current() + '';

                        var remText = '';
                        for (var i = 1; i < 10; ++i) {
                            let cur = stream.lookAhead(i);
                            if (cur === undefined) {
                                break;
                            }
                            remText += ' ' + cur;
                        }

                        var tmpText = state.remainder + remText;
                        var pos = 0;
                        try {
                            token = Interpreter.Lexer.nextToken({
                                'next': () => {
                                    if (pos < tmpText.length) {
                                        ++pos;
                                        return tmpText.charAt(pos - 1);
                                    }
                                    throw new Interpreter.Errors.IncompleteError('. . .');
                                },
                                'eos': () => {
                                    return pos >= tmpText.length;
                                },
                                'peek': offset => {
                                    if (offset === undefined) {
                                        offset = 0;
                                    }
                                    if (pos + offset < tmpText.length) {
                                        return tmpText.charAt(pos + offset);
                                    }
                                    return undefined;
                                }
                            }, {'allowCommentToken': true});
                        } catch (e) {
                            return 'error';
                        }
                    } else {
                        // Some other error
                        return 'error';
                    }
                }
                if (token === undefined) {
                    return null;
                }

                switch (token.typeName()) {
                    case 'CommentToken': return 'comment';
                    case 'KeywordToken': {
                        if (token.text === '(') {
                            state.parenLevel++;
                        }
                        if (token.text === ')') {
                            state.parenLevel--;
                        }
                        if (token.text === 'let' || token.text === 'local'
                            || token.text === 'struct' || token.text === 'sig') {
                            state.letLevel++;
                        }
                        if (token.text === 'end') {
                            state.letLevel--;
                        }
                        if (token.text === ';') {
                            if (state.parenLevel === 0 && state.letLevel === 0) {
                                // top-level ;
                                return null;
                            }
                        }
                        return 'keyword';
                    }
                    case 'IntegerConstantToken': return 'number';
                    case 'NumericToken': return 'number';
                    case 'RealConstantToken': return 'number';
                    case 'WordConstantToken': return 'number';
                    case 'ConstantToken': return 'number';
                    case 'CharacterConstantToken': return 'quote';
                    case 'StringConstantToken': return 'quote';
                    case 'IdentifierToken': return 'variable';
                    case 'AlphanumericIdentifierToken': {
                        if (initialState.getDynamicValue(token.text) !== undefined
                            || initialState.getDynamicType(token.text) !== undefined) {
                            // some default value
                            return 'builtin';
                        }
                        return 'variable';
                    }
                    case 'LongIdentifierToken': return 'variable';
                    case 'TypeVariableToken': return 'atom';
                    case 'EqualityTypeVariableToken': return 'atom';
                    case 'StarToken': return 'operator';
                    case 'EqualsToken': return 'operator';
                    default: return null;
                }
            },
            indent: function(state, textAfter) {
                return state.currentIndent;
            },

            // electricInput: new RegExp(electricRegex),
            blockCommentStart: '(*',
            blockCommentEnd: '*)',
            lineComment: null,
            fold: "sml"
        };
    });

    CodeMirror.defineMIME('text/sml', {
        name: 'sml',
        extraWords: { }
    });
});

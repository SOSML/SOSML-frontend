var Interpreter =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// A general compiler error. Different translation phases may derive their own, more specialized error classes.
var InterpreterError = (function (_super) {
    __extends(InterpreterError, _super);
    function InterpreterError(position, message) {
        var _this = _super.call(this, message) || this;
        _this.position = position;
        Object.setPrototypeOf(_this, InterpreterError.prototype);
        return _this;
    }
    return InterpreterError;
}(Error));
exports.InterpreterError = InterpreterError;
// Used for errors that Never Happen™. Any InternalInterpreterError occurring is a bug in the interpreter, regardless
// of how absurd the input is.
var InternalInterpreterError = (function (_super) {
    __extends(InternalInterpreterError, _super);
    function InternalInterpreterError(position, message) {
        if (message === void 0) { message = 'internal compiler error'; }
        var _this = _super.call(this, position, message) || this;
        Object.setPrototypeOf(_this, InternalInterpreterError.prototype);
        return _this;
    }
    return InternalInterpreterError;
}(InterpreterError));
exports.InternalInterpreterError = InternalInterpreterError;
// Used if the code may be valid SML, but uses a feature that this interpreter does not implement, e.g. references.
var FeatureNotImplementedError = (function (_super) {
    __extends(FeatureNotImplementedError, _super);
    function FeatureNotImplementedError(position, message) {
        var _this = _super.call(this, position, message) || this;
        Object.setPrototypeOf(_this, FeatureNotImplementedError.prototype);
        return _this;
    }
    return FeatureNotImplementedError;
}(InterpreterError));
exports.FeatureNotImplementedError = FeatureNotImplementedError;
// Used if the code may be valid SML, but uses a feature that is currently disabled in the interpreter settings.
var FeatureDisabledError = (function (_super) {
    __extends(FeatureDisabledError, _super);
    function FeatureDisabledError(position, message) {
        var _this = _super.call(this, position, message) || this;
        Object.setPrototypeOf(_this, FeatureDisabledError.prototype);
        return _this;
    }
    return FeatureDisabledError;
}(InterpreterError));
exports.FeatureDisabledError = FeatureDisabledError;
// Used if the input is incomplete, but may be a prefix of valid SML code.
var IncompleteError = (function (_super) {
    __extends(IncompleteError, _super);
    function IncompleteError(position, message) {
        if (message === void 0) { message = 'unexpected end of input'; }
        var _this = _super.call(this, position, message) || this;
        Object.setPrototypeOf(_this, IncompleteError.prototype);
        return _this;
    }
    return IncompleteError;
}(InterpreterError));
exports.IncompleteError = IncompleteError;
var LexerError = (function (_super) {
    __extends(LexerError, _super);
    function LexerError(position, message) {
        var _this = _super.call(this, position, message) || this;
        Object.setPrototypeOf(_this, LexerError.prototype);
        return _this;
    }
    return LexerError;
}(InterpreterError));
exports.LexerError = LexerError;
var ParserError = (function (_super) {
    __extends(ParserError, _super);
    function ParserError(message, position) {
        var _this = _super.call(this, position, message) || this;
        Object.setPrototypeOf(_this, ParserError.prototype);
        return _this;
    }
    return ParserError;
}(InterpreterError));
exports.ParserError = ParserError;
var ElaborationError = (function (_super) {
    __extends(ElaborationError, _super);
    function ElaborationError(position, message) {
        var _this = _super.call(this, position, message) || this;
        Object.setPrototypeOf(_this, ElaborationError.prototype);
        return _this;
    }
    ElaborationError.getUnguarded = function (position, tyvars) {
        var res = '';
        if (tyvars.length > 1) {
            res += 's';
        }
        res += ' ';
        for (var i = 0; i < tyvars.length; ++i) {
            if (i > 0) {
                res += ', ';
            }
            res += '"' + tyvars[i] + '"';
        }
        return new ElaborationError(position, 'Unguarded type variable' + res + '.');
    };
    return ElaborationError;
}(InterpreterError));
exports.ElaborationError = ElaborationError;
var EvaluationError = (function (_super) {
    __extends(EvaluationError, _super);
    function EvaluationError(position, message) {
        var _this = _super.call(this, position, message) || this;
        Object.setPrototypeOf(_this, EvaluationError.prototype);
        return _this;
    }
    return EvaluationError;
}(InterpreterError));
exports.EvaluationError = EvaluationError;
var Warning = (function (_super) {
    __extends(Warning, _super);
    function Warning(position, message) {
        var _this = _super.call(this, position, message) || this;
        Object.setPrototypeOf(_this, Warning.prototype);
        return _this;
    }
    return Warning;
}(InterpreterError));
exports.Warning = Warning;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var KeywordToken = (function () {
    function KeywordToken(text, position) {
        this.text = text;
        this.position = position;
    }
    KeywordToken.prototype.getText = function () {
        return this.text;
    };
    KeywordToken.prototype.isValidRecordLabel = function () { return false; };
    KeywordToken.prototype.isVid = function () { return false; };
    return KeywordToken;
}());
exports.KeywordToken = KeywordToken;
var ConstantToken = (function () {
    function ConstantToken() {
    }
    ConstantToken.prototype.isVid = function () { return false; };
    return ConstantToken;
}());
exports.ConstantToken = ConstantToken;
var IntegerConstantToken = (function (_super) {
    __extends(IntegerConstantToken, _super);
    function IntegerConstantToken(text, position, value) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.position = position;
        _this.value = value;
        return _this;
    }
    IntegerConstantToken.prototype.getText = function () {
        return '' + this.value;
    };
    IntegerConstantToken.prototype.isValidRecordLabel = function () { return false; };
    return IntegerConstantToken;
}(ConstantToken));
exports.IntegerConstantToken = IntegerConstantToken;
var RealConstantToken = (function (_super) {
    __extends(RealConstantToken, _super);
    function RealConstantToken(text, position, value) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.position = position;
        _this.value = value;
        return _this;
    }
    RealConstantToken.prototype.getText = function () {
        return '' + this.value;
    };
    RealConstantToken.prototype.isValidRecordLabel = function () { return false; };
    return RealConstantToken;
}(ConstantToken));
exports.RealConstantToken = RealConstantToken;
var WordConstantToken = (function (_super) {
    __extends(WordConstantToken, _super);
    function WordConstantToken(text, position, value) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.position = position;
        _this.value = value;
        return _this;
    }
    WordConstantToken.prototype.getText = function () {
        return '' + this.value;
    };
    WordConstantToken.prototype.isValidRecordLabel = function () { return false; };
    return WordConstantToken;
}(ConstantToken));
exports.WordConstantToken = WordConstantToken;
var CharacterConstantToken = (function (_super) {
    __extends(CharacterConstantToken, _super);
    function CharacterConstantToken(text, position, value) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.position = position;
        _this.value = value;
        return _this;
    }
    CharacterConstantToken.prototype.getText = function () {
        return '' + this.text;
    };
    CharacterConstantToken.prototype.isValidRecordLabel = function () { return false; };
    return CharacterConstantToken;
}(ConstantToken));
exports.CharacterConstantToken = CharacterConstantToken;
var StringConstantToken = (function (_super) {
    __extends(StringConstantToken, _super);
    function StringConstantToken(text, position, value) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.position = position;
        _this.value = value;
        return _this;
    }
    StringConstantToken.prototype.getText = function () {
        return '' + this.text;
    };
    StringConstantToken.prototype.isValidRecordLabel = function () { return false; };
    return StringConstantToken;
}(ConstantToken));
exports.StringConstantToken = StringConstantToken;
// Any identifier not starting with a prime (')
// May represent value identifiers, type constructors and record labels
var IdentifierToken = (function () {
    function IdentifierToken(text, position) {
        this.text = text;
        this.position = position;
        this.opPrefixed = false;
    }
    IdentifierToken.prototype.getText = function () {
        return this.text;
    };
    IdentifierToken.prototype.isValidRecordLabel = function () { return true; };
    IdentifierToken.prototype.isVid = function () { return true; };
    return IdentifierToken;
}());
exports.IdentifierToken = IdentifierToken;
// Alphanumeric identifiers not starting with a prime may represent structure identifiers, signature identifiers
// and functor identifiers
var AlphanumericIdentifierToken = (function (_super) {
    __extends(AlphanumericIdentifierToken, _super);
    function AlphanumericIdentifierToken(text, position) {
        return _super.call(this, text, position) || this;
    }
    AlphanumericIdentifierToken.prototype.getText = function () {
        return this.text;
    };
    AlphanumericIdentifierToken.prototype.isValidRecordLabel = function () { return true; };
    return AlphanumericIdentifierToken;
}(IdentifierToken));
exports.AlphanumericIdentifierToken = AlphanumericIdentifierToken;
// An alphanumeric identifier that starts with a prime
var TypeVariableToken = (function () {
    function TypeVariableToken(text, position) {
        this.text = text;
        this.position = position;
    }
    TypeVariableToken.prototype.getText = function () {
        return this.text;
    };
    TypeVariableToken.prototype.isValidRecordLabel = function () { return false; };
    TypeVariableToken.prototype.isVid = function () { return false; };
    return TypeVariableToken;
}());
exports.TypeVariableToken = TypeVariableToken;
// An alphanumeric identifier that starts with two primes
var EqualityTypeVariableToken = (function (_super) {
    __extends(EqualityTypeVariableToken, _super);
    function EqualityTypeVariableToken(text, position) {
        return _super.call(this, text, position) || this;
    }
    EqualityTypeVariableToken.prototype.getText = function () {
        return this.text;
    };
    EqualityTypeVariableToken.prototype.isValidRecordLabel = function () { return false; };
    EqualityTypeVariableToken.prototype.isVid = function () { return false; };
    return EqualityTypeVariableToken;
}(TypeVariableToken));
exports.EqualityTypeVariableToken = EqualityTypeVariableToken;
// A star (*) can be used as value identifier or record label, but not as a type constructor and thus must be separated.
// See SML definition, chapter 2.4 Identifiers
var StarToken = (function (_super) {
    __extends(StarToken, _super);
    function StarToken(position) {
        var _this = _super.call(this, '*', position) || this;
        _this.position = position;
        _this.opPrefixed = false;
        return _this;
    }
    StarToken.prototype.getText = function () {
        return this.text;
    };
    StarToken.prototype.isValidRecordLabel = function () { return true; };
    StarToken.prototype.isVid = function () { return true; };
    return StarToken;
}(KeywordToken));
exports.StarToken = StarToken;
// Reserved words are generally not allowed as identifiers. "The only exception to this rule is that the symbol = ,
// which is a reserved word, is also allowed as an identifier to stand for the equality predicate.
// The identifier = may not be re-bound; this precludes any syntactic ambiguity." (Definition of SML, page 5)
var EqualsToken = (function (_super) {
    __extends(EqualsToken, _super);
    function EqualsToken(position) {
        var _this = _super.call(this, '=', position) || this;
        _this.position = position;
        return _this;
    }
    EqualsToken.prototype.getText = function () {
        return this.text;
    };
    EqualsToken.prototype.isValidRecordLabel = function () { return false; };
    EqualsToken.prototype.isVid = function () { return true; };
    return EqualsToken;
}(KeywordToken));
exports.EqualsToken = EqualsToken;
// A numeric token (a positive, decimal integer not starting with '0') can be used either as an integer constant or as
// a record label.
var NumericToken = (function (_super) {
    __extends(NumericToken, _super);
    function NumericToken(text, position, value) {
        return _super.call(this, text, position, value) || this;
    }
    NumericToken.prototype.getText = function () {
        return this.text;
    };
    NumericToken.prototype.isValidRecordLabel = function () { return true; };
    NumericToken.prototype.isVid = function () { return false; };
    return NumericToken;
}(IntegerConstantToken));
exports.NumericToken = NumericToken;
// A long identifier is a sequence str_1.str_2. … .str_n.id of n > 0 structure identifiers and one Identifier
// separated by '.'s. The identifier may a value identifier, type constructor or structure identifier
var LongIdentifierToken = (function () {
    function LongIdentifierToken(text, position, qualifiers, id) {
        this.text = text;
        this.position = position;
        this.qualifiers = qualifiers;
        this.id = id;
        this.opPrefixed = false;
    }
    LongIdentifierToken.prototype.getText = function () {
        var res = '';
        for (var i = 0; i < this.qualifiers.length; ++i) {
            if (i > 0) {
                res += '.';
            }
            res += this.qualifiers[i].getText();
        }
        return res + '.' + this.id.getText();
    };
    LongIdentifierToken.prototype.isValidRecordLabel = function () { return false; };
    LongIdentifierToken.prototype.isVid = function () { return false; };
    return LongIdentifierToken;
}());
exports.LongIdentifierToken = LongIdentifierToken;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var values_1 = __webpack_require__(3);
var tokens_1 = __webpack_require__(1);
var errors_1 = __webpack_require__(0);
var IdentifierStatus;
(function (IdentifierStatus) {
    IdentifierStatus[IdentifierStatus["VALUE_VARIABLE"] = 0] = "VALUE_VARIABLE";
    IdentifierStatus[IdentifierStatus["VALUE_CONSTRUCTOR"] = 1] = "VALUE_CONSTRUCTOR";
    IdentifierStatus[IdentifierStatus["EXCEPTION_CONSTRUCTOR"] = 2] = "EXCEPTION_CONSTRUCTOR";
})(IdentifierStatus = exports.IdentifierStatus || (exports.IdentifierStatus = {}));
var TypeInformation = (function () {
    // Every constructor also appears in the value environment,
    // thus it suffices to record their names here.
    function TypeInformation(type, constructors, arity, allowsEquality) {
        if (allowsEquality === void 0) { allowsEquality = true; }
        this.type = type;
        this.constructors = constructors;
        this.arity = arity;
        this.allowsEquality = allowsEquality;
    }
    return TypeInformation;
}());
exports.TypeInformation = TypeInformation;
var DynamicFunctorInformation = (function () {
    function DynamicFunctorInformation(paramName, param, body, state) {
        this.paramName = paramName;
        this.param = param;
        this.body = body;
        this.state = state;
    }
    return DynamicFunctorInformation;
}());
exports.DynamicFunctorInformation = DynamicFunctorInformation;
var DynamicInterface = (function () {
    function DynamicInterface(typeInterface, valueInterface, structureInterface) {
        this.typeInterface = typeInterface;
        this.valueInterface = valueInterface;
        this.structureInterface = structureInterface;
    }
    DynamicInterface.prototype.extend = function (other) {
        for (var i in other.typeInterface) {
            if (other.typeInterface.hasOwnProperty(i)) {
                this.typeInterface[i] = other.typeInterface[i];
            }
        }
        for (var i in other.valueInterface) {
            if (other.valueInterface.hasOwnProperty(i)) {
                this.valueInterface[i] = other.valueInterface[i];
            }
        }
        for (var i in other.structureInterface) {
            if (other.structureInterface.hasOwnProperty(i)) {
                this.structureInterface[i] = other.structureInterface[i];
            }
        }
        return this;
    };
    return DynamicInterface;
}());
exports.DynamicInterface = DynamicInterface;
var InfixStatus = (function () {
    function InfixStatus(infix, precedence, rightAssociative) {
        if (precedence === void 0) { precedence = 0; }
        if (rightAssociative === void 0) { rightAssociative = false; }
        this.infix = infix;
        this.precedence = precedence;
        this.rightAssociative = rightAssociative;
    }
    return InfixStatus;
}());
exports.InfixStatus = InfixStatus;
var DynamicBasis = (function () {
    function DynamicBasis(typeEnvironment, valueEnvironment, structureEnvironment, signatureEnvironment, functorEnvironment) {
        this.typeEnvironment = typeEnvironment;
        this.valueEnvironment = valueEnvironment;
        this.structureEnvironment = structureEnvironment;
        this.signatureEnvironment = signatureEnvironment;
        this.functorEnvironment = functorEnvironment;
    }
    DynamicBasis.prototype.getValue = function (name) {
        return this.valueEnvironment[name];
    };
    DynamicBasis.prototype.getType = function (name) {
        return this.typeEnvironment[name];
    };
    DynamicBasis.prototype.getStructure = function (name) {
        return this.structureEnvironment[name];
    };
    DynamicBasis.prototype.getSignature = function (name) {
        return this.signatureEnvironment[name];
    };
    DynamicBasis.prototype.getFunctor = function (name) {
        return this.functorEnvironment[name];
    };
    DynamicBasis.prototype.setValue = function (name, value, is) {
        this.valueEnvironment[name] = [value, is];
    };
    DynamicBasis.prototype.setType = function (name, type) {
        this.typeEnvironment[name] = type;
    };
    DynamicBasis.prototype.setStructure = function (name, structure) {
        this.structureEnvironment[name] = structure;
    };
    DynamicBasis.prototype.setSignature = function (name, signature) {
        this.signatureEnvironment[name] = signature;
    };
    DynamicBasis.prototype.setFunctor = function (name, functor) {
        this.functorEnvironment[name] = functor;
    };
    DynamicBasis.prototype.extend = function (other) {
        for (var i in other.typeEnvironment) {
            if (other.typeEnvironment.hasOwnProperty(i)) {
                this.typeEnvironment[i] = other.typeEnvironment[i];
            }
        }
        for (var i in other.valueEnvironment) {
            if (other.valueEnvironment.hasOwnProperty(i)) {
                this.valueEnvironment[i] = other.valueEnvironment[i];
            }
        }
        for (var i in other.structureEnvironment) {
            if (other.structureEnvironment.hasOwnProperty(i)) {
                this.structureEnvironment[i] = other.structureEnvironment[i];
            }
        }
        for (var i in other.signatureEnvironment) {
            if (other.signatureEnvironment.hasOwnProperty(i)) {
                this.signatureEnvironment[i] = other.signatureEnvironment[i];
            }
        }
        for (var i in other.functorEnvironment) {
            if (other.functorEnvironment.hasOwnProperty(i)) {
                this.functorEnvironment[i] = other.functorEnvironment[i];
            }
        }
        return this;
    };
    DynamicBasis.prototype.restrict = function (sig) {
        var res = new DynamicBasis({}, {}, {}, this.signatureEnvironment, this.functorEnvironment);
        for (var i in sig.typeInterface) {
            if (sig.typeInterface.hasOwnProperty(i)
                && this.typeEnvironment.hasOwnProperty(i)) {
                var tmp = new Set();
                var ntp = [];
                for (var j = 0; j < this.typeEnvironment[i].length; ++j) {
                    tmp = tmp.add(this.typeEnvironment[i][j]);
                }
                for (var j = 0; j < sig.typeInterface[i].length; ++j) {
                    if (tmp.has(sig.typeInterface[i][j])) {
                        ntp.push(sig.typeInterface[i][j]);
                    }
                }
                res.typeEnvironment[i] = ntp;
            }
        }
        for (var i in sig.valueInterface) {
            if (sig.valueInterface.hasOwnProperty(i)
                && this.valueEnvironment.hasOwnProperty(i)) {
                res.valueEnvironment[i] = [this.valueEnvironment[i][0], sig.valueInterface[i]];
            }
        }
        for (var i in sig.structureInterface) {
            if (sig.structureInterface.hasOwnProperty(i)
                && this.structureEnvironment.hasOwnProperty(i)) {
                res.structureEnvironment[i]
                    = this.structureEnvironment[i].restrict(sig.structureInterface[i]);
            }
        }
        return res;
    };
    return DynamicBasis;
}());
exports.DynamicBasis = DynamicBasis;
var StaticBasis = (function () {
    function StaticBasis(typeEnvironment, valueEnvironment, structureEnvironment, signatureEnvironment, functorEnvironment) {
        this.typeEnvironment = typeEnvironment;
        this.valueEnvironment = valueEnvironment;
        this.structureEnvironment = structureEnvironment;
        this.signatureEnvironment = signatureEnvironment;
        this.functorEnvironment = functorEnvironment;
    }
    StaticBasis.prototype.getValue = function (name) {
        return this.valueEnvironment[name];
    };
    StaticBasis.prototype.getType = function (name) {
        return this.typeEnvironment[name];
    };
    StaticBasis.prototype.getStructure = function (name) {
        return this.structureEnvironment[name];
    };
    StaticBasis.prototype.getSignature = function (name) {
        return this.signatureEnvironment[name];
    };
    StaticBasis.prototype.getFunctor = function (name) {
        return this.functorEnvironment[name];
    };
    StaticBasis.prototype.setValue = function (name, value, is) {
        this.valueEnvironment[name] = [value, is];
    };
    StaticBasis.prototype.deleteValue = function (name) {
        this.valueEnvironment[name] = undefined;
    };
    StaticBasis.prototype.setType = function (name, type, constructors, arity) {
        this.typeEnvironment[name] = new TypeInformation(type, constructors, arity);
    };
    StaticBasis.prototype.setStructure = function (name, structure) {
        this.structureEnvironment[name] = structure;
    };
    StaticBasis.prototype.setSignature = function (name, signature) {
        this.signatureEnvironment[name] = signature;
    };
    StaticBasis.prototype.setFunctor = function (name, functor) {
        this.functorEnvironment[name] = functor;
    };
    StaticBasis.prototype.extend = function (other) {
        for (var i in other.typeEnvironment) {
            if (other.typeEnvironment.hasOwnProperty(i)) {
                this.typeEnvironment[i] = other.typeEnvironment[i];
            }
        }
        for (var i in other.valueEnvironment) {
            if (other.valueEnvironment.hasOwnProperty(i)) {
                this.valueEnvironment[i] = other.valueEnvironment[i];
            }
        }
        for (var i in other.structureEnvironment) {
            if (other.structureEnvironment.hasOwnProperty(i)) {
                this.structureEnvironment[i] = other.structureEnvironment[i];
            }
        }
        for (var i in other.signatureEnvironment) {
            if (other.signatureEnvironment.hasOwnProperty(i)) {
                this.signatureEnvironment[i] = other.signatureEnvironment[i];
            }
        }
        for (var i in other.functorEnvironment) {
            if (other.functorEnvironment.hasOwnProperty(i)) {
                this.functorEnvironment[i] = other.functorEnvironment[i];
            }
        }
        return this;
    };
    return StaticBasis;
}());
exports.StaticBasis = StaticBasis;
var State = (function () {
    // The states' ids are non-decreasing; a single declaration uses the same ids
    function State(id, parent, staticBasis, dynamicBasis, memory, freeTypeVariables, infixEnvironment, valueIdentifierId) {
        if (freeTypeVariables === void 0) { freeTypeVariables = [0, new Map()]; }
        if (infixEnvironment === void 0) { infixEnvironment = {}; }
        if (valueIdentifierId === void 0) { valueIdentifierId = {}; }
        this.id = id;
        this.parent = parent;
        this.staticBasis = staticBasis;
        this.dynamicBasis = dynamicBasis;
        this.memory = memory;
        this.freeTypeVariables = freeTypeVariables;
        this.infixEnvironment = infixEnvironment;
        this.valueIdentifierId = valueIdentifierId;
    }
    State.allowsRebind = function (name) {
        return {
            'true': false,
            'false': false,
            'nil': false,
            '::': false,
            '=': false,
            'ref': false,
            ':=': false,
            '!': false
        }[name] === undefined;
    };
    State.prototype.getMemoryChanges = function (stopId) {
        if (this.id === stopId) {
            return [];
        }
        var res = [];
        if (this.parent !== undefined) {
            res = this.parent.getMemoryChanges(stopId);
        }
        for (var i in this.memory[1]) {
            if (this.memory[1].hasOwnProperty(i)) {
                res.push([+i, this.memory[1][i]]);
            }
        }
        return res;
    };
    State.prototype.getDynamicChanges = function (stopId) {
        if (this.id === stopId) {
            return new DynamicBasis({}, {}, {}, {}, {});
        }
        var res = new DynamicBasis({}, {}, {}, {}, {});
        if (this.parent !== undefined) {
            res = this.parent.getDynamicChanges(stopId);
        }
        res = res.extend(this.dynamicBasis);
        return res;
    };
    State.prototype.getStaticChanges = function (stopId) {
        if (this.id === stopId) {
            return new StaticBasis({}, {}, {}, {}, {});
        }
        var res = new StaticBasis({}, {}, {}, {}, {});
        if (this.parent !== undefined) {
            res = this.parent.getStaticChanges(stopId);
        }
        res = res.extend(this.staticBasis);
        return res;
    };
    State.prototype.getNestedState = function (newId) {
        if (newId === void 0) { newId = undefined; }
        if (newId === undefined) {
            newId = this.id + 1;
        }
        var res = new State(newId, this, new StaticBasis({}, {}, {}, {}, {}), new DynamicBasis({}, {}, {}, {}, {}), [this.memory[0], {}], [this.freeTypeVariables[0], new Map()]);
        return res;
    };
    State.prototype.getCell = function (address) {
        if (this.memory[1][address] !== undefined) {
            return this.memory[1][address];
        }
        else if (this.parent === undefined) {
            return undefined;
        }
        else {
            return this.parent.getCell(address);
        }
    };
    State.prototype.getTypeVariableBinds = function (idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        var result = this.freeTypeVariables;
        if (this.parent === undefined || this.parent.id < idLimit) {
            var ret_1 = new Map();
            result[1].forEach(function (val, key) {
                ret_1.set(key, val);
            });
            return [result[0], ret_1];
        }
        else {
            var tmp_1 = this.parent.getTypeVariableBinds(idLimit);
            result[1].forEach(function (val, key) {
                tmp_1[1].set(key, val);
            });
            return [Math.max(result[0], tmp_1[0]), tmp_1[1]];
        }
    };
    // Gets an identifier's type. The value  intermediate  determines whether to return intermediate results
    State.prototype.getStaticValue = function (name, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        var result = this.staticBasis.getValue(name);
        if (result !== undefined || this.parent === undefined || this.parent.id < idLimit) {
            if (result !== undefined) {
                return [result[0], result[1]];
            }
            return result;
        }
        else {
            return this.parent.getStaticValue(name, idLimit);
        }
    };
    State.prototype.getStaticType = function (name, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        var result = this.staticBasis.getType(name);
        if (result !== undefined || this.parent === undefined || this.parent.id < idLimit) {
            return result;
        }
        else {
            return this.parent.getStaticType(name, idLimit);
        }
    };
    State.prototype.getDynamicValue = function (name, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        var result = this.dynamicBasis.getValue(name);
        if (result !== undefined || this.parent === undefined || this.parent.id < idLimit) {
            if (result !== undefined) {
                return [result[0], result[1]];
            }
            return result;
        }
        else {
            return this.parent.getDynamicValue(name, idLimit);
        }
    };
    State.prototype.getDynamicType = function (name, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        var result = this.dynamicBasis.getType(name);
        if (result !== undefined || this.parent === undefined || this.parent.id < idLimit) {
            if (result !== undefined) {
                return [result[0], result[1]];
            }
            return result;
        }
        else {
            return this.parent.getDynamicType(name, idLimit);
        }
    };
    State.prototype.getDynamicStructure = function (name, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        var result = this.dynamicBasis.getStructure(name);
        if (result !== undefined || this.parent === undefined || this.parent.id < idLimit) {
            return result;
        }
        else {
            return this.parent.getDynamicStructure(name, idLimit);
        }
    };
    State.prototype.getAndResolveDynamicStructure = function (name, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        var res = undefined;
        if (name.qualifiers.length === 0) {
            throw new errors_1.EvaluationError(name.position, 'Unqualified LongIdentifierToken are too unqualified to be useful here.');
        }
        else {
            res = this.getDynamicStructure(name.qualifiers[0].getText(), idLimit);
        }
        for (var i = 1; i < name.qualifiers.length; ++i) {
            if (res === undefined) {
                return res;
            }
            res = res.getStructure(name.qualifiers[i].getText());
        }
        return res;
    };
    State.prototype.getDynamicSignature = function (name, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        var result = this.dynamicBasis.getSignature(name);
        if (result !== undefined || this.parent === undefined || this.parent.id < idLimit) {
            return result;
        }
        else {
            return this.parent.getDynamicSignature(name, idLimit);
        }
    };
    State.prototype.getDynamicFunctor = function (name, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        var result = this.dynamicBasis.getFunctor(name);
        if (result !== undefined || this.parent === undefined || this.parent.id < idLimit) {
            return result;
        }
        else {
            return this.parent.getDynamicFunctor(name, idLimit);
        }
    };
    State.prototype.getInfixStatus = function (id, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        if (id.isVid() || id instanceof tokens_1.LongIdentifierToken) {
            if (this.infixEnvironment.hasOwnProperty(id.getText()) || !this.parent
                || this.parent.id < idLimit) {
                return this.infixEnvironment[id.getText()];
            }
            else {
                return this.parent.getInfixStatus(id, idLimit);
            }
        }
        else {
            throw new errors_1.InternalInterpreterError(id.position, 'You gave me some "' + id.getText() + '" (' + id.constructor.name
                + ') but I only want (Long)IdentifierToken.');
        }
    };
    State.prototype.getValueIdentifierId = function (name, idLimit) {
        if (idLimit === void 0) { idLimit = 0; }
        if (this.valueIdentifierId.hasOwnProperty(name)) {
            return this.valueIdentifierId[name];
        }
        else if (!this.parent || this.parent.id < idLimit) {
            return 0;
        }
        else {
            return this.parent.getValueIdentifierId(name, idLimit);
        }
    };
    State.prototype.incrementValueIdentifierId = function (name, atId) {
        if (atId === void 0) { atId = undefined; }
        if (atId === undefined || this.id === atId) {
            this.valueIdentifierId[name] = this.getValueIdentifierId(name, atId) + 1;
        }
        else if (atId > this.id || this.parent === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'State with id "' + atId + '" does not exist.');
        }
        else {
            this.parent.incrementValueIdentifierId(name, atId);
        }
    };
    State.prototype.setCell = function (address, value) {
        if (address >= this.memory[0]) {
            this.memory[0] = address + 1;
        }
        this.memory[1][address] = value;
    };
    State.prototype.setNewCell = function (value) {
        this.memory[1][this.memory[0]] = value;
        return new values_1.ReferenceValue(this.memory[0]++);
    };
    State.prototype.deleteStaticValue = function (name) {
        this.staticBasis.deleteValue(name);
        if (this.parent !== undefined) {
            this.parent.deleteStaticValue(name);
        }
    };
    State.prototype.setStaticValue = function (name, type, is, atId) {
        if (atId === void 0) { atId = undefined; }
        if (atId === undefined || atId === this.id) {
            this.staticBasis.setValue(name, type, is);
        }
        else if (atId > this.id || this.parent === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'State with id "' + atId + '" does not exist.');
        }
        else {
            this.parent.setStaticValue(name, type, is, atId);
        }
    };
    State.prototype.setStaticType = function (name, type, constructors, arity, atId) {
        if (atId === void 0) { atId = undefined; }
        if (atId === undefined || atId === this.id) {
            this.staticBasis.setType(name, type, constructors, arity);
        }
        else if (atId > this.id || this.parent === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'State with id "' + atId + '" does not exist.');
        }
        else {
            this.parent.setStaticType(name, type, constructors, arity, atId);
        }
    };
    State.prototype.setDynamicValue = function (name, value, is, atId) {
        if (atId === void 0) { atId = undefined; }
        if (atId === undefined || atId === this.id) {
            this.dynamicBasis.setValue(name, value, is);
        }
        else if (atId > this.id || this.parent === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'State with id "' + atId + '" does not exist.');
        }
        else {
            this.parent.setDynamicValue(name, value, is, atId);
        }
    };
    State.prototype.setDynamicType = function (name, constructors, atId) {
        if (atId === void 0) { atId = undefined; }
        if (atId === undefined || atId === this.id) {
            this.dynamicBasis.setType(name, constructors);
        }
        else if (atId > this.id || this.parent === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'State with id "' + atId + '" does not exist.');
        }
        else {
            this.parent.setDynamicType(name, constructors, atId);
        }
    };
    State.prototype.setDynamicStructure = function (name, structure, atId) {
        if (atId === void 0) { atId = undefined; }
        if (atId === undefined || atId === this.id) {
            this.dynamicBasis.setStructure(name, structure);
        }
        else if (atId > this.id || this.parent === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'State with id "' + atId + '" does not exist.');
        }
        else {
            this.parent.setDynamicStructure(name, structure, atId);
        }
    };
    State.prototype.setDynamicSignature = function (name, signature, atId) {
        if (atId === void 0) { atId = undefined; }
        if (atId === undefined || atId === this.id) {
            this.dynamicBasis.setSignature(name, signature);
        }
        else if (atId > this.id || this.parent === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'State with id "' + atId + '" does not exist.');
        }
        else {
            this.parent.setDynamicSignature(name, signature, atId);
        }
    };
    State.prototype.setDynamicFunctor = function (name, functor, atId) {
        if (atId === void 0) { atId = undefined; }
        if (atId === undefined || atId === this.id) {
            this.dynamicBasis.setFunctor(name, functor);
        }
        else if (atId > this.id || this.parent === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'State with id "' + atId + '" does not exist.');
        }
        else {
            this.parent.setDynamicFunctor(name, functor, atId);
        }
    };
    State.prototype.setInfixStatus = function (id, precedence, rightAssociative, infix, atId) {
        if (atId === void 0) { atId = undefined; }
        if (atId === undefined || atId === this.id) {
            if (id.isVid() || id instanceof tokens_1.LongIdentifierToken) {
                this.infixEnvironment[id.getText()]
                    = new InfixStatus(infix, precedence, rightAssociative);
            }
        }
        else if (atId > this.id || this.parent === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'State with id "' + atId + '" does not exist.');
        }
        else {
            this.parent.setInfixStatus(id, precedence, rightAssociative, infix, atId);
        }
    };
    return State;
}());
exports.State = State;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Contains classes to represent SML values, e.g. int, string, functions, …
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__(2);
var errors_1 = __webpack_require__(0);
var tokens_1 = __webpack_require__(1);
var Value = (function () {
    function Value() {
    }
    Value.prototype.equals = function (other) {
        throw new errors_1.InternalInterpreterError(-1, 'Tried comparing incomparable things.');
    };
    return Value;
}());
exports.Value = Value;
var ReferenceValue = (function (_super) {
    __extends(ReferenceValue, _super);
    function ReferenceValue(address) {
        var _this = _super.call(this) || this;
        _this.address = address;
        return _this;
    }
    ReferenceValue.prototype.equals = function (other) {
        return this.address === other.address;
    };
    ReferenceValue.prototype.toString = function (state) {
        if (state === undefined) {
            return '$' + this.address;
        }
        else {
            if (state.getCell(this.address) !== undefined) {
                return 'ref ' + state.getCell(this.address).toString(state);
            }
            else {
                throw new errors_1.EvaluationError(-1, 'Ouch, you may not de-reference "$'
                    + this.address + '".');
            }
        }
    };
    return ReferenceValue;
}(Value));
exports.ReferenceValue = ReferenceValue;
var BoolValue = (function (_super) {
    __extends(BoolValue, _super);
    function BoolValue(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    BoolValue.prototype.equals = function (other) {
        return this.value === other.value;
    };
    BoolValue.prototype.toString = function (state) {
        if (this.value) {
            return 'true';
        }
        else {
            return 'false';
        }
    };
    return BoolValue;
}(Value));
exports.BoolValue = BoolValue;
var CharValue = (function (_super) {
    __extends(CharValue, _super);
    function CharValue(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    CharValue.prototype.toString = function (state) {
        return '#' + new StringValue(this.value).toString(state);
    };
    CharValue.prototype.compareTo = function (other) {
        if (this.value < other.value) {
            return -1;
        }
        else if (this.value > other.value) {
            return 1;
        }
        else {
            return 0;
        }
    };
    CharValue.prototype.equals = function (other) {
        return this.value === other.value;
    };
    return CharValue;
}(Value));
exports.CharValue = CharValue;
var StringValue = (function (_super) {
    __extends(StringValue, _super);
    function StringValue(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    // at the beginning because of linter…
    StringValue.implode = function (list) {
        var str = '';
        while (list.constructorName !== 'nil') {
            if (list.constructorName !== '::') {
                throw new errors_1.InternalInterpreterError(-1, 'Is this a char list? I can\'t implode "' + list.constructorName + '".');
            }
            var arg = list.argument;
            if (arg instanceof RecordValue) {
                var a1 = arg.getValue('1');
                var a2 = arg.getValue('2');
                if (a1 instanceof CharValue && a2 instanceof ConstructedValue) {
                    str += a1.value;
                    list = a2;
                }
                else {
                    throw new errors_1.InternalInterpreterError(-1, 'Is this a char list? I can\'t implode "' + list.constructorName + '".');
                }
            }
            else {
                throw new errors_1.InternalInterpreterError(-1, 'Is this a char list? I can\'t implode "' + list.constructorName + '".');
            }
        }
        return new StringValue(str);
    };
    StringValue.prototype.toString = function (state) {
        var pretty = '';
        for (var _i = 0, _a = this.value; _i < _a.length; _i++) {
            var chr = _a[_i];
            switch (chr) {
                case '\n':
                    pretty += '\\n';
                    break;
                case '\t':
                    pretty += '\\t';
                    break;
                case '\r':
                    pretty += '\\r';
                    break;
                case '\x07':
                    pretty += '\\a';
                    break;
                case '\b':
                    pretty += '\\b';
                    break;
                case '\v':
                    pretty += '\\v';
                    break;
                case '\f':
                    pretty += '\\f';
                    break;
                case '\x7F':
                    pretty += '\\127';
                    break;
                case '\xFF':
                    pretty += '\\255';
                    break;
                default:
                    if (chr.charCodeAt(0) < 32) {
                        pretty += '\\^' + String.fromCharCode(chr.charCodeAt(0) + 64);
                    }
                    else {
                        pretty += chr;
                    }
                    break;
            }
        }
        return '"' + pretty + '"';
    };
    StringValue.prototype.equals = function (other) {
        return this.value === other.value;
    };
    StringValue.prototype.compareTo = function (other) {
        if (this.value < other.value) {
            return -1;
        }
        else if (this.value > other.value) {
            return 1;
        }
        else {
            return 0;
        }
    };
    StringValue.prototype.concat = function (other) {
        return new StringValue(this.value + other.value);
    };
    StringValue.prototype.explode = function () {
        var ret = new ConstructedValue('nil');
        for (var i = this.value.length - 1; i >= 0; --i) {
            ret = new ConstructedValue('::', new RecordValue(new Map([
                ['1', new CharValue(this.value[i])],
                ['2', ret]
            ])));
        }
        return ret;
    };
    return StringValue;
}(Value));
exports.StringValue = StringValue;
var Word = (function (_super) {
    __extends(Word, _super);
    function Word(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Word.prototype.toString = function (state) {
        return '' + this.value;
    };
    Word.prototype.compareTo = function (val) {
        if (val instanceof Word) {
            var other = val.value;
            if (this.value < other) {
                return -1;
            }
            else if (this.value > other) {
                return 1;
            }
            else {
                return 0;
            }
        }
        return 2;
    };
    Word.prototype.negate = function () { return new Word(-this.value); };
    Word.prototype.equals = function (value) { return this.compareTo(value) === 0; };
    Word.prototype.add = function (other) { return new Word(this.value + other.value); };
    Word.prototype.multiply = function (other) { return new Word(this.value * other.value); };
    Word.prototype.divide = function (other) { return new Word(Math.floor(this.value / other.value)); };
    Word.prototype.modulo = function (other) { return new Word(this.value % other.value); };
    Word.prototype.toReal = function () { return new Real(this.value); };
    Word.prototype.hasOverflow = function () { return this.value > 1073741823 || this.value < -1073741824; };
    return Word;
}(Value));
exports.Word = Word;
var Integer = (function (_super) {
    __extends(Integer, _super);
    function Integer(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Integer.prototype.toString = function (state) {
        return '' + this.value;
    };
    Integer.prototype.compareTo = function (val) {
        if (val instanceof Integer) {
            var other = val.value;
            if (this.value < other) {
                return -1;
            }
            else if (this.value > other) {
                return 1;
            }
            else {
                return 0;
            }
        }
        return false;
    };
    Integer.prototype.equals = function (value) {
        return this.compareTo(value) === 0;
    };
    Integer.prototype.negate = function () { return new Integer(-this.value); };
    Integer.prototype.add = function (other) { return new Integer(this.value + other.value); };
    Integer.prototype.multiply = function (other) { return new Integer(this.value * other.value); };
    Integer.prototype.divide = function (other) { return new Integer(Math.floor(this.value / other.value)); };
    Integer.prototype.modulo = function (other) { return new Integer(this.value % other.value); };
    Integer.prototype.toReal = function () { return new Real(this.value); };
    Integer.prototype.hasOverflow = function () { return this.value > 1073741823 || this.value < -1073741824; };
    return Integer;
}(Value));
exports.Integer = Integer;
var Real = (function (_super) {
    __extends(Real, _super);
    function Real(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Real.prototype.toString = function (state) {
        var str = '' + this.value;
        if (str.search(/\./) === -1) {
            str += '.0';
        }
        return str;
    };
    Real.prototype.compareTo = function (val) {
        if (val instanceof Real) {
            var other = val.value;
            if (this.value < other) {
                return -1;
            }
            else if (this.value > other) {
                return 1;
            }
            else {
                return 0;
            }
        }
        return false;
    };
    Real.prototype.equals = function (value) {
        return this.compareTo(value) === 0;
    };
    Real.prototype.negate = function () {
        return new Real(-this.value);
    };
    Real.prototype.add = function (other) {
        return new Real(this.value + other.value);
    };
    Real.prototype.multiply = function (other) {
        return new Real(this.value * other.value);
    };
    Real.prototype.divide = function (other) {
        return new Real(this.value / other.value);
    };
    Real.prototype.toInteger = function () {
        return new Integer(Math.floor(this.value));
    };
    Real.prototype.hasOverflow = function () {
        // TODO how do we implement Overflow for reals?
        return false;
    };
    return Real;
}(Value));
exports.Real = Real;
var RecordValue = (function (_super) {
    __extends(RecordValue, _super);
    function RecordValue(entries) {
        if (entries === void 0) { entries = new Map(); }
        var _this = _super.call(this) || this;
        _this.entries = entries;
        return _this;
    }
    RecordValue.prototype.toString = function (state) {
        var isTuple = true;
        for (var i = 1; i <= this.entries.size; ++i) {
            if (!this.entries.has('' + i)) {
                isTuple = false;
            }
        }
        if (isTuple) {
            var res = '(';
            for (var i = 1; i <= this.entries.size; ++i) {
                if (i > 1) {
                    res += ', ';
                }
                var sub = this.entries.get('' + i);
                if (sub !== undefined) {
                    res += sub.toString(state);
                }
                else {
                    throw new errors_1.InternalInterpreterError(-1, 'How did we loose this value? It was there before. I promise…');
                }
            }
            return res + ')';
        }
        var result = '{ ';
        var first = true;
        this.entries.forEach(function (value, key) {
            if (!first) {
                result += ', ';
            }
            else {
                first = false;
            }
            result += key + ' = ' + value.toString(state);
        });
        return result + ' }';
    };
    RecordValue.prototype.getValue = function (name) {
        if (!this.entries.has(name)) {
            throw new errors_1.EvaluationError(0, 'Tried accessing non-existing record part.');
        }
        return this.entries.get(name);
    };
    RecordValue.prototype.hasValue = function (name) {
        return this.entries.has(name);
    };
    RecordValue.prototype.equals = function (other) {
        var _this = this;
        if (!(other instanceof RecordValue)) {
            return false;
        }
        var fail = false;
        this.entries.forEach(function (j, i) {
            if (!other.entries.has(i)) {
                fail = true;
            }
            if (!j.equals(other.entries.get(i))) {
                fail = true;
            }
        });
        if (fail) {
            return false;
        }
        other.entries.forEach(function (j, i) {
            if (!_this.entries.has(i)) {
                fail = true;
            }
            if (!j.equals(other.entries.get(i))) {
                fail = true;
            }
        });
        if (fail) {
            return false;
        }
        return true;
    };
    return RecordValue;
}(Value));
exports.RecordValue = RecordValue;
var FunctionValue = (function (_super) {
    __extends(FunctionValue, _super);
    function FunctionValue(state, recursives, body) {
        var _this = _super.call(this) || this;
        _this.state = state;
        _this.recursives = recursives;
        _this.body = body;
        return _this;
    }
    FunctionValue.prototype.toString = function (state) {
        return 'fn';
    };
    // Computes the function on the given argument,
    // returns [result, is thrown]
    FunctionValue.prototype.compute = function (argument, memory) {
        // adjoin the bindings in this.state into the state
        var nstate = this.state.getNestedState(this.state.id);
        for (var i = 0; i < this.recursives.length; ++i) {
            if (this.recursives[i][1] instanceof FunctionValue) {
                nstate.setDynamicValue(this.recursives[i][0], new FunctionValue(this.state, this.recursives, this.recursives[i][1].body), state_1.IdentifierStatus.VALUE_VARIABLE);
            }
            else {
                nstate.setDynamicValue(this.recursives[i][0], this.recursives[i][1], state_1.IdentifierStatus.VALUE_VARIABLE);
            }
        }
        for (var i = 0; i < memory.length; ++i) {
            nstate.setCell(memory[i][0], memory[i][1]);
        }
        return this.body.compute(nstate, argument);
    };
    FunctionValue.prototype.equals = function (other) {
        throw new errors_1.InternalInterpreterError(-1, 'You simply cannot compare "' + this.toString(undefined)
            + '" and "' + other.toString(undefined) + '".');
    };
    return FunctionValue;
}(Value));
exports.FunctionValue = FunctionValue;
// Values that were constructed from type constructors
var ConstructedValue = (function (_super) {
    __extends(ConstructedValue, _super);
    function ConstructedValue(constructorName, argument, id) {
        if (argument === void 0) { argument = undefined; }
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.constructorName = constructorName;
        _this.argument = argument;
        _this.id = id;
        return _this;
    }
    ConstructedValue.prototype.toString = function (state) {
        if (this.constructorName === '::') {
            var res = '[';
            var list = this;
            while (list.constructorName !== 'nil') {
                if (list.constructorName !== '::') {
                    throw new errors_1.InternalInterpreterError(-1, 'Is this even a list? 1 "' + list.constructorName + '".');
                }
                var arg = list.argument;
                if (arg instanceof RecordValue && arg.entries.size === 2) {
                    var a1 = arg.getValue('1');
                    var a2 = arg.getValue('2');
                    if (a1 instanceof Value && a2 instanceof ConstructedValue) {
                        if (list !== this) {
                            res += ', ';
                        }
                        res += a1.toString(state);
                        list = a2;
                    }
                    else {
                        throw new errors_1.InternalInterpreterError(-1, 'Is this even a list? 2 "' + list.constructorName + '".');
                    }
                }
                else {
                    throw new errors_1.InternalInterpreterError(-1, 'Is this even a list? 3 "' + list.constructorName + '".');
                }
            }
            return res + ']';
        }
        else if (this.constructorName === 'nil') {
            return '[]';
        }
        if (state !== undefined) {
            var infix = state.getInfixStatus(new tokens_1.IdentifierToken(this.constructorName, -1));
            if (infix !== undefined
                && infix.infix
                && this.argument instanceof RecordValue && this.argument.entries.size === 2) {
                var left = this.argument.getValue('1');
                var right = this.argument.getValue('2');
                if (left instanceof Value && right instanceof Value) {
                    var res = '(' + left.toString(state);
                    res += ' ' + this.constructorName;
                    if (this.id > 0) {
                        res += '/' + this.id;
                    }
                    res += ' ' + right.toString(state);
                    return res + ')';
                }
            }
        }
        var result = this.constructorName;
        if (this.id > 0) {
            result += '/' + this.id;
        }
        if (this.argument) {
            result += ' ' + this.argument.toString(state);
        }
        return result;
    };
    ConstructedValue.prototype.equals = function (other) {
        if (other instanceof ValueConstructor) {
            other = other.construct();
        }
        if (!(other instanceof ConstructedValue)) {
            return false;
        }
        if (this.constructorName !== other.constructorName
            || this.id !== other.id) {
            return false;
        }
        if (this.argument !== undefined) {
            if (other.argument === undefined) {
                return true;
            }
            else {
                return this.argument.equals(other.argument);
            }
        }
        else {
            return other.argument === undefined;
        }
    };
    return ConstructedValue;
}(Value));
exports.ConstructedValue = ConstructedValue;
var ExceptionValue = (function (_super) {
    __extends(ExceptionValue, _super);
    function ExceptionValue(constructorName, argument, id) {
        if (argument === void 0) { argument = undefined; }
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.constructorName = constructorName;
        _this.argument = argument;
        _this.id = id;
        return _this;
    }
    ExceptionValue.prototype.toString = function (state) {
        var result = this.constructorName;
        if (this.id > 0) {
            result += '/' + this.id;
        }
        if (this.argument) {
            result += ' ' + this.argument.toString(state);
        }
        return result;
    };
    ExceptionValue.prototype.equals = function (other) {
        if (other instanceof ExceptionConstructor) {
            other = other.construct();
        }
        if (!(other instanceof ExceptionValue)) {
            return false;
        }
        if (this.constructorName !== other.constructorName
            || this.id !== other.id) {
            return false;
        }
        if (this.argument !== undefined) {
            if (other.argument === undefined) {
                return true;
            }
            else {
                return this.argument.equals(other.argument);
            }
        }
        else {
            return other.argument === undefined;
        }
    };
    return ExceptionValue;
}(Value));
exports.ExceptionValue = ExceptionValue;
var PredefinedFunction = (function (_super) {
    __extends(PredefinedFunction, _super);
    function PredefinedFunction(name, apply) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.apply = apply;
        return _this;
    }
    PredefinedFunction.prototype.toString = function (state) {
        return 'fn';
    };
    PredefinedFunction.prototype.equals = function (other) {
        if (!(other instanceof PredefinedFunction)) {
            return false;
        }
        return this.name === other.name;
    };
    return PredefinedFunction;
}(Value));
exports.PredefinedFunction = PredefinedFunction;
var ValueConstructor = (function (_super) {
    __extends(ValueConstructor, _super);
    function ValueConstructor(constructorName, numArgs, id) {
        if (numArgs === void 0) { numArgs = 0; }
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.constructorName = constructorName;
        _this.numArgs = numArgs;
        _this.id = id;
        return _this;
    }
    ValueConstructor.prototype.equals = function (other) {
        if (!(other instanceof ValueConstructor)) {
            return false;
        }
        return this.constructorName === other.constructorName
            && this.id === other.id;
    };
    ValueConstructor.prototype.construct = function (parameter) {
        if (parameter === void 0) { parameter = undefined; }
        return new ConstructedValue(this.constructorName, parameter, this.id);
    };
    ValueConstructor.prototype.toString = function (state) {
        var result = this.constructorName;
        if (this.id > 0) {
            result += '/' + this.id;
        }
        return result;
    };
    return ValueConstructor;
}(Value));
exports.ValueConstructor = ValueConstructor;
var ExceptionConstructor = (function (_super) {
    __extends(ExceptionConstructor, _super);
    function ExceptionConstructor(exceptionName, numArgs, id) {
        if (numArgs === void 0) { numArgs = 0; }
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.exceptionName = exceptionName;
        _this.numArgs = numArgs;
        _this.id = id;
        return _this;
    }
    ExceptionConstructor.prototype.equals = function (other) {
        if (!(other instanceof ExceptionConstructor)) {
            return false;
        }
        return this.exceptionName === other.exceptionName
            && this.id === other.id;
    };
    ExceptionConstructor.prototype.construct = function (parameter) {
        if (parameter === void 0) { parameter = undefined; }
        return new ExceptionValue(this.exceptionName, parameter, this.id);
    };
    ExceptionConstructor.prototype.toString = function (state) {
        var result = this.exceptionName;
        if (this.id > 0) {
            result += '/' + this.id;
        }
        return result;
    };
    return ExceptionConstructor;
}(Value));
exports.ExceptionConstructor = ExceptionConstructor;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = __webpack_require__(0);
var Type = (function () {
    function Type() {
    }
    // Constructs types with type variables instantiated as much as possible
    Type.prototype.instantiate = function (state, tyVarBnd, seen) {
        if (seen === void 0) { seen = new Set(); }
        throw new errors_1.ElaborationError(-1, 'I mustn\'t run away. I mustn\'t run away. I mustn\'t run away.');
    };
    // Merge this type with the other type. This operation is commutative
    Type.prototype.merge = function (state, tyVarBnd, other) {
        throw new errors_1.ElaborationError(-1, 'I don\'t know anything.');
    };
    Type.prototype.makeEqType = function (state, tyVarBnd) {
        throw new errors_1.ElaborationError(-1, 'Yeaaah.');
    };
    // Return all (free) type variables
    Type.prototype.getTypeVariables = function (free) {
        if (free === void 0) { free = false; }
        throw new errors_1.ElaborationError(-1, 'This is wrong.\nI said with a posed look.');
    };
    // Get all type variables in order (they may appear more than once)
    Type.prototype.getOrderedTypeVariables = function () {
        throw new errors_1.ElaborationError(-1, 'You seem well today.\nDid something nice happen?');
    };
    Type.prototype.replaceTypeVariables = function (replacements, free) {
        if (free === void 0) { free = new Set(); }
        throw new errors_1.ElaborationError(-1, 'あんたバカ?');
    };
    // Mark all type variables as free
    Type.prototype.makeFree = function () {
        return this;
    };
    Type.prototype.simplify = function () {
        return this;
    };
    Type.prototype.admitsEquality = function (state) {
        return false;
    };
    // Normalizes a type. Free type variables need to get new names **across** different decls.
    Type.prototype.normalize = function (nextFree) {
        if (nextFree === void 0) { nextFree = 0; }
        var orderedVars = this.getOrderedTypeVariables();
        var freeVars = this.getTypeVariables(true);
        var replacements = new Map();
        var rcnt = 0;
        for (var _i = 0, orderedVars_1 = orderedVars; _i < orderedVars_1.length; _i++) {
            var v = orderedVars_1[_i];
            if (replacements.has(v)) {
                continue;
            }
            var nextVar = '';
            var cnt = ++rcnt;
            if (freeVars.has(v)) {
                cnt = ++nextFree;
            }
            if (cnt <= 26) {
                nextVar = String.fromCharCode('a'.charCodeAt(0) + cnt - 1);
            }
            else {
                while (cnt > 0) {
                    var nextChar = (--cnt) % 26;
                    nextVar = String.fromCharCode('a'.charCodeAt(0) + nextChar) + nextVar;
                    cnt = Math.floor(cnt / 26);
                }
            }
            var newVar = '\'';
            if (v.length > 2 && v.charAt(1) === '\'') {
                newVar += '\'';
            }
            if (freeVars.has(v)) {
                newVar += '~';
            }
            newVar += nextVar;
            if (freeVars.has(v)) {
                newVar = newVar.toUpperCase();
            }
            replacements.set(v, newVar);
        }
        return [this.replaceTypeVariables(replacements), nextFree];
    };
    return Type;
}());
exports.Type = Type;
// A type representing any type
var AnyType = (function (_super) {
    __extends(AnyType, _super);
    function AnyType() {
        return _super.call(this) || this;
    }
    AnyType.prototype.toString = function () {
        return 'any';
    };
    AnyType.prototype.equals = function (other) {
        return true;
    };
    AnyType.prototype.instantiate = function (state, tyVarBnd, seen) {
        if (seen === void 0) { seen = new Set(); }
        return this;
    };
    AnyType.prototype.merge = function (state, tyVarBnd, other) {
        return [other, tyVarBnd];
    };
    AnyType.prototype.makeEqType = function (state, tyVarBnd) {
        return [this, tyVarBnd];
    };
    AnyType.prototype.getTypeVariables = function (free) {
        if (free === void 0) { free = false; }
        return new Set();
    };
    AnyType.prototype.getOrderedTypeVariables = function () {
        return [];
    };
    AnyType.prototype.replaceTypeVariables = function (replacements, free) {
        if (free === void 0) { free = new Set(); }
        return this;
    };
    return AnyType;
}(Type));
exports.AnyType = AnyType;
var TypeVariableBind = (function (_super) {
    __extends(TypeVariableBind, _super);
    function TypeVariableBind(name, type, domain) {
        if (domain === void 0) { domain = []; }
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.type = type;
        _this.domain = domain;
        _this.isFree = false;
        return _this;
    }
    TypeVariableBind.prototype.simplify = function () {
        var res = new TypeVariableBind(this.name, this.type.simplify(), this.domain);
        res.isFree = this.isFree;
        return res;
    };
    TypeVariableBind.prototype.makeFree = function () {
        var res = new TypeVariableBind(this.name, this.type.makeFree(), this.domain);
        res.isFree = true;
        return res;
    };
    TypeVariableBind.prototype.toString = function () {
        var frees = new Set();
        var bound = new Set();
        var ct = this;
        while (ct instanceof TypeVariableBind) {
            if (ct.isFree) {
                frees = frees.add([ct.name, ct.domain]);
            }
            else {
                bound = bound.add([ct.name, ct.domain]);
            }
            ct = ct.type;
        }
        var res = '';
        if (bound.size > 0) {
            res += '∀';
            bound.forEach(function (val) {
                res += ' ' + val[0];
                if (val[1].length > 0) {
                    res += ' ∈ {';
                    for (var i = 0; i < val[1].length; ++i) {
                        if (i > 0) {
                            res += ', ';
                        }
                        res += val[1][i];
                    }
                    res += '}';
                }
            });
            res += ' . ';
        }
        res += ct;
        if (frees.size > 0) {
            res += ',';
            frees.forEach(function (val) {
                res += ' ' + val[0];
                if (val[1].length > 0) {
                    res += ' ∈ {';
                    for (var i = 0; i < val[1].length; ++i) {
                        if (i > 0) {
                            res += ', ';
                        }
                        res += val[1][i];
                    }
                    res += '}';
                }
            });
            res += ' free';
        }
        return res;
    };
    TypeVariableBind.prototype.getTypeVariables = function (free) {
        var _this = this;
        if (free === void 0) { free = false; }
        var rec = this.type.getTypeVariables(free);
        var res = new Set();
        rec.forEach(function (val) {
            if (val !== _this.name || free === _this.isFree) {
                res.add(val);
            }
        });
        if (free && this.isFree && !res.has(this.name)) {
            res.add(this.name);
        }
        return res;
    };
    TypeVariableBind.prototype.getOrderedTypeVariables = function () {
        return [this.name].concat(this.type.getOrderedTypeVariables());
    };
    TypeVariableBind.prototype.replaceTypeVariables = function (replacements, free) {
        if (free === void 0) { free = new Set(); }
        if (replacements.has(this.name)) {
            var res = new TypeVariableBind(replacements.get(this.name), this.type.replaceTypeVariables(replacements, free));
            if (free.has(this.name)) {
                res.isFree = true;
            }
            else {
                res.isFree = this.isFree;
            }
            return res;
        }
        else {
            var res = new TypeVariableBind(this.name, this.type.replaceTypeVariables(replacements, free));
            res.isFree = this.isFree;
            return res;
        }
    };
    TypeVariableBind.prototype.equals = function (other) {
        if (!(other instanceof TypeVariableBind)
            || other.name !== this.name) {
            return false;
        }
        return other.type.equals(this.type);
    };
    return TypeVariableBind;
}(Type));
exports.TypeVariableBind = TypeVariableBind;
var TypeVariable = (function (_super) {
    __extends(TypeVariable, _super);
    function TypeVariable(name, position) {
        if (position === void 0) { position = 0; }
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.position = position;
        _this.isFree = false;
        return _this;
    }
    TypeVariable.prototype.makeFree = function () {
        var res = new TypeVariable(this.name, this.position);
        res.isFree = true;
        return res;
    };
    TypeVariable.prototype.toString = function () {
        return this.name;
    };
    TypeVariable.prototype.instantiate = function (state, tyVarBnd, seen) {
        if (seen === void 0) { seen = new Set(); }
        if (!tyVarBnd.has(this.name)) {
            return this;
        }
        if (seen.has(this.name)) {
            throw new errors_1.ElaborationError(-1, 'Type clash. An expression of type "' + this.name
                + '" cannot have type "' + tyVarBnd.get(this.name)[0]
                + '" because of circularity.');
        }
        var nsen = new Set();
        seen.forEach(function (val) {
            nsen.add(val);
        });
        nsen.add(this.name);
        return tyVarBnd.get(this.name)[0].instantiate(state, tyVarBnd, nsen);
    };
    TypeVariable.prototype.merge = function (state, tyVarBnd, other) {
        if (other instanceof AnyType) {
            return [this, tyVarBnd];
        }
        var ths = this.instantiate(state, tyVarBnd);
        if (ths instanceof TypeVariable) {
            var oth = other.instantiate(state, tyVarBnd);
            if (oth instanceof TypeVariable) {
                // TODO equality checks
                if (ths.name === oth.name) {
                    return [ths, tyVarBnd];
                }
                else {
                    var repl_1 = new Map();
                    var rs = ths;
                    if (ths.name < oth.name) {
                        repl_1.set(oth.name, ths.name);
                    }
                    else {
                        repl_1.set(ths.name, oth.name);
                        rs = oth;
                    }
                    var nvb_1 = new Map();
                    tyVarBnd.forEach(function (val, key) {
                        nvb_1 = nvb_1.set(key, [val[0].replaceTypeVariables(repl_1), val[1]]);
                    });
                    if (ths.name < oth.name) {
                        nvb_1.set(oth.name, [ths, oth.isFree]);
                    }
                    else {
                        nvb_1.set(ths.name, [oth, ths.isFree]);
                    }
                    return [rs, nvb_1];
                }
            }
            else {
                var otv = oth.getTypeVariables();
                if (otv.has(ths.name)) {
                    throw new errors_1.ElaborationError(-1, 'Type clash. An expression of type "' + ths.name
                        + '" cannot have type "' + oth + '" because of circularity.');
                }
                if (ths.isFree) {
                    oth = oth.makeFree();
                }
                if (ths.admitsEquality(state) && !oth.admitsEquality(state)) {
                    var nt = oth.makeEqType(state, tyVarBnd);
                    if (!nt[0].admitsEquality(state)) {
                        throw ['Type "' + oth + '" does not admit equality.', ths, oth];
                    }
                    else {
                        oth = nt[0];
                        tyVarBnd = nt[1];
                    }
                }
                return [oth, tyVarBnd.set(ths.name, [oth, ths.isFree])];
            }
        }
        else {
            return ths.merge(state, tyVarBnd, other);
        }
    };
    TypeVariable.prototype.makeEqType = function (state, tyVarBnd) {
        if (this.admitsEquality(state)) {
            return [this, tyVarBnd];
        }
        if (tyVarBnd.has(this.name)) {
            var tmp = tyVarBnd.get(this.name)[0].makeEqType(state, tyVarBnd);
            tyVarBnd = tmp[1];
            var n = new TypeVariable('\'' + this.name, this.position);
            n.isFree = this.isFree;
            tyVarBnd = tyVarBnd.set(n.name, [tmp[0], n.isFree]);
        }
        var nt = new TypeVariable('\'' + this.name, this.position);
        return [nt, tyVarBnd.set(this.name, [nt, this.isFree])];
    };
    TypeVariable.prototype.getTypeVariables = function (free) {
        if (free === void 0) { free = false; }
        var res = new Set();
        if (!free || this.isFree) {
            res.add(this.name);
        }
        return res;
    };
    TypeVariable.prototype.getOrderedTypeVariables = function () {
        return [this.name];
    };
    TypeVariable.prototype.replaceTypeVariables = function (replacements, free) {
        if (free === void 0) { free = new Set(); }
        if (replacements.has(this.name)) {
            var res = new TypeVariable(replacements.get(this.name), this.position);
            if (free.has(this.name)) {
                res.isFree = true;
            }
            else {
                res.isFree = this.isFree;
            }
            return res;
        }
        return this;
    };
    TypeVariable.prototype.admitsEquality = function (state) {
        return this.name[1] === '\'';
    };
    TypeVariable.prototype.equals = function (other) {
        if (other instanceof AnyType) {
            return true;
        }
        if (!(other instanceof TypeVariable && this.name === other.name)) {
            return false;
        }
        return true;
    };
    return TypeVariable;
}(Type));
exports.TypeVariable = TypeVariable;
var RecordType = (function (_super) {
    __extends(RecordType, _super);
    function RecordType(elements, complete, position) {
        if (complete === void 0) { complete = true; }
        if (position === void 0) { position = 0; }
        var _this = _super.call(this) || this;
        _this.elements = elements;
        _this.complete = complete;
        _this.position = position;
        return _this;
    }
    RecordType.prototype.makeFree = function () {
        var newElements = new Map();
        this.elements.forEach(function (type, key) {
            newElements.set(key, type.makeFree());
        });
        return new RecordType(newElements, this.complete, this.position);
    };
    RecordType.prototype.instantiate = function (state, tyVarBnd, seen) {
        if (seen === void 0) { seen = new Set(); }
        var newElements = new Map();
        this.elements.forEach(function (type, key) {
            newElements.set(key, type.instantiate(state, tyVarBnd, seen));
        });
        return new RecordType(newElements, this.complete, this.position);
    };
    RecordType.prototype.merge = function (state, tyVarBnd, other) {
        var _this = this;
        if (other instanceof TypeVariable || other instanceof AnyType) {
            return other.merge(state, tyVarBnd, this);
        }
        if (other instanceof RecordType) {
            if (!this.complete && other.complete) {
                return other.merge(state, tyVarBnd, this);
            }
            var rt_1 = new Map();
            var tybnd_1 = tyVarBnd;
            other.elements.forEach(function (val, key) {
                if (_this.complete && !_this.elements.has(key)) {
                    throw ['Records don\'t agree on members ("' + key
                            + '" occurs only once.)', _this.instantiate(state, tybnd_1),
                        other.instantiate(state, tybnd_1)];
                }
                if (!_this.elements.has(key)) {
                    rt_1 = rt_1.set(key, val.instantiate(state, tybnd_1));
                }
                else {
                    var mg = val.merge(state, tybnd_1, _this.elements.get(key));
                    rt_1 = rt_1.set(key, mg[0]);
                    tybnd_1 = mg[1];
                }
            });
            if (other.complete) {
                this.elements.forEach(function (val, key) {
                    if (!other.elements.has(key)) {
                        throw ['Records don\'t agree on members ("' + key
                                + '" occurs only once.)', _this.instantiate(state, tybnd_1),
                            other.instantiate(state, tybnd_1)];
                    }
                });
            }
            return [new RecordType(rt_1, this.complete || other.complete, this.position), tybnd_1];
        }
        // Merging didn't work
        throw ['Cannot merge "RecordType" and "' + other.constructor.name + '".',
            this.instantiate(state, tyVarBnd),
            other.instantiate(state, tyVarBnd)];
    };
    RecordType.prototype.makeEqType = function (state, tyVarBnd) {
        var newElements = new Map();
        this.elements.forEach(function (type, key) {
            var tmp = type.makeEqType(state, tyVarBnd);
            newElements.set(key, tmp[0]);
            tyVarBnd = tmp[1];
        });
        return [new RecordType(newElements, this.complete, this.position), tyVarBnd];
    };
    RecordType.prototype.getTypeVariables = function (free) {
        if (free === void 0) { free = false; }
        var res = new Set();
        this.elements.forEach(function (val) {
            val.getTypeVariables(free).forEach(function (id) {
                res.add(id);
            });
        });
        return res;
    };
    RecordType.prototype.getOrderedTypeVariables = function () {
        var res = [];
        this.elements.forEach(function (val) {
            res = res.concat(val.getOrderedTypeVariables());
        });
        return res;
    };
    RecordType.prototype.replaceTypeVariables = function (replacements, free) {
        if (free === void 0) { free = new Set(); }
        var rt = new Map();
        this.elements.forEach(function (val, key) {
            rt = rt.set(key, val.replaceTypeVariables(replacements, free));
        });
        return new RecordType(rt, this.complete, this.position);
    };
    RecordType.prototype.getType = function (name) {
        if (!this.elements.has(name)) {
            throw new errors_1.ElaborationError(0, 'Tried accessing non-existing record part.');
        }
        return this.elements.get(name);
    };
    RecordType.prototype.hasType = function (name) {
        return this.elements.has(name);
    };
    RecordType.prototype.admitsEquality = function (state) {
        var res = true;
        this.elements.forEach(function (type, key) {
            if (!type.admitsEquality(state)) {
                res = false;
            }
        });
        return res;
    };
    RecordType.prototype.toString = function () {
        var isTuple = true;
        for (var i = 1; i <= this.elements.size; ++i) {
            if (!this.elements.has('' + i)) {
                isTuple = false;
            }
        }
        if (isTuple) {
            if (this.elements.size === 0) {
                return 'unit';
            }
            var res = '';
            for (var i = 1; i <= this.elements.size; ++i) {
                if (i > 1) {
                    res += ' * ';
                }
                var sub = this.elements.get('' + i);
                if (sub instanceof FunctionType) {
                    res += '(' + sub + ')';
                }
                else {
                    res += sub;
                }
            }
            return res + '';
        }
        // TODO: print as Tuple if possible
        var result = '{';
        var first = true;
        this.elements.forEach(function (type, key) {
            if (!first) {
                result += ', ';
            }
            else {
                first = false;
            }
            result += key + ': ' + type;
        });
        if (!this.complete) {
            if (!first) {
                result += ', ';
            }
            result += '...';
        }
        return result + '}';
    };
    RecordType.prototype.simplify = function () {
        var newElements = new Map();
        this.elements.forEach(function (type, key) {
            newElements.set(key, type.simplify());
        });
        return new RecordType(newElements, this.complete, this.position);
    };
    RecordType.prototype.equals = function (other) {
        if (other instanceof AnyType) {
            return true;
        }
        if (!(other instanceof RecordType) || this.complete !== other.complete) {
            return false;
        }
        else {
            if (other === this) {
                return true;
            }
            for (var name_1 in this.elements) {
                if (!this.elements.hasOwnProperty(name_1)) {
                    if (!this.elements.get(name_1).equals(other.elements.get(name_1))) {
                        return false;
                    }
                }
            }
            for (var name_2 in other.elements) {
                if (!other.elements.hasOwnProperty(name_2)) {
                    if (!other.elements.get(name_2).equals(this.elements.get(name_2))) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    return RecordType;
}(Type));
exports.RecordType = RecordType;
var FunctionType = (function (_super) {
    __extends(FunctionType, _super);
    function FunctionType(parameterType, returnType, position) {
        if (position === void 0) { position = 0; }
        var _this = _super.call(this) || this;
        _this.parameterType = parameterType;
        _this.returnType = returnType;
        _this.position = position;
        return _this;
    }
    FunctionType.prototype.makeFree = function () {
        return new FunctionType(this.parameterType.makeFree(), this.returnType.makeFree());
    };
    FunctionType.prototype.instantiate = function (state, tyVarBnd, seen) {
        if (seen === void 0) { seen = new Set(); }
        return new FunctionType(this.parameterType.instantiate(state, tyVarBnd, seen), this.returnType.instantiate(state, tyVarBnd, seen), this.position);
    };
    FunctionType.prototype.merge = function (state, tyVarBnd, other) {
        if (other instanceof TypeVariable || other instanceof AnyType) {
            return other.merge(state, tyVarBnd, this);
        }
        if (other instanceof FunctionType) {
            var p = this.parameterType.merge(state, tyVarBnd, other.parameterType);
            var r = this.returnType.merge(state, p[1], other.returnType);
            return [new FunctionType(p[0], r[0], this.position), r[1]];
        }
        // Merging didn't work
        throw ['Cannot merge "FunctionType" and "' + other.constructor.name + '".',
            this.instantiate(state, tyVarBnd),
            other.instantiate(state, tyVarBnd)];
    };
    FunctionType.prototype.makeEqType = function (state, tyVarBnd) {
        return [this, tyVarBnd];
    };
    FunctionType.prototype.getTypeVariables = function (free) {
        if (free === void 0) { free = false; }
        var res = new Set();
        this.parameterType.getTypeVariables(free).forEach(function (value) {
            res.add(value);
        });
        this.returnType.getTypeVariables(free).forEach(function (value) {
            res.add(value);
        });
        return res;
    };
    FunctionType.prototype.getOrderedTypeVariables = function () {
        var res = [];
        res = res.concat(this.parameterType.getOrderedTypeVariables());
        res = res.concat(this.returnType.getOrderedTypeVariables());
        return res;
    };
    FunctionType.prototype.replaceTypeVariables = function (replacements, free) {
        if (free === void 0) { free = new Set(); }
        var res = this.parameterType.replaceTypeVariables(replacements, free);
        var res2 = this.returnType.replaceTypeVariables(replacements, free);
        return new FunctionType(res, res2, this.position);
    };
    FunctionType.prototype.admitsEquality = function (state) {
        return false;
    };
    FunctionType.prototype.toString = function () {
        if (this.parameterType instanceof FunctionType) {
            return '(' + this.parameterType + ')'
                + ' → ' + this.returnType;
        }
        else {
            return this.parameterType
                + ' → ' + this.returnType;
        }
    };
    FunctionType.prototype.simplify = function () {
        return new FunctionType(this.parameterType.simplify(), this.returnType.simplify(), this.position);
    };
    FunctionType.prototype.equals = function (other) {
        if (other instanceof AnyType) {
            return true;
        }
        return other instanceof FunctionType && this.parameterType.equals(other.parameterType)
            && this.returnType.equals(other.returnType);
    };
    return FunctionType;
}(Type));
exports.FunctionType = FunctionType;
// A custom defined type similar to "list" or "option".
// May have a type argument.
// TODO ID?
var CustomType = (function (_super) {
    __extends(CustomType, _super);
    function CustomType(name, typeArguments, position) {
        if (typeArguments === void 0) { typeArguments = []; }
        if (position === void 0) { position = 0; }
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.typeArguments = typeArguments;
        _this.position = position;
        return _this;
    }
    CustomType.prototype.makeFree = function () {
        var res = [];
        for (var i = 0; i < this.typeArguments.length; ++i) {
            res.push(this.typeArguments[i].makeFree());
        }
        return new CustomType(this.name, res, this.position);
    };
    CustomType.prototype.instantiate = function (state, tyVarBnd, seen) {
        if (seen === void 0) { seen = new Set(); }
        var tp = state.getStaticType(this.name);
        if (tp !== undefined && tp.type instanceof FunctionType) {
            try {
                var mt = this.merge(state, tyVarBnd, tp.type.parameterType, true);
                return tp.type.returnType.instantiate(state, mt[1], seen);
            }
            catch (e) {
                if (!(e instanceof Array)) {
                    throw e;
                }
                throw new errors_1.ElaborationError(-1, 'Instantiating "' + this + '" failed:\n'
                    + 'Cannot merge "' + e[1] + '" and "' + e[2]
                    + '" (' + e[0] + ').');
            }
        }
        else if (tp === undefined) {
            throw new errors_1.ElaborationError(-1, 'Unbound type "' + this.name + '".');
        }
        var res = [];
        for (var i = 0; i < this.typeArguments.length; ++i) {
            res.push(this.typeArguments[i].instantiate(state, tyVarBnd, seen));
        }
        return new CustomType(this.name, res, this.position);
    };
    CustomType.prototype.merge = function (state, tyVarBnd, other, noinst) {
        if (noinst === void 0) { noinst = false; }
        if (other instanceof TypeVariable || other instanceof AnyType) {
            return other.merge(state, tyVarBnd, this);
        }
        var ths = this;
        var oth = other;
        if (!noinst) {
            // Remove type alias and stuff
            ths = this.instantiate(state, tyVarBnd);
            if (!(ths instanceof CustomType)) {
                return ths.merge(state, tyVarBnd, other);
            }
            oth = other.instantiate(state, tyVarBnd);
        }
        if (oth instanceof CustomType && ths.name === oth.name
            && ths.typeArguments.length === oth.typeArguments.length) {
            var res = [];
            var tybnd = tyVarBnd;
            for (var i = 0; i < ths.typeArguments.length; ++i) {
                var tmp = ths.typeArguments[i].merge(state, tybnd, oth.typeArguments[i]);
                res.push(tmp[0]);
                tybnd = tmp[1];
            }
            return [new CustomType(ths.name, res, this.position), tybnd];
        }
        // Merging didn't work
        throw ['Cannot merge "CustomType" and "' + other.constructor.name + '".',
            this.instantiate(state, tyVarBnd),
            other.instantiate(state, tyVarBnd)];
    };
    CustomType.prototype.makeEqType = function (state, tyVarBnd) {
        var res = [];
        for (var i = 0; i < this.typeArguments.length; ++i) {
            var tmp = this.typeArguments[i].makeEqType(state, tyVarBnd);
            res.push(tmp[0]);
            tyVarBnd = tmp[1];
        }
        return [new CustomType(this.name, res, this.position), tyVarBnd];
    };
    CustomType.prototype.getTypeVariables = function (free) {
        if (free === void 0) { free = false; }
        var res = new Set();
        if (this.typeArguments.length > 0) {
            for (var i = 0; i < this.typeArguments.length; ++i) {
                this.typeArguments[i].getTypeVariables(free).forEach(function (val) {
                    res.add(val);
                });
            }
        }
        return res;
    };
    CustomType.prototype.getOrderedTypeVariables = function () {
        var res = [];
        for (var i = 0; i < this.typeArguments.length; ++i) {
            res = res.concat(this.typeArguments[i].getOrderedTypeVariables());
        }
        return res;
    };
    CustomType.prototype.replaceTypeVariables = function (replacements, free) {
        if (replacements === void 0) { replacements = new Map(); }
        if (free === void 0) { free = new Set(); }
        var rt = [];
        for (var i = 0; i < this.typeArguments.length; ++i) {
            rt.push(this.typeArguments[i].replaceTypeVariables(replacements, free));
        }
        return new CustomType(this.name, rt, this.position);
    };
    CustomType.prototype.admitsEquality = function (state) {
        for (var i = 0; i < this.typeArguments.length; ++i) {
            if (!this.typeArguments[i].admitsEquality(state)) {
                return false;
            }
        }
        return true;
    };
    CustomType.prototype.toString = function () {
        var result = '';
        if (this.typeArguments.length > 1
            || (this.typeArguments.length === 1 && this.typeArguments[0] instanceof FunctionType)) {
            result += '(';
        }
        for (var i = 0; i < this.typeArguments.length; ++i) {
            if (i > 0) {
                result += ', ';
            }
            result += this.typeArguments[i];
        }
        if (this.typeArguments.length > 1
            || (this.typeArguments.length === 1 && this.typeArguments[0] instanceof FunctionType)) {
            result += ')';
        }
        if (this.typeArguments.length > 0) {
            result += ' ';
        }
        result += this.name;
        return result;
    };
    CustomType.prototype.simplify = function () {
        var args = [];
        for (var i = 0; i < this.typeArguments.length; ++i) {
            args.push(this.typeArguments[i].simplify());
        }
        return new CustomType(this.name, args, this.position);
    };
    CustomType.prototype.equals = function (other) {
        if (other instanceof AnyType) {
            return true;
        }
        if (!(other instanceof CustomType) || this.name !== other.name) {
            return false;
        }
        for (var i = 0; i < this.typeArguments.length; ++i) {
            if (!this.typeArguments[i].equals(other.typeArguments[i])) {
                return false;
            }
        }
        return true;
    };
    return CustomType;
}(Type));
exports.CustomType = CustomType;
// Derived Types
var TupleType = (function (_super) {
    __extends(TupleType, _super);
    function TupleType(elements, position) {
        if (position === void 0) { position = 0; }
        var _this = _super.call(this) || this;
        _this.elements = elements;
        _this.position = position;
        return _this;
    }
    TupleType.prototype.toString = function () {
        var result = '(';
        for (var i = 0; i < this.elements.length; ++i) {
            if (i > 0) {
                result += ' * ';
            }
            result += this.elements[i];
        }
        return result + ')';
    };
    TupleType.prototype.simplify = function () {
        var entries = new Map();
        for (var i = 0; i < this.elements.length; ++i) {
            entries.set('' + (i + 1), this.elements[i].simplify());
        }
        return new RecordType(entries, true, this.position);
    };
    TupleType.prototype.equals = function (other) {
        return this.simplify().equals(other);
    };
    return TupleType;
}(Type));
exports.TupleType = TupleType;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__(2);
var types_1 = __webpack_require__(4);
var values_1 = __webpack_require__(3);
var errors_1 = __webpack_require__(0);
// Initial static basis (see SML Definition, appendix C through E)
// let intType = new CustomType('int');
var realType = new types_1.CustomType('real');
// let wordType = new CustomType('word');
var boolType = new types_1.CustomType('bool');
var stringType = new types_1.CustomType('string');
var charType = new types_1.CustomType('char');
function functionType(type) {
    return new types_1.FunctionType(new types_1.TupleType([type, type]), type).simplify();
}
function bfunctionType(type) {
    return new types_1.FunctionType(new types_1.TupleType([type, type]), boolType).simplify();
}
var typeVar = new types_1.TypeVariable('\'a');
var eqTypeVar = new types_1.TypeVariable('\'\'b');
var intWordType = new types_1.TypeVariable('\'iw');
var intRealType = new types_1.TypeVariable('\'ir');
var intWordRealType = new types_1.TypeVariable('\'iwr');
var anyType = new types_1.TypeVariable('\'any');
function intWordBind(type) {
    return new types_1.TypeVariableBind('\'iw', type, [new types_1.CustomType('int'), new types_1.CustomType('word')]);
}
function intRealBind(type) {
    return new types_1.TypeVariableBind('\'ir', type, [new types_1.CustomType('int'), new types_1.CustomType('real')]);
}
function intWordRealBind(type) {
    return new types_1.TypeVariableBind('\'iwr', type, [new types_1.CustomType('int'), new types_1.CustomType('word'),
        new types_1.CustomType('real')]);
}
function anyBind(type) {
    return new types_1.TypeVariableBind('\'any', type, [new types_1.CustomType('int'), new types_1.CustomType('word'),
        new types_1.CustomType('real'), new types_1.CustomType('string'), new types_1.CustomType('char')]);
}
var initialState = new state_1.State(0, undefined, new state_1.StaticBasis({
    'unit': new state_1.TypeInformation(new types_1.FunctionType(new types_1.CustomType('unit'), new types_1.TupleType([])).simplify(), [], 0, true),
    'bool': new state_1.TypeInformation(new types_1.CustomType('bool'), ['true', 'false'], 0, true),
    'int': new state_1.TypeInformation(new types_1.CustomType('int'), [], 0, true),
    'word': new state_1.TypeInformation(new types_1.CustomType('word'), [], 0, true),
    'real': new state_1.TypeInformation(new types_1.CustomType('real'), [], 0, false),
    'string': new state_1.TypeInformation(new types_1.CustomType('string'), [], 0, false),
    'char': new state_1.TypeInformation(new types_1.CustomType('char'), [], 0, false),
    'list': new state_1.TypeInformation(new types_1.CustomType('list', [typeVar]), ['nil', '::'], 1, true),
    'array': new state_1.TypeInformation(new types_1.CustomType('array', [typeVar]), [], 1, true),
    'ref': new state_1.TypeInformation(new types_1.CustomType('ref', [typeVar]), ['ref'], 1, true),
    'exn': new state_1.TypeInformation(new types_1.CustomType('exn'), [], 0, false)
}, {
    'div': [intWordBind(functionType(intWordType)), state_1.IdentifierStatus.VALUE_VARIABLE],
    'mod': [intWordBind(functionType(intWordType)), state_1.IdentifierStatus.VALUE_VARIABLE],
    '*': [intWordRealBind(functionType(intWordRealType)),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    '/': [functionType(realType), state_1.IdentifierStatus.VALUE_VARIABLE],
    '+': [intWordRealBind(functionType(intWordRealType)),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    '-': [intWordRealBind(functionType(intWordRealType)),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    '<': [anyBind(bfunctionType(anyType)), state_1.IdentifierStatus.VALUE_VARIABLE],
    '<=': [anyBind(bfunctionType(anyType)), state_1.IdentifierStatus.VALUE_VARIABLE],
    '>': [anyBind(bfunctionType(anyType)), state_1.IdentifierStatus.VALUE_VARIABLE],
    '>=': [anyBind(bfunctionType(anyType)), state_1.IdentifierStatus.VALUE_VARIABLE],
    '=': [new types_1.TypeVariableBind('\'\'b', new types_1.FunctionType(new types_1.TupleType([eqTypeVar, eqTypeVar]), boolType)).simplify(),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    '<>': [new types_1.TypeVariableBind('\'\'b', new types_1.FunctionType(new types_1.TupleType([eqTypeVar, eqTypeVar]), boolType)).simplify(),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    'true': [new types_1.CustomType('bool'), state_1.IdentifierStatus.VALUE_CONSTRUCTOR],
    'false': [new types_1.CustomType('bool'), state_1.IdentifierStatus.VALUE_CONSTRUCTOR],
    'nil': [new types_1.TypeVariableBind('\'a', new types_1.CustomType('list', [typeVar])), state_1.IdentifierStatus.VALUE_CONSTRUCTOR],
    '::': [new types_1.TypeVariableBind('\'a', new types_1.FunctionType(new types_1.TupleType([typeVar, new types_1.CustomType('list', [typeVar])]), new types_1.CustomType('list', [typeVar]))).simplify(),
        state_1.IdentifierStatus.VALUE_CONSTRUCTOR],
    'Match': [new types_1.CustomType('exn'), state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR],
    'Bind': [new types_1.CustomType('exn'), state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR],
    'Div': [new types_1.CustomType('exn'), state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR],
    'Overflow': [new types_1.CustomType('exn'), state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR],
    '^': [functionType(stringType), state_1.IdentifierStatus.VALUE_VARIABLE],
    'explode': [new types_1.FunctionType(stringType, new types_1.CustomType('list', [charType])).simplify(),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    'implode': [new types_1.FunctionType(new types_1.CustomType('list', [charType]), stringType).simplify(),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    '~': [intRealBind(new types_1.FunctionType(intRealType, intRealType)),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    'abs': [intRealBind(new types_1.FunctionType(intRealType, intRealType)),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    'print': [new types_1.TypeVariableBind('\'a', new types_1.FunctionType(typeVar, new types_1.TupleType([]))).simplify(),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    'printLn': [new types_1.TypeVariableBind('\'a', new types_1.FunctionType(typeVar, new types_1.TupleType([]))).simplify(),
        state_1.IdentifierStatus.VALUE_VARIABLE],
    ':=': [new types_1.TypeVariableBind('\'a', new types_1.FunctionType(new types_1.TupleType([new types_1.CustomType('ref', [typeVar]), typeVar]), new types_1.TupleType([]))).simplify(), state_1.IdentifierStatus.VALUE_VARIABLE],
    'ref': [new types_1.TypeVariableBind('\'a', new types_1.FunctionType(typeVar, new types_1.CustomType('ref', [typeVar]))),
        state_1.IdentifierStatus.VALUE_CONSTRUCTOR],
    '!': [new types_1.TypeVariableBind('\'a', new types_1.FunctionType(new types_1.CustomType('ref', [typeVar]), typeVar)),
        state_1.IdentifierStatus.VALUE_VARIABLE]
}, {}, {}, {}), new state_1.DynamicBasis({
    'unit': [],
    'bool': ['true', 'false'],
    'int': [],
    'word': [],
    'real': [],
    'string': [],
    'char': [],
    'list': ['nil', '::'],
    'array': [],
    'ref': ['ref'],
    'exn': [],
}, {
    'div': [new values_1.PredefinedFunction('div', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Integer && val2 instanceof values_1.Integer) {
                    if (val2.value === 0) {
                        return [new values_1.ExceptionConstructor('Div').construct(), true, []];
                    }
                    return [val1.divide(val2), false, []];
                }
                else if (val1 instanceof values_1.Word && val2 instanceof values_1.Word) {
                    if (val2.value === 0) {
                        return [new values_1.ExceptionConstructor('Div').construct(), true, []];
                    }
                    return [val1.divide(val2), false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "div" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    'mod': [new values_1.PredefinedFunction('mod', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Integer && val2 instanceof values_1.Integer) {
                    if (val2.value === 0) {
                        return [new values_1.ExceptionConstructor('Div').construct(), true, []];
                    }
                    return [val1.modulo(val2), false, []];
                }
                else if (val1 instanceof values_1.Word && val2 instanceof values_1.Word) {
                    if (val2.value === 0) {
                        return [new values_1.ExceptionConstructor('Div').construct(), true, []];
                    }
                    return [val1.modulo(val2), false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "mod" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '*': [new values_1.PredefinedFunction('*', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Integer && val2 instanceof values_1.Integer) {
                    var result = val1.multiply(val2);
                    if (result.hasOverflow()) {
                        return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                    }
                    return [result, false, []];
                }
                else if (val1 instanceof values_1.Word && val2 instanceof values_1.Word) {
                    var result = val1.multiply(val2);
                    if (result.hasOverflow()) {
                        return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                    }
                    return [result, false, []];
                }
                else if (val1 instanceof values_1.Real && val2 instanceof values_1.Real) {
                    var result = val1.multiply(val2);
                    if (result.hasOverflow()) {
                        return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                    }
                    return [result, false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "*" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '/': [new values_1.PredefinedFunction('/', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Real && val2 instanceof values_1.Real) {
                    if (val2.value === 0) {
                        return [new values_1.ExceptionConstructor('Div').construct(), true, []];
                    }
                    return [val1.divide(val2), false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "/" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '+': [new values_1.PredefinedFunction('+', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Integer && val2 instanceof values_1.Integer) {
                    var result = val1.add(val2);
                    if (result.hasOverflow()) {
                        return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                    }
                    return [result, false, []];
                }
                else if (val1 instanceof values_1.Word && val2 instanceof values_1.Word) {
                    var result = val1.add(val2);
                    if (result.hasOverflow()) {
                        return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                    }
                    return [result, false, []];
                }
                else if (val1 instanceof values_1.Real && val2 instanceof values_1.Real) {
                    var result = val1.add(val2);
                    if (result.hasOverflow()) {
                        return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                    }
                    return [result, false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "+" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '-': [new values_1.PredefinedFunction('-', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Integer && val2 instanceof values_1.Integer) {
                    var result = val1.add(val2.negate());
                    if (result.hasOverflow()) {
                        return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                    }
                    return [result, false, []];
                }
                else if (val1 instanceof values_1.Word && val2 instanceof values_1.Word) {
                    var result = val1.add(val2.negate());
                    if (result.hasOverflow()) {
                        return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                    }
                    return [result, false, []];
                }
                else if (val1 instanceof values_1.Real && val2 instanceof values_1.Real) {
                    var result = val1.add(val2.negate());
                    if (result.hasOverflow()) {
                        return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                    }
                    return [result, false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "-" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '<': [new values_1.PredefinedFunction('<', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Integer && val2 instanceof values_1.Integer) {
                    return [new values_1.BoolValue(val1.compareTo(val2) < 0), false, []];
                }
                else if (val1 instanceof values_1.Word && val2 instanceof values_1.Word) {
                    return [new values_1.BoolValue(val1.compareTo(val2) < 0), false, []];
                }
                else if (val1 instanceof values_1.Real && val2 instanceof values_1.Real) {
                    return [new values_1.BoolValue(val1.compareTo(val2) < 0), false, []];
                }
                else if (val1 instanceof values_1.StringValue && val2 instanceof values_1.StringValue) {
                    return [new values_1.BoolValue(val1.compareTo(val2) < 0),
                        false, []];
                }
                else if (val1 instanceof values_1.CharValue && val2 instanceof values_1.CharValue) {
                    return [new values_1.BoolValue(val1.compareTo(val2) < 0),
                        false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "<" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '>': [new values_1.PredefinedFunction('<', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Integer && val2 instanceof values_1.Integer) {
                    return [new values_1.BoolValue(val1.compareTo(val2) > 0), false, []];
                }
                else if (val1 instanceof values_1.Word && val2 instanceof values_1.Word) {
                    return [new values_1.BoolValue(val1.compareTo(val2) > 0), false, []];
                }
                else if (val1 instanceof values_1.Real && val2 instanceof values_1.Real) {
                    return [new values_1.BoolValue(val1.compareTo(val2) > 0), false, []];
                }
                else if (val1 instanceof values_1.StringValue && val2 instanceof values_1.StringValue) {
                    return [new values_1.BoolValue(val1.compareTo(val2) > 0),
                        false, []];
                }
                else if (val1 instanceof values_1.CharValue && val2 instanceof values_1.CharValue) {
                    return [new values_1.BoolValue(val1.compareTo(val2) > 0),
                        false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called ">" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '<=': [new values_1.PredefinedFunction('<', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Integer && val2 instanceof values_1.Integer) {
                    return [new values_1.BoolValue(val1.compareTo(val2) <= 0),
                        false, []];
                }
                else if (val1 instanceof values_1.Word && val2 instanceof values_1.Word) {
                    return [new values_1.BoolValue(val1.compareTo(val2) <= 0), false, []];
                }
                else if (val1 instanceof values_1.Real && val2 instanceof values_1.Real) {
                    return [new values_1.BoolValue(val1.compareTo(val2) <= 0), false, []];
                }
                else if (val1 instanceof values_1.StringValue && val2 instanceof values_1.StringValue) {
                    return [new values_1.BoolValue(val1.compareTo(val2) <= 0),
                        false, []];
                }
                else if (val1 instanceof values_1.CharValue && val2 instanceof values_1.CharValue) {
                    return [new values_1.BoolValue(val1.compareTo(val2) <= 0),
                        false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "<=" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '>=': [new values_1.PredefinedFunction('<', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.Integer && val2 instanceof values_1.Integer) {
                    return [new values_1.BoolValue(val1.compareTo(val2) >= 0), false, []];
                }
                else if (val1 instanceof values_1.Word && val2 instanceof values_1.Word) {
                    return [new values_1.BoolValue(val1.compareTo(val2) >= 0), false, []];
                }
                else if (val1 instanceof values_1.Real && val2 instanceof values_1.Real) {
                    return [new values_1.BoolValue(val1.compareTo(val2) >= 0), false, []];
                }
                else if (val1 instanceof values_1.StringValue && val2 instanceof values_1.StringValue) {
                    return [new values_1.BoolValue(val1.compareTo(val2) >= 0),
                        false, []];
                }
                else if (val1 instanceof values_1.CharValue && val2 instanceof values_1.CharValue) {
                    return [new values_1.BoolValue(val1.compareTo(val2) >= 0), false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called ">=" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '=': [new values_1.PredefinedFunction('=', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                return [new values_1.BoolValue(val1.equals(val2)), false, []];
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "=" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '<>': [new values_1.PredefinedFunction('=', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                return [new values_1.BoolValue(!val1.equals(val2)), false, []];
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "<>" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    // ':='
    // 'ref': new ValueIdentifier(new FunctionType(typeVar, new CustomType('ref', typeVar)),
    'true': [new values_1.BoolValue(true), state_1.IdentifierStatus.VALUE_CONSTRUCTOR],
    'false': [new values_1.BoolValue(false), state_1.IdentifierStatus.VALUE_CONSTRUCTOR],
    'nil': [new values_1.ValueConstructor('nil').construct(), state_1.IdentifierStatus.VALUE_CONSTRUCTOR],
    '::': [new values_1.ValueConstructor('::', 1), state_1.IdentifierStatus.VALUE_CONSTRUCTOR],
    'Match': [new values_1.ExceptionConstructor('Match').construct(), state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR],
    'Bind': [new values_1.ExceptionConstructor('Bind').construct(), state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR],
    'Div': [new values_1.ExceptionConstructor('Div').construct(), state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR],
    'Overflow': [new values_1.ExceptionConstructor('Overflow').construct(), state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR],
    '^': [new values_1.PredefinedFunction('^', function (val) {
            if (val instanceof values_1.RecordValue) {
                var val1 = val.getValue('1');
                var val2 = val.getValue('2');
                if (val1 instanceof values_1.StringValue && val2 instanceof values_1.StringValue) {
                    return [val1.concat(val2), false, []];
                }
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "^" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    'explode': [new values_1.PredefinedFunction('explode', function (val) {
            if (val instanceof values_1.StringValue) {
                return [val.explode(), false, []];
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "explode" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    'implode': [new values_1.PredefinedFunction('implode', function (val) {
            if (val instanceof values_1.ConstructedValue) {
                return [values_1.StringValue.implode(val), false, []];
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "explode" on value of the wrong type (' + val.constructor.name + ').');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    '~': [new values_1.PredefinedFunction('~', function (val) {
            if (val instanceof values_1.Integer) {
                var result = val.negate();
                if (result.hasOverflow()) {
                    return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                }
                return [result, false, []];
            }
            else if (val instanceof values_1.Real) {
                var result = val.negate();
                if (result.hasOverflow()) {
                    return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                }
                return [result, false, []];
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "~" on something weird.');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    'abs': [new values_1.PredefinedFunction('~', function (val) {
            if (val instanceof values_1.Integer) {
                if (val.value >= 0) {
                    return [val, false, []];
                }
                var result = val.negate();
                if (result.hasOverflow()) {
                    return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                }
                return [result, false, []];
            }
            else if (val instanceof values_1.Real) {
                if (val.value >= 0) {
                    return [val, false, []];
                }
                var result = val.negate();
                if (result.hasOverflow()) {
                    return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
                }
                return [result, false, []];
            }
            throw new errors_1.InternalInterpreterError(-1, 'Called "~" on something weird.');
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    'print': [new values_1.PredefinedFunction('print', function (val) {
            var warns = [];
            if (val instanceof values_1.StringValue) {
                warns.push(new errors_1.Warning(-1, val.value));
            }
            else {
                warns.push(new errors_1.Warning(-1, val.toString(undefined)));
            }
            return [new values_1.RecordValue(), false, warns];
        }), state_1.IdentifierStatus.VALUE_VARIABLE],
    'printLn': [new values_1.PredefinedFunction('printLn', function (val) {
            var warns = [];
            if (val instanceof values_1.StringValue) {
                warns.push(new errors_1.Warning(-1, val.value + '\n'));
            }
            else {
                warns.push(new errors_1.Warning(-1, val.toString(undefined) + '\n'));
            }
            return [new values_1.RecordValue(), false, warns];
        }), state_1.IdentifierStatus.VALUE_VARIABLE]
    // ref, :=, ! are implemented directly within evaluate.
}, {}, {}, {}), [0, {}], [0, new Map()], {
    'div': new state_1.InfixStatus(true, 7, false),
    'mod': new state_1.InfixStatus(true, 7, false),
    '*': new state_1.InfixStatus(true, 7, false),
    '/': new state_1.InfixStatus(true, 7, false),
    '+': new state_1.InfixStatus(true, 6, false),
    '-': new state_1.InfixStatus(true, 6, false),
    '<': new state_1.InfixStatus(true, 4, false),
    '>': new state_1.InfixStatus(true, 4, false),
    '<=': new state_1.InfixStatus(true, 4, false),
    '>=': new state_1.InfixStatus(true, 4, false),
    '::': new state_1.InfixStatus(true, 5, true),
    '=': new state_1.InfixStatus(true, 4, false),
    '<>': new state_1.InfixStatus(true, 4, false),
    ':=': new state_1.InfixStatus(true, 3, false),
    '^': new state_1.InfixStatus(true, 6, false),
}, {
    'nil': 1,
    '::': 1,
    'Match': 1,
    'Bind': 1,
    'Div': 1,
    'Overflow': 1
});
function getInitialState() {
    return initialState.getNestedState();
}
exports.getInitialState = getInitialState;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var expressions_1 = __webpack_require__(7);
var tokens_1 = __webpack_require__(1);
var types_1 = __webpack_require__(4);
var state_1 = __webpack_require__(2);
var errors_1 = __webpack_require__(0);
var values_1 = __webpack_require__(3);
var Declaration = (function () {
    function Declaration() {
    }
    Declaration.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (isTopLevel === void 0) { isTopLevel = false; }
        throw new errors_1.InternalInterpreterError(-1, 'Not yet implemented.');
    };
    // Returns [computed state, has Error occured, Exception]
    Declaration.prototype.evaluate = function (state) {
        throw new errors_1.InternalInterpreterError(-1, 'Not yet implemented.');
    };
    Declaration.prototype.toString = function () {
        throw new errors_1.InternalInterpreterError(-1, 'Not yet implemented.');
    };
    Declaration.prototype.simplify = function () {
        throw new errors_1.InternalInterpreterError(-1, 'Not yet implemented.');
    };
    return Declaration;
}());
exports.Declaration = Declaration;
// Declaration subclasses
var ValueDeclaration = (function (_super) {
    __extends(ValueDeclaration, _super);
    // val typeVariableSequence valueBinding
    function ValueDeclaration(position, typeVariableSequence, valueBinding, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.typeVariableSequence = typeVariableSequence;
        _this.valueBinding = valueBinding;
        _this.id = id;
        return _this;
    }
    ValueDeclaration.prototype.simplify = function () {
        var valBnd = [];
        for (var i = 0; i < this.valueBinding.length; ++i) {
            valBnd.push(new ValueBinding(this.valueBinding[i].position, this.valueBinding[i].isRecursive, this.valueBinding[i].pattern.simplify(), this.valueBinding[i].expression.simplify()));
        }
        return new ValueDeclaration(this.position, this.typeVariableSequence, valBnd, this.id);
    };
    ValueDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        var result = [];
        var isRec = false;
        var warns = [];
        var bnds = tyVarBnd;
        var i = 0;
        for (; i < this.valueBinding.length; ++i) {
            if (this.valueBinding[i].isRecursive) {
                isRec = true;
                for (var j = i; j < this.valueBinding.length; ++j) {
                    var r = this.valueBinding[j].pattern.name.getText();
                    result.push([r, new types_1.TypeVariableBind('\'a', new types_1.TypeVariableBind('\'b', new types_1.FunctionType(new types_1.TypeVariable('\'a'), new types_1.TypeVariable('\'b'))))]);
                }
                break;
            }
            var val = this.valueBinding[i].getType(this.typeVariableSequence, state, bnds, nextName, isTopLevel);
            warns = warns.concat(val[1]);
            bnds = val[2];
            nextName = val[3];
            for (var j = 0; j < val[0].length; ++j) {
                result.push(val[0][j]);
            }
        }
        for (var j = 0; j < result.length; ++j) {
            state.setStaticValue(result[j][0], result[j][1], state_1.IdentifierStatus.VALUE_VARIABLE);
        }
        for (var l = 0; l < 2; ++l) {
            for (var j = i; j < this.valueBinding.length; ++j) {
                var val = this.valueBinding[i].getType(this.typeVariableSequence, state, bnds, nextName, isTopLevel);
                warns = warns.concat(val[1]);
                bnds = val[2];
                nextName = val[3];
                for (var k = 0; k < val[0].length; ++k) {
                    state.setStaticValue(val[0][k][0], val[0][k][1], state_1.IdentifierStatus.VALUE_VARIABLE);
                }
            }
        }
        return [state, warns, bnds, nextName];
    };
    ValueDeclaration.prototype.evaluate = function (state) {
        var result = [];
        var recursives = [];
        var isRec = false;
        var warns = [];
        for (var i = 0; i < this.valueBinding.length; ++i) {
            if (this.valueBinding[i].isRecursive) {
                isRec = true;
            }
            var val = this.valueBinding[i].compute(state);
            warns = warns.concat(val[2]);
            for (var j = 0; j < val[3].length; ++j) {
                state.setCell(val[3][j][0], val[3][j][1]);
            }
            if (val[1] !== undefined) {
                return [state, true, val[1], warns];
            }
            if (val[0] === undefined) {
                return [state, true, new values_1.ExceptionValue('Bind'), warns];
            }
            for (var j = 0; j < val[0].length; ++j) {
                if (!isRec) {
                    result.push(val[0][j]);
                }
                else {
                    recursives.push(val[0][j]);
                }
            }
        }
        for (var j = 0; j < result.length; ++j) {
            state.setDynamicValue(result[j][0], result[j][1], state_1.IdentifierStatus.VALUE_VARIABLE);
        }
        for (var j = 0; j < recursives.length; ++j) {
            if (recursives[j][1] instanceof values_1.FunctionValue) {
                state.setDynamicValue(recursives[j][0], new values_1.FunctionValue(recursives[j][1].state, recursives, recursives[j][1].body), state_1.IdentifierStatus.VALUE_VARIABLE);
            }
            else {
                state.setDynamicValue(recursives[j][0], recursives[j][1], state_1.IdentifierStatus.VALUE_VARIABLE);
            }
        }
        return [state, false, undefined, warns];
    };
    ValueDeclaration.prototype.toString = function () {
        // TODO
        var res = 'val <stuff>';
        for (var i = 0; i < this.valueBinding.length; ++i) {
            if (i > 0) {
                res += ' and';
            }
            res += ' ' + this.valueBinding[i];
        }
        return res += ';';
    };
    return ValueDeclaration;
}(Declaration));
exports.ValueDeclaration = ValueDeclaration;
var TypeDeclaration = (function (_super) {
    __extends(TypeDeclaration, _super);
    // type typeBinding
    function TypeDeclaration(position, typeBinding, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.typeBinding = typeBinding;
        _this.id = id;
        return _this;
    }
    TypeDeclaration.prototype.simplify = function () {
        var bnds = [];
        for (var i = 0; i < this.typeBinding.length; ++i) {
            bnds.push(new TypeBinding(this.typeBinding[i].position, this.typeBinding[i].typeVariableSequence, this.typeBinding[i].name, this.typeBinding[i].type.simplify()));
        }
        return new TypeDeclaration(this.position, bnds, this.id);
    };
    TypeDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        for (var i = 0; i < this.typeBinding.length; ++i) {
            state.setStaticType(this.typeBinding[i].name.getText(), new types_1.FunctionType(new types_1.CustomType(this.typeBinding[i].name.getText(), this.typeBinding[i].typeVariableSequence), this.typeBinding[i].type), [], this.typeBinding[i].typeVariableSequence.length);
        }
        return [state, [], tyVarBnd, nextName];
    };
    TypeDeclaration.prototype.evaluate = function (state) {
        for (var i = 0; i < this.typeBinding.length; ++i) {
            state.setDynamicType(this.typeBinding[i].name.getText(), []);
        }
        return [state, false, undefined, []];
    };
    TypeDeclaration.prototype.toString = function () {
        // TODO
        var res = 'type';
        for (var i = 0; i < this.typeBinding.length; ++i) {
            if (i > 0) {
                res += ' and';
            }
            res += ' <stuff> ' + this.typeBinding[i].name.getText();
            res += ' = ' + this.typeBinding[i].type;
        }
        return res + ';';
    };
    return TypeDeclaration;
}(Declaration));
exports.TypeDeclaration = TypeDeclaration;
var DatatypeDeclaration = (function (_super) {
    __extends(DatatypeDeclaration, _super);
    // datatype datatypeBinding <withtype typeBinding>
    function DatatypeDeclaration(position, datatypeBinding, typeBinding, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.datatypeBinding = datatypeBinding;
        _this.typeBinding = typeBinding;
        _this.id = id;
        if (_this.typeBinding !== undefined) {
            throw new errors_1.FeatureDisabledError(_this.position, 'Who is "withtype"?');
        }
        return _this;
    }
    DatatypeDeclaration.prototype.simplify = function () {
        var datbnd = [];
        for (var i = 0; i < this.datatypeBinding.length; ++i) {
            var ntype = [];
            for (var j = 0; j < this.datatypeBinding[i].type.length; ++j) {
                if (this.datatypeBinding[i].type[j][1] !== undefined) {
                    ntype.push([this.datatypeBinding[i].type[j][0],
                        this.datatypeBinding[i].type[j][1].simplify()]);
                }
                else {
                    ntype.push(this.datatypeBinding[i].type[j]);
                }
            }
            datbnd.push(new DatatypeBinding(this.datatypeBinding[i].position, this.datatypeBinding[i].typeVariableSequence, this.datatypeBinding[i].name, ntype));
        }
        // TODO Correctly implement the withtype ~> type transition or clean up this mess
        /*
        if (this.typeBinding) {
            return new SequentialDeclaration(this.position, [
                new DatatypeDeclaration(this.position, datbnd, undefined),
                new TypeDeclaration(this.position, this.typeBinding).simplify()]);
        } else { */
        return new DatatypeDeclaration(this.position, datbnd, undefined, this.id);
        /* } */
    };
    DatatypeDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        // I'm assuming the withtype is empty
        for (var i = 0; i < this.datatypeBinding.length; ++i) {
            var res = this.datatypeBinding[i].getType(state);
            for (var j = 0; j < res[0].length; ++j) {
                if (!state_1.State.allowsRebind(res[0][j][0])) {
                    throw new errors_1.ElaborationError(this.position, 'You simply cannot rebind "'
                        + res[0][j][0] + '".');
                }
                state.setStaticValue(res[0][j][0], res[0][j][1], state_1.IdentifierStatus.VALUE_CONSTRUCTOR);
            }
            // TODO id
            state.setStaticType(res[2][0], res[1], res[2][1], this.datatypeBinding[i].typeVariableSequence.length);
        }
        return [state, [], tyVarBnd, nextName];
    };
    DatatypeDeclaration.prototype.evaluate = function (state) {
        // I'm assuming the withtype is empty
        for (var i = 0; i < this.datatypeBinding.length; ++i) {
            var res = this.datatypeBinding[i].compute(state);
            for (var j = 0; j < res[0].length; ++j) {
                if (!state_1.State.allowsRebind(res[0][j][0])) {
                    throw new errors_1.EvaluationError(this.position, 'You simply cannot rebind "'
                        + res[0][j][0] + '".');
                }
                state.setDynamicValue(res[0][j][0], res[0][j][1], state_1.IdentifierStatus.VALUE_CONSTRUCTOR);
            }
            // TODO id
            state.setDynamicType(res[1][0], res[1][1]);
        }
        return [state, false, undefined, []];
    };
    DatatypeDeclaration.prototype.toString = function () {
        var res = 'datatype';
        for (var i = 0; i < this.datatypeBinding.length; ++i) {
            if (i > 0) {
                res += ' and';
            }
            res += ' ' + this.datatypeBinding[i].name.getText() + ' =';
            for (var j = 0; j < this.datatypeBinding[i].type.length; ++j) {
                if (j > 0) {
                    res += ' |';
                }
                res += ' ' + this.datatypeBinding[i].type[j][0].getText();
                if (this.datatypeBinding[i].type[j][1] !== undefined) {
                    res += ' of ' + this.datatypeBinding[i].type[j][1];
                }
            }
        }
        return res + ';';
    };
    return DatatypeDeclaration;
}(Declaration));
exports.DatatypeDeclaration = DatatypeDeclaration;
var DatatypeReplication = (function (_super) {
    __extends(DatatypeReplication, _super);
    // datatype name = datatype oldname
    function DatatypeReplication(position, name, oldname, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.name = name;
        _this.oldname = oldname;
        _this.id = id;
        return _this;
    }
    DatatypeReplication.prototype.simplify = function () {
        return this;
    };
    DatatypeReplication.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        var res = undefined;
        if (this.oldname instanceof tokens_1.LongIdentifierToken) {
            /* TODO
            let st = state.getAndResolveStaticStructure(<LongIdentifierToken> this.oldname);
            if (st !== undefined) {
                res = <string[]> (<StaticBasis> st).getType(
                    (<LongIdentifierToken> this.oldname).id.getText());
            }
             */
        }
        else {
            res = state.getStaticType(this.oldname.getText());
        }
        if (res === undefined) {
            throw new errors_1.ElaborationError(this.position, 'The datatype "' + this.oldname.getText() + '" doesn\'t exist.');
        }
        state.setStaticType(this.name.getText(), res.type, res.constructors, res.arity);
        return [state, [], tyVarBnd, nextName];
    };
    DatatypeReplication.prototype.evaluate = function (state) {
        var tp = [];
        if (this.oldname instanceof tokens_1.LongIdentifierToken) {
            var st = state.getAndResolveDynamicStructure(this.oldname);
            if (st !== undefined) {
                tp = st.getType(this.oldname.id.getText());
            }
        }
        else {
            tp = state.getDynamicType(this.oldname.getText());
        }
        if (tp === undefined) {
            throw new errors_1.EvaluationError(this.position, 'The datatype "'
                + this.oldname.getText() + '" does not exist.');
        }
        state.setDynamicType(this.name.getText(), tp);
        return [state, false, undefined, []];
    };
    DatatypeReplication.prototype.toString = function () {
        return 'datatype ' + this.name.getText() + ' = datatype ' + this.oldname.getText() + ';';
    };
    return DatatypeReplication;
}(Declaration));
exports.DatatypeReplication = DatatypeReplication;
var ExceptionDeclaration = (function (_super) {
    __extends(ExceptionDeclaration, _super);
    function ExceptionDeclaration(position, bindings, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.bindings = bindings;
        _this.id = id;
        return _this;
    }
    ExceptionDeclaration.prototype.simplify = function () {
        return this;
    };
    ExceptionDeclaration.prototype.toString = function () {
        // TODO
        return 'exception <stuff>;';
    };
    ExceptionDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        for (var i = 0; i < this.bindings.length; ++i) {
            state = this.bindings[i].elaborate(state);
        }
        return [state, [], tyVarBnd, nextName];
    };
    ExceptionDeclaration.prototype.evaluate = function (state) {
        for (var i = 0; i < this.bindings.length; ++i) {
            var res = this.bindings[i].evaluate(state);
            if (res[1]) {
                return [res[0], res[1], res[2], []];
            }
            state = res[0];
        }
        return [state, false, undefined, []];
    };
    return ExceptionDeclaration;
}(Declaration));
exports.ExceptionDeclaration = ExceptionDeclaration;
var LocalDeclaration = (function (_super) {
    __extends(LocalDeclaration, _super);
    // local declaration in body end
    function LocalDeclaration(position, declaration, body, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.declaration = declaration;
        _this.body = body;
        _this.id = id;
        return _this;
    }
    LocalDeclaration.prototype.simplify = function () {
        return new LocalDeclaration(this.position, this.declaration.simplify(), this.body.simplify(), this.id);
    };
    LocalDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        var nstate = [state.getNestedState(state.id), [], tyVarBnd, nextName];
        var res = this.declaration.elaborate(nstate[0], tyVarBnd, nextName);
        var input = res[0].getNestedState(state.id);
        nstate = this.body.elaborate(input, res[2], res[3], isTopLevel);
        // Forget all local definitions
        input.parent = state;
        return [nstate[0], res[1].concat(nstate[1]), nstate[2], nstate[3]];
    };
    LocalDeclaration.prototype.evaluate = function (state) {
        var nstate = state.getNestedState(0).getNestedState(state.id);
        var res = this.declaration.evaluate(nstate);
        var membnd = res[0].getMemoryChanges(0);
        for (var i = 0; i < membnd.length; ++i) {
            state.setCell(membnd[i][0], membnd[i][1]);
        }
        if (res[1]) {
            // Something came flying in our direction. So hide we were here and let it flow.
            return [state, true, res[2], res[3]];
        }
        nstate = res[0].getNestedState(state.id);
        var nres = this.body.evaluate(nstate);
        // Forget all local definitions
        nstate.parent = state;
        nres[3] = res[3].concat(nres[3]);
        return nres;
    };
    LocalDeclaration.prototype.toString = function () {
        var res = 'local ' + this.declaration;
        res += ' in ' + this.body;
        res += ' end;';
        return res;
    };
    return LocalDeclaration;
}(Declaration));
exports.LocalDeclaration = LocalDeclaration;
var OpenDeclaration = (function (_super) {
    __extends(OpenDeclaration, _super);
    // open name_1 ... name_n
    function OpenDeclaration(position, names, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.names = names;
        _this.id = id;
        return _this;
    }
    OpenDeclaration.prototype.simplify = function () {
        return this;
    };
    OpenDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        for (var i = 0; i < this.names.length; ++i) {
            var tmp = undefined;
            if (this.names[i] instanceof tokens_1.LongIdentifierToken) {
                /* TODO
                tmp = state.getAndResolveStaticStructure(<LongIdentifierToken> this.names[i]);
                if (tmp !== undefined) {
                    tmp = res.getStructure((<LongIdentifierToken> this.names[i]).id.getText());
                }
                 */
            }
            else {
                // tmp = state.getStaticStructure(this.names[i].getText());
            }
            if (tmp === undefined) {
                throw new errors_1.EvaluationError(this.position, 'Undefined module "' + this.names[i].getText() + '".');
            }
            // state.staticBasis.extend(<StaticBasis> tmp);
        }
        return [state, [], tyVarBnd, nextName];
    };
    OpenDeclaration.prototype.evaluate = function (state) {
        for (var i = 0; i < this.names.length; ++i) {
            var tmp = void 0;
            if (this.names[i] instanceof tokens_1.LongIdentifierToken) {
                tmp = state.getAndResolveDynamicStructure(this.names[i]);
                if (tmp !== undefined) {
                    tmp = tmp.getStructure(this.names[i].id.getText());
                }
            }
            else {
                tmp = state.getDynamicStructure(this.names[i].getText());
            }
            if (tmp === undefined) {
                throw new errors_1.EvaluationError(this.position, 'Undefined module "' + this.names[i].getText() + '".');
            }
            state.dynamicBasis.extend(tmp);
        }
        return [state, false, undefined, []];
    };
    OpenDeclaration.prototype.toString = function () {
        var res = 'open';
        for (var i = 0; i < this.names.length; ++i) {
            res += ' ' + this.names[i].getText();
        }
        return res + ';';
    };
    return OpenDeclaration;
}(Declaration));
exports.OpenDeclaration = OpenDeclaration;
var EmptyDeclaration = (function (_super) {
    __extends(EmptyDeclaration, _super);
    // exactly what it says on the tin.
    function EmptyDeclaration(id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    EmptyDeclaration.prototype.simplify = function () {
        return this;
    };
    EmptyDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        return [state, [], tyVarBnd, nextName];
    };
    EmptyDeclaration.prototype.evaluate = function (state) {
        return [state, false, undefined, []];
    };
    EmptyDeclaration.prototype.toString = function () {
        return ' ;';
    };
    return EmptyDeclaration;
}(Declaration));
exports.EmptyDeclaration = EmptyDeclaration;
var SequentialDeclaration = (function (_super) {
    __extends(SequentialDeclaration, _super);
    // declaration1 <;> declaration2
    function SequentialDeclaration(position, declarations, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.declarations = declarations;
        _this.id = id;
        return _this;
    }
    SequentialDeclaration.prototype.simplify = function () {
        var decls = [];
        for (var i = 0; i < this.declarations.length; ++i) {
            decls.push(this.declarations[i].simplify());
        }
        return new SequentialDeclaration(this.position, decls, this.id);
    };
    SequentialDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName, isTopLevel) {
        var _this = this;
        var warns = [];
        var bnds = tyVarBnd;
        var str = nextName;
        var _loop_1 = function (i) {
            if (isTopLevel) {
                bnds = new Map();
                state.getTypeVariableBinds()[1].forEach(function (val, key) {
                    bnds = bnds.set(key, val);
                });
            }
            var res = this_1.declarations[i].elaborate(state.getNestedState(this_1.declarations[i].id), bnds, str, isTopLevel);
            state = res[0];
            warns = warns.concat(res[1]);
            bnds = res[2];
            var nbnds = new Map();
            if (isTopLevel) {
                nbnds = tyVarBnd;
            }
            res[2].forEach(function (val, key) {
                if (val[1] && key[1] === '~') {
                    // Only free type variables are to be kept
                    var ntp = val[0].instantiate(state, res[2]).normalize(state.freeTypeVariables[0]);
                    if (!state.parent.getTypeVariableBinds()[1].has(key)) {
                        warns.push(new errors_1.Warning(_this.position, 'The free type variable "'
                            + key + '" has been instantiated to "' + ntp[0] + '".\n'));
                    }
                    nbnds = nbnds.set(key, [ntp[0], true]);
                }
                else if (tyVarBnd.has(key)) {
                    nbnds = nbnds.set(key, [val[0].instantiate(state, res[2]), false]);
                }
            });
            bnds = nbnds;
            if (isTopLevel) {
                state.freeTypeVariables[1] = nbnds;
                for (var v in state.staticBasis.valueEnvironment) {
                    if (state.staticBasis.valueEnvironment.hasOwnProperty(v)) {
                        var tp = state.staticBasis.valueEnvironment[v];
                        var norm = tp[0].normalize(state.freeTypeVariables[0]);
                        state.freeTypeVariables[0] = norm[1];
                        state.setStaticValue(v, norm[0], tp[1]);
                    }
                }
            }
            str = res[3];
        };
        var this_1 = this;
        for (var i = 0; i < this.declarations.length; ++i) {
            _loop_1(i);
        }
        return [state, warns, bnds, str];
    };
    SequentialDeclaration.prototype.evaluate = function (state) {
        var warns = [];
        for (var i = 0; i < this.declarations.length; ++i) {
            var nstate = state.getNestedState(this.declarations[i].id);
            var res = this.declarations[i].evaluate(nstate);
            warns = warns.concat(res[3]);
            if (res[1]) {
                // Something blew up, so let someone else handle the mess
                return [res[0], res[1], res[2], warns];
            }
            state = res[0];
        }
        return [state, false, undefined, warns];
    };
    SequentialDeclaration.prototype.toString = function () {
        var res = '';
        for (var i = 0; i < this.declarations.length; ++i) {
            if (i > 0) {
                res += ' ';
            }
            res += this.declarations[i];
        }
        return res;
    };
    return SequentialDeclaration;
}(Declaration));
exports.SequentialDeclaration = SequentialDeclaration;
// Derived Forms and semantically irrelevant stuff
var FunctionDeclaration = (function (_super) {
    __extends(FunctionDeclaration, _super);
    // fun typeVariableSequence functionValueBinding
    function FunctionDeclaration(position, typeVariableSequence, functionValueBinding, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.typeVariableSequence = typeVariableSequence;
        _this.functionValueBinding = functionValueBinding;
        _this.id = id;
        return _this;
    }
    FunctionDeclaration.prototype.simplify = function () {
        var valbnd = [];
        for (var i = 0; i < this.functionValueBinding.length; ++i) {
            valbnd.push(this.functionValueBinding[i].simplify());
        }
        return new ValueDeclaration(this.position, this.typeVariableSequence, valbnd, this.id);
    };
    return FunctionDeclaration;
}(Declaration));
exports.FunctionDeclaration = FunctionDeclaration;
var Evaluation = (function (_super) {
    __extends(Evaluation, _super);
    // do exp
    function Evaluation(position, expression) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.expression = expression;
        return _this;
    }
    Evaluation.prototype.simplify = function () {
        return new ValueDeclaration(this.position, [], [new ValueBinding(this.position, false, new expressions_1.Tuple(-1, []), this.expression)]).simplify();
    };
    return Evaluation;
}(Declaration));
exports.Evaluation = Evaluation;
var AbstypeDeclaration = (function (_super) {
    __extends(AbstypeDeclaration, _super);
    // abstype datatypeBinding <withtype typeBinding> with declaration end
    function AbstypeDeclaration(position, datatypeBinding, typeBinding, declaration, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.datatypeBinding = datatypeBinding;
        _this.typeBinding = typeBinding;
        _this.declaration = declaration;
        _this.id = id;
        if (_this.typeBinding !== undefined) {
            throw new errors_1.FeatureDisabledError(_this.position, 'Who is "withtype"?');
        }
        return _this;
    }
    AbstypeDeclaration.prototype.simplify = function () {
        var dat = new DatatypeDeclaration(this.position, this.datatypeBinding, undefined, this.id);
        var tpbnd = [];
        for (var i = 0; i < this.datatypeBinding.length; ++i) {
            tpbnd.push(new TypeBinding(this.datatypeBinding[i].position, this.datatypeBinding[i].typeVariableSequence, this.datatypeBinding[i].name, new types_1.CustomType(this.datatypeBinding[i].name.getText(), this.datatypeBinding[i].typeVariableSequence)));
        }
        var tp = new TypeDeclaration(this.position, tpbnd, this.id);
        return new LocalDeclaration(this.position, dat, new SequentialDeclaration(this.position, [tp, this.declaration], this.id), this.id).simplify();
    };
    return AbstypeDeclaration;
}(Declaration));
exports.AbstypeDeclaration = AbstypeDeclaration;
var InfixDeclaration = (function (_super) {
    __extends(InfixDeclaration, _super);
    // infix <d> vid1 .. vidn
    function InfixDeclaration(position, operators, precedence, id) {
        if (precedence === void 0) { precedence = 0; }
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.operators = operators;
        _this.precedence = precedence;
        _this.id = id;
        return _this;
    }
    InfixDeclaration.prototype.simplify = function () {
        return this;
    };
    InfixDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName) {
        return [state, [], tyVarBnd, nextName];
    };
    InfixDeclaration.prototype.evaluate = function (state) {
        for (var i = 0; i < this.operators.length; ++i) {
            state.setInfixStatus(this.operators[i], this.precedence, false, true);
        }
        return [state, false, undefined, []];
    };
    InfixDeclaration.prototype.toString = function () {
        var res = 'infix';
        res += ' ' + this.precedence;
        for (var i = 0; i < this.operators.length; ++i) {
            res += ' ' + this.operators[i].getText();
        }
        return res + ';';
    };
    return InfixDeclaration;
}(Declaration));
exports.InfixDeclaration = InfixDeclaration;
var InfixRDeclaration = (function (_super) {
    __extends(InfixRDeclaration, _super);
    // infixr <d> vid1 .. vidn
    function InfixRDeclaration(position, operators, precedence, id) {
        if (precedence === void 0) { precedence = 0; }
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.operators = operators;
        _this.precedence = precedence;
        _this.id = id;
        return _this;
    }
    InfixRDeclaration.prototype.simplify = function () {
        return this;
    };
    InfixRDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName) {
        return [state, [], tyVarBnd, nextName];
    };
    InfixRDeclaration.prototype.evaluate = function (state) {
        for (var i = 0; i < this.operators.length; ++i) {
            state.setInfixStatus(this.operators[i], this.precedence, true, true);
        }
        return [state, false, undefined, []];
    };
    InfixRDeclaration.prototype.toString = function () {
        var res = 'infixr';
        res += ' ' + this.precedence;
        for (var i = 0; i < this.operators.length; ++i) {
            res += ' ' + this.operators[i].getText();
        }
        return res + ';';
    };
    return InfixRDeclaration;
}(Declaration));
exports.InfixRDeclaration = InfixRDeclaration;
var NonfixDeclaration = (function (_super) {
    __extends(NonfixDeclaration, _super);
    // nonfix <d> vid1 .. vidn
    function NonfixDeclaration(position, operators, id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.operators = operators;
        _this.id = id;
        return _this;
    }
    NonfixDeclaration.prototype.simplify = function () {
        return this;
    };
    NonfixDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName) {
        return [state, [], tyVarBnd, nextName];
    };
    NonfixDeclaration.prototype.evaluate = function (state) {
        for (var i = 0; i < this.operators.length; ++i) {
            state.setInfixStatus(this.operators[i], 0, false, false);
        }
        return [state, false, undefined, []];
    };
    NonfixDeclaration.prototype.toString = function () {
        var res = 'nonfix';
        for (var i = 0; i < this.operators.length; ++i) {
            res += ' ' + this.operators[i].getText();
        }
        return res + ';';
    };
    return NonfixDeclaration;
}(Declaration));
exports.NonfixDeclaration = NonfixDeclaration;
// Value Bundings
var ValueBinding = (function () {
    // <rec> pattern = expression
    function ValueBinding(position, isRecursive, pattern, expression) {
        this.position = position;
        this.isRecursive = isRecursive;
        this.pattern = pattern;
        this.expression = expression;
    }
    ValueBinding.prototype.toString = function () {
        var res = '';
        if (this.isRecursive) {
            res += 'rec ';
        }
        res += this.pattern;
        res += ' = ';
        return res + this.expression;
    };
    ValueBinding.prototype.getType = function (tyVarSeq, state, tyVarBnd, nextName, isTopLevel) {
        var nstate = state.getNestedState(state.id);
        var tp = this.expression.getType(nstate, tyVarBnd, nextName);
        var res = this.pattern.matchType(nstate, tp[4], tp[0]);
        var noBind = new Set();
        res[2].forEach(function (val, key) {
            noBind.add(key);
            val[0].getTypeVariables().forEach(function (v) {
                noBind.add(v);
            });
        });
        if (res === undefined) {
            throw new errors_1.ElaborationError(this.position, 'Type clash. An expression of type "' + tp[0]
                + '" cannot be assigned to "' + res[1] + '".');
        }
        var ntys = [];
        for (var i = 0; i < tyVarSeq.length; ++i) {
            var nt = tyVarSeq[i].instantiate(state, res[2]);
            if (!(nt instanceof types_1.TypeVariable)) {
                throw new errors_1.ElaborationError(this.position, 'Type clash. An expression of explicit type "' + tyVarSeq[i]
                    + '" cannot have type "' + nt + '".');
            }
            ntys.push(nt);
        }
        var valuePoly = !this.isRecursive && !this.expression.isSafe(state);
        for (var i = 0; i < res[0].length; ++i) {
            res[0][i][1] = res[0][i][1].instantiate(state, res[2]);
            //           console.log(res[2]);
            // console.log(res[0][i][1] + ' ' + i );
            var tv = res[0][i][1].getTypeVariables();
            var free = res[0][i][1].getTypeVariables(true);
            for (var j = ntys.length - 1; j >= 0; --j) {
                if (tv.has(ntys[j].name)) {
                    res[0][i][1] = new types_1.TypeVariableBind(ntys[j].name, res[0][i][1]);
                    res[0][i][1].isFree = free.has(ntys[j].name);
                }
            }
            ntys = [];
            res[0][i][1].getTypeVariables().forEach(function (val) {
                if (isTopLevel || !noBind.has(val)) {
                    ntys.push(new types_1.TypeVariable(val));
                }
            });
            for (var j = ntys.length - 1; j >= 0; --j) {
                res[0][i][1] = new types_1.TypeVariableBind(ntys[j].name, res[0][i][1]);
                res[0][i][1].isFree = valuePoly || free.has(ntys[j].name);
            }
        }
        return [res[0], tp[1], res[2], tp[2]];
    };
    // Returns [ VE | undef, Excep | undef, Warning[]]
    ValueBinding.prototype.compute = function (state) {
        var v = this.expression.compute(state);
        if (v[1]) {
            return [undefined, v[0], v[2], v[3]];
        }
        return [this.pattern.matches(state, v[0]), undefined, v[2], v[3]];
    };
    return ValueBinding;
}());
exports.ValueBinding = ValueBinding;
var FunctionValueBinding = (function () {
    function FunctionValueBinding(position, parameters, name) {
        this.position = position;
        this.parameters = parameters;
        this.name = name;
    }
    FunctionValueBinding.prototype.simplify = function () {
        if (this.name === undefined) {
            throw new errors_1.InternalInterpreterError(this.position, 'This function isn\'t ready to be simplified yet.');
        }
        // Build the case analysis, starting with the (vid1,...,vidn)
        var arr = [];
        var matches = [];
        for (var i = 0; i < this.parameters[0][0].length; ++i) {
            arr.push(new expressions_1.ValueIdentifier(-1, new tokens_1.IdentifierToken('__arg' + i, -1)));
        }
        for (var i = 0; i < this.parameters.length; ++i) {
            var pat2 = void 0;
            if (this.parameters[i][0].length === 1) {
                pat2 = this.parameters[i][0][0];
            }
            else {
                pat2 = new expressions_1.Tuple(-1, this.parameters[i][0]);
            }
            if (this.parameters[i][1] === undefined) {
                matches.push([pat2, this.parameters[i][2]]);
            }
            else {
                matches.push([pat2,
                    new expressions_1.TypedExpression(-1, this.parameters[i][2], this.parameters[i][1])]);
            }
        }
        var pat;
        if (arr.length !== 1) {
            pat = new expressions_1.Tuple(-1, arr).simplify();
        }
        else {
            pat = arr[0];
        }
        var mat = new expressions_1.Match(-1, matches);
        var exp;
        //        if (arr.length === 1) {
        //    exp = new Lambda(-1, mat);
        // } else {
        exp = new expressions_1.CaseAnalysis(-1, pat, mat);
        // Now build the lambdas around
        for (var i = this.parameters[0][0].length - 1; i >= 0; --i) {
            exp = new expressions_1.Lambda(-1, new expressions_1.Match(-1, [[
                    new expressions_1.ValueIdentifier(-1, new tokens_1.IdentifierToken('__arg' + i, -1)),
                    exp
                ]]));
        }
        // }
        return new ValueBinding(this.position, true, this.name, exp.simplify());
    };
    FunctionValueBinding.prototype.toString = function () {
        var res = '';
        for (var i = 0; i < this.parameters.length; ++i) {
            if (i > 0) {
                res += ' | ';
            }
            res += this.name.name.getText();
            for (var j = 0; j < this.parameters[i][0].length; ++j) {
                res += ' ' + this.parameters[i][0][j];
            }
            if (this.parameters[i][1] !== undefined) {
                res += ': ' + this.parameters[i][1];
            }
            res += ' = ' + this.parameters[i][2];
        }
        return res;
    };
    return FunctionValueBinding;
}());
exports.FunctionValueBinding = FunctionValueBinding;
// Type Bindings
var TypeBinding = (function () {
    // typeVariableSequence name = type
    function TypeBinding(position, typeVariableSequence, name, type) {
        this.position = position;
        this.typeVariableSequence = typeVariableSequence;
        this.name = name;
        this.type = type;
    }
    return TypeBinding;
}());
exports.TypeBinding = TypeBinding;
// Datatype Bindings
var DatatypeBinding = (function () {
    // typeVariableSequence name = <op> constructor <of type>
    // type: [constructorName, <type>]
    function DatatypeBinding(position, typeVariableSequence, name, type) {
        this.position = position;
        this.typeVariableSequence = typeVariableSequence;
        this.name = name;
        this.type = type;
    }
    DatatypeBinding.prototype.getType = function (state) {
        var connames = [];
        var ve = [];
        var nstate = state.getNestedState(state.id);
        var restp = new types_1.CustomType(this.name.getText(), this.typeVariableSequence);
        nstate.setStaticType(this.name.getText(), restp, [], this.typeVariableSequence.length);
        var _loop_2 = function (i) {
            var numArg = 0;
            var tp = restp;
            if (this_2.type[i][1] !== undefined) {
                numArg = 1;
                tp = new types_1.FunctionType(this_2.type[i][1].instantiate(nstate, new Map()), tp);
            }
            tp.getTypeVariables().forEach(function (val) {
                tp = new types_1.TypeVariableBind(val, tp);
            });
            // TODO ID
            // let id = state.getValueIdentifierId(this.type[i][0].getText());
            // state.incrementValueIdentifierId(this.type[i][0].getText());
            ve.push([this_2.type[i][0].getText(), tp]);
            connames.push(this_2.type[i][0].getText());
        };
        var this_2 = this;
        for (var i = 0; i < this.type.length; ++i) {
            _loop_2(i);
        }
        return [ve, restp, [this.name.getText(), connames]];
    };
    DatatypeBinding.prototype.compute = function (state) {
        var connames = [];
        var ve = [];
        for (var i = 0; i < this.type.length; ++i) {
            var numArg = 0;
            if (this.type[i][1] !== undefined) {
                numArg = 1;
            }
            var id = state.getValueIdentifierId(this.type[i][0].getText());
            state.incrementValueIdentifierId(this.type[i][0].getText());
            ve.push([this.type[i][0].getText(), new values_1.ValueConstructor(this.type[i][0].getText(), numArg, id)]);
            connames.push(this.type[i][0].getText());
        }
        return [ve, [this.name.getText(), connames]];
    };
    return DatatypeBinding;
}());
exports.DatatypeBinding = DatatypeBinding;
var DirectExceptionBinding = (function () {
    // <op> name <of type>
    function DirectExceptionBinding(position, name, type) {
        this.position = position;
        this.name = name;
        this.type = type;
    }
    DirectExceptionBinding.prototype.elaborate = function (state) {
        if (this.type !== undefined) {
            var tp = this.type.simplify().instantiate(state, new Map());
            var tyvars_1 = [];
            tp.getTypeVariables().forEach(function (val) {
                tyvars_1.push(val);
            });
            // TODO Only do this if we're at top level
            // if (tyvars.length > 0) {
            //    throw ElaborationError.getUnguarded(this.position, tyvars);
            // }
            state.setStaticValue(this.name.getText(), new types_1.FunctionType(tp, new types_1.CustomType('exn')).normalize()[0], state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR);
        }
        else {
            state.setStaticValue(this.name.getText(), new types_1.CustomType('exn').normalize()[0], state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR);
        }
        return state;
    };
    DirectExceptionBinding.prototype.evaluate = function (state) {
        var numArg = 0;
        if (this.type !== undefined) {
            numArg = 1;
        }
        var id = state.getValueIdentifierId(this.name.getText());
        state.incrementValueIdentifierId(this.name.getText());
        if (!state_1.State.allowsRebind(this.name.getText())) {
            throw new errors_1.EvaluationError(this.position, 'You simply cannot rebind "'
                + this.name.getText() + '".');
        }
        state.setDynamicValue(this.name.getText(), new values_1.ExceptionConstructor(this.name.getText(), numArg, id), state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR);
        return [state, false, undefined];
    };
    return DirectExceptionBinding;
}());
exports.DirectExceptionBinding = DirectExceptionBinding;
var ExceptionAlias = (function () {
    // <op> name = <op> oldname
    function ExceptionAlias(position, name, oldname) {
        this.position = position;
        this.name = name;
        this.oldname = oldname;
    }
    ExceptionAlias.prototype.elaborate = function (state) {
        var res = undefined;
        if (this.oldname instanceof tokens_1.LongIdentifierToken) {
            /* TODO
            let st = state.getAndResolveStaticStructure(<LongIdentifierToken> this.oldname);
            if (st !== undefined) {
                res = st.getValue((<LongIdentifierToken> this.oldname).id.getText());
            }
            */
        }
        else {
            res = state.getStaticValue(this.oldname.getText());
        }
        if (res === undefined) {
            throw new errors_1.ElaborationError(this.position, 'Unbound value identifier "'
                + this.oldname.getText() + '".');
        }
        else if (res[1] !== state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR) {
            throw new errors_1.ElaborationError(this.position, 'You cannot transform "'
                + res[0] + '" into an exception.');
        }
        state.setStaticValue(this.name.getText(), res[0].normalize()[0], state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR);
        return state;
    };
    ExceptionAlias.prototype.evaluate = function (state) {
        var res = undefined;
        if (this.oldname instanceof tokens_1.LongIdentifierToken) {
            var st = state.getAndResolveDynamicStructure(this.oldname);
            if (st !== undefined) {
                res = st.getValue(this.oldname.id.getText());
            }
        }
        else {
            res = state.getDynamicValue(this.oldname.getText());
        }
        if (res === undefined) {
            throw new errors_1.EvaluationError(this.position, 'Unbound value identifier "'
                + this.oldname.getText() + '".');
        }
        else if (res[1] !== state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR) {
            throw new errors_1.EvaluationError(this.position, 'You cannot transform "'
                + res[0].toString(state) + '" into an exception.');
        }
        state.setDynamicValue(this.name.getText(), res[0], state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR);
        return [state, false, undefined];
    };
    return ExceptionAlias;
}());
exports.ExceptionAlias = ExceptionAlias;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(4);
var declarations_1 = __webpack_require__(6);
var tokens_1 = __webpack_require__(1);
var state_1 = __webpack_require__(2);
var errors_1 = __webpack_require__(0);
var values_1 = __webpack_require__(3);
var initialState_ts_1 = __webpack_require__(5);
var Expression = (function () {
    function Expression() {
    }
    Expression.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        throw new errors_1.InternalInterpreterError(this.position, 'Called "getType" on a derived form.');
    };
    // Computes the value of an expression, returns [computed value, is thrown exception]
    Expression.prototype.compute = function (state) {
        throw new errors_1.InternalInterpreterError(this.position, 'Called "getValue" on a derived form.');
    };
    // Returns whether the expression could do nasty stuff (value polymorphism ...)
    Expression.prototype.isSafe = function (state) {
        return true;
    };
    Expression.prototype.toString = function () {
        throw new errors_1.InternalInterpreterError(this.position, 'I don\'t want to be printed.');
    };
    return Expression;
}());
exports.Expression = Expression;
var Constant = (function (_super) {
    __extends(Constant, _super);
    function Constant(position, token) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.token = token;
        return _this;
    }
    Constant.prototype.matchType = function (state, tyVarBnd, t) {
        return [[], this.getType(state, tyVarBnd)[0], tyVarBnd];
    };
    Constant.prototype.matches = function (state, v) {
        if (this.compute(state)[0].equals(v)) {
            return [];
        }
        else {
            return undefined;
        }
    };
    Constant.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        if (this.token instanceof tokens_1.IntegerConstantToken || this.token instanceof tokens_1.NumericToken) {
            return [new types_1.CustomType('int'), [], nextName, tyVars, tyVarBnd];
        }
        else if (this.token instanceof tokens_1.RealConstantToken) {
            return [new types_1.CustomType('real'), [], nextName, tyVars, tyVarBnd];
        }
        else if (this.token instanceof tokens_1.WordConstantToken) {
            return [new types_1.CustomType('word'), [], nextName, tyVars, tyVarBnd];
        }
        else if (this.token instanceof tokens_1.CharacterConstantToken) {
            return [new types_1.CustomType('char'), [], nextName, tyVars, tyVarBnd];
        }
        else if (this.token instanceof tokens_1.StringConstantToken) {
            return [new types_1.CustomType('string'), [], nextName, tyVars, tyVarBnd];
        }
        else {
            throw new errors_1.InternalInterpreterError(this.token.position, '"' + this + '" does not seem to be a valid constant.');
        }
    };
    Constant.prototype.simplify = function () { return this; };
    Constant.prototype.toString = function () {
        return this.token.getText();
    };
    Constant.prototype.compute = function (state) {
        if (this.token instanceof tokens_1.IntegerConstantToken || this.token instanceof tokens_1.NumericToken) {
            return [new values_1.Integer(this.token.value),
                false, [], []];
        }
        else if (this.token instanceof tokens_1.RealConstantToken) {
            return [new values_1.Real(this.token.value), false, [], []];
        }
        else if (this.token instanceof tokens_1.WordConstantToken) {
            return [new values_1.Word(this.token.value), false, [], []];
        }
        else if (this.token instanceof tokens_1.CharacterConstantToken) {
            return [new values_1.CharValue(this.token.value), false, [], []];
        }
        else if (this.token instanceof tokens_1.StringConstantToken) {
            return [new values_1.StringValue(this.token.value), false, [], []];
        }
        throw new errors_1.EvaluationError(this.token.position, 'You sure that this is a constant?');
    };
    return Constant;
}(Expression));
exports.Constant = Constant;
var ValueIdentifier = (function (_super) {
    __extends(ValueIdentifier, _super);
    // op longvid or longvid
    function ValueIdentifier(position, name) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.name = name;
        return _this;
    }
    ValueIdentifier.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        var res = undefined;
        if (this.name instanceof tokens_1.LongIdentifierToken) {
            /* TODO
            let st = state.getAndResolveStaticStructure(<LongIdentifierToken> this.name);
            if (st !== undefined) {
                res = st.getValue((<LongIdentifierToken> this.name).id.getText());
            }
             */
        }
        else {
            res = state.getStaticValue(this.name.getText());
        }
        var mps = tyVarBnd;
        var bnd = false;
        if (res === undefined || res[1] === state_1.IdentifierStatus.VALUE_VARIABLE) {
            var tv = new types_1.TypeVariable('\'**' + this.name.getText());
            if (forceRebind) {
                res = [new types_1.TypeVariableBind('\'**' + this.name.getText(), tv), 0];
                bnd = true;
            }
            else if (tyVarBnd.has(tv.name)) {
                var tmp = tyVarBnd.get(tv.name)[0].instantiate(state, mps);
                return [tmp, [], nextName, tyVars, mps];
            }
            else if (res === undefined) {
                throw new errors_1.ElaborationError(this.position, 'Unbound value identifier "'
                    + this.name.getText() + '".');
            }
        }
        var vars = new Set();
        var frees = new Set();
        var repl = new Map();
        while (res[0] instanceof types_1.TypeVariableBind) {
            if (res[0].isFree) {
                frees = frees.add(res[0].name);
                repl.set(res[0].name, res[0].name);
            }
            else {
                vars = vars.add(res[0].name);
            }
            res[0] = res[0].type;
        }
        var nwvar = [];
        vars.forEach(function (val) {
            var cur = (+nextName.substring(2)) + 1;
            var nm = '';
            for (;; ++cur) {
                nextName = '\'' + nextName[1] + cur;
                if (!vars.has(nextName) && !tyVars.has(nextName) && !tyVarBnd.has(nextName)
                    && state.getStaticValue(nextName) === undefined) {
                    if (val[1] === '\'') {
                        nm = '\'' + nextName;
                    }
                    else {
                        nm = nextName;
                    }
                    nwvar.push(nm);
                    repl = repl.set(val, nm);
                    break;
                }
            }
        });
        for (var i = 0; i < nwvar.length; ++i) {
            tyVars = tyVars.add(nwvar[i]);
        }
        var r2 = res[0].replaceTypeVariables(repl, frees).instantiate(state, mps);
        if (bnd) {
            mps = mps.set('\'**' + this.name.getText(), [r2, false]);
        }
        return [r2, [], nextName, tyVars, mps];
    };
    ValueIdentifier.prototype.matchType = function (state, tyVarBnd, t) {
        if (this.name instanceof tokens_1.LongIdentifierToken) {
            throw new errors_1.ElaborationError(this.position, 'Variable names in patterns cannot be qualified.');
        }
        var res = state.getStaticValue(this.name.getText());
        if (res === undefined || res[1] === state_1.IdentifierStatus.VALUE_VARIABLE) {
            return [[[this.name.getText(), t.instantiate(state, tyVarBnd)]],
                t.instantiate(state, tyVarBnd), tyVarBnd];
        }
        var tmp = this.getType(state, tyVarBnd, '\'g0');
        tmp[3].forEach(function (val) {
            var nname = '\'p' + val.substring(2);
            if (val[1] === '\'') {
                nname = '\'\'p' + val.substring(3);
            }
            tmp[4] = tmp[4].set(val, [new types_1.TypeVariable(nname), false]);
        });
        res[0] = tmp[0];
        tyVarBnd = tmp[4];
        try {
            var rt = t.merge(state, tyVarBnd, res[0]);
            return [[], rt[0], rt[1]];
        }
        catch (e) {
            if (!(e instanceof Array)) {
                throw e;
            }
            throw new errors_1.ElaborationError(this.position, 'Type clash: "' + t + '" vs. "'
                + res[0] + '":\n' + e[0]);
        }
    };
    ValueIdentifier.prototype.matches = function (state, v) {
        if (this.name instanceof tokens_1.LongIdentifierToken) {
            throw new errors_1.EvaluationError(this.position, 'Variable names in patterns cannot be qualified.');
        }
        var res = state.getDynamicValue(this.name.getText());
        if (res === undefined || res[1] === state_1.IdentifierStatus.VALUE_VARIABLE) {
            return [[this.name.getText(), v]];
        }
        if (v.equals(res[0])) {
            return [];
        }
        return undefined;
    };
    ValueIdentifier.prototype.simplify = function () { return this; };
    ValueIdentifier.prototype.toString = function () {
        return this.name.getText();
    };
    ValueIdentifier.prototype.compute = function (state) {
        var res = undefined;
        if (this.name instanceof tokens_1.LongIdentifierToken) {
            var st = state.getAndResolveDynamicStructure(this.name);
            if (st !== undefined) {
                res = st.getValue(this.name.id.getText());
            }
        }
        else {
            res = state.getDynamicValue(this.name.getText());
        }
        if (res === undefined) {
            throw new errors_1.EvaluationError(this.position, 'Unbound value identifier "'
                + this.name.getText() + '".');
        }
        if (res[1] === state_1.IdentifierStatus.VALUE_CONSTRUCTOR
            && res[0].numArgs === 0) {
            return [res[0].construct(), false, [], []];
        }
        if (res[1] === state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR
            && res[0].numArgs === 0) {
            return [res[0].construct(), false, [], []];
        }
        return [res[0], false, [], []];
    };
    return ValueIdentifier;
}(Expression));
exports.ValueIdentifier = ValueIdentifier;
var Record = (function (_super) {
    __extends(Record, _super);
    // { lab = exp, ... } or { }
    // a record(pattern) is incomplete if it ends with '...'
    function Record(position, complete, entries) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.complete = complete;
        _this.entries = entries;
        _this.entries.sort();
        for (var i = 1; i < _this.entries.length; ++i) {
            if (_this.entries[i][0] === _this.entries[i - 1][0]) {
                throw new errors_1.ElaborationError(_this.position, 'Label "' + _this.entries[i][0] + '" occurs more than once in the same record.');
            }
        }
        return _this;
    }
    Record.prototype.isSafe = function (state) {
        for (var i = 0; i < this.entries.length; ++i) {
            if (!this.entries[i][1].isSafe(state)) {
                return false;
            }
        }
        return true;
    };
    Record.prototype.matchType = function (state, tyVarBnd, t) {
        if (!(t instanceof types_1.RecordType)) {
            t = t.instantiate(state, tyVarBnd);
        }
        if (t instanceof types_1.TypeVariable) {
            var ntype = new Map();
            for (var i = 0; i < this.entries.length; ++i) {
                var ntv = new types_1.TypeVariable(t.name + '*' + i);
                ntv.isFree = t.isFree;
                ntype = ntype.set(this.entries[i][0], ntv);
            }
            var tp = new types_1.RecordType(ntype, this.complete);
            tyVarBnd = tyVarBnd.set(t.name, [tp, t.isFree]);
            t = tp;
        }
        if (!(t instanceof types_1.RecordType)) {
            throw new errors_1.ElaborationError(this.position, 'Expected pattern of a record type, got "' + t.constructor.name + '".');
        }
        if (this.complete && this.entries.length !== t.elements.size) {
            throw new errors_1.ElaborationError(this.position, 'Expected a record type with ' + this.entries.length + ' entries,'
                + ' but the given one has ' + t.elements.size + '.');
        }
        var res = [];
        var rtp = new Map();
        var bnd = tyVarBnd;
        for (var i = 0; i < this.entries.length; ++i) {
            if (!t.hasType(this.entries[i][0])) {
                // TODO Better message
                throw new errors_1.ElaborationError(this.position, 'Elaboration failed.');
            }
            var cur = this.entries[i][1].matchType(state, bnd, t.getType(this.entries[i][0]));
            res = res.concat(cur[0]);
            rtp = rtp.set(this.entries[i][0], cur[1]);
            bnd = cur[2];
        }
        return [res, new types_1.RecordType(rtp), bnd];
    };
    Record.prototype.matches = function (state, v) {
        if (!(v instanceof values_1.RecordValue)) {
            return undefined;
        }
        if (this.complete && this.entries.length !== v.entries.size) {
            return undefined;
        }
        var res = [];
        for (var i = 0; i < this.entries.length; ++i) {
            if (!v.hasValue(this.entries[i][0])) {
                return undefined;
            }
            var cur = this.entries[i][1].matches(state, v.getValue(this.entries[i][0]));
            if (cur === undefined) {
                return cur;
            }
            for (var j = 0; j < cur.length; ++j) {
                res.push(cur[j]);
            }
        }
        return res;
    };
    Record.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        var e = new Map();
        var warns = [];
        var bnds = tyVarBnd;
        for (var i = 0; i < this.entries.length; ++i) {
            var name_1 = this.entries[i][0];
            var exp = this.entries[i][1];
            if (e.has(name_1)) {
                throw new errors_1.ElaborationError(this.position, 'Label "' + name_1 + '" occurs more than once in the same record.');
            }
            var tmp = exp.getType(state, bnds, nextName, tyVars, forceRebind);
            warns = warns.concat(tmp[1]);
            nextName = tmp[2];
            tyVars = tmp[3];
            tmp[4].forEach(function (val, key) {
                bnds = bnds.set(key, val);
            });
            e = e.set(name_1, tmp[0]);
        }
        return [new types_1.RecordType(e, this.complete), warns, nextName, tyVars, bnds];
    };
    Record.prototype.simplify = function () {
        var newEntries = [];
        for (var i = 0; i < this.entries.length; ++i) {
            var e = this.entries[i];
            newEntries.push([e[0], e[1].simplify()]);
        }
        return new Record(this.position, this.complete, newEntries);
    };
    Record.prototype.toString = function () {
        var result = '{';
        var first = true;
        for (var i = 0; i < this.entries.length; ++i) {
            if (!first) {
                result += ', ';
            }
            first = false;
            result += this.entries[i][0] + ' = '
                + this.entries[i][1];
        }
        if (!this.complete) {
            if (!first) {
                result += ', ';
            }
            result += '...';
        }
        return result + '}';
    };
    Record.prototype.compute = function (state) {
        var nentr = new Map();
        var warns = [];
        var membnd = [];
        for (var i = 0; i < this.entries.length; ++i) {
            var res = this.entries[i][1].compute(state);
            warns = warns.concat(res[2]);
            membnd = membnd.concat(res[3]);
            for (var j = 0; j < res[3].length; ++j) {
                state.setCell(res[3][j][0], res[3][j][1]);
            }
            if (res[1]) {
                // Computing some expression failed
                return [res[0], true, warns, membnd];
            }
            nentr = nentr.set(this.entries[i][0], res[0]);
        }
        return [new values_1.RecordValue(nentr), false, warns, membnd];
    };
    return Record;
}(Expression));
exports.Record = Record;
var LocalDeclarationExpression = (function (_super) {
    __extends(LocalDeclarationExpression, _super);
    // let dec in exp1; ...; expn end
    // A sequential expression exp1; ... ; expn is represented as such,
    // despite the potentially missing parentheses
    function LocalDeclarationExpression(position, declaration, expression) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.declaration = declaration;
        _this.expression = expression;
        return _this;
    }
    LocalDeclarationExpression.prototype.simplify = function () {
        return new LocalDeclarationExpression(this.position, this.declaration.simplify(), this.expression.simplify());
    };
    LocalDeclarationExpression.prototype.toString = function () {
        var res = 'let ' + this.declaration;
        res += ' in ' + this.expression + ' end';
        return res;
    };
    LocalDeclarationExpression.prototype.isSafe = function (state) {
        return this.expression.isSafe(state);
    };
    LocalDeclarationExpression.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        var nstate = state.getNestedState(state.id);
        tyVarBnd.forEach(function (val, key) {
            if (key[1] === '*' && key[2] === '*') {
                nstate.setStaticValue(key.substring(3), val[0].instantiate(state, tyVarBnd), state_1.IdentifierStatus.VALUE_VARIABLE);
            }
        });
        /*
    let nvbnd = new Map<string, [Type, boolean]>();
    let names = new Set<string>();
    tyVarBnd.forEach((val: [Type, boolean], key: string) => {
        nvbnd = nvbnd.set(key, val);
        if (key[1] === '*' && key[2] === '*') {
            names.add(key);
            val[0].getTypeVariables().forEach((v: string) => {
                names.add(v);
            });
        }

    });

         */
        var res = this.declaration.elaborate(nstate, tyVarBnd, nextName);
        nextName = res[3];
        var nbnds = new Map();
        tyVarBnd.forEach(function (val, key) {
            nbnds = nbnds.set(key, [val[0].instantiate(res[0], res[2]), val[1]]);
        });
        /*
    for (let i = 0; i < chg.length; ++i) {
        if ((<[Type, boolean]> tyVarBnd.get(chg[i][0]))[0].equals(
            (<[Type, boolean]> res[2].get(chg[i][0]))[0])) {
            // Make sure we're not using some type of some rebound identifier
            let tmp = chg[i][1][0].merge(nstate, tyVarBnd,
                chg[i][1][0].instantiate(nstate, res[2]));
            tyVarBnd = tmp[1];
        }
    }
            */
        var r2 = this.expression.getType(res[0], res[2], nextName, tyVars, forceRebind);
        return [r2[0], res[1].concat(r2[1]), r2[2], r2[3], r2[4]];
    };
    LocalDeclarationExpression.prototype.compute = function (state) {
        var nstate = state.getNestedState(0).getNestedState(state.id);
        var res = this.declaration.evaluate(nstate);
        var membnd = res[0].getMemoryChanges(0);
        if (res[1]) {
            return [res[2], true, res[3], membnd];
        }
        var nres = this.expression.compute(res[0]);
        return [nres[0], nres[1], res[3].concat(nres[2]), membnd.concat(nres[3])];
    };
    return LocalDeclarationExpression;
}(Expression));
exports.LocalDeclarationExpression = LocalDeclarationExpression;
var TypedExpression = (function (_super) {
    __extends(TypedExpression, _super);
    // expression: type (L)
    function TypedExpression(position, expression, typeAnnotation) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.expression = expression;
        _this.typeAnnotation = typeAnnotation;
        return _this;
    }
    TypedExpression.prototype.isSafe = function (state) {
        return this.expression.isSafe(state);
    };
    TypedExpression.prototype.matchType = function (state, tyVarBnd, t) {
        var tp = this.expression.matchType(state, tyVarBnd, t);
        try {
            var res = tp[1].merge(state, tp[2], this.typeAnnotation);
            for (var i = 0; i < tp[0].length; ++i) {
                tp[0][i][1] = tp[0][i][1].instantiate(state, res[1]);
            }
            return [tp[0], res[0], res[1]];
        }
        catch (e) {
            if (!(e instanceof Array)) {
                throw e;
            }
            throw new errors_1.ElaborationError(this.position, 'The annotated type "' + this.typeAnnotation
                + '" does not match the expression\'s type "'
                + tp[1] + '":\n' + e[0]);
        }
    };
    TypedExpression.prototype.matches = function (state, v) {
        return this.expression.matches(state, v);
    };
    TypedExpression.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        var tp = this.expression.getType(state, tyVarBnd, nextName, tyVars, forceRebind);
        try {
            var ann = this.typeAnnotation.instantiate(state, tyVarBnd);
            var tmp = tp[0].merge(state, tyVarBnd, ann);
            return [tmp[0], tp[1], tp[2], tp[3], tmp[1]];
        }
        catch (e) {
            if (!(e instanceof Array)) {
                throw e;
            }
            throw new errors_1.ElaborationError(this.position, 'The specified type "' + this.typeAnnotation
                + '" does not match the annotated expression\'s type "'
                + tp[0] + '":\n' + e[0] + ' ("' + e[1] + '" vs. "'
                + e[2] + '")');
        }
    };
    TypedExpression.prototype.simplify = function () {
        return new TypedExpression(this.position, this.expression.simplify(), this.typeAnnotation.simplify());
    };
    TypedExpression.prototype.toString = function () {
        var res = '( ' + this.expression;
        res += ': ' + this.typeAnnotation;
        return res + ' )';
    };
    TypedExpression.prototype.compute = function (state) {
        return this.expression.compute(state);
    };
    return TypedExpression;
}(Expression));
exports.TypedExpression = TypedExpression;
// May represent either a function application or a constructor with an argument
var FunctionApplication = (function (_super) {
    __extends(FunctionApplication, _super);
    // function argument
    function FunctionApplication(position, func, argument) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.func = func;
        _this.argument = argument;
        return _this;
    }
    FunctionApplication.prototype.isSafe = function (state) {
        if (!(this.func instanceof ValueIdentifier)) {
            return false;
        }
        var f = state.getStaticValue(this.func.name.getText());
        if (f === undefined) {
            return false;
        }
        return f[1] !== state_1.IdentifierStatus.VALUE_VARIABLE;
    };
    FunctionApplication.prototype.matchType = function (state, tyVarBnd, t) {
        /*
    if (t instanceof FunctionType) {
        throw new ElaborationError(this.position,
            'You simply cannot match function values.');
    } */
        if (!(this.func instanceof ValueIdentifier)) {
            // TODO Better message
            throw new errors_1.ElaborationError(this.position, 'Elaboration failed. 1');
        }
        // TODO Long identifier
        var ti = state.getStaticValue(this.func.name.getText());
        if (ti === undefined || ti[1] === state_1.IdentifierStatus.VALUE_VARIABLE) {
            throw new errors_1.ElaborationError(this.position, 'Unbound value Identifier "' + this.func.name.getText() + '".');
        }
        var tmp = this.func.getType(state, tyVarBnd, '\'g0');
        tmp[3].forEach(function (val) {
            var nname = '\'p' + val.substring(2);
            if (val[1] === '\'') {
                nname = '\'\'p' + val.substring(3);
            }
            tmp[4] = tmp[4].set(val, [new types_1.TypeVariable(nname), false]);
        });
        ti[0] = tmp[0];
        tyVarBnd = tmp[4];
        if (!(ti[0] instanceof types_1.FunctionType)) {
            // TODO Better message
            throw new errors_1.ElaborationError(this.position, 'Elaboration failed. 2');
        }
        try {
            var ft = ti[0];
            var mg = ft.returnType.merge(state, tyVarBnd, t);
            var res = this.argument.matchType(state, mg[1], ft.parameterType.instantiate(state, mg[1]));
            return [res[0], mg[0], res[2]];
        }
        catch (e) {
            if (!(e instanceof Array)) {
                throw e;
            }
            // TODO Better message
            throw new errors_1.ElaborationError(this.position, 'Merge failed:\n' + e[0]);
        }
    };
    FunctionApplication.prototype.matches = function (state, v) {
        if (v instanceof values_1.FunctionValue) {
            throw new errors_1.EvaluationError(this.position, 'You simply cannot match function values.');
        }
        else if (v instanceof values_1.ConstructedValue) {
            if (this.func instanceof ValueIdentifier
                && this.func.name.getText()
                    === v.constructorName
                && this.func.name.getText() !== 'ref') {
                if (v.argument !== undefined) {
                    return this.argument.matches(state, v.argument);
                }
                return [];
            }
            return undefined;
        }
        else if (v instanceof values_1.ExceptionValue) {
            if (this.func instanceof ValueIdentifier
                && this.func.name.getText()
                    === v.constructorName) {
                if (v.argument !== undefined) {
                    return this.argument.matches(state, v.argument);
                }
                return [];
            }
            return undefined;
        }
        else if (v instanceof values_1.PredefinedFunction) {
            throw new errors_1.EvaluationError(this.position, 'You simply cannot match predefined functions.');
        }
        else if (v instanceof values_1.ReferenceValue) {
            if (this.func instanceof ValueIdentifier
                && this.func.name.getText() === 'ref') {
                return this.argument.matches(state, state.getCell(v.address));
            }
            return undefined;
        }
        throw new errors_1.EvaluationError(this.position, 'Help me, I\'m broken. ('
            + v.constructor.name + ').');
    };
    FunctionApplication.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        var f = this.func.getType(state, tyVarBnd, nextName, tyVars, forceRebind);
        var arg = this.argument.getType(state, f[4], f[2], f[3], forceRebind);
        arg[4].forEach(function (val, key) {
            f[4] = f[4].set(key, val);
        });
        f[0] = f[0].instantiate(state, tyVarBnd);
        if (f[0] instanceof types_1.TypeVariable) {
            var tva = new types_1.TypeVariable(f[0].name + '*a');
            var tvb = new types_1.TypeVariable(f[0].name + '*b');
            tva.isFree = f[0].isFree;
            tvb.isFree = f[0].isFree;
            var ntype = new types_1.FunctionType(tva, tvb);
            f[4] = f[4].set(f[0].name, [ntype, f[0].isFree]);
            f[0] = ntype;
        }
        if (f[0] instanceof types_1.AnyType) {
            f[0] = new types_1.FunctionType(new types_1.AnyType(), new types_1.AnyType());
        }
        if (f[0] instanceof types_1.FunctionType) {
            try {
                var tp = f[0].parameterType.merge(state, f[4], arg[0]);
                return [f[0].returnType.instantiate(state, tp[1]),
                    f[1].concat(arg[1]), arg[2], arg[3], tp[1]];
            }
            catch (e) {
                if (!(e instanceof Array)) {
                    throw e;
                }
                throw new errors_1.ElaborationError(this.position, 'Do not feed functions of type "' + f[0]
                    + '" an argument of type "' + arg[0] + '":\n'
                    + e[0] + ' ("' + e[1] + '" vs. "' + e[2] + '")');
            }
        }
        else {
            throw new errors_1.ElaborationError(this.func.position, '"' + this.func + '" of type "'
                + f[0] + '" is not a function.');
        }
    };
    FunctionApplication.prototype.simplify = function () {
        return new FunctionApplication(this.position, this.func.simplify(), this.argument.simplify());
    };
    FunctionApplication.prototype.toString = function () {
        var res = '( ' + this.func;
        res += ' ' + this.argument;
        return res + ' )';
    };
    FunctionApplication.prototype.compute = function (state) {
        if (this.func instanceof ValueIdentifier) {
            if (this.func.name.getText() === 'ref') {
                var aVal = this.argument.compute(state);
                if (aVal[1]) {
                    return [aVal[0], true, aVal[2], aVal[3]];
                }
                for (var i = 0; i < aVal[3].length; ++i) {
                    state.setCell(aVal[3][i][0], aVal[3][i][1]);
                }
                var res = state.setNewCell(aVal[0]);
                aVal[3].push([res.address, aVal[0]]);
                return [res, false, aVal[2], aVal[3]];
            }
            else if (this.func.name.getText() === ':=') {
                var aVal = this.argument.compute(state);
                if (aVal[1]) {
                    return [aVal[0], true, aVal[2], aVal[3]];
                }
                for (var i = 0; i < aVal[3].length; ++i) {
                    state.setCell(aVal[3][i][0], aVal[3][i][1]);
                }
                if ((!(aVal[0] instanceof values_1.RecordValue))
                    || (!(aVal[0].getValue('1') instanceof values_1.ReferenceValue))) {
                    throw new errors_1.EvaluationError(this.position, 'That\'s not how ":=" works.');
                }
                aVal[3].push([aVal[0].getValue('1').address,
                    aVal[0].getValue('2')]);
                return [new values_1.RecordValue(), false, aVal[2], aVal[3]];
            }
            else if (this.func.name.getText() === '!') {
                var aVal = this.argument.compute(state);
                if (aVal[1]) {
                    return [aVal[0], true, aVal[2], aVal[3]];
                }
                for (var i = 0; i < aVal[3].length; ++i) {
                    state.setCell(aVal[3][i][0], aVal[3][i][1]);
                }
                if (!(aVal[0] instanceof values_1.ReferenceValue)) {
                    throw new errors_1.EvaluationError(this.position, 'You cannot dereference "' + this.argument + '".');
                }
                return [state.getCell(aVal[0].address), false, aVal[2], aVal[3]];
            }
        }
        var funcVal = this.func.compute(state);
        if (funcVal[1]) {
            // computing the function failed
            return funcVal;
        }
        for (var i = 0; i < funcVal[3].length; ++i) {
            state.setCell(funcVal[3][i][0], funcVal[3][i][1]);
        }
        var argVal = this.argument.compute(state);
        var warns = funcVal[2].concat(argVal[2]);
        var membnd = funcVal[3].concat(argVal[3]);
        if (argVal[1]) {
            return [argVal[0], true, warns, membnd];
        }
        if (funcVal[0] instanceof values_1.FunctionValue) {
            for (var i = 0; i < argVal[3].length; ++i) {
                state.setCell(argVal[3][i][0], argVal[3][i][1]);
            }
            var nmem = [];
            for (var i = 0; i < state.memory[0]; ++i) {
                if (state.getCell(i) !== undefined) {
                    nmem.push([i, state.getCell(i)]);
                }
            }
            var res = funcVal[0].compute(argVal[0], nmem);
            return [res[0], res[1], warns.concat(res[2]), membnd.concat(res[3])];
        }
        else if (funcVal[0] instanceof values_1.ValueConstructor) {
            return [funcVal[0].construct(argVal[0]), false, warns, membnd];
        }
        else if (funcVal[0] instanceof values_1.ExceptionConstructor) {
            return [funcVal[0].construct(argVal[0]), false, warns, membnd];
        }
        else if (funcVal[0] instanceof values_1.PredefinedFunction) {
            var res = funcVal[0].apply(argVal[0]);
            return [res[0], res[1], warns.concat(res[2]), membnd];
        }
        throw new errors_1.EvaluationError(this.position, 'Cannot evaluate the function "'
            + this.func + '" (' + funcVal[0].constructor.name + ').');
    };
    return FunctionApplication;
}(Expression));
exports.FunctionApplication = FunctionApplication;
var HandleException = (function (_super) {
    __extends(HandleException, _super);
    // expression handle match
    function HandleException(position, expression, match) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.expression = expression;
        _this.match = match;
        return _this;
    }
    HandleException.prototype.isSafe = function (state) {
        return this.expression.isSafe(state);
    };
    HandleException.prototype.simplify = function () {
        return new HandleException(this.position, this.expression.simplify(), this.match.simplify());
    };
    HandleException.prototype.toString = function () {
        var res = '( ( ' + this.expression + ' )';
        res += ' handle ' + this.match + ' )';
        return res;
    };
    HandleException.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        var mtp = this.match.getType(state, tyVarBnd, nextName, tyVars, forceRebind);
        if ((!(mtp[0] instanceof types_1.FunctionType))
            || !mtp[0].parameterType.equals(new types_1.CustomType('exn'))) {
            throw new errors_1.ElaborationError(this.match.position, 'You can only handle things of type "exn" and not "'
                + mtp[0].parameterType + '".');
        }
        var rt = mtp[0].returnType;
        var etp = this.expression.getType(state, mtp[4], mtp[2], mtp[3], forceRebind);
        try {
            var res = rt.merge(state, etp[4], etp[0]);
            return [res[0], mtp[1].concat(etp[1]), etp[2], etp[3], res[1]];
        }
        catch (e) {
            if (!(e instanceof Array)) {
                throw e;
            }
            throw new errors_1.ElaborationError(this.expression.position, 'The "handle" cannot change the type of the expression from "'
                + etp[0] + '" to "' + rt + '":\n' + e[0]);
        }
    };
    HandleException.prototype.compute = function (state) {
        var res = this.expression.compute(state);
        if (res[1]) {
            for (var i = 0; i < res[3].length; ++i) {
                state.setCell(res[3][i][0], res[3][i][1]);
            }
            var next = this.match.compute(state, res[0]);
            if (!next[1] || !next[0].equals(new values_1.ExceptionValue('Match', undefined, 0))) {
                // Exception got handled
                return [next[0], next[1], res[2].concat(next[2]), res[3].concat(next[3])];
            }
            res[2] = res[2].concat(next[2]);
            res[3] = res[3].concat(next[3]);
        }
        return res;
    };
    return HandleException;
}(Expression));
exports.HandleException = HandleException;
var RaiseException = (function (_super) {
    __extends(RaiseException, _super);
    // raise expression
    function RaiseException(position, expression) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.expression = expression;
        return _this;
    }
    RaiseException.prototype.simplify = function () {
        return new RaiseException(this.position, this.expression.simplify());
    };
    RaiseException.prototype.isSafe = function (state) {
        return this.expression.isSafe(state);
    };
    RaiseException.prototype.toString = function () {
        return 'raise ' + this.expression;
    };
    RaiseException.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        var res = this.expression.getType(state, tyVarBnd, nextName, tyVars, forceRebind);
        try {
            var mg = res[0].merge(state, tyVarBnd, new types_1.CustomType('exn'));
            return [new types_1.AnyType(), res[1], res[2], res[3], mg[1]];
        }
        catch (e) {
            if (!(e instanceof Array)) {
                throw e;
            }
            throw new errors_1.ElaborationError(this.expression.position, 'Raising anything but exceptions will only raise exceptions:\n' + e[0]);
        }
    };
    RaiseException.prototype.compute = function (state) {
        var res = this.expression.compute(state);
        if (!(res[0] instanceof values_1.ExceptionValue)) {
            throw new errors_1.EvaluationError(this.position, 'Cannot "raise" value of type "' + res.constructor.name
                + '" (type must be "exn").');
        }
        return [res[0], true, res[2], res[3]];
    };
    return RaiseException;
}(Expression));
exports.RaiseException = RaiseException;
var Lambda = (function (_super) {
    __extends(Lambda, _super);
    // fn match
    function Lambda(position, match) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.match = match;
        return _this;
    }
    Lambda.prototype.simplify = function () {
        return new Lambda(this.position, this.match.simplify());
    };
    Lambda.prototype.toString = function () {
        return '( fn ' + this.match + ' )';
    };
    Lambda.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        return this.match.getType(state, tyVarBnd, nextName, tyVars, forceRebind);
    };
    Lambda.prototype.compute = function (state) {
        // We need to ensure that the function value receives a capture
        // of the current state, and that that capture stays that way
        // (Local declarations may change the past, so we must record that, too.
        var nstate = initialState_ts_1.getInitialState().getNestedState(state.id);
        nstate.dynamicBasis = state.getDynamicChanges(-1);
        return [new values_1.FunctionValue(nstate, [], this.match), false, [], []];
    };
    return Lambda;
}(Expression));
exports.Lambda = Lambda;
// Matches
var Match = (function () {
    // pat => exp or pat => exp | match
    function Match(position, matches) {
        this.position = position;
        this.matches = matches;
    }
    Match.prototype.toString = function () {
        var res = '';
        for (var i = 0; i < this.matches.length; ++i) {
            if (i > 0) {
                res += ' | ';
            }
            res += this.matches[i][0];
            res += ' => ' + this.matches[i][1];
        }
        return res;
    };
    Match.prototype.compute = function (state, value) {
        for (var i = 0; i < this.matches.length; ++i) {
            var nstate = state.getNestedState(state.id);
            var res = this.matches[i][0].matches(nstate, value);
            if (res !== undefined) {
                for (var j = 0; j < res.length; ++j) {
                    nstate.setDynamicValue(res[j][0], res[j][1], state_1.IdentifierStatus.VALUE_VARIABLE);
                }
                return this.matches[i][1].compute(nstate);
            }
        }
        return [new values_1.ExceptionValue('Match', undefined, 0), true, [], []];
    };
    Match.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        var restp = new types_1.FunctionType(new types_1.AnyType(), new types_1.AnyType());
        var warns = [];
        var bnds = tyVarBnd;
        var _loop_1 = function (i) {
            var nmap = new Map();
            bnds.forEach(function (val, key) {
                nmap = nmap.set(key, val);
            });
            var r1 = this_1.matches[i][0].getType(state, bnds, nextName, tyVars, true);
            warns = warns.concat(r1[1]);
            var r2 = this_1.matches[i][1].getType(state, r1[4], r1[2], r1[3], forceRebind);
            warns = warns.concat(r2[1]);
            nextName = r2[2];
            tyVars = r2[3];
            var rtp = new types_1.FunctionType(r1[0], r2[0]);
            try {
                _a = restp.merge(state, r2[4], rtp), restp = _a[0], bnds = _a[1];
            }
            catch (e) {
                if (!(e instanceof Array)) {
                    throw e;
                }
                throw new errors_1.ElaborationError(this_1.position, 'Match rules disagree on type:\n' + e[0] + ' ("' + e[1]
                    + '" vs. "' + e[2] + '")');
            }
            restp = restp.instantiate(state, r2[4]);
            bnds.forEach(function (val, key) {
                if (key[1] !== '*' || key[2] !== '*') {
                    nmap = nmap.set(key, val);
                }
            });
            bnds = nmap;
            var _a;
        };
        var this_1 = this;
        for (var i = 0; i < this.matches.length; ++i) {
            _loop_1(i);
        }
        return [restp, warns, nextName, tyVars, bnds];
    };
    Match.prototype.simplify = function () {
        var newMatches = [];
        for (var i = 0; i < this.matches.length; ++i) {
            var m = this.matches[i];
            newMatches.push([m[0].simplify(), m[1].simplify()]);
        }
        return new Match(this.position, newMatches);
    };
    return Match;
}());
exports.Match = Match;
// Pure Patterns
var Wildcard = (function (_super) {
    __extends(Wildcard, _super);
    function Wildcard(position) {
        var _this = _super.call(this) || this;
        _this.position = position;
        return _this;
    }
    Wildcard.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        return [new types_1.AnyType(), [], nextName, tyVars, tyVarBnd];
    };
    Wildcard.prototype.compute = function (state) {
        throw new errors_1.InternalInterpreterError(this.position, 'Wildcards are far too wild to have a value.');
    };
    Wildcard.prototype.matchType = function (state, tyVarBnd, t) {
        return [[], t, tyVarBnd];
    };
    Wildcard.prototype.matches = function (state, v) {
        return [];
    };
    Wildcard.prototype.simplify = function () {
        return this;
    };
    Wildcard.prototype.toString = function () {
        return '_';
    };
    return Wildcard;
}(Expression));
exports.Wildcard = Wildcard;
var LayeredPattern = (function (_super) {
    __extends(LayeredPattern, _super);
    // <op> identifier <:type> as pattern
    function LayeredPattern(position, identifier, typeAnnotation, pattern) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.identifier = identifier;
        _this.typeAnnotation = typeAnnotation;
        _this.pattern = pattern;
        return _this;
    }
    LayeredPattern.prototype.getType = function (state, tyVarBnd, nextName, tyVars, forceRebind) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        if (tyVars === void 0) { tyVars = new Set(); }
        if (forceRebind === void 0) { forceRebind = false; }
        if (!forceRebind) {
            throw new errors_1.InternalInterpreterError(this.position, 'Layered patterns are far too layered to have a type.');
        }
        var valid = new ValueIdentifier(-1, this.identifier);
        var gtp = valid.getType(state, tyVarBnd, nextName, tyVars, true);
        var tp = gtp[0];
        if (this.typeAnnotation !== undefined) {
            try {
                var mg = tp.merge(state, gtp[4], this.typeAnnotation);
                tyVarBnd = mg[1];
                tp = mg[0];
            }
            catch (e) {
                if (!(e instanceof Array)) {
                    throw e;
                }
                throw new errors_1.ElaborationError(this.position, 'Wrong type annotation:\n' + e[0]);
            }
        }
        var argtp = this.pattern.getType(state, tyVarBnd, gtp[2], gtp[3], true);
        try {
            var mg = tp.merge(state, argtp[4], argtp[0]);
            tyVarBnd = mg[1];
            tp = mg[0];
        }
        catch (e) {
            if (!(e instanceof Array)) {
                throw e;
            }
            throw new errors_1.ElaborationError(this.position, 'Wrong type annotation:\n' + e[0]);
        }
        return [tp, gtp[1].concat(argtp[1]), argtp[2], argtp[3], tyVarBnd];
    };
    LayeredPattern.prototype.compute = function (state) {
        throw new errors_1.InternalInterpreterError(this.position, 'Layered patterns are far too layered to have a value.');
    };
    LayeredPattern.prototype.matchType = function (state, tyVarBnd, t) {
        var tp = t;
        if (this.typeAnnotation !== undefined) {
            try {
                var mg = t.merge(state, tyVarBnd, this.typeAnnotation);
                tyVarBnd = mg[1];
                tp = mg[0];
            }
            catch (e) {
                if (!(e instanceof Array)) {
                    throw e;
                }
                throw new errors_1.ElaborationError(this.position, 'Wrong type annotation:\n' + e[0]);
            }
        }
        var res = this.pattern.matchType(state, tyVarBnd, tp);
        var result = [[this.identifier.getText(), tp]];
        return [result.concat(res[0]), t, res[2]];
    };
    LayeredPattern.prototype.matches = function (state, v) {
        var res = this.pattern.matches(state, v);
        if (res === undefined) {
            return res;
        }
        var result = [[this.identifier.getText(), v]];
        return result.concat(res);
    };
    LayeredPattern.prototype.simplify = function () {
        if (this.typeAnnotation) {
            return new LayeredPattern(this.position, this.identifier, this.typeAnnotation.simplify(), this.pattern.simplify());
        }
        else {
            return new LayeredPattern(this.position, this.identifier, undefined, this.pattern.simplify());
        }
    };
    LayeredPattern.prototype.toString = function () {
        return this.identifier.getText() + ' as ' + this.pattern;
    };
    return LayeredPattern;
}(Expression));
exports.LayeredPattern = LayeredPattern;
// The following classes are derived forms.
// They will not be present in the simplified AST and do not implement elaborate/getType
var InfixExpression = (function (_super) {
    __extends(InfixExpression, _super);
    // operators: (op, idx), to simplify simplify
    function InfixExpression(expressions, operators) {
        var _this = _super.call(this) || this;
        _this.expressions = expressions;
        _this.operators = operators;
        return _this;
    }
    InfixExpression.prototype.matchType = function (state, tyVarBnd, t) {
        return this.reParse(state).matchType(state, tyVarBnd, t);
    };
    InfixExpression.prototype.matches = function (state, v) {
        return this.reParse(state).matches(state, v);
    };
    InfixExpression.prototype.simplify = function () {
        throw new errors_1.InternalInterpreterError(this.position, 'Ouch, I\'m not fully parsed.');
    };
    InfixExpression.prototype.reParse = function (state) {
        var ops = this.operators;
        var exps = this.expressions;
        var poses = [];
        for (var i = 0; i < exps.length; ++i) {
            poses.push([i]);
        }
        ops.sort(function (_a, _b) {
            var a = _a[0], p1 = _a[1];
            var b = _b[0], p2 = _b[1];
            var sta = state.getInfixStatus(a);
            var stb = state.getInfixStatus(b);
            if (sta.precedence > stb.precedence) {
                return -1;
            }
            if (sta.precedence < stb.precedence) {
                return 1;
            }
            if (sta.rightAssociative) {
                if (p1 > p2) {
                    return -1;
                }
                if (p1 < p2) {
                    return 1;
                }
            }
            else {
                if (p1 > p2) {
                    return 1;
                }
                if (p1 < p2) {
                    return -1;
                }
            }
            return 0;
        });
        // Using copy by reference to make this work whithout shrinking the array
        for (var i = 0; i < ops.length; ++i) {
            if (i > 0) {
                var info1 = state.getInfixStatus(ops[i][0]);
                var info2 = state.getInfixStatus(ops[i - 1][0]);
                if (info1.precedence === info2.precedence
                    && info1.rightAssociative !== info2.rightAssociative
                    && (poses[ops[i - 1][1] + 1] === poses[ops[i][1]]
                        || poses[ops[i - 1][1]] === poses[ops[i][1] + 1])) {
                    throw new errors_1.ParserError('Could you ever imagine left associatives '
                        + 'and right associatives living together in peace?', ops[i][0].position);
                }
            }
            var left = exps[ops[i][1]];
            var right = exps[ops[i][1] + 1];
            var com = new FunctionApplication(ops[i][0].position, new ValueIdentifier(ops[i][0].position, ops[i][0]), new Tuple(ops[i][0].position, [left, right]));
            var npos = poses[ops[i][1]];
            for (var _i = 0, _a = poses[ops[i][1] + 1]; _i < _a.length; _i++) {
                var j = _a[_i];
                npos.push(j);
            }
            for (var _b = 0, npos_1 = npos; _b < npos_1.length; _b++) {
                var j = npos_1[_b];
                poses[j] = npos;
                exps[j] = com;
            }
        }
        return exps[0];
    };
    return InfixExpression;
}(Expression));
exports.InfixExpression = InfixExpression;
var falseConstant = new ValueIdentifier(0, new tokens_1.IdentifierToken('false', 0));
var trueConstant = new ValueIdentifier(0, new tokens_1.IdentifierToken('true', 0));
var nilConstant = new ValueIdentifier(0, new tokens_1.IdentifierToken('nil', 0));
var consConstant = new ValueIdentifier(0, new tokens_1.IdentifierToken('::', 0));
var Conjunction = (function (_super) {
    __extends(Conjunction, _super);
    // leftOperand andalso rightOperand
    function Conjunction(position, leftOperand, rightOperand) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.leftOperand = leftOperand;
        _this.rightOperand = rightOperand;
        return _this;
    }
    Conjunction.prototype.simplify = function () {
        return new Conditional(this.position, this.leftOperand, this.rightOperand, falseConstant).simplify();
    };
    Conjunction.prototype.toString = function () {
        return '( ' + this.leftOperand + ' andalso '
            + this.rightOperand + ' )';
    };
    return Conjunction;
}(Expression));
exports.Conjunction = Conjunction;
var Disjunction = (function (_super) {
    __extends(Disjunction, _super);
    // leftOperand orelse rightOperand
    function Disjunction(position, leftOperand, rightOperand) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.leftOperand = leftOperand;
        _this.rightOperand = rightOperand;
        return _this;
    }
    Disjunction.prototype.simplify = function () {
        return new Conditional(this.position, this.leftOperand, trueConstant, this.rightOperand).simplify();
    };
    Disjunction.prototype.toString = function () {
        return '( ' + this.leftOperand + ' orelse '
            + this.rightOperand + ' )';
    };
    return Disjunction;
}(Expression));
exports.Disjunction = Disjunction;
var Tuple = (function (_super) {
    __extends(Tuple, _super);
    // (exp1, ..., expn), n > 1
    function Tuple(position, expressions) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.expressions = expressions;
        return _this;
    }
    Tuple.prototype.matchType = function (state, tyVarBnd, t) {
        return this.simplify().matchType(state, tyVarBnd, t);
    };
    Tuple.prototype.matches = function (state, v) {
        return this.simplify().matches(state, v);
    };
    Tuple.prototype.simplify = function () {
        var entries = [];
        for (var i = 0; i < this.expressions.length; ++i) {
            entries.push(['' + (i + 1), this.expressions[i].simplify()]);
        }
        return new Record(this.position, true, entries);
    };
    Tuple.prototype.toString = function () {
        var res = '( ';
        for (var i = 0; i < this.expressions.length; ++i) {
            if (i > 0) {
                res += ', ';
            }
            res += this.expressions[i];
        }
        return res + ' )';
    };
    return Tuple;
}(Expression));
exports.Tuple = Tuple;
var List = (function (_super) {
    __extends(List, _super);
    // [exp1, ..., expn]
    function List(position, expressions) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.expressions = expressions;
        return _this;
    }
    List.prototype.matchType = function (state, tyVarBnd, t) {
        return this.simplify().matchType(state, tyVarBnd, t);
    };
    List.prototype.matches = function (state, v) {
        return this.simplify().matches(state, v);
    };
    List.prototype.simplify = function () {
        var res = nilConstant;
        for (var i = this.expressions.length - 1; i >= 0; --i) {
            var pair = new Tuple(-1, [this.expressions[i], res]).simplify();
            res = new FunctionApplication(-1, consConstant, pair);
        }
        return res;
    };
    List.prototype.toString = function () {
        var res = '[ ';
        for (var i = 0; i < this.expressions.length; ++i) {
            if (i > 0) {
                res += ', ';
            }
            res += this.expressions[i];
        }
        return res + ' ]';
    };
    return List;
}(Expression));
exports.List = List;
var Sequence = (function (_super) {
    __extends(Sequence, _super);
    // (exp1; ...; expn), n >= 2
    function Sequence(position, expressions) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.expressions = expressions;
        return _this;
    }
    Sequence.prototype.simplify = function () {
        var pos = this.expressions.length - 1;
        var match = new Match(-1, [[new Wildcard(0), this.expressions[pos]]]);
        var res = new CaseAnalysis(-1, this.expressions[pos - 1], match);
        for (var i = pos - 2; i >= 0; --i) {
            match = new Match(-1, [[new Wildcard(0), res]]);
            res = new CaseAnalysis(-1, this.expressions[i], match);
        }
        return res.simplify();
    };
    Sequence.prototype.toString = function () {
        var res = '( ';
        for (var i = 0; i < this.expressions.length; ++i) {
            if (i > 0) {
                res += '; ';
            }
            res += this.expressions[i];
        }
        return res + ' )';
    };
    return Sequence;
}(Expression));
exports.Sequence = Sequence;
var RecordSelector = (function (_super) {
    __extends(RecordSelector, _super);
    // #label record
    function RecordSelector(position, label) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.label = label;
        return _this;
    }
    RecordSelector.prototype.simplify = function () {
        return new Lambda(this.position, new Match(-1, [[
                new Record(-1, false, [[this.label.text, new ValueIdentifier(-1, new tokens_1.IdentifierToken('__rs', -1))]]),
                new ValueIdentifier(-1, new tokens_1.IdentifierToken('__rs', -1))
            ]]));
    };
    RecordSelector.prototype.toString = function () {
        return '#' + this.label.getText();
    };
    return RecordSelector;
}(Expression));
exports.RecordSelector = RecordSelector;
var CaseAnalysis = (function (_super) {
    __extends(CaseAnalysis, _super);
    // case expression of match
    function CaseAnalysis(position, expression, match) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.expression = expression;
        _this.match = match;
        return _this;
    }
    CaseAnalysis.prototype.simplify = function () {
        return new FunctionApplication(this.position, new Lambda(this.position, this.match.simplify()), this.expression.simplify());
    };
    CaseAnalysis.prototype.toString = function () {
        return 'case ' + this.expression + ' of ' + this.match;
    };
    return CaseAnalysis;
}(Expression));
exports.CaseAnalysis = CaseAnalysis;
var Conditional = (function (_super) {
    __extends(Conditional, _super);
    // if condition then consequence else alternative
    function Conditional(position, condition, consequence, alternative) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.condition = condition;
        _this.consequence = consequence;
        _this.alternative = alternative;
        return _this;
    }
    Conditional.prototype.simplify = function () {
        var match = new Match(this.position, [[trueConstant, this.consequence],
            [falseConstant, this.alternative]]);
        return new CaseAnalysis(this.position, this.condition, match).simplify();
    };
    Conditional.prototype.toString = function () {
        return 'if ' + this.condition + ' then ' + this.consequence + ' else ' + this.alternative;
    };
    return Conditional;
}(Expression));
exports.Conditional = Conditional;
var While = (function (_super) {
    __extends(While, _super);
    // while exp do exp
    function While(position, condition, body) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.condition = condition;
        _this.body = body;
        return _this;
    }
    While.prototype.simplify = function () {
        var nm = new ValueIdentifier(this.position, new tokens_1.IdentifierToken('__whl', this.position));
        var fapp = new FunctionApplication(this.position, nm, new Tuple(this.position, []));
        var cond = new Conditional(this.position, this.condition, new Sequence(this.position, [this.body, fapp]), new Tuple(this.position, []));
        var valbnd = new declarations_1.ValueBinding(this.position, true, nm, new Lambda(this.position, new Match(this.position, [[new Tuple(this.position, []), cond]])));
        var dec = new declarations_1.ValueDeclaration(this.position, [], [valbnd]);
        return new LocalDeclarationExpression(this.position, dec, fapp).simplify();
    };
    While.prototype.toString = function () {
        return '( while ' + this.condition + ' do ' + this.body + ' )';
    };
    return While;
}(Expression));
exports.While = While;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*

This file is the main entry point for the interpreter.
It should only contain logic required to provide the API to the frontend (backend).
All required modules should be included at the top, for example if the main interpreter class
is located in the file interpreter.ts:

import Interpreter = require("./interpreter");
// Do stuff with Interpreter
let instance = new Interpreter();
let AST = instance.lexParse(..code..);
...

*/
Object.defineProperty(exports, "__esModule", { value: true });
var initialState_1 = __webpack_require__(5);
var stdlib_1 = __webpack_require__(11);
var tokens_1 = __webpack_require__(1);
var Lexer = __webpack_require__(9);
var Parser = __webpack_require__(10);
function interpret(nextInstruction, oldState, options) {
    if (oldState === void 0) { oldState = initialState_1.getInitialState(); }
    if (options === void 0) { options = {
        'allowLongFunctionNames': false,
        'allowUnicodeInStrings': false,
        'allowSuccessorML': false,
        'disableElaboration': false
    }; }
    var state = oldState.getNestedState();
    var tkn = Lexer.lex(nextInstruction, options);
    if (options.allowLongFunctionNames) {
        var newTkn = [];
        for (var _i = 0, tkn_1 = tkn; _i < tkn_1.length; _i++) {
            var t = tkn_1[_i];
            if (t instanceof tokens_1.LongIdentifierToken) {
                newTkn.push(new tokens_1.IdentifierToken(t.getText(), t.position));
            }
            else {
                newTkn.push(t);
            }
        }
        tkn = newTkn;
    }
    var ast = Parser.parse(tkn, state, options);
    state = oldState.getNestedState();
    ast = ast.simplify();
    if (options.disableElaboration === true) {
        var tmp = ast.evaluate(oldState.getNestedState() /* , options */);
        return {
            'state': tmp[0],
            'evaluationErrored': tmp[1],
            'error': tmp[2],
            'warnings': tmp[3]
        };
    }
    var elab = ast.elaborate(state, new Map(), '\'t0', true);
    state = elab[0];
    // Use a fresh state to be able to piece types and values together
    var res = ast.evaluate(oldState.getNestedState() /* , options */);
    for (var i = 0; i < elab[1].length; ++i) {
        res[3].push(elab[1][i]);
    }
    if (res[1]) {
        return {
            'state': res[0],
            'evaluationErrored': true,
            'error': res[2],
            'warnings': res[3]
        };
    }
    var curState = res[0];
    while (curState.id > oldState.id) {
        if (curState.dynamicBasis !== undefined) {
            curState.freeTypeVariables = state.getTypeVariableBinds(curState.id);
            // For every new bound value, try to find its type
            for (var i in curState.dynamicBasis.valueEnvironment) {
                if (Object.prototype.hasOwnProperty.call(curState.dynamicBasis.valueEnvironment, i)) {
                    var tp = state.getStaticValue(i, curState.id);
                    if (tp !== undefined) {
                        curState.setStaticValue(i, tp[0], tp[1]);
                    }
                }
            }
            // For every new bound type, try to find its type
            for (var i in curState.dynamicBasis.typeEnvironment) {
                if (Object.prototype.hasOwnProperty.call(curState.dynamicBasis.typeEnvironment, i)) {
                    var tp = state.getStaticType(i, curState.id);
                    if (tp !== undefined) {
                        curState.setStaticType(i, tp.type, tp.constructors, tp.arity);
                    }
                }
            }
        }
        if (state.parent === undefined) {
            break;
        }
        curState = curState.parent;
        while (state.id > curState.id && state.parent !== undefined) {
            state = state.parent;
        }
    }
    return {
        'state': res[0],
        'evaluationErrored': false,
        'error': res[2],
        'warnings': res[3]
    };
}
exports.interpret = interpret;
function getFirstState(withStdLib) {
    if (withStdLib) {
        return stdlib_1.addStdLib(initialState_1.getInitialState(), {
            'allowLongFunctionNames': true
        });
    }
    return initialState_1.getInitialState();
}
exports.getFirstState = getFirstState;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * TODO: Documentation for the lexer
 */
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = __webpack_require__(0);
var tokens_1 = __webpack_require__(1);
// TODO: maybe these should be static class members
var reservedWords = new Set([
    'abstype', 'and', 'andalso', 'as', 'case', 'datatype', 'do', 'else', 'end', 'exception', 'fn', 'fun', 'handle',
    'if', 'in', 'infix', 'infixr', 'let', 'local', 'nonfix', 'of', 'op', 'open', 'orelse', 'raise', 'rec', 'then',
    'type', 'val', 'with', 'withtype', 'while',
    '(', ')', '[', ']', '{', '}', ',', ':', ';', '...', '_', '|', '=', '=>', '->', '#',
    'eqtype', 'functor', 'signature', 'struct', 'include', 'sharing', 'structure', 'where', 'sig', ':>'
]);
var symbolicCharacters = new Set([
    '!', '%', '&', '$', '#', '+', '-', '/', ':', '<', '=', '>', '?', '@', '\\', '~', '`', '^', '|', '*'
]);
var Lexer = (function () {
    function Lexer(input, options) {
        this.input = input;
        this.options = options;
        this.position = 0;
        this.skipWhitespaceAndComments();
    }
    // TODO proper support for >= 256 chars
    Lexer.isAlphanumeric = function (c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '\'' || c === '_';
    };
    Lexer.isSymbolic = function (c) {
        return symbolicCharacters.has(c);
    };
    Lexer.isWhitespace = function (c) {
        return c === ' ' || c === '\t' || c === '\n' || c === '\f';
    };
    Lexer.isNumber = function (c, hexadecimal) {
        return (c >= '0' && c <= '9') || (hexadecimal && ((c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')));
    };
    Lexer.prototype.consumeChar = function (errorMessageOnEOF, errornumberOnEOF) {
        if (errorMessageOnEOF === void 0) { errorMessageOnEOF = ''; }
        if (errornumberOnEOF === void 0) { errornumberOnEOF = this.input.length - 1; }
        if (this.position >= this.input.length) {
            if (errorMessageOnEOF === '') {
                throw new errors_1.IncompleteError(errornumberOnEOF);
            }
            else {
                throw new errors_1.IncompleteError(errornumberOnEOF, errorMessageOnEOF);
            }
        }
        ++this.position;
        return this.input.charAt(this.position - 1);
    };
    Lexer.prototype.getChar = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (this.position + offset >= this.input.length) {
            // This must be any character that has no syntactic meaning in SML. It may not be counted as whitespace.
            return '\x04'; // End of Transmission character
        }
        else {
            return this.input.charAt(this.position + offset);
        }
    };
    Lexer.prototype.skipWhitespace = function () {
        while (Lexer.isWhitespace(this.getChar())) {
            ++this.position;
        }
    };
    Lexer.prototype.skipWhitespaceAndComments = function () {
        var oldnumber;
        do {
            oldnumber = this.position;
            this.skipWhitespace();
            while (this.position + 1 < this.input.length && this.input.substr(this.position, 2) === '(*') {
                var commentStart = this.position;
                this.position += 2;
                var openComments = 1;
                while (openComments > 0) {
                    if (this.position > this.input.length - 2) {
                        throw new errors_1.IncompleteError(commentStart, 'unclosed comment');
                    }
                    var s = this.input.substr(this.position, 2);
                    if (s === '(*') {
                        ++openComments;
                        ++this.position;
                    }
                    else if (s === '*)') {
                        --openComments;
                        ++this.position;
                    }
                    ++this.position;
                }
            }
        } while (this.position !== oldnumber);
        this.tokenStart = this.position;
    };
    /* Reads a sequence of digits. Sign, exponent etc. are handled by lexNumber. Accepts leading zeros.
     */
    Lexer.prototype.readNumeric = function (hexadecimal, maxLength) {
        if (maxLength === void 0) { maxLength = -1; }
        var result = '';
        while (Lexer.isNumber(this.getChar(), hexadecimal) && result.length !== maxLength) {
            result += this.consumeChar();
        }
        return result;
    };
    Lexer.prototype.makeNumberToken = function (value, real, word, hexadecimal) {
        if (real === void 0) { real = false; }
        if (word === void 0) { word = false; }
        if (hexadecimal === void 0) { hexadecimal = false; }
        if (real && word) {
            throw new errors_1.InternalInterpreterError(this.position);
        }
        var token = this.input.substring(this.tokenStart, this.position);
        if (real) {
            return new tokens_1.RealConstantToken(token, this.tokenStart, parseFloat(value));
        }
        var v = parseInt(value, hexadecimal ? 16 : 10);
        if (word) {
            return new tokens_1.WordConstantToken(token, this.tokenStart, v);
        }
        else {
            var firstChar = token.charAt(0);
            if (Lexer.isNumber(firstChar, false) && firstChar !== '0') {
                // firstChar !== 0 also implies that the number is not hexadecimal
                return new tokens_1.NumericToken(token, this.tokenStart, v);
            }
            else {
                return new tokens_1.IntegerConstantToken(token, this.tokenStart, v);
            }
        }
    };
    Lexer.prototype.lexNumber = function () {
        var value = '';
        var hexadecimal = false;
        var word = false;
        var real = false;
        var negative = false;
        if (this.getChar() === '~') {
            ++this.position;
            negative = true;
            value += '-';
        }
        if (this.getChar() === '0' && (this.getChar(1) === 'w' || this.getChar(1) === 'x')) {
            ++this.position;
            if (this.getChar() === 'w') {
                word = true;
            }
            if (this.getChar(word ? 1 : 0) === 'x') {
                hexadecimal = true;
            }
            var nextDigitOffset = (word && hexadecimal) ? 2 : 1;
            if ((negative && word) || !Lexer.isNumber(this.getChar(nextDigitOffset), hexadecimal)) {
                // The 'w' or 'x' is not part of the number
                value += '0';
                return this.makeNumberToken(value, false, false, false);
            }
            this.position += nextDigitOffset;
        }
        value += this.readNumeric(hexadecimal);
        if (hexadecimal || word) {
            return this.makeNumberToken(value, false, word, hexadecimal);
        }
        if (this.getChar() === '.') {
            if (Lexer.isNumber(this.getChar(1), false)) {
                value += this.consumeChar();
                value += this.readNumeric(false);
            }
            else {
                return this.makeNumberToken(value);
            }
            real = true;
        }
        if (this.getChar() === 'e' || this.getChar() === 'E') {
            if (Lexer.isNumber(this.getChar(1), false)) {
                value += 'e';
                ++this.position;
                value += this.readNumeric(false);
            }
            else if (this.getChar(1) === '~' && Lexer.isNumber(this.getChar(2), false)) {
                value += 'e-';
                this.position += 2;
                value += this.readNumeric(false);
            }
            else {
                return this.makeNumberToken(value, real);
            }
            real = true;
        }
        return this.makeNumberToken(value, real);
    };
    Lexer.prototype.lexString = function () {
        var startnumber = this.position;
        if (this.consumeChar() !== '"') {
            throw new errors_1.InternalInterpreterError(this.position);
        }
        var value = '';
        while (this.getChar() !== '"') {
            if (this.getChar() === '\\') {
                ++this.position;
                if (Lexer.isWhitespace(this.getChar())) {
                    this.skipWhitespace();
                    if (this.consumeChar('unterminated whitespace escape sequence') !== '\\') {
                        throw new errors_1.LexerError(this.position - 1, 'only whitespace is allowed in whitespace escape sequence');
                    }
                }
                else {
                    var c = this.consumeChar();
                    switch (c) {
                        case 'a':
                            value += '\x07';
                            break;
                        case 'b':
                            value += '\b';
                            break;
                        case 't':
                            value += '\t';
                            break;
                        case 'n':
                            value += '\n';
                            break;
                        case 'v':
                            value += '\v';
                            break;
                        case 'f':
                            value += '\f';
                            break;
                        case 'r':
                            value += '\r';
                            break;
                        case '"':
                            value += '"';
                            break;
                        case '\\':
                            value += '\\';
                            break;
                        case '^': {
                            var cc = this.consumeChar().charCodeAt(0);
                            if (cc < 64 || cc > 95) {
                                throw new errors_1.LexerError(this.position - 1, '"' + String.fromCharCode(cc) +
                                    '" does not represent a valid control character');
                            }
                            value += String.fromCharCode(cc - 64);
                            break;
                        }
                        case 'u': {
                            var s = this.readNumeric(true, 4);
                            if (s.length !== 4) {
                                throw new errors_1.LexerError(this.position - s.length - 1, 'unicode escape sequence must have four digits');
                            }
                            var v = parseInt(s, 16);
                            if (v >= 256 && !this.options.allowUnicodeInStrings) {
                                throw new errors_1.LexerError(this.position - s.length - 1, 'character code ' + s + ' is too large, only 00 to ff is allowed');
                            }
                            value += String.fromCharCode(v);
                            break;
                        }
                        default: {
                            if (!Lexer.isNumber(c, false)) {
                                throw new errors_1.LexerError(this.position - 1, 'invalid escape sequence');
                            }
                            --this.position; // 'un-consume' the first character of the number
                            var s = this.readNumeric(false, 3);
                            if (s.length !== 3) {
                                throw new errors_1.LexerError(this.position - s.length - 1, 'numeric escape sequence must have three digits');
                            }
                            var v = parseInt(s, 10);
                            if (v >= 256 && !this.options.allowUnicodeInStrings) {
                                throw new errors_1.LexerError(this.position - s.length - 1, 'character code ' + s + ' is too large, only 000 to 255 is allowed');
                            }
                            value += String.fromCharCode(v);
                            break;
                        }
                    }
                }
            }
            else {
                var c = this.consumeChar('unterminated string', this.tokenStart).charCodeAt(0);
                // Only printable characters (33 to 126) and spaces are allowed (SML definition, chapter 2.2)
                // We however also allow all non-ASCII characters (>128), since MosML and SML/NJ seem to do so as well.
                if ((c < 33 || c > 126) && c !== 32 /*space*/ && c < 128) {
                    // invalid characters are not printable, so we should print its code rather than the character
                    throw new errors_1.LexerError(this.position - 1, 'invalid character with code ' + c + ' in string');
                }
                value += String.fromCharCode(c);
            }
        }
        if (this.consumeChar() !== '"') {
            throw new errors_1.InternalInterpreterError(this.position);
        }
        return new tokens_1.StringConstantToken(this.input.substring(startnumber, this.position), this.tokenStart, value);
    };
    Lexer.prototype.lexCharacter = function () {
        if (this.consumeChar() !== '#') {
            throw new errors_1.InternalInterpreterError(this.position);
        }
        var t = this.lexString();
        if (t.value.length !== 1) {
            throw new errors_1.LexerError(this.tokenStart, 'character constant must have length 1, not ' + t.value.length);
        }
        return new tokens_1.CharacterConstantToken('#' + t.text, this.tokenStart, t.value);
    };
    Lexer.prototype.lexIdentifierOrKeyword = function () {
        // Both identifiers and keywords can be either symbolic (consisting only of the characters
        // ! % & $ # + - / : < = > ? @ \ ~ ‘ ^ | *
        // or alphanumeric (consisting only of letters, digits, ' or _).
        // We first need to figure out which of these types the token belongs to, then find the longest possible token
        // of that type at this position and lastly check whether it is a reserved word.
        var token = '';
        var charChecker;
        var firstChar = this.getChar();
        if (Lexer.isSymbolic(firstChar)) {
            charChecker = Lexer.isSymbolic;
        }
        else if (Lexer.isAlphanumeric(firstChar) && !Lexer.isNumber(firstChar, false) && firstChar !== '_') {
            // alphanumeric identifiers may not start with a number
            charChecker = Lexer.isAlphanumeric;
        }
        else if (reservedWords.has(firstChar)) {
            return new tokens_1.KeywordToken(this.consumeChar(), this.tokenStart);
        }
        else if (firstChar === '.' && this.getChar(1) === '.' && this.getChar(2) === '.') {
            this.position += 3;
            return new tokens_1.KeywordToken('...', this.tokenStart);
        }
        else {
            if (firstChar.charCodeAt(0) < 32) {
                throw new errors_1.LexerError(this.position, 'invalid character with ascii code ' + firstChar.charCodeAt(0));
            }
            else {
                throw new errors_1.LexerError(this.position, 'invalid token: ' + firstChar);
            }
        }
        do {
            token += this.consumeChar();
        } while (charChecker(this.getChar()));
        if (token === '*') {
            return new tokens_1.StarToken(this.tokenStart);
        }
        else if (token === '=') {
            return new tokens_1.EqualsToken(this.tokenStart);
        }
        else if (reservedWords.has(token)) {
            return new tokens_1.KeywordToken(token, this.tokenStart);
        }
        else if (firstChar === '\'') {
            if (token.charAt(1) === '\'') {
                return new tokens_1.EqualityTypeVariableToken(token, this.tokenStart);
            }
            else {
                return new tokens_1.TypeVariableToken(token, this.tokenStart);
            }
        }
        else if (Lexer.isAlphanumeric(firstChar)) {
            return new tokens_1.AlphanumericIdentifierToken(token, this.tokenStart);
        }
        else {
            return new tokens_1.IdentifierToken(token, this.tokenStart);
        }
    };
    Lexer.prototype.lexLongIdentifierOrKeyword = function () {
        var tokenStart = this.tokenStart;
        var t = this.lexIdentifierOrKeyword();
        if (this.getChar() !== '.') {
            return t;
        }
        var qualifiers = [];
        do {
            this.consumeChar();
            if (!(t instanceof tokens_1.AlphanumericIdentifierToken)) {
                throw new errors_1.LexerError(t.position, 'expected structure name before "."');
            }
            qualifiers.push(t);
            this.tokenStart = this.position;
            t = this.lexIdentifierOrKeyword();
        } while (this.getChar() === '.');
        // Only value identifiers, type constructors and structure identifiers are allowed here.
        // EqualsToken is not allowed because it cannot be re-bound.
        if ((!(t instanceof tokens_1.IdentifierToken || t instanceof tokens_1.StarToken)) || t instanceof tokens_1.TypeVariableToken) {
            throw new errors_1.LexerError(t.position, t.text + ' is not allowed in a long identifier');
        }
        return new tokens_1.LongIdentifierToken(this.input.substring(tokenStart, this.position), tokenStart, qualifiers, t);
    };
    Lexer.prototype.nextToken = function () {
        var token;
        this.tokenStart = this.position;
        if (Lexer.isNumber(this.getChar(), false)
            || (this.getChar() === '~' && Lexer.isNumber(this.getChar(1), false))) {
            token = this.lexNumber();
        }
        else if (this.getChar() === '"') {
            token = this.lexString();
        }
        else if (this.getChar() === '#' && this.getChar(1) === '"') {
            token = this.lexCharacter();
        }
        else {
            token = this.lexLongIdentifierOrKeyword();
        }
        this.skipWhitespaceAndComments();
        return token;
    };
    Lexer.prototype.finished = function () {
        return this.position >= this.input.length;
    };
    return Lexer;
}());
function lex(s, options) {
    var l = new Lexer(s, options);
    var result = [];
    while (!l.finished()) {
        result.push(l.nextToken());
    }
    return result;
}
exports.lex = lex;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var expressions_1 = __webpack_require__(7);
var types_1 = __webpack_require__(4);
var errors_1 = __webpack_require__(0);
var tokens_1 = __webpack_require__(1);
var declarations_1 = __webpack_require__(6);
var modules_1 = __webpack_require__(12);
var Parser = (function () {
    function Parser(tokens, state, currentId, options) {
        this.tokens = tokens;
        this.state = state;
        this.currentId = currentId;
        this.options = options;
        this.position = 0; // position of the next not yet parsed token
        if (this.state === undefined) {
            throw new errors_1.InternalInterpreterError(-1, 'What are you, stupid? Hurry up and give me ' +
                'a state already!');
        }
    }
    Parser.prototype.assertKeywordToken = function (tok, text) {
        if (text === void 0) { text = undefined; }
        if (!(tok instanceof tokens_1.KeywordToken)) {
            throw new errors_1.ParserError('Expected a reserved word, got "' + tok.getText()
                + '" (' + tok.constructor.name + ').', tok.position);
        }
        if (text !== undefined && tok.text !== text) {
            throw new errors_1.ParserError('Expected "' + text + '" but got "' + tok.text + '".', tok.position);
        }
    };
    Parser.prototype.assertVidToken = function (tok) {
        if (!tok.isVid()) {
            throw new errors_1.ParserError('Expected an identifier, got \"'
                + tok.getText() + '\" ('
                + tok.constructor.name + ').', tok.position);
        }
    };
    Parser.prototype.assertIdentifierToken = function (tok) {
        if (!(tok instanceof tokens_1.IdentifierToken)) {
            throw new errors_1.ParserError('Expected an identifier, got \"'
                + tok.getText() + '\" ('
                + tok.constructor.name + ').', tok.position);
        }
    };
    Parser.prototype.assertVidOrLongToken = function (tok) {
        if (!tok.isVid() && !(tok instanceof tokens_1.LongIdentifierToken)) {
            throw new errors_1.ParserError('Expected an identifier, got \"'
                + tok.getText() + '\" ('
                + tok.constructor.name + ').', tok.position);
        }
    };
    Parser.prototype.assertIdentifierOrLongToken = function (tok) {
        if (!(tok instanceof tokens_1.IdentifierToken)
            && !(tok instanceof tokens_1.LongIdentifierToken)) {
            throw new errors_1.ParserError('Expected an identifier, got \"'
                + tok.getText() + '\" ('
                + tok.constructor.name + ').', tok.position);
        }
    };
    Parser.prototype.assertRecordLabelToken = function (tok) {
        if (!tok.isValidRecordLabel()) {
            throw new errors_1.ParserError('Expected a record label \"'
                + tok.getText() + '\" ('
                + tok.constructor.name + ').', tok.position);
        }
    };
    Parser.prototype.checkVidOrLongToken = function (tok) {
        return (tok.isVid() || (tok instanceof tokens_1.LongIdentifierToken));
    };
    Parser.prototype.checkIdentifierOrLongToken = function (tok) {
        return ((tok instanceof tokens_1.IdentifierToken)
            || (tok instanceof tokens_1.LongIdentifierToken));
    };
    Parser.prototype.checkKeywordToken = function (tok, text) {
        if (text === void 0) { text = undefined; }
        if (!(tok instanceof tokens_1.KeywordToken)) {
            return false;
        }
        if (text !== undefined && tok.text !== text) {
            return false;
        }
        return true;
    };
    Parser.prototype.parseOpIdentifierToken = function (allowLong) {
        if (allowLong === void 0) { allowLong = false; }
        var curTok = this.currentToken();
        var opPrefixed = this.checkKeywordToken(curTok, 'op');
        if (opPrefixed) {
            ++this.position;
        }
        if (allowLong) {
            this.assertIdentifierOrLongToken(this.currentToken());
        }
        else {
            this.assertIdentifierToken(this.currentToken());
        }
        var name = this.currentToken();
        name.opPrefixed = opPrefixed;
        ++this.position;
        return name;
    };
    Parser.prototype.parseAtomicExpression = function () {
        /*
         * atexp ::= scon                           Constant(position, token)
         *              ConstantToken
         *           [op] longvid                   ValueIdentifier(position, name:Token)
         *              [KeywordToken] IdentifierToken
         *           { [exprow] }
         *           #lab                           RecordSelector(pos, label:Token)
         *              KeywordToken IdentifierToken
         *           ()                             Tuple(pos, [])
         *              KeywordToken KeywordToken
         *           (exp1, …, expn)                Tuple(pos, exps: (Pattern|Exp)[])
         *              KeywordToken exp [KeywordToken exp]* KeywordToken
         *           [exp1, …, expn]                List(pos, exps: (Pattern|Exp)[])
         *              KeywordToken exp [KeywordToken exp]* KeywordToken
         *           (exp1; …; expn)                Sequence(pos, exps:Exp[])
         *              KeywordToken exp [KeywordToken exp]* KeywordToken
         *           let dec in exp1, …, expn end   LocalDeclarationExpression(pos, decl:Decl, exp)
         *              KeywordToken dec KeywordToken exp [KeywordToken exp]* KeywordToken
         *           ( exp )                        Expression
         *              KeywordToken exp KeywordToken
         */
        var curTok = this.currentToken();
        if (this.checkKeywordToken(curTok, 'op')) {
            ++this.position;
            var nextCurTok = this.currentToken();
            this.assertVidOrLongToken(nextCurTok);
            nextCurTok.opPrefixed = true;
            ++this.position;
            return new expressions_1.ValueIdentifier(curTok.position, nextCurTok);
        }
        if (this.checkKeywordToken(curTok, '{')) {
            // Record expression
            ++this.position;
            return this.parseExpressionRow();
        }
        if (this.checkKeywordToken(curTok, '(')) {
            // Tuple expression
            ++this.position;
            if (this.checkKeywordToken(this.currentToken(), ')')) {
                ++this.position;
                return new expressions_1.Tuple(curTok.position, []);
            }
            var results = [this.parseExpression()];
            var isSequence = false;
            var isTuple = false;
            while (true) {
                var nextCurTok = this.currentToken();
                if (this.checkKeywordToken(nextCurTok, ',') && !isSequence) {
                    ++this.position;
                    isTuple = true;
                    results.push(this.parseExpression());
                    continue;
                }
                else if (this.checkKeywordToken(nextCurTok, ';') && !isTuple) {
                    ++this.position;
                    isSequence = true;
                    if (!this.options.allowSuccessorML
                        || !this.checkKeywordToken(this.currentToken(), ')')) {
                        results.push(this.parseExpression());
                        continue;
                    }
                }
                if (this.checkKeywordToken(nextCurTok, ')')) {
                    ++this.position;
                    if (results.length === 1) {
                        return results[0];
                    }
                    else {
                        if (isTuple) {
                            return new expressions_1.Tuple(curTok.position, results);
                        }
                        else if (isSequence) {
                            return new expressions_1.Sequence(curTok.position, results);
                        }
                    }
                }
                else {
                    throw new errors_1.ParserError('Expected ",", ";" or ")" but got \"' +
                        nextCurTok.getText() + '\".', nextCurTok.position);
                }
                results.push(this.parseExpression());
            }
        }
        if (this.checkKeywordToken(curTok, '[')) {
            // List expression
            ++this.position;
            if (this.checkKeywordToken(this.currentToken(), ']')) {
                ++this.position;
                return new expressions_1.List(curTok.position, []);
            }
            var results = [this.parseExpression()];
            while (true) {
                var nextCurTok = this.currentToken();
                if (this.checkKeywordToken(nextCurTok, ',')) {
                    ++this.position;
                }
                else if (this.checkKeywordToken(nextCurTok, ']')) {
                    ++this.position;
                    return new expressions_1.List(curTok.position, results);
                }
                else {
                    throw new errors_1.ParserError('Expected "," or "]" but found "' +
                        nextCurTok.getText() + '".', nextCurTok.position);
                }
                results.push(this.parseExpression());
            }
        }
        if (this.checkKeywordToken(curTok, '#')) {
            ++this.position;
            var nextTok = this.currentToken();
            this.assertRecordLabelToken(nextTok);
            ++this.position;
            return new expressions_1.RecordSelector(curTok.position, nextTok);
        }
        if (this.checkKeywordToken(curTok, 'let')) {
            ++this.position;
            var nstate = this.state;
            this.state = this.state.getNestedState(this.state.id);
            var dec = this.parseDeclaration();
            this.assertKeywordToken(this.currentToken(), 'in');
            ++this.position;
            var res = [this.parseExpression()];
            var newTok = this.currentToken();
            var tpos = newTok.position;
            while (this.checkKeywordToken(newTok, ';')) {
                ++this.position;
                res.push(this.parseExpression());
                newTok = this.currentToken();
            }
            this.assertKeywordToken(newTok, 'end');
            ++this.position;
            this.state = nstate;
            if (res.length >= 2) {
                return new expressions_1.LocalDeclarationExpression(curTok.position, dec, new expressions_1.Sequence(tpos, res));
            }
            else {
                return new expressions_1.LocalDeclarationExpression(curTok.position, dec, res[0]);
            }
        }
        else if (curTok instanceof tokens_1.ConstantToken) {
            ++this.position;
            return new expressions_1.Constant(curTok.position, curTok);
        }
        else if (curTok.isVid() || curTok instanceof tokens_1.LongIdentifierToken) {
            ++this.position;
            if (this.state.getInfixStatus(curTok) !== undefined
                && this.state.getInfixStatus(curTok).infix) {
                throw new errors_1.ParserError('Infix operator "' + curTok.getText()
                    + '" appeared in non-infix context without "op".', curTok.position);
            }
            return new expressions_1.ValueIdentifier(curTok.position, curTok);
        }
        throw new errors_1.ParserError('Expected atomic expression, "' +
            curTok.getText() + '" found.', curTok.position);
    };
    Parser.prototype.parseExpressionRow = function () {
        /*
         * Parses Record expression, munches closing }
         * exprow ::= lab = exp [, exprow]  Record(position, complete: boolean,
         *                                         entries: [string, (Pattern|Expression)][])
         *              IdentifierToken KeywordToken exp [KeywordToken exp]*
         */
        var curTok = this.currentToken();
        var res = [];
        var firstIt = true;
        while (true) {
            var newTok = this.currentToken();
            if (this.checkKeywordToken(newTok, '}')) {
                ++this.position;
                return new expressions_1.Record(curTok.position, true, res);
            }
            if (!firstIt && this.checkKeywordToken(newTok, ',')) {
                ++this.position;
                continue;
            }
            firstIt = false;
            if (newTok.isValidRecordLabel()) {
                ++this.position;
                var nextTok = this.currentToken();
                this.assertKeywordToken(nextTok, '=');
                ++this.position;
                res.push([newTok.getText(), this.parseExpression()]);
                continue;
            }
            throw new errors_1.ParserError('Expected "}", or identifier, got "'
                + newTok.getText() + '".', newTok.position);
        }
    };
    Parser.prototype.parseApplicationExpression = function () {
        /* appexp ::= atexp
         *            appexp atexp      FunctionApplication(position, func:exp, arg:exp)
         *              exp exp
         */
        var curTok = this.currentToken();
        var res = this.parseAtomicExpression();
        while (true) {
            var oldPos = this.position;
            var nextTok = this.currentToken();
            if (this.checkVidOrLongToken(nextTok)
                && this.state.getInfixStatus(nextTok) !== undefined
                && this.state.getInfixStatus(nextTok).infix) {
                break;
            }
            try {
                var newExp = this.parseAtomicExpression();
                res = new expressions_1.FunctionApplication(curTok.position, res, newExp);
            }
            catch (e) {
                this.position = oldPos;
                break;
            }
        }
        return res;
    };
    Parser.prototype.parseInfixExpression = function () {
        /*
         * infexp ::= appexp
         *            infexp1 vid infexp2   FunctionApplication(pos, ValueIdentifier, (exp1,exp2))
         *              exp IdentifierToken exp
         */
        var exps = [];
        var ops = [];
        var cnt = 0;
        while (true) {
            exps.push(this.parseApplicationExpression());
            var curTok = this.currentToken();
            if (this.checkVidOrLongToken(curTok)
                && this.state.getInfixStatus(curTok) !== undefined
                && this.state.getInfixStatus(curTok).infix) {
                // We don't know anything about identifiers yet, so just assume they are infix
                ++this.position;
                ops.push([curTok, cnt++]);
            }
            else {
                break;
            }
        }
        if (cnt === 0) {
            return exps[0];
        }
        return new expressions_1.InfixExpression(exps, ops).reParse(this.state);
    };
    Parser.prototype.parseAppendedExpression = function () {
        /*
         * exp ::= infexp
         *         exp : ty                         TypedExpression(position, exp, type)
         *          exp KeywordToken type
         *         exp handle match                 HandleException(position, exp, match)
         *          exp KeywordToken exp
         *         raise exp                        RaiseException(position, exp)
         *          KeywordToken exp
         *         if exp1 then exp2 else exp3      Conditional(pos, exp1, exp2, exp3)
         *          KeywordToken exp KeywordToken exp KeywordToken exp
         *         case exp of match                CaseAnalysis(pos, exp, match)
         *          KeywordToken exp KeywordToken match
         *         while exp do exp                 While(pos, exp, exp)
         *          KeywordToken exp KeywordToken exp
         *         fn match                         Lambda(position, match)
         *          KeywordToken match
         */
        var curTok = this.currentToken();
        if (this.checkKeywordToken(curTok, 'raise')) {
            ++this.position;
            return new expressions_1.RaiseException(curTok.position, this.parseExpression());
        }
        else if (this.checkKeywordToken(curTok, 'if')) {
            ++this.position;
            var cond = this.parseExpression();
            this.assertKeywordToken(this.currentToken(), 'then');
            ++this.position;
            var cons = this.parseExpression();
            if (this.options.allowSuccessorML
                && !this.checkKeywordToken(this.currentToken(), 'else')) {
                return new expressions_1.Conditional(curTok.position, cond, cons, new expressions_1.Tuple(-1, []));
            }
            else {
                this.assertKeywordToken(this.currentToken(), 'else');
                ++this.position;
                return new expressions_1.Conditional(curTok.position, cond, cons, this.parseExpression());
            }
        }
        else if (this.checkKeywordToken(curTok, 'case')) {
            ++this.position;
            var cond = this.parseExpression();
            this.assertKeywordToken(this.currentToken(), 'of');
            ++this.position;
            return new expressions_1.CaseAnalysis(curTok.position, cond, this.parseMatch());
        }
        else if (this.checkKeywordToken(curTok, 'while')) {
            ++this.position;
            var cond = this.parseExpression();
            this.assertKeywordToken(this.currentToken(), 'do');
            ++this.position;
            return new expressions_1.While(curTok.position, cond, this.parseExpression());
        }
        else if (this.checkKeywordToken(curTok, 'fn')) {
            ++this.position;
            return new expressions_1.Lambda(curTok.position, this.parseMatch());
        }
        var exp = this.parseInfixExpression();
        var nextTok = this.currentToken();
        while (this.checkKeywordToken(nextTok, ':')) {
            ++this.position;
            exp = new expressions_1.TypedExpression(curTok.position, exp, this.parseType());
            nextTok = this.currentToken();
        }
        return exp;
    };
    Parser.prototype.parseExpression = function () {
        /*
         * exp ::= exp1 andalso exp2                Conjunction(pos, exp1, exp2)
         *          exp KeywordToken exp
         *         exp1 orelse exp2                 Disjunction(pos, exp1, exp2)
         *          exp KeywordToken exp
         */
        var exp = this.parseAppendedExpression();
        var nextTok = this.currentToken();
        var curTok = nextTok;
        if (this.checkKeywordToken(nextTok, 'andalso')
            || this.checkKeywordToken(nextTok, 'orelse')) {
            var exps = [[exp, [0]]];
            var ops = [];
            var cnt = 0;
            while (true) {
                if (this.checkKeywordToken(nextTok, 'orelse')) {
                    ops.push([1, cnt++]);
                    ++this.position;
                }
                else if (this.checkKeywordToken(nextTok, 'andalso')) {
                    ops.push([0, cnt++]);
                    ++this.position;
                }
                else {
                    break;
                }
                exps.push([this.parseAppendedExpression(), [cnt]]);
                nextTok = this.currentToken();
            }
            ops.sort();
            for (var i = 0; i < ops.length; ++i) {
                // Using pointers or something similar could speed up this stuff here
                // and achieve linear running time
                var left = exps[ops[i][1]][0];
                var right = exps[ops[i][1] + 1][0];
                var res = void 0;
                if (ops[i][0] === 0) {
                    res = new expressions_1.Conjunction(left.position, left, right);
                }
                else {
                    res = new expressions_1.Disjunction(left.position, left, right);
                }
                var npos = exps[ops[i][1]][1];
                for (var _i = 0, _a = exps[ops[i][1] + 1][1]; _i < _a.length; _i++) {
                    var j = _a[_i];
                    npos.push(j);
                }
                for (var _b = 0, npos_1 = npos; _b < npos_1.length; _b++) {
                    var j = npos_1[_b];
                    exps[j] = [res, npos];
                }
            }
            exp = exps[0][0];
        }
        nextTok = this.currentToken();
        while (this.checkKeywordToken(nextTok, 'handle')) {
            ++this.position;
            exp = new expressions_1.HandleException(curTok.position, exp, this.parseMatch());
            nextTok = this.currentToken();
        }
        return exp;
    };
    Parser.prototype.parseSimpleStructureExpression = function () {
        /*
         * strexp ::= struct strdec end         StructureExpression(pos, dec)
         *            longstrid                 StructureIdentifier(pos, token)
         *            funid ( strexp )          FunctorApplication(pos, funid, exp)
         *            let strdec in strexp end  LocalDeclarationExpression(pos, dec, exp)
         */
        var curTok = this.currentToken();
        if (this.checkKeywordToken(curTok, 'struct')) {
            ++this.position;
            var dec = this.parseDeclaration(false, true);
            this.assertKeywordToken(this.currentToken(), 'end');
            ++this.position;
            return new modules_1.StructureExpression(curTok.position, dec);
        }
        else if (this.checkKeywordToken(curTok, 'let')) {
            ++this.position;
            var dec = this.parseDeclaration(false, true);
            this.assertKeywordToken(this.currentToken(), 'in');
            ++this.position;
            var exp = this.parseStructureExpression();
            this.assertKeywordToken(this.currentToken(), 'end');
            ++this.position;
            return new modules_1.LocalDeclarationStructureExpression(curTok.position, dec, exp);
        }
        if (curTok instanceof tokens_1.IdentifierToken) {
            ++this.position;
            if (this.checkKeywordToken(this.currentToken(), '(')) {
                ++this.position;
                // TODO Allow strdec here
                var exp = this.parseStructureExpression();
                this.assertKeywordToken(this.currentToken(), ')');
                ++this.position;
                return new modules_1.FunctorApplication(curTok.position, curTok, exp);
            }
            else {
                --this.position;
            }
        }
        if (this.checkIdentifierOrLongToken(curTok)) {
            ++this.position;
            return new modules_1.StructureIdentifier(curTok.position, curTok);
        }
        throw new errors_1.ParserError('Expected a simple structure expression.', curTok.position);
    };
    Parser.prototype.parseStructureExpression = function () {
        /*
         * strexp ::= strexp : sigexp           TransparentConstraint(pos, strexp, sigexp)
         *            strexp :> sigexp          OpaqueConstraint(pos, strexp, sigexp)
         */
        var curTok = this.currentToken();
        var exp = this.parseSimpleStructureExpression();
        while (true) {
            if (this.checkKeywordToken(this.currentToken(), ':')) {
                ++this.position;
                exp = new modules_1.TransparentConstraint(curTok.position, exp, this.parseSignatureExpression());
            }
            else if (this.checkKeywordToken(this.currentToken(), ':>')) {
                ++this.position;
                exp = new modules_1.OpaqueConstraint(curTok.position, exp, this.parseSignatureExpression());
            }
            else {
                break;
            }
        }
        return exp;
    };
    Parser.prototype.parseSimpleSignatureExpression = function () {
        /*
         * sigexp ::= sig spec end              SignatureExpression
         *            sigid                     SignatureIdentifier
         */
        var curTok = this.currentToken();
        if (this.checkKeywordToken(curTok, 'sig')) {
            ++this.position;
            var spec = this.parseSpecification();
            this.assertKeywordToken(this.currentToken(), 'end');
            ++this.position;
            return new modules_1.SignatureExpression(curTok.position, spec);
        }
        if (curTok instanceof tokens_1.IdentifierToken) {
            ++this.position;
            return new modules_1.SignatureIdentifier(curTok.position, curTok);
        }
        throw new errors_1.ParserError('Expected a simple signature expression.', curTok.position);
    };
    Parser.prototype.parseSignatureExpression = function () {
        /*
         * sigexp ::= sigexp where type tyvarseq longtycon = ty TypeRealisation(pos, exp, tyvar, ty)
         */
        var curTok = this.currentToken();
        var sig = this.parseSimpleSignatureExpression();
        while (this.checkKeywordToken(this.currentToken(), 'where')) {
            ++this.position;
            this.assertKeywordToken(this.currentToken(), 'type');
            ++this.position;
            var tyvarseq = this.parseTypeVarSequence();
            this.assertIdentifierOrLongToken(this.currentToken());
            var token = this.currentToken();
            ++this.position;
            this.assertKeywordToken(this.currentToken(), '=');
            ++this.position;
            sig = new modules_1.TypeRealisation(curTok.position, sig, tyvarseq, token, this.parseType());
        }
        return sig;
    };
    Parser.prototype.parseSimpleSpecification = function () {
        /*
         * spec ::= val vid : ty <and valdesc>          ValueSpecification(pos, [Token, Type][])
         *          type tyvarseq tycon <and tydesc>    TypeSpecification(pos, [tyvar, tycon][])
         *          eqtype tyvarseq tycon <and tydesc>  EqualityTypeSpecification(ps, [tyva, tycn][])
         *          datatype datdesc
         *          datatype tycon = datatype longtycon
         *          exception exdesc
         *          structure strdesc
         *          include sigexp
         *
         */
        var curTok = this.currentToken();
        if (this.checkKeywordToken(curTok, 'val')) {
            ++this.position;
            var res = [];
            while (true) {
                this.assertIdentifierOrLongToken(this.currentToken());
                var tkn = this.currentToken();
                ++this.position;
                this.assertKeywordToken(this.currentToken(), ':');
                ++this.position;
                res.push([tkn, this.parseType()]);
                if (this.checkKeywordToken(this.currentToken(), 'and')) {
                    ++this.position;
                    continue;
                }
                break;
            }
            return new modules_1.ValueSpecification(curTok.position, res);
        }
        else if (this.checkKeywordToken(curTok, 'type')) {
            ++this.position;
            var res = [];
            while (true) {
                var tyvar = this.parseTypeVarSequence();
                this.assertIdentifierToken(this.currentToken());
                res.push([tyvar, this.currentToken()]);
                ++this.position;
                if (this.checkKeywordToken(this.currentToken(), 'and')) {
                    ++this.position;
                    continue;
                }
                break;
            }
            return new modules_1.TypeSpecification(curTok.position, res);
        }
        else if (this.checkKeywordToken(curTok, 'eqtype')) {
            ++this.position;
            var res = [];
            while (true) {
                var tyvar = this.parseTypeVarSequence();
                this.assertIdentifierToken(this.currentToken());
                res.push([tyvar, this.currentToken()]);
                ++this.position;
                if (this.checkKeywordToken(this.currentToken(), 'and')) {
                    ++this.position;
                    continue;
                }
                break;
            }
            return new modules_1.EqualityTypeSpecification(curTok.position, res);
        }
        else if (this.checkKeywordToken(curTok, 'datatype')) {
            ++this.position;
            if (this.position + 2 < this.tokens.length &&
                this.checkKeywordToken(this.tokens[this.position + 2], 'datatype')) {
                this.assertIdentifierToken(this.currentToken());
                var tk = this.currentToken();
                ++this.position;
                this.assertKeywordToken(this.currentToken(), '=');
                ++this.position;
                this.assertKeywordToken(this.currentToken(), 'datatype');
                ++this.position;
                this.assertIdentifierOrLongToken(this.currentToken());
                var on = this.currentToken();
                ++this.position;
                return new modules_1.DatatypeReplicationSpecification(curTok.position, tk, on);
            }
            // Yeah I know that this stuff is ugly
            var res = [];
            while (true) {
                var tyvar = this.parseTypeVarSequence();
                this.assertIdentifierToken(this.currentToken());
                var tk = this.currentToken();
                ++this.position;
                this.assertKeywordToken(this.currentToken(), '=');
                ++this.position;
                var cons = [];
                while (true) {
                    this.assertIdentifierToken(this.currentToken());
                    var cn = this.currentToken();
                    ++this.position;
                    var tp = undefined;
                    if (this.checkKeywordToken(this.currentToken(), 'of')) {
                        ++this.position;
                        tp = this.parseType();
                    }
                    cons.push([cn, tp]);
                    if (this.checkKeywordToken(this.currentToken(), '|')) {
                        ++this.position;
                        continue;
                    }
                    break;
                }
                res.push([tyvar, tk, cons]);
                if (this.checkKeywordToken(this.currentToken(), 'and')) {
                    ++this.position;
                    continue;
                }
                break;
            }
            return new modules_1.DatatypeSpecification(curTok.position, res);
        }
        else if (this.checkKeywordToken(curTok, 'exception')) {
            ++this.position;
            var res = [];
            while (true) {
                this.assertIdentifierToken(this.currentToken());
                var tk = this.currentToken();
                ++this.position;
                var tp = undefined;
                if (this.checkKeywordToken(this.currentToken(), 'of')) {
                    ++this.position;
                    tp = this.parseType();
                }
                res.push([tk, tp]);
                if (this.checkKeywordToken(this.currentToken(), 'and')) {
                    ++this.position;
                    continue;
                }
                break;
            }
            return new modules_1.ExceptionSpecification(curTok.position, res);
        }
        else if (this.checkKeywordToken(curTok, 'structure')) {
            ++this.position;
            var res = [];
            while (true) {
                this.assertIdentifierToken(this.currentToken());
                var tk = this.currentToken();
                ++this.position;
                this.assertKeywordToken(this.currentToken(), ':');
                ++this.position;
                res.push([tk, this.parseSignatureExpression()]);
                if (this.checkKeywordToken(this.currentToken(), 'and')) {
                    ++this.position;
                    continue;
                }
                break;
            }
            return new modules_1.StructureSpecification(curTok.position, res);
        }
        else if (this.checkKeywordToken(curTok, 'include')) {
            ++this.position;
            return new modules_1.IncludeSpecification(curTok.position, this.parseSignatureExpression());
        }
        return new modules_1.EmptySpecification(curTok.position);
    };
    Parser.prototype.parseSequentialSpecification = function () {
        /*
         * spec ::= spec <;> spec       SequentialSpecification(pos, Spec[])
         */
        var curTok = this.currentToken();
        var res = [];
        while (true) {
            var cur = this.parseSimpleSpecification();
            if (cur instanceof modules_1.EmptySpecification) {
                break;
            }
            res.push(cur);
            if (this.checkKeywordToken(this.currentToken(), ';')) {
                ++this.position;
            }
        }
        return new modules_1.SequentialSpecification(curTok.position, res);
    };
    Parser.prototype.parseSpecification = function () {
        /*
         * spec ::= spec sharing type longtycon = ... = longtycon
         */
        var curTok = this.currentToken();
        var spec = this.parseSequentialSpecification();
        while (this.checkKeywordToken(this.currentToken(), 'sharing')) {
            ++this.position;
            this.assertKeywordToken(this.currentToken(), 'type');
            ++this.position;
            this.assertIdentifierOrLongToken(this.currentToken());
            var tkn = [this.currentToken()];
            ++this.position;
            while (this.checkKeywordToken(this.currentToken(), '=')) {
                ++this.position;
                this.assertIdentifierOrLongToken(this.currentToken());
                tkn.push(this.currentToken());
                ++this.position;
            }
            if (tkn.length < 2) {
                throw new errors_1.ParserError('A "sharing" expression requires at least 2 type names.', curTok.position);
            }
            spec = new modules_1.SharingSpecification(curTok.position, spec, tkn);
        }
        return spec;
    };
    Parser.prototype.parseMatch = function () {
        /*
         * match ::= pat => exp [| match]       Match(pos, [Pattern, Expression][])
         */
        var curTok = this.currentToken();
        if (this.options.allowSuccessorML && this.checkKeywordToken(this.currentToken(), '|')) {
            ++this.position;
        }
        var res = [];
        while (true) {
            var pat = this.parsePattern();
            this.assertKeywordToken(this.currentToken(), '=>');
            ++this.position;
            var exp = this.parseExpression();
            res.push([pat, exp]);
            if (!this.checkKeywordToken(this.currentToken(), '|')) {
                break;
            }
            ++this.position;
        }
        return new expressions_1.Match(curTok.position, res);
    };
    Parser.prototype.parsePatternRow = function () {
        /*
         * Parses Record patterns, munches closing }
         * patrow ::= ...
         *              KeywordToken
         *            lab = pat [, patrow]
         *              IdentifierToken KeywordToken pat
         *            vid [:ty] [as pat] [, patrow]
         *              IdentifierToken [KeywordToken type] [KeywordToken pat]
         */
        var curTok = this.currentToken();
        var res = [];
        var firstIt = true;
        var complete = true;
        while (true) {
            var newTok = this.currentToken();
            if (this.checkKeywordToken(newTok, '}')) {
                ++this.position;
                return new expressions_1.Record(curTok.position, complete, res);
            }
            if (!complete) {
                throw new errors_1.ParserError('Record wildcard must appear as last element of the record.', newTok.position);
            }
            if (!firstIt && this.checkKeywordToken(newTok, ',')) {
                ++this.position;
                continue;
            }
            firstIt = false;
            if (this.checkKeywordToken(newTok, '...')) {
                // A wildcard may only occur as the last entry of a record.
                complete = false;
                ++this.position;
                continue;
            }
            if (newTok.isValidRecordLabel()) {
                ++this.position;
                var nextTok = this.currentToken();
                if (!(nextTok instanceof tokens_1.KeywordToken)) {
                    throw new errors_1.ParserError('Expected ":", "as", ",", or "=", got ' +
                        nextTok.getText() + '".', nextTok.position);
                }
                if (nextTok.text === '=') {
                    // lab = pat
                    ++this.position;
                    res.push([newTok.getText(), this.parsePattern()]);
                    continue;
                }
                var tp = undefined;
                if (newTok instanceof tokens_1.NumericToken) {
                    throw new errors_1.ParserError('You cannot assign to "' + newTok.getText() + '".', newTok.position);
                }
                var pat = new expressions_1.ValueIdentifier(newTok.position, newTok);
                if (nextTok.text === ':') {
                    ++this.position;
                    tp = this.parseType();
                    nextTok = this.currentToken();
                }
                if (nextTok.text === 'as') {
                    ++this.position;
                    pat = new expressions_1.LayeredPattern(pat.position, pat.name, tp, this.parsePattern());
                    nextTok = this.currentToken();
                }
                else if (tp !== undefined) {
                    pat = new expressions_1.TypedExpression(pat.position, pat, tp);
                }
                res.push([newTok.getText(), pat]);
                continue;
            }
            throw new errors_1.ParserError('Expected "}", "...", or identifier.', newTok.position);
        }
    };
    Parser.prototype.parseAtomicPattern = function () {
        /*
         * atpat ::= _                      Wildcard(pos)
         *           scon                   Constant(pos, token)
         *           [op] longvid           ValueIdentifier(pos, name:Taken)
         *           [op] vid [:ty] as pat  LayeredPattern(pos, IdentifierToken, type, pattern)
         *           { [patrow] }
         *           ()                     Tuple(pos, [])
         *           ( pat1, …, patn )      Tuple(pos, (Pattern|Exp)[])
         *           [ pat1, …, patn ]      List(pos, (Pattern|Exp)[])
         *           ( pat )
         */
        if (this.position >= this.tokens.length) {
            throw new errors_1.ParserError('Unexpected end of token stream', -1);
        }
        var curTok = this.currentToken();
        if (this.checkKeywordToken(curTok, 'op')) {
            ++this.position;
            var nextCurTok = this.currentToken();
            this.assertIdentifierOrLongToken(nextCurTok);
            nextCurTok.opPrefixed = true;
            ++this.position;
            var newOldPos = this.position;
            try {
                if (!(nextCurTok instanceof tokens_1.LongIdentifierToken)) {
                    var newTok = this.currentToken();
                    var tp = void 0;
                    if (this.checkKeywordToken(newTok, ':')) {
                        ++this.position;
                        tp = this.parseType();
                        newTok = this.currentToken();
                    }
                    this.assertKeywordToken(newTok, 'as');
                    ++this.position;
                    return new expressions_1.LayeredPattern(curTok.position, nextCurTok, tp, this.parsePattern());
                }
            }
            catch (f) {
                this.position = newOldPos;
            }
            return new expressions_1.ValueIdentifier(curTok.position, nextCurTok);
        }
        if (this.checkKeywordToken(curTok, '_')) {
            // Wildcard pattern
            ++this.position;
            return new expressions_1.Wildcard(curTok.position);
        }
        if (this.checkKeywordToken(curTok, '{')) {
            // Record pattern
            ++this.position;
            var result = this.parsePatternRow();
            return result;
        }
        if (this.checkKeywordToken(curTok, '(')) {
            // Tuple pattern
            ++this.position;
            if (this.checkKeywordToken(this.currentToken(), ')')) {
                ++this.position;
                return new expressions_1.Tuple(curTok.position, []);
            }
            var results = [this.parsePattern()];
            while (true) {
                var nextCurTok = this.currentToken();
                if (this.checkKeywordToken(nextCurTok, ',')) {
                    ++this.position;
                }
                else if (this.checkKeywordToken(nextCurTok, ')')) {
                    ++this.position;
                    if (results.length === 1) {
                        return results[0];
                    }
                    else {
                        return new expressions_1.Tuple(curTok.position, results);
                    }
                }
                else {
                    throw new errors_1.ParserError('Expected "," or ")", but got "'
                        + nextCurTok.getText() + '".', nextCurTok.position);
                }
                results.push(this.parsePattern());
            }
        }
        if (this.checkKeywordToken(curTok, '[')) {
            // List pattern
            ++this.position;
            if (this.checkKeywordToken(this.currentToken(), ']')) {
                ++this.position;
                return new expressions_1.List(curTok.position, []);
            }
            var results = [this.parsePattern()];
            while (true) {
                var nextCurTok = this.currentToken();
                if (this.checkKeywordToken(nextCurTok, ',')) {
                    ++this.position;
                }
                else if (this.checkKeywordToken(nextCurTok, ']')) {
                    ++this.position;
                    return new expressions_1.List(curTok.position, results);
                }
                else {
                    throw new errors_1.ParserError('Expected "," or "]" but found "' +
                        nextCurTok.getText() + '".', nextCurTok.position);
                }
                results.push(this.parsePattern());
            }
        }
        else if (curTok instanceof tokens_1.ConstantToken) {
            ++this.position;
            return new expressions_1.Constant(curTok.position, curTok);
        }
        else if (curTok instanceof tokens_1.IdentifierToken
            || curTok instanceof tokens_1.LongIdentifierToken) {
            ++this.position;
            var newOldPos = this.position;
            try {
                if (!(curTok instanceof tokens_1.LongIdentifierToken)) {
                    var newTok = this.currentToken();
                    var tp = void 0;
                    if (this.checkKeywordToken(newTok, ':')) {
                        ++this.position;
                        tp = this.parseType();
                        newTok = this.currentToken();
                    }
                    this.assertKeywordToken(newTok, 'as');
                    ++this.position;
                    return new expressions_1.LayeredPattern(curTok.position, curTok, tp, this.parsePattern());
                }
            }
            catch (f) {
                this.position = newOldPos;
            }
            return new expressions_1.ValueIdentifier(curTok.position, curTok);
        }
        throw new errors_1.ParserError('Expected atomic pattern but got "'
            + curTok.getText() + '".', curTok.position);
    };
    Parser.prototype.parseApplicationPattern = function () {
        /*
         *  pat ::= atpat
         *          [op] longvid atpat      FunctionApplication(pos, func, argument)
         */
        var curTok = this.currentToken();
        var res = this.parseAtomicPattern();
        while (true) {
            var oldPos = this.position;
            var nextTok = this.currentToken();
            if (this.checkVidOrLongToken(nextTok)
                && this.state.getInfixStatus(nextTok) !== undefined
                && this.state.getInfixStatus(nextTok).infix) {
                break;
            }
            try {
                var newExp = this.parseAtomicPattern();
                res = new expressions_1.FunctionApplication(curTok.position, res, newExp);
            }
            catch (e) {
                this.position = oldPos;
                break;
            }
        }
        return res;
    };
    Parser.prototype.parseInfixPattern = function () {
        /*
         * pat ::= pat1 vid pat2            FunctionApplication(pos, vid, (pat1, pat2))
         */
        var pats = [];
        var ops = [];
        var cnt = 0;
        while (true) {
            pats.push(this.parseApplicationPattern());
            var curTok = this.currentToken();
            if (this.checkIdentifierOrLongToken(curTok)
                && this.state.getInfixStatus(curTok) !== undefined
                && this.state.getInfixStatus(curTok).infix) {
                ++this.position;
                ops.push([curTok, cnt++]);
            }
            else {
                break;
            }
        }
        if (cnt === 0) {
            return pats[0];
        }
        return new expressions_1.InfixExpression(pats, ops).reParse(this.state);
    };
    Parser.prototype.parsePattern = function () {
        /*
         *          pat : ty                TypedExpression(pos, exp, type)
         */
        var curTok = this.currentToken();
        var pat = this.parseInfixPattern();
        while (this.checkKeywordToken(this.currentToken(), ':')) {
            ++this.position;
            pat = new expressions_1.TypedExpression(curTok.position, pat, this.parseType());
        }
        return pat;
    };
    Parser.prototype.parseTypeRow = function () {
        /*
         * Parses Record type, munches closing }
         * tyrow ::= lab : ty [, tyrow]     Record(comp:boolean, entries: [string, Type])
         */
        var firstTok = this.currentToken();
        var elements = new Map();
        var firstIt = true;
        while (true) {
            var curTok = this.currentToken();
            if (this.checkKeywordToken(curTok, '}')) {
                ++this.position;
                return new types_1.RecordType(elements, true, firstTok.position);
            }
            if (!firstIt && this.checkKeywordToken(curTok, ',')) {
                ++this.position;
                continue;
            }
            firstIt = false;
            if (curTok.isValidRecordLabel()) {
                ++this.position;
                var nextTok = this.currentToken();
                if (!(nextTok instanceof tokens_1.KeywordToken)) {
                    throw new errors_1.ParserError('Expected ":".', nextTok.position);
                }
                if (nextTok.text === ':') {
                    // lab: type
                    ++this.position;
                    if (elements.has(curTok.getText())) {
                        throw new errors_1.ParserError('Duplicate record label "' + curTok.getText()
                            + '".', curTok.position);
                    }
                    elements.set(curTok.getText(), this.parseType());
                    continue;
                }
                throw new errors_1.ParserError('Expected ":".', nextTok.position);
            }
            throw new errors_1.ParserError('Expected "}", or an identifier, got "' +
                curTok.getText() + '".', curTok.position);
        }
    };
    Parser.prototype.parseSimpleType = function () {
        /*
         * ty ::= tyvar                     TypeVariable(name:string)
         *        longtycon                 CustomType
         *        (ty1,..., tyn) longtycon  CustomType
         *        { [tyrow] }
         *        ( ty )
         */
        var curTok = this.currentToken();
        if (curTok instanceof tokens_1.TypeVariableToken) {
            ++this.position;
            return new types_1.TypeVariable(curTok.getText(), curTok.position);
        }
        if (this.checkIdentifierOrLongToken(curTok)) {
            ++this.position;
            return new types_1.CustomType(curTok.getText(), [], curTok.position);
        }
        if (this.checkKeywordToken(curTok, '{')) {
            ++this.position;
            return this.parseTypeRow();
        }
        if (this.checkKeywordToken(curTok, '(')) {
            ++this.position;
            if (this.checkKeywordToken(this.currentToken(), ')')) {
                throw new errors_1.ParserError('Use "{}" or "unit" to denote the unit type.', this.currentToken().position);
            }
            var res = [this.parseType()];
            while (true) {
                var nextTok = this.currentToken();
                if (this.checkKeywordToken(nextTok, ',')) {
                    ++this.position;
                    res.push(this.parseType());
                    continue;
                }
                if (this.checkKeywordToken(nextTok, ')')) {
                    ++this.position;
                    if (res.length === 1) {
                        return res[0];
                    }
                    this.assertIdentifierOrLongToken(this.currentToken());
                    var name_1 = this.currentToken();
                    ++this.position;
                    return new types_1.CustomType(name_1.getText(), res, curTok.position);
                }
                throw new errors_1.ParserError('Expected "," or ")", got "' +
                    nextTok.getText() + '".', nextTok.position);
            }
        }
        throw new errors_1.ParserError('Expected either "(" or "{" got \"'
            + curTok.getText() + '\".', curTok.position);
    };
    Parser.prototype.parseType = function () {
        /*
         * ty ::= ty1 -> ty2        Function(param:Type, return:Type)
         */
        var curTy = this.parseTupleType();
        var curTok = this.currentToken();
        if (!this.checkKeywordToken(curTok, '->')) {
            return curTy;
        }
        ++this.position;
        var tgTy = this.parseType();
        return new types_1.FunctionType(curTy, tgTy, curTok.position);
    };
    Parser.prototype.parseTupleType = function () {
        /*
         * ty ::= ty1 * … * tyn     TupleType(types:Type[])
         */
        var curTy = [this.parseCustomType()];
        var curTok = this.currentToken();
        var pos = curTok.position;
        while (this.checkKeywordToken(this.currentToken(), '*')) {
            ++this.position;
            curTy.push(this.parseCustomType());
        }
        if (curTy.length === 1) {
            return curTy[0];
        }
        return new types_1.TupleType(curTy, pos);
    };
    Parser.prototype.parseCustomType = function () {
        /*
         * ty ::= ty longtycon    CustomType(fullName:String, tyArg:Type[])
         */
        var curTok = this.currentToken();
        var ty = this.parseSimpleType();
        while (this.position < this.tokens.length) {
            var nextTok = this.currentToken();
            if (!this.checkIdentifierOrLongToken(nextTok)) {
                return ty;
            }
            ++this.position;
            ty = new types_1.CustomType(nextTok.getText(), [ty], curTok.position);
            continue;
        }
        return ty;
    };
    Parser.prototype.parseValueBinding = function () {
        /*
         *  valbind ::= pat = exp       ValueBinding(pos, isRec, pat, exp)
         *              rec valbind     isRecursive = true
         */
        var curTok = this.currentToken();
        if (this.checkKeywordToken(curTok, 'rec')) {
            ++this.position;
            var res = this.parseValueBinding();
            res.position = curTok.position;
            res.isRecursive = true;
            return res;
        }
        var pat = this.parsePattern();
        this.assertKeywordToken(this.currentToken(), '=');
        ++this.position;
        return new declarations_1.ValueBinding(curTok.position, false, pat, this.parseExpression());
    };
    Parser.prototype.parseFunctionValueBinding = function () {
        var curTok = this.currentToken();
        var result = [];
        var argcnt = -1;
        var name = undefined;
        while (true) {
            var args = [];
            var ty = undefined;
            var nm = void 0;
            if (this.checkKeywordToken(this.currentToken(), '(')) {
                var pat = this.parsePattern();
                if ((!(pat instanceof expressions_1.FunctionApplication))
                    || (!(pat.argument.simplify() instanceof expressions_1.Record))
                    || ((pat.argument.simplify()).entries.length !== 2)
                    || (!(pat.func instanceof expressions_1.ValueIdentifier))) {
                    throw new errors_1.ParserError('If you start a function declaration with a "(",'
                        + ' some infix expression should follow. But you gave me "'
                        + pat + '" (' + pat.constructor.name + ').', pat.position);
                }
                nm = pat.func;
                args.push(pat.argument);
            }
            else {
                var oldPos = this.position;
                var throwError = false;
                var throwIfError = false;
                try {
                    var tok = this.parseOpIdentifierToken();
                    nm = new expressions_1.ValueIdentifier(tok.position, tok);
                    if (this.state.getInfixStatus(nm.name) !== undefined
                        && this.state.getInfixStatus(nm.name).infix
                        && !nm.name.opPrefixed) {
                        throwError = true;
                        throw new errors_1.ParserError('Missing "op".', nm.name.position);
                    }
                    while (true) {
                        if (this.checkKeywordToken(this.currentToken(), '=')
                            || this.checkKeywordToken(this.currentToken(), ':')) {
                            break;
                        }
                        var pat = this.parseAtomicPattern();
                        if (pat instanceof expressions_1.ValueIdentifier
                            && this.state.getInfixStatus(pat.name) !== undefined
                            && this.state.getInfixStatus(pat.name).infix) {
                            throwIfError = true;
                            throw new errors_1.ParserError('Cute little infix identifiers such as "' +
                                pat + '" sure should play somewhere else.', pat.position);
                        }
                        args.push(pat);
                    }
                }
                catch (e) {
                    if (throwError) {
                        throw e;
                    }
                    throwError = false;
                    try {
                        // Again infix
                        this.position = oldPos;
                        var left = this.parseAtomicPattern();
                        this.assertIdentifierOrLongToken(this.currentToken());
                        nm = new expressions_1.ValueIdentifier(this.currentToken().position, this.currentToken());
                        if (this.state.getInfixStatus(this.currentToken()) === undefined
                            || !this.state.getInfixStatus(this.currentToken()).infix) {
                            if (throwIfError) {
                                throwError = true;
                                throw e;
                            }
                            throw new errors_1.ParserError('"' + this.currentToken().getText()
                                + '" does not have infix status.', this.currentToken().position);
                        }
                        ++this.position;
                        var right = this.parseAtomicPattern();
                        args.push(new expressions_1.Tuple(-1, [left, right]));
                    }
                    catch (f) {
                        // It wasn't infix at all, but simply wrong.
                        throw e;
                    }
                }
            }
            if (this.checkKeywordToken(this.currentToken(), ':')) {
                ++this.position;
                ty = this.parseType();
            }
            this.assertKeywordToken(this.currentToken(), '=');
            ++this.position;
            if (argcnt === -1) {
                argcnt = args.length;
            }
            else if (argcnt !== 2 && argcnt !== 3 && argcnt !== args.length) {
                throw new errors_1.ParserError('Different number of arguments.', curTok.position);
            }
            if (argcnt === 0) {
                throw new errors_1.ParserError('Functions need arguments to survive. Rely on "val" instead.', curTok.position);
            }
            if (name === undefined) {
                name = nm;
            }
            else if (nm.name.getText() !== name.name.getText()) {
                throw new errors_1.ParserError('Different function names in different cases ("' + nm.name.getText()
                    + '" vs. "' + name.name.getText() + '")', curTok.position);
            }
            result.push([args, ty, this.parseExpression()]);
            if (this.checkKeywordToken(this.currentToken(), '|')) {
                ++this.position;
                continue;
            }
            break;
        }
        return new declarations_1.FunctionValueBinding(curTok.position, result, name);
    };
    Parser.prototype.parseTypeBinding = function () {
        /*
         * tybind ::= tyvarseq tycon = ty       TypeBinding(pos, TypeVariable[], IdentifierToken, Type)
         */
        var curTok = this.currentToken();
        var tyvar = this.parseTypeVarSequence();
        this.assertIdentifierToken(this.currentToken());
        var vid = this.currentToken();
        ++this.position;
        this.assertKeywordToken(this.currentToken(), '=');
        ++this.position;
        return new declarations_1.TypeBinding(curTok.position, tyvar, vid, this.parseType());
    };
    Parser.prototype.parseTypeBindingSeq = function () {
        var tybinds = [];
        while (true) {
            tybinds.push(this.parseTypeBinding());
            if (this.checkKeywordToken(this.currentToken(), 'and')) {
                ++this.position;
            }
            else {
                break;
            }
        }
        return tybinds;
    };
    Parser.prototype.parseExceptionBinding = function () {
        var curTok = this.currentToken();
        var name = this.parseOpIdentifierToken();
        if (this.checkKeywordToken(this.currentToken(), 'of')) {
            ++this.position;
            var ty = this.parseType();
            return new declarations_1.DirectExceptionBinding(curTok.position, name, ty);
        }
        if (this.checkKeywordToken(this.currentToken(), '=')) {
            ++this.position;
            var oldname = this.parseOpIdentifierToken(true);
            return new declarations_1.ExceptionAlias(curTok.position, name, oldname);
        }
        return new declarations_1.DirectExceptionBinding(curTok.position, name, undefined);
    };
    Parser.prototype.parseDatatypeBinding = function () {
        var curTok = this.currentToken();
        var tyvars = this.parseTypeVarSequence();
        this.assertIdentifierToken(this.currentToken());
        var tycon = this.currentToken();
        ++this.position;
        this.assertKeywordToken(this.currentToken(), '=');
        ++this.position;
        var constrs = [];
        while (true) {
            var name_2 = this.parseOpIdentifierToken();
            if (this.checkKeywordToken(this.currentToken(), 'of')) {
                ++this.position;
                var ty = this.parseType();
                constrs.push([name_2, ty]);
            }
            else {
                constrs.push([name_2, undefined]);
            }
            if (this.checkKeywordToken(this.currentToken(), '|')) {
                ++this.position;
            }
            else {
                break;
            }
        }
        return new declarations_1.DatatypeBinding(curTok.position, tyvars, tycon, constrs);
    };
    Parser.prototype.parseDatatypeBindingSeq = function () {
        var datbinds = [];
        while (true) {
            datbinds.push(this.parseDatatypeBinding());
            if (this.checkKeywordToken(this.currentToken(), 'and')) {
                ++this.position;
            }
            else {
                break;
            }
        }
        return datbinds;
    };
    Parser.prototype.parseStructureBinding = function () {
        /*
         * strbind ::= strid = strexp
         *             strid : sigexp = strexp
         *             strid :> sigexp = strexp
         */
        var curTok = this.currentToken();
        this.assertIdentifierToken(this.currentToken());
        var tycon = this.currentToken();
        ++this.position;
        if (this.checkKeywordToken(this.currentToken(), ':')) {
            ++this.position;
            var sig = this.parseSignatureExpression();
            this.assertKeywordToken(this.currentToken(), '=');
            ++this.position;
            var str = this.parseStructureExpression();
            return new modules_1.StructureBinding(curTok.position, tycon, new modules_1.TransparentConstraint(curTok.position, str, sig));
        }
        else if (this.checkKeywordToken(this.currentToken(), ':>')) {
            ++this.position;
            var sig = this.parseSignatureExpression();
            this.assertKeywordToken(this.currentToken(), '=');
            ++this.position;
            var str = this.parseStructureExpression();
            return new modules_1.StructureBinding(curTok.position, tycon, new modules_1.OpaqueConstraint(curTok.position, str, sig));
        }
        this.assertKeywordToken(this.currentToken(), '=');
        ++this.position;
        return new modules_1.StructureBinding(curTok.position, tycon, this.parseStructureExpression());
    };
    Parser.prototype.parseStructureBindingSeq = function () {
        var strbinds = [];
        while (true) {
            strbinds.push(this.parseStructureBinding());
            if (this.checkKeywordToken(this.currentToken(), 'and')) {
                ++this.position;
            }
            else {
                break;
            }
        }
        return strbinds;
    };
    Parser.prototype.parseSignatureBinding = function () {
        /*
         * sigbind ::= sigid = sigexp
         */
        var curTok = this.currentToken();
        this.assertIdentifierToken(this.currentToken());
        var tycon = this.currentToken();
        ++this.position;
        this.assertKeywordToken(this.currentToken(), '=');
        ++this.position;
        return new modules_1.SignatureBinding(curTok.position, tycon, this.parseSignatureExpression());
    };
    Parser.prototype.parseSignatureBindingSeq = function () {
        var sigbinds = [];
        while (true) {
            sigbinds.push(this.parseSignatureBinding());
            if (this.checkKeywordToken(this.currentToken(), 'and')) {
                ++this.position;
            }
            else {
                break;
            }
        }
        return sigbinds;
    };
    Parser.prototype.parseFunctorBinding = function () {
        /*
         * funbind ::= funid (tycon : sigexp) = strexp
         *             funid (tycon : sigexp) : sigexp' = strexp
         *             funid (tycon : sigexp) :> sigexp' = strexp
         *             funid (spec) [: sigexp] = strexp
         *             funid (spec) [:> sigexp] = strexp
         */
        var curTok = this.currentToken();
        this.assertIdentifierToken(this.currentToken());
        var funid = this.currentToken();
        ++this.position;
        this.assertKeywordToken(this.currentToken(), '(');
        ++this.position;
        if (this.currentToken() instanceof tokens_1.IdentifierToken) {
            var tycon = this.currentToken();
            ++this.position;
            this.assertKeywordToken(this.currentToken(), ':');
            ++this.position;
            var sigexp = this.parseSignatureExpression();
            this.assertKeywordToken(this.currentToken(), ')');
            ++this.position;
            if (this.checkKeywordToken(this.currentToken(), ':')) {
                ++this.position;
                var sg = this.parseSignatureExpression();
                this.assertKeywordToken(this.currentToken(), '=');
                ++this.position;
                return new modules_1.FunctorBinding(curTok.position, funid, tycon, sigexp, new modules_1.TransparentConstraint(curTok.position, this.parseStructureExpression(), sg));
            }
            else if (this.checkKeywordToken(this.currentToken(), ':>')) {
                ++this.position;
                var sg = this.parseSignatureExpression();
                this.assertKeywordToken(this.currentToken(), '=');
                ++this.position;
                return new modules_1.FunctorBinding(curTok.position, funid, tycon, sigexp, new modules_1.OpaqueConstraint(curTok.position, this.parseStructureExpression(), sg));
            }
            this.assertKeywordToken(this.currentToken(), '=');
            ++this.position;
            return new modules_1.FunctorBinding(curTok.position, funid, tycon, sigexp, this.parseStructureExpression());
        }
        var spec = this.parseSpecification();
        var specsig = new modules_1.SignatureExpression(-1, spec);
        this.assertKeywordToken(this.currentToken(), ')');
        ++this.position;
        var opaque = false;
        var sig = undefined;
        if (this.checkKeywordToken(this.currentToken(), ':')) {
            ++this.position;
            sig = this.parseSignatureExpression();
        }
        else if (this.checkKeywordToken(this.currentToken(), ':>')) {
            opaque = true;
            ++this.position;
            sig = this.parseSignatureExpression();
        }
        this.assertKeywordToken(this.currentToken(), '=');
        ++this.position;
        var str = this.parseStructureExpression();
        var strid = new tokens_1.AlphanumericIdentifierToken('__farg', -1);
        if (sig !== undefined) {
            if (opaque) {
                str = new modules_1.OpaqueConstraint(-1, str, sig);
            }
            else {
                str = new modules_1.TransparentConstraint(-1, str, sig);
            }
        }
        str = new modules_1.LocalDeclarationStructureExpression(-1, new declarations_1.OpenDeclaration(-1, [strid]), str);
        return new modules_1.FunctorBinding(curTok.position, funid, strid, specsig, str);
    };
    Parser.prototype.parseFunctorBindingSeq = function () {
        var funbinds = [];
        while (true) {
            funbinds.push(this.parseFunctorBinding());
            if (this.checkKeywordToken(this.currentToken(), 'and')) {
                ++this.position;
            }
            else {
                break;
            }
        }
        return funbinds;
    };
    Parser.prototype.parseTypeVarSequence = function (allowFail) {
        if (allowFail === void 0) { allowFail = false; }
        /*
         * ε                    []
         * tyvar                [TypeVariable]
         * (tyvar1,…,tyvarn)    TypeVariable[]
         */
        var curTok = this.currentToken();
        var res = [];
        if (curTok instanceof tokens_1.TypeVariableToken) {
            res.push(new types_1.TypeVariable(curTok.text, curTok.position));
            ++this.position;
            return res;
        }
        if (this.checkKeywordToken(curTok, '(')) {
            ++this.position;
            while (true) {
                curTok = this.currentToken();
                if (!(curTok instanceof tokens_1.TypeVariableToken)) {
                    if (allowFail) {
                        return undefined;
                    }
                    throw new errors_1.ParserError('Expected a type varible.', curTok.position);
                }
                res.push(new types_1.TypeVariable(curTok.text, curTok.position));
                ++this.position;
                curTok = this.currentToken();
                if (this.checkKeywordToken(curTok, ',')) {
                    ++this.position;
                    continue;
                }
                else if (this.checkKeywordToken(curTok, ')')) {
                    ++this.position;
                    break;
                }
                throw new errors_1.ParserError('Expected "," or ")" but got "'
                    + curTok.getText() + '".', curTok.position);
            }
        }
        return res;
    };
    Parser.prototype.parseDeclaration = function (topLevel, strDec) {
        if (topLevel === void 0) { topLevel = false; }
        if (strDec === void 0) { strDec = false; }
        /*
         * dec ::= dec [;] dec                          SequentialDeclaration(pos, Declaration[])
         */
        var res = [];
        var curTok = this.currentToken();
        var curId = this.currentId++;
        while (this.position < this.tokens.length) {
            var cur = this.parseSimpleDeclaration(topLevel, strDec);
            if (cur instanceof declarations_1.EmptyDeclaration) {
                if (this.position >= this.tokens.length
                    || this.checkKeywordToken(this.currentToken(), 'in')
                    || this.checkKeywordToken(this.currentToken(), 'end')) {
                    break;
                }
                continue;
            }
            res.push(cur);
            if (this.checkKeywordToken(this.currentToken(), ';')) {
                ++this.position;
            }
        }
        return new declarations_1.SequentialDeclaration(curTok.position, res, curId);
    };
    Parser.prototype.parseSimpleDeclaration = function (topLevel, strDec) {
        if (topLevel === void 0) { topLevel = false; }
        if (strDec === void 0) { strDec = false; }
        /*
         * dec ::= val tyvarseq valbind                 ValueDeclaration(pos, tyvarseq, ValueBinding[])
         *         fun tyvarseq fvalbind                FunctionDeclaration(pos, tyvarseq, FunctionValueBinding[])
         *         type typbind                         TypeDeclaration(pos, TypeBinding[])
         *         datatype datbind [withtype typbind]  DatatypeDeclaration(pos, DTBind[], TypeBind[]|undefined)
         *         datatype tycon = datatype ltycon   DatatypeReplication(pos, IdentifierToken, oldname: Token)
         *         abstype datbind [withtype typbind]
         *              with dec end                    AbstypeDeclaration(pos, DTBind[], TypeBing[]|undef, Decl)
         *         exception exbind                     ExceptionDeclaration(pos, ExceptionBinding[])
         *         local dec1 in dec2 end               LocalDeclaration(pos, Declaration, body:Declaration)
         *         open longstrid1 … longstr1dn         OpenDeclaration(pos, names: Token[])
         *         infix [d] vid1 … vidn                InfixDeclaration(pos, ValueIdentifier[], d=0)
         *         infixr [d] vid1 … vidn               InfixRDeclaration(pos, ValueIdentifier[], d=0)
         *         nonfix vid1 … vidn                   NonfixDeclaration(pos, ValueIdentifier[])
         *
         *         structure strbind                    StructureDeclaration(pos, StrBind[])
         *         signature sigbind                    SignatureDeclaration(pos, SigBind[])
         *         functor funbind                      FunctorDeclaration(pos, FunBind[])
         *
         *         do exp                               Evaluation(pos, exp) [succML]
         *
         *         (empty)                              EmptyDeclaration()
         *         exp                                  val it = exp
         */
        var curTok = this.currentToken();
        var curId = this.currentId++;
        if (this.checkKeywordToken(curTok, 'val')) {
            ++this.position;
            var tyvar = this.parseTypeVarSequence(true);
            if (tyvar === undefined) {
                --this.position;
                tyvar = [];
            }
            var valbinds = [];
            var isRec = false;
            while (true) {
                var curbnd = this.parseValueBinding();
                if (curbnd.isRecursive) {
                    isRec = true;
                    if (!(curbnd.expression instanceof expressions_1.Lambda)) {
                        throw new errors_1.ParserError('Using "rec" requires binding a lambda.', curbnd.position);
                    }
                    if (!(curbnd.pattern instanceof expressions_1.ValueIdentifier)
                        && !(curbnd.pattern instanceof expressions_1.Wildcard)) {
                        throw new errors_1.ParserError('Using "rec" requires binding to a single identifier'
                            + ' and not "' + curbnd.pattern.toString(0, true) + '".', curbnd.position);
                    }
                }
                curbnd.isRecursive = isRec;
                valbinds.push(curbnd);
                if (this.checkKeywordToken(this.currentToken(), 'and')) {
                    ++this.position;
                }
                else {
                    break;
                }
            }
            return new declarations_1.ValueDeclaration(curTok.position, tyvar, valbinds, curId);
        }
        else if (this.checkKeywordToken(curTok, 'fun')) {
            ++this.position;
            var tyvar = this.parseTypeVarSequence(true);
            if (tyvar === undefined) {
                --this.position;
                tyvar = [];
            }
            var fvalbinds = [];
            while (true) {
                fvalbinds.push(this.parseFunctionValueBinding());
                if (this.checkKeywordToken(this.currentToken(), 'and')) {
                    ++this.position;
                }
                else {
                    break;
                }
            }
            return new declarations_1.FunctionDeclaration(curTok.position, tyvar, fvalbinds, curId);
        }
        else if (this.checkKeywordToken(curTok, 'type')) {
            ++this.position;
            return new declarations_1.TypeDeclaration(curTok.position, this.parseTypeBindingSeq(), curId);
        }
        else if (this.checkKeywordToken(curTok, 'datatype')) {
            if (this.position + 3 < this.tokens.length &&
                this.checkKeywordToken(this.tokens[this.position + 3], 'datatype')) {
                ++this.position;
                var nw = this.currentToken();
                this.assertIdentifierToken(nw);
                this.position += 2;
                var old = this.currentToken();
                this.assertIdentifierOrLongToken(old);
                return new declarations_1.DatatypeReplication(curTok.position, nw, old, curId);
            }
            else {
                ++this.position;
                var datbind = this.parseDatatypeBindingSeq();
                if (this.checkKeywordToken(this.currentToken(), 'withtype')) {
                    ++this.position;
                    var tp = this.parseTypeBindingSeq();
                    return new declarations_1.DatatypeDeclaration(curTok.position, datbind, tp, curId);
                }
                return new declarations_1.DatatypeDeclaration(curTok.position, datbind, undefined, curId);
            }
        }
        else if (this.checkKeywordToken(curTok, 'abstype')) {
            ++this.position;
            var nstate = this.state;
            this.state = this.state.getNestedState(this.state.id);
            var datbind = this.parseDatatypeBindingSeq();
            var tybind = undefined;
            if (this.checkKeywordToken(this.currentToken(), 'withtype')) {
                ++this.position;
                tybind = this.parseTypeBindingSeq();
            }
            this.assertKeywordToken(this.currentToken(), 'with');
            ++this.position;
            var dec = this.parseDeclaration();
            this.assertKeywordToken(this.currentToken(), 'end');
            ++this.position;
            this.state = nstate;
            return new declarations_1.AbstypeDeclaration(curTok.position, datbind, tybind, dec, curId);
        }
        else if (this.checkKeywordToken(curTok, 'exception')) {
            ++this.position;
            var bnds = [];
            while (true) {
                bnds.push(this.parseExceptionBinding());
                if (this.checkKeywordToken(this.currentToken(), 'and')) {
                    ++this.position;
                }
                else {
                    break;
                }
            }
            return new declarations_1.ExceptionDeclaration(curTok.position, bnds, curId);
        }
        else if (this.checkKeywordToken(curTok, 'local')) {
            ++this.position;
            var nstate = this.state;
            this.state = this.state.getNestedState(this.state.id);
            var dec = this.parseDeclaration(false, strDec);
            this.assertKeywordToken(this.currentToken(), 'in');
            ++this.position;
            var dec2 = this.parseDeclaration(false, strDec);
            this.assertKeywordToken(this.currentToken(), 'end');
            ++this.position;
            this.state = nstate;
            return new declarations_1.LocalDeclaration(curTok.position, dec, dec2, curId);
        }
        else if (this.checkKeywordToken(curTok, 'open')) {
            ++this.position;
            var res = [];
            while (this.checkIdentifierOrLongToken(this.currentToken())) {
                res.push(this.currentToken());
                ++this.position;
            }
            if (res.length === 0) {
                throw new errors_1.ParserError('Empty "open" declaration.', this.currentToken().position);
            }
            return new declarations_1.OpenDeclaration(curTok.position, res, curId);
        }
        else if (this.checkKeywordToken(curTok, 'infix')) {
            ++this.position;
            var precedence = 0;
            if (this.currentToken() instanceof tokens_1.IntegerConstantToken) {
                if (this.currentToken().text.length !== 1) {
                    throw new errors_1.ParserError('Precedences may only be single digits.', this.currentToken().position);
                }
                precedence = this.currentToken().value;
                ++this.position;
            }
            var res = [];
            while (this.currentToken().isVid()) {
                res.push(this.currentToken());
                ++this.position;
            }
            if (res.length === 0) {
                throw new errors_1.ParserError('Empty "infix" declaration.', this.currentToken().position);
            }
            var resdec = new declarations_1.InfixDeclaration(curTok.position, res, precedence, curId);
            this.state = resdec.evaluate(this.state)[0];
            return resdec;
        }
        else if (this.checkKeywordToken(curTok, 'infixr')) {
            ++this.position;
            var precedence = 0;
            if (this.currentToken() instanceof tokens_1.IntegerConstantToken) {
                if (this.currentToken().text.length !== 1) {
                    throw new errors_1.ParserError('Precedences may only be single digits.', this.currentToken().position);
                }
                precedence = this.currentToken().value;
                ++this.position;
            }
            var res = [];
            while (this.currentToken().isVid()) {
                res.push(this.currentToken());
                ++this.position;
            }
            if (res.length === 0) {
                throw new errors_1.ParserError('Empty "infixr" declaration.', this.currentToken().position);
            }
            var resdec = new declarations_1.InfixRDeclaration(curTok.position, res, precedence, curId);
            this.state = resdec.evaluate(this.state)[0];
            return resdec;
        }
        else if (this.checkKeywordToken(curTok, 'nonfix')) {
            ++this.position;
            var res = [];
            while (this.currentToken().isVid()) {
                res.push(this.currentToken());
                ++this.position;
            }
            if (res.length === 0) {
                throw new errors_1.ParserError('Empty "nonfix" declaration.', this.currentToken().position);
            }
            var resdec = new declarations_1.NonfixDeclaration(curTok.position, res, curId);
            this.state = resdec.evaluate(this.state)[0];
            return resdec;
        }
        if (this.options.allowSuccessorML && this.checkKeywordToken(curTok, 'do')) {
            ++this.position;
            return new declarations_1.Evaluation(curTok.position, this.parseExpression());
        }
        if (this.options.allowStructuresAnywhere === true || strDec) {
            if (this.checkKeywordToken(curTok, 'structure')) {
                ++this.position;
                return new modules_1.StructureDeclaration(curTok.position, this.parseStructureBindingSeq());
            }
        }
        if (this.options.allowSignaturesAnywhere === true || topLevel) {
            if (this.checkKeywordToken(curTok, 'signature')) {
                ++this.position;
                return new modules_1.SignatureDeclaration(curTok.position, this.parseSignatureBindingSeq());
            }
        }
        if (this.options.allowFunctorsAnywhere === true || topLevel) {
            if (this.checkKeywordToken(curTok, 'functor')) {
                ++this.position;
                return new modules_1.FunctorDeclaration(curTok.position, this.parseFunctorBindingSeq());
            }
        }
        if (this.checkKeywordToken(curTok, ';')) {
            ++this.position;
            return new declarations_1.EmptyDeclaration(curId);
        }
        else if (this.checkKeywordToken(curTok, 'in')
            || this.checkKeywordToken(curTok, 'end')) {
            return new declarations_1.EmptyDeclaration(curId);
        }
        if (topLevel) {
            var exp = this.parseExpression();
            var valbnd = new declarations_1.ValueBinding(curTok.position, false, new expressions_1.ValueIdentifier(-1, new tokens_1.AlphanumericIdentifierToken('it', -1)), exp);
            this.assertKeywordToken(this.currentToken(), ';');
            return new declarations_1.ValueDeclaration(curTok.position, [], [valbnd], curId);
        }
        throw new errors_1.ParserError('Expected a declaration.', curTok.position);
    };
    Parser.prototype.currentToken = function () {
        if (this.position >= this.tokens.length) {
            throw new errors_1.IncompleteError(-1, 'More input, I\'m starving. ~nyan.');
        }
        return this.tokens[this.position];
    };
    return Parser;
}());
exports.Parser = Parser;
function parse(tokens, state, options) {
    if (options === void 0) { options = {}; }
    var p = new Parser(tokens, state, state.id, options);
    return p.parseDeclaration(true, true);
}
exports.parse = parse;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__(2);
var types_1 = __webpack_require__(4);
var values_1 = __webpack_require__(3);
var errors_1 = __webpack_require__(0);
var Interpreter = __webpack_require__(8);
var intType = new types_1.CustomType('int');
var realType = new types_1.CustomType('real');
// let wordType = new CustomType('word');
// let boolType = new CustomType('bool');
// let stringType = new CustomType('string');
var charType = new types_1.CustomType('char');
function addMathLib(state) {
    state.setDynamicValue('Math.sqrt', new values_1.PredefinedFunction('Math.sqrt', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            if (value < 0) {
                return [new values_1.ExceptionConstructor('Domain').construct(), true, []];
            }
            return [new values_1.Real(Math.sqrt(value)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.sqrt', new types_1.FunctionType(realType, realType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.sin', new values_1.PredefinedFunction('Math.sin', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            return [new values_1.Real(Math.sin(value)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.sin', new types_1.FunctionType(realType, realType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.cos', new values_1.PredefinedFunction('Math.cos', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            return [new values_1.Real(Math.cos(value)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.cos', new types_1.FunctionType(realType, realType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.asin', new values_1.PredefinedFunction('Math.asin', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            return [new values_1.Real(Math.asin(value)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.asin', new types_1.FunctionType(realType, realType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.acos', new values_1.PredefinedFunction('Math.acos', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            return [new values_1.Real(Math.acos(value)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.acos', new types_1.FunctionType(realType, realType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.exp', new values_1.PredefinedFunction('Math.exp', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            return [new values_1.Real(Math.exp(value)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.exp', new types_1.FunctionType(realType, realType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.pow', new values_1.PredefinedFunction('Math.sin', function (val) {
        if (val instanceof values_1.RecordValue) {
            var val1 = val.getValue('1');
            var val2 = val.getValue('2');
            if (val1 instanceof values_1.Real && val2 instanceof values_1.Real) {
                var value1 = val1.value;
                var value2 = val1.value;
                return [new values_1.Real(Math.pow(value1, value2)), false, []];
            }
            else {
                throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
            }
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.pow', new types_1.FunctionType(new types_1.TupleType([realType, realType]), realType).simplify(), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.ln', new values_1.PredefinedFunction('Math.ln', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            return [new values_1.Real(Math.log(value)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.ln', new types_1.FunctionType(realType, realType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.log10', new values_1.PredefinedFunction('Math.log10', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            return [new values_1.Real(Math.log10(value)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.log10', new types_1.FunctionType(realType, realType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.pi', new values_1.Real(3.14159265359), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.pi', realType, state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Math.e', new values_1.Real(2.71828182846), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Math.e', realType, state_1.IdentifierStatus.VALUE_VARIABLE);
    return state;
}
function addCharLib(state) {
    state.setDynamicValue('ord', new values_1.PredefinedFunction('ord', function (val) {
        if (val instanceof values_1.CharValue) {
            var value = val.value;
            return [new values_1.Integer(value.charCodeAt(0)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('ord', new types_1.FunctionType(charType, intType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('chr', new values_1.PredefinedFunction('chr', function (val) {
        if (val instanceof values_1.Integer) {
            var value = val.value;
            if (value < 0 || value > 255) {
                return [new values_1.ExceptionConstructor('Chr').construct(), true, []];
            }
            return [new values_1.CharValue(String.fromCharCode(value)), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('chr', new types_1.FunctionType(intType, charType), state_1.IdentifierStatus.VALUE_VARIABLE);
    return state;
}
function addRealLib(state) {
    state.setDynamicValue('Real.fromInt', new values_1.PredefinedFunction('Real.fromInt', function (val) {
        if (val instanceof values_1.Integer) {
            var value = val.value;
            return [new values_1.Real(value), false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Real.fromInt', new types_1.FunctionType(intType, realType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Real.round', new values_1.PredefinedFunction('Real.round', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            var integer = new values_1.Integer(Math.round(value));
            if (integer.hasOverflow()) {
                return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
            }
            return [integer, false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Real.round', new types_1.FunctionType(realType, intType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Real.floor', new values_1.PredefinedFunction('Real.floor', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            var integer = new values_1.Integer(Math.floor(value));
            if (integer.hasOverflow()) {
                return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
            }
            return [integer, false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Real.floor', new types_1.FunctionType(realType, intType), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setDynamicValue('Real.ceil', new values_1.PredefinedFunction('Real.ceil', function (val) {
        if (val instanceof values_1.Real) {
            var value = val.value;
            var integer = new values_1.Integer(Math.round(value));
            if (integer.hasOverflow()) {
                return [new values_1.ExceptionConstructor('Overflow').construct(), true, []];
            }
            return [integer, false, []];
        }
        else {
            throw new errors_1.InternalInterpreterError(-1, 'std type mismatch');
        }
    }), state_1.IdentifierStatus.VALUE_VARIABLE);
    state.setStaticValue('Real.ceil', new types_1.FunctionType(realType, intType), state_1.IdentifierStatus.VALUE_VARIABLE);
    return state;
}
var code = "\nexception Domain;\nexception Empty;\nexception Subscript;\nexception Size;\nexception Chr;\n\nfun o (f,g) x = f (g x);\ninfix 3 o;\n\ndatatype order = LESS | EQUAL | GREATER;\n\nfun Int.compare (x, y: int) = if x<y then LESS else if x>y then GREATER else EQUAL;\nfun Real.compare (x, y: real) = if x<y then LESS else if x>y then GREATER else EQUAL;\n\nexception Option.Option;\ndatatype 'a option = NONE | SOME of 'a;\nfun valOf (SOME x) = x\n  | valOf NONE = raise Option.Option;\nfun isSome NONE = false\n  | isSome (SOME _) = true;\n\nval Int.minInt = SOME ~1073741824;\nval Int.maxInt = SOME 1073741823;\nfun Int.max (x, y) = if x < y then y else x : int;\n\nfun not true = false | not false = true;\n\nfun hd nil = raise Empty\n| hd (x::xr) = x;\nfun tl nil = raise Empty\n| tl (x::xr) = xr;\nfun null nil = true\n| null (x::xr) = false;\n\nfun map f nil = nil\n  | map f (x::xr) = (f x) :: (map f xr);\n\nfun @ (nil,ys) = ys\n| @((x::xr),ys) = x:: @(xr,ys);\ninfixr 5 @;\n\nfun length nil = 0\n  | length (x::xr) = 1 + length xr;\n\nfun rev nil = nil\n  | rev (x::xr) = rev xr @ [x];\n\nfun List.concat nil = nil\n  | List.concat (x::xr) = x @ List.concat xr;\n\nfun foldr f e []      = e\n  | foldr f e (x::xr) = f(x, foldr f e xr);\n\nfun foldl f e []      = e\n  | foldl f e (x::xr) = foldl f (f(x, e)) xr;\n\nfun List.tabulate (n, f) =\n  let fun h i = if i<n then f i :: h (i+1) else []\n  in if n<0 then raise Size else h 0 end;\n\nfun List.exists p []      = false\n  | List.exists p (x::xr) = p x orelse List.exists p xr;\n\nfun List.all p []      = true\n  | List.all p (x::xr) = p x andalso List.all p xr;\n\nfun List.filter p []      = []\n  | List.filter p (x::xr) = if p x then x :: List.filter p xr else List.filter p xr;\n\nfun List.collate (compare : 'a * 'a -> order) p = case p of\n    (nil, _::_) => LESS\n  | (nil, nil) => EQUAL\n  | (_::_, nil) => GREATER\n  | (x::xr, y::yr) => case compare(x,y) of\n         EQUAL => List.collate compare (xr,yr)\n       | s => s;\n\nfun List.nth (xs, n) =\n    let fun h []      _ = raise Subscript\n      | h (x::xr) n = if n=0 then x else h xr (n-1)\n    in if n<0 then raise Subscript else h xs n end;\n\nfun Char.isLower c  = #\"a\" <= c andalso c <= #\"z\";\nfun Char.isUpper c  = #\"A\" <= c andalso c <= #\"Z\";\nfun Char.isDigit c  = #\"0\" <= c andalso c <= #\"9\";\nfun Char.isAlpha c  = Char.isLower c orelse Char.isUpper c;\n\nfun ! (a : 'A ref): 'A = ! a;\nfun op := ((a, b) : ('A ref * 'A)): unit = a := b;\nfun ref (a : 'A): 'A ref = ref a;\n";
function addStdLib(state, options) {
    state = addMathLib(state);
    state = addCharLib(state);
    state = addRealLib(state);
    state = Interpreter.interpret(code, state, options).state;
    return state;
}
exports.addStdLib = addStdLib;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var expressions_1 = __webpack_require__(7);
var declarations_1 = __webpack_require__(6);
var tokens_1 = __webpack_require__(1);
var state_1 = __webpack_require__(2);
var errors_1 = __webpack_require__(0);
var values_1 = __webpack_require__(3);
var initialState_1 = __webpack_require__(5);
var StructureExpression = (function (_super) {
    __extends(StructureExpression, _super);
    // struct <strdec> end
    function StructureExpression(position, structureDeclaration) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.structureDeclaration = structureDeclaration;
        return _this;
    }
    StructureExpression.prototype.simplify = function () {
        return new StructureExpression(this.position, this.structureDeclaration.simplify());
    };
    StructureExpression.prototype.computeStructure = function (state) {
        var nstate = state.getNestedState(0).getNestedState(state.id);
        var tmp = this.structureDeclaration.evaluate(nstate);
        var mem = tmp[0].getMemoryChanges(0);
        if (tmp[1]) {
            return [tmp[2], tmp[3], mem];
        }
        return [tmp[0].getDynamicChanges(0), tmp[3], mem];
    };
    StructureExpression.prototype.toString = function () {
        return 'struct ' + this.structureDeclaration + ' end';
    };
    return StructureExpression;
}(expressions_1.Expression));
exports.StructureExpression = StructureExpression;
var StructureIdentifier = (function (_super) {
    __extends(StructureIdentifier, _super);
    // longstrid
    function StructureIdentifier(position, identifier) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.identifier = identifier;
        return _this;
    }
    StructureIdentifier.prototype.simplify = function () {
        return this;
    };
    StructureIdentifier.prototype.computeStructure = function (state) {
        var res = undefined;
        if (this.identifier instanceof tokens_1.LongIdentifierToken) {
            var st = state.getAndResolveDynamicStructure(this.identifier);
            if (st !== undefined) {
                res = st.getStructure(this.identifier.id.getText());
            }
        }
        else {
            res = state.getDynamicStructure(this.identifier.getText());
        }
        if (res === undefined) {
            throw new errors_1.EvaluationError(this.position, 'Undefined module "'
                + this.identifier.getText() + '".');
        }
        return [res, [], []];
    };
    StructureIdentifier.prototype.toString = function () {
        return this.identifier.getText();
    };
    return StructureIdentifier;
}(expressions_1.Expression));
exports.StructureIdentifier = StructureIdentifier;
var TransparentConstraint = (function (_super) {
    __extends(TransparentConstraint, _super);
    // strexp : sigexp
    function TransparentConstraint(position, structureExpression, signatureExpression) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.structureExpression = structureExpression;
        _this.signatureExpression = signatureExpression;
        return _this;
    }
    TransparentConstraint.prototype.simplify = function () {
        return new TransparentConstraint(this.position, this.structureExpression.simplify(), this.signatureExpression.simplify());
    };
    TransparentConstraint.prototype.computeStructure = function (state) {
        var tmp = this.structureExpression.computeStructure(state);
        if (tmp[0] instanceof values_1.Value) {
            return tmp;
        }
        var sig = this.signatureExpression.computeInterface(state);
        return [tmp[0].restrict(sig), tmp[1], tmp[2]];
    };
    TransparentConstraint.prototype.toString = function () {
        return this.structureExpression + ' : ' + this.signatureExpression;
    };
    return TransparentConstraint;
}(expressions_1.Expression));
exports.TransparentConstraint = TransparentConstraint;
var OpaqueConstraint = (function (_super) {
    __extends(OpaqueConstraint, _super);
    // strexp :> sigexp
    function OpaqueConstraint(position, structureExpression, signatureExpression) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.structureExpression = structureExpression;
        _this.signatureExpression = signatureExpression;
        return _this;
    }
    OpaqueConstraint.prototype.simplify = function () {
        return new OpaqueConstraint(this.position, this.structureExpression.simplify(), this.signatureExpression.simplify());
    };
    OpaqueConstraint.prototype.computeStructure = function (state) {
        var tmp = this.structureExpression.computeStructure(state);
        if (tmp[0] instanceof values_1.Value) {
            return tmp;
        }
        var sig = this.signatureExpression.computeInterface(state);
        return [tmp[0].restrict(sig), tmp[1], tmp[2]];
    };
    OpaqueConstraint.prototype.toString = function () {
        return this.structureExpression + ' :> ' + this.signatureExpression;
    };
    return OpaqueConstraint;
}(expressions_1.Expression));
exports.OpaqueConstraint = OpaqueConstraint;
var FunctorApplication = (function (_super) {
    __extends(FunctorApplication, _super);
    // funid ( strexp )
    function FunctorApplication(position, functorId, structureExpression) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.functorId = functorId;
        _this.structureExpression = structureExpression;
        return _this;
    }
    FunctorApplication.prototype.simplify = function () {
        return new FunctorApplication(this.position, this.functorId, this.structureExpression.simplify());
    };
    FunctorApplication.prototype.computeStructure = function (state) {
        var fun = state.getDynamicFunctor(this.functorId.getText());
        if (fun === undefined) {
            throw new errors_1.EvaluationError(this.position, 'Undefined functor "' + this.functorId.getText() + '".');
        }
        var res = this.structureExpression.computeStructure(state);
        if (res[0] instanceof values_1.Value) {
            return res;
        }
        var nstate = fun.state.getNestedState(fun.state.id);
        for (var i = 0; i < res[2].length; ++i) {
            nstate.setCell(res[2][i][0], res[2][i][1]);
        }
        nstate.setDynamicStructure(fun.paramName.getText(), res[0].restrict(fun.param));
        var nres = fun.body.computeStructure(nstate);
        return [nres[0], res[1].concat(nres[1]), res[2].concat(nres[2])];
    };
    FunctorApplication.prototype.toString = function () {
        return this.functorId.getText() + '( ' + this.structureExpression + ' )';
    };
    return FunctorApplication;
}(expressions_1.Expression));
exports.FunctorApplication = FunctorApplication;
var LocalDeclarationStructureExpression = (function (_super) {
    __extends(LocalDeclarationStructureExpression, _super);
    // let strdec in exp1; ...; expn end
    // A sequential expression exp1; ... ; expn is represented as such,
    // despite the potentially missing parentheses
    function LocalDeclarationStructureExpression(position, declaration, expression) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.declaration = declaration;
        _this.expression = expression;
        return _this;
    }
    LocalDeclarationStructureExpression.prototype.simplify = function () {
        return new LocalDeclarationStructureExpression(this.position, this.declaration.simplify(), this.expression.simplify());
    };
    LocalDeclarationStructureExpression.prototype.toString = function () {
        return 'let ' + this.declaration + ' in ' + this.expression + ' end';
    };
    LocalDeclarationStructureExpression.prototype.computeStructure = function (state) {
        var nstate = state.getNestedState(0).getNestedState(state.id);
        var res = this.declaration.evaluate(nstate);
        var membnd = res[0].getMemoryChanges(0);
        if (res[1]) {
            return [res[2], res[3], membnd];
        }
        var nres = this.expression.computeStructure(res[0]);
        return [nres[0], res[3].concat(nres[1]), membnd.concat(nres[2])];
    };
    return LocalDeclarationStructureExpression;
}(expressions_1.Expression));
exports.LocalDeclarationStructureExpression = LocalDeclarationStructureExpression;
var SignatureExpression = (function (_super) {
    __extends(SignatureExpression, _super);
    // sig spec end
    function SignatureExpression(position, specification) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.specification = specification;
        return _this;
    }
    SignatureExpression.prototype.simplify = function () {
        return this;
    };
    SignatureExpression.prototype.computeInterface = function (state) {
        return this.specification.computeInterface(state);
    };
    SignatureExpression.prototype.toString = function () {
        return 'sig ' + this.specification + ' end';
    };
    return SignatureExpression;
}(expressions_1.Expression));
exports.SignatureExpression = SignatureExpression;
var SignatureIdentifier = (function (_super) {
    __extends(SignatureIdentifier, _super);
    // sigid
    function SignatureIdentifier(position, identifier) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.identifier = identifier;
        return _this;
    }
    SignatureIdentifier.prototype.simplify = function () {
        return this;
    };
    SignatureIdentifier.prototype.computeInterface = function (state) {
        var st = state.dynamicBasis;
        if (this.identifier instanceof tokens_1.LongIdentifierToken) {
            for (var i = 0; i < this.identifier.qualifiers.length; ++i) {
                var tmp = void 0;
                if (i === 0) {
                    tmp = state.getDynamicStructure(this.identifier.qualifiers[i].getText());
                }
                else {
                    tmp = st.getStructure(this.identifier.qualifiers[i].getText());
                }
                if (tmp === undefined) {
                    throw new errors_1.EvaluationError(this.position, 'Undefined module "'
                        + this.identifier.qualifiers[i].getText() + '"');
                }
                st = tmp;
            }
            var res = st.getSignature(this.identifier.id.getText());
            if (res === undefined) {
                throw new errors_1.EvaluationError(this.position, 'Undefined signature "'
                    + this.identifier.getText() + '".');
            }
            else {
                return res;
            }
        }
        var rs = state.getDynamicSignature(this.identifier.getText());
        if (rs === undefined) {
            throw new errors_1.EvaluationError(this.position, 'Undefined signature "'
                + this.identifier.getText() + '".');
        }
        else {
            return rs;
        }
    };
    SignatureIdentifier.prototype.toString = function () {
        return this.identifier.getText();
    };
    return SignatureIdentifier;
}(expressions_1.Expression));
exports.SignatureIdentifier = SignatureIdentifier;
var TypeRealisation = (function (_super) {
    __extends(TypeRealisation, _super);
    // sigexp where type tyvarseq longtycon = ty
    function TypeRealisation(position, signatureExpression, tyvarseq, name, type) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.signatureExpression = signatureExpression;
        _this.tyvarseq = tyvarseq;
        _this.name = name;
        _this.type = type;
        return _this;
    }
    TypeRealisation.prototype.simplify = function () {
        return new TypeRealisation(this.position, this.signatureExpression.simplify(), this.tyvarseq, this.name, this.type.simplify());
    };
    TypeRealisation.prototype.computeInterface = function (state) {
        return this.signatureExpression.computeInterface(state);
    };
    TypeRealisation.prototype.toString = function () {
        return this.signatureExpression + ' where type <stuff> ' + this.name.getText()
            + ' = ' + this.type;
    };
    return TypeRealisation;
}(expressions_1.Expression));
exports.TypeRealisation = TypeRealisation;
// Module declarations and bindings
// Sutrcture declaration
var StructureDeclaration = (function (_super) {
    __extends(StructureDeclaration, _super);
    // structure strbind
    function StructureDeclaration(position, structureBinding) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.structureBinding = structureBinding;
        return _this;
    }
    StructureDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        // TODO
        return [state, [new errors_1.Warning(this.position, 'Skipped elaborating structure.\n')], tyVarBnd, nextName];
    };
    StructureDeclaration.prototype.evaluate = function (state) {
        var warns = [];
        for (var i = 0; i < this.structureBinding.length; ++i) {
            var tmp = this.structureBinding[i].evaluate(state);
            if (tmp[1]) {
                return tmp;
            }
            state = tmp[0];
            warns = warns.concat(tmp[3]);
        }
        return [state, false, undefined, warns];
    };
    StructureDeclaration.prototype.simplify = function () {
        var bnd = [];
        for (var i = 0; i < this.structureBinding.length; ++i) {
            bnd.push(this.structureBinding[i].simplify());
        }
        return new StructureDeclaration(this.position, bnd);
    };
    StructureDeclaration.prototype.toString = function () {
        var res = 'structure';
        for (var i = 0; i < this.structureBinding.length; ++i) {
            res += ' ' + this.structureBinding[i];
        }
        return res + ';';
    };
    return StructureDeclaration;
}(declarations_1.Declaration));
exports.StructureDeclaration = StructureDeclaration;
var SignatureDeclaration = (function (_super) {
    __extends(SignatureDeclaration, _super);
    // signature sigbind
    function SignatureDeclaration(position, signatureBinding) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.signatureBinding = signatureBinding;
        return _this;
    }
    SignatureDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        // TODO
        return [state, [new errors_1.Warning(this.position, 'Skipped elaborating signature.\n')], tyVarBnd, nextName];
    };
    SignatureDeclaration.prototype.evaluate = function (state) {
        for (var i = 0; i < this.signatureBinding.length; ++i) {
            state = this.signatureBinding[i].evaluate(state);
        }
        return [state, false, undefined, []];
    };
    SignatureDeclaration.prototype.simplify = function () {
        var bnd = [];
        for (var i = 0; i < this.signatureBinding.length; ++i) {
            bnd.push(this.signatureBinding[i].simplify());
        }
        return new SignatureDeclaration(this.position, bnd);
    };
    SignatureDeclaration.prototype.toString = function () {
        var res = 'structure';
        for (var i = 0; i < this.signatureBinding.length; ++i) {
            res += ' ' + this.signatureBinding[i];
        }
        return res + ';';
    };
    return SignatureDeclaration;
}(declarations_1.Declaration));
exports.SignatureDeclaration = SignatureDeclaration;
var FunctorDeclaration = (function (_super) {
    __extends(FunctorDeclaration, _super);
    // functor funbind
    function FunctorDeclaration(position, functorBinding) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.functorBinding = functorBinding;
        return _this;
    }
    FunctorDeclaration.prototype.elaborate = function (state, tyVarBnd, nextName) {
        if (tyVarBnd === void 0) { tyVarBnd = new Map(); }
        if (nextName === void 0) { nextName = '\'t0'; }
        // TODO
        return [state, [new errors_1.Warning(this.position, 'Skipped elaborating functor.\n')], tyVarBnd, nextName];
    };
    FunctorDeclaration.prototype.evaluate = function (state) {
        for (var i = 0; i < this.functorBinding.length; ++i) {
            state = this.functorBinding[i].evaluate(state);
        }
        return [state, false, undefined, []];
    };
    FunctorDeclaration.prototype.simplify = function () {
        var bnd = [];
        for (var i = 0; i < this.functorBinding.length; ++i) {
            bnd.push(this.functorBinding[i].simplify());
        }
        return new FunctorDeclaration(this.position, bnd);
    };
    FunctorDeclaration.prototype.toString = function () {
        var res = 'functor';
        for (var i = 0; i < this.functorBinding.length; ++i) {
            res += ' ' + this.functorBinding[i];
        }
        return res + ';';
    };
    return FunctorDeclaration;
}(declarations_1.Declaration));
exports.FunctorDeclaration = FunctorDeclaration;
var StructureBinding = (function () {
    // strid = strexp
    function StructureBinding(position, name, binding) {
        this.position = position;
        this.name = name;
        this.binding = binding;
    }
    StructureBinding.prototype.simplify = function () {
        return new StructureBinding(this.position, this.name, this.binding.simplify());
    };
    StructureBinding.prototype.evaluate = function (state) {
        var tmp = this.binding.computeStructure(state);
        for (var i = 0; i < tmp[2].length; ++i) {
            state.setCell(tmp[2][i][0], tmp[2][i][1]);
        }
        if (tmp[0] instanceof values_1.Value) {
            return [state, true, tmp[0], tmp[1]];
        }
        state.setDynamicStructure(this.name.getText(), tmp[0]);
        return [state, false, undefined, tmp[1]];
    };
    StructureBinding.prototype.toString = function () {
        return this.name.getText() + ' = ' + this.binding;
    };
    return StructureBinding;
}());
exports.StructureBinding = StructureBinding;
var SignatureBinding = (function () {
    // sigid = sigexp
    function SignatureBinding(position, name, binding) {
        this.position = position;
        this.name = name;
        this.binding = binding;
    }
    SignatureBinding.prototype.simplify = function () {
        return new SignatureBinding(this.position, this.name, this.binding.simplify());
    };
    SignatureBinding.prototype.evaluate = function (state) {
        state.setDynamicSignature(this.name.getText(), this.binding.computeInterface(state));
        return state;
    };
    SignatureBinding.prototype.toString = function () {
        return this.name.getText() + ' = ' + this.binding;
    };
    return SignatureBinding;
}());
exports.SignatureBinding = SignatureBinding;
var FunctorBinding = (function () {
    // funid ( strid : sigexp ) = strexp
    function FunctorBinding(position, name, signatureName, signatureBinding, binding) {
        this.position = position;
        this.name = name;
        this.signatureName = signatureName;
        this.signatureBinding = signatureBinding;
        this.binding = binding;
    }
    FunctorBinding.prototype.simplify = function () {
        return new FunctorBinding(this.position, this.name, this.signatureName, this.signatureBinding.simplify(), this.binding.simplify());
    };
    FunctorBinding.prototype.evaluate = function (state) {
        var inter = this.signatureBinding.computeInterface(state);
        var nstate = initialState_1.getInitialState().getNestedState(state.id);
        nstate.dynamicBasis = state.getDynamicChanges(-1);
        state.setDynamicFunctor(this.name.getText(), new state_1.DynamicFunctorInformation(this.signatureName, inter, this.binding, nstate));
        return state;
    };
    FunctorBinding.prototype.toString = function () {
        return this.name.getText() + '( ' + this.signatureName + ' : ' + this.signatureBinding
            + ' ) = ' + this.binding;
    };
    return FunctorBinding;
}());
exports.FunctorBinding = FunctorBinding;
// Specifications
var Specification = (function () {
    function Specification() {
    }
    return Specification;
}());
exports.Specification = Specification;
var ValueSpecification = (function (_super) {
    __extends(ValueSpecification, _super);
    // val valdesc
    function ValueSpecification(position, valueDescription) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.valueDescription = valueDescription;
        return _this;
    }
    ValueSpecification.prototype.computeInterface = function (state) {
        var res = {};
        for (var i = 0; i < this.valueDescription.length; ++i) {
            res[this.valueDescription[i][0].getText()] = state_1.IdentifierStatus.VALUE_VARIABLE;
        }
        return new state_1.DynamicInterface({}, res, {});
    };
    return ValueSpecification;
}(Specification));
exports.ValueSpecification = ValueSpecification;
var TypeSpecification = (function (_super) {
    __extends(TypeSpecification, _super);
    // type [tyvarseq tycon][]
    function TypeSpecification(position, typeDescription) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.typeDescription = typeDescription;
        return _this;
    }
    TypeSpecification.prototype.computeInterface = function (state) {
        var res = {};
        for (var i = 0; i < this.typeDescription.length; ++i) {
            res[this.typeDescription[i][1].getText()] = [];
        }
        return new state_1.DynamicInterface(res, {}, {});
    };
    return TypeSpecification;
}(Specification));
exports.TypeSpecification = TypeSpecification;
var EqualityTypeSpecification = (function (_super) {
    __extends(EqualityTypeSpecification, _super);
    // eqtype [tyvarseq tycon][]
    function EqualityTypeSpecification(position, typeDescription) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.typeDescription = typeDescription;
        return _this;
    }
    EqualityTypeSpecification.prototype.computeInterface = function (state) {
        var res = {};
        for (var i = 0; i < this.typeDescription.length; ++i) {
            res[this.typeDescription[i][1].getText()] = [];
        }
        return new state_1.DynamicInterface(res, {}, {});
    };
    return EqualityTypeSpecification;
}(Specification));
exports.EqualityTypeSpecification = EqualityTypeSpecification;
var DatatypeSpecification = (function (_super) {
    __extends(DatatypeSpecification, _super);
    // datatype [tyvarseq tycon = [vid <of ty>][]][]
    function DatatypeSpecification(position, datatypeDescription) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.datatypeDescription = datatypeDescription;
        return _this;
    }
    DatatypeSpecification.prototype.computeInterface = function (state) {
        var vi = {};
        var ti = {};
        for (var i = 0; i < this.datatypeDescription.length; ++i) {
            var cns = [];
            for (var j = 0; j < this.datatypeDescription[i][2].length; ++j) {
                vi[this.datatypeDescription[i][2][j][0].getText()]
                    = state_1.IdentifierStatus.VALUE_CONSTRUCTOR;
                cns.push(this.datatypeDescription[i][2][j][0].getText());
            }
            ti[this.datatypeDescription[i][1].getText()] = cns;
        }
        return new state_1.DynamicInterface(ti, vi, {});
    };
    return DatatypeSpecification;
}(Specification));
exports.DatatypeSpecification = DatatypeSpecification;
var DatatypeReplicationSpecification = (function (_super) {
    __extends(DatatypeReplicationSpecification, _super);
    // datatype tycon = datatype longtycon
    function DatatypeReplicationSpecification(position, name, oldname) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.name = name;
        _this.oldname = oldname;
        return _this;
    }
    DatatypeReplicationSpecification.prototype.computeInterface = function (state) {
        var st = state.dynamicBasis;
        var tp = [];
        if (this.oldname instanceof tokens_1.LongIdentifierToken) {
            for (var i = 0; i < this.oldname.qualifiers.length; ++i) {
                var tmp = void 0;
                if (i === 0) {
                    tmp = state.getDynamicStructure(this.oldname.qualifiers[i].getText());
                }
                else {
                    tmp = st.getStructure(this.oldname.qualifiers[i].getText());
                }
                if (tmp === undefined) {
                    throw new errors_1.EvaluationError(this.position, 'Undefined module "'
                        + this.oldname.qualifiers[i].getText() + '"');
                }
                st = tmp;
            }
            tp = st.getType(this.oldname.id.getText());
        }
        else {
            tp = state.getDynamicType(this.oldname.getText());
        }
        if (tp === undefined) {
            throw new errors_1.EvaluationError(this.position, 'The datatype "'
                + this.oldname.getText() + '" does not exist.');
        }
        var vi = {};
        for (var i = 0; i < tp.length; ++i) {
            vi[tp[i]] = state_1.IdentifierStatus.VALUE_CONSTRUCTOR;
        }
        var ti = {};
        ti[this.name.getText()] = tp;
        return new state_1.DynamicInterface(ti, vi, {});
    };
    return DatatypeReplicationSpecification;
}(Specification));
exports.DatatypeReplicationSpecification = DatatypeReplicationSpecification;
var ExceptionSpecification = (function (_super) {
    __extends(ExceptionSpecification, _super);
    // exception [vid <of ty>][]
    function ExceptionSpecification(position, exceptionDescription) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.exceptionDescription = exceptionDescription;
        return _this;
    }
    ExceptionSpecification.prototype.computeInterface = function (state) {
        var res = {};
        for (var i = 0; i < this.exceptionDescription.length; ++i) {
            res[this.exceptionDescription[i][0].getText()] = state_1.IdentifierStatus.EXCEPTION_CONSTRUCTOR;
        }
        return new state_1.DynamicInterface({}, res, {});
    };
    return ExceptionSpecification;
}(Specification));
exports.ExceptionSpecification = ExceptionSpecification;
var StructureSpecification = (function (_super) {
    __extends(StructureSpecification, _super);
    // structure [strid: sigexp][]
    function StructureSpecification(position, structureDescription) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.structureDescription = structureDescription;
        return _this;
    }
    StructureSpecification.prototype.computeInterface = function (state) {
        var res = {};
        for (var i = 0; i < this.structureDescription.length; ++i) {
            res[this.structureDescription[i][0].getText()] = this.structureDescription[i][1].computeInterface(state);
        }
        return new state_1.DynamicInterface({}, {}, res);
    };
    return StructureSpecification;
}(Specification));
exports.StructureSpecification = StructureSpecification;
var IncludeSpecification = (function (_super) {
    __extends(IncludeSpecification, _super);
    // include sigexp
    function IncludeSpecification(position, expression) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.expression = expression;
        return _this;
    }
    IncludeSpecification.prototype.computeInterface = function (state) {
        return this.expression.computeInterface(state);
    };
    return IncludeSpecification;
}(Specification));
exports.IncludeSpecification = IncludeSpecification;
var EmptySpecification = (function (_super) {
    __extends(EmptySpecification, _super);
    //
    function EmptySpecification(position) {
        var _this = _super.call(this) || this;
        _this.position = position;
        return _this;
    }
    EmptySpecification.prototype.computeInterface = function (state) {
        return new state_1.DynamicInterface({}, {}, {});
    };
    return EmptySpecification;
}(Specification));
exports.EmptySpecification = EmptySpecification;
var SequentialSpecification = (function (_super) {
    __extends(SequentialSpecification, _super);
    // spec[]
    function SequentialSpecification(position, specifications) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.specifications = specifications;
        return _this;
    }
    SequentialSpecification.prototype.computeInterface = function (state) {
        var res = new state_1.DynamicInterface({}, {}, {});
        for (var i = 0; i < this.specifications.length; ++i) {
            res = res.extend(this.specifications[i].computeInterface(state));
        }
        return res;
    };
    return SequentialSpecification;
}(Specification));
exports.SequentialSpecification = SequentialSpecification;
var SharingSpecification = (function (_super) {
    __extends(SharingSpecification, _super);
    // spec sharing type longtycon = ... = longtycon
    function SharingSpecification(position, specification, typeNames) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.specification = specification;
        _this.typeNames = typeNames;
        return _this;
    }
    SharingSpecification.prototype.computeInterface = function (state) {
        return this.specification.computeInterface(state);
    };
    return SharingSpecification;
}(Specification));
exports.SharingSpecification = SharingSpecification;


/***/ })
/******/ ]);
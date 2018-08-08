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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let untypedGlobal = global;
let interpreterSettings = {
    'allowUnicodeInStrings': false,
    'allowSuccessorML': false,
    'disableElaboration': false,
    'allowLongFunctionNames': false
};
class Communication {
    static init() {
        Communication.handlers = {};
        Communication.nextId = 1;
        Communication.freeIds = new Set();
        untypedGlobal.onmessage = function (e) {
            let message = e.data;
            if (message.type) {
                if (Communication.handlers[message.type]) {
                    Communication.handlers[message.type](message.data);
                }
            }
        };
        Communication.registerHandler('settings', (settings) => {
            if (settings) {
                interpreterSettings = JSON.parse(settings);
            }
        });
    }
    static registerHandler(type, func) {
        Communication.handlers[type] = func;
    }
    static clearHandler(type) {
        delete Communication.handlers[type];
    }
    static sendPartialOutput(output) {
        untypedGlobal.postMessage({
            type: 'partial',
            data: output
        });
    }
    static sendOutputFinished() {
        untypedGlobal.postMessage({
            type: 'finished',
            data: ''
        });
    }
    static getCode(pos) {
        return new Promise((resolve, reject) => {
            untypedGlobal.postMessage({
                type: 'getcode',
                data: pos
            });
            let timeout = setTimeout(() => {
                reject('Timeout');
                Communication.clearHandler('code');
            }, 1000);
            Communication.registerHandler('code', (code) => {
                Communication.clearHandler('code');
                clearTimeout(timeout);
                resolve(code);
            });
        });
    }
    static markText(from, to, style) {
        let id;
        if (Communication.freeIds.size > 0) {
            let it = Communication.freeIds.values();
            id = it.next().value;
            Communication.freeIds.delete(id);
        }
        else {
            id = Communication.nextId++;
        }
        untypedGlobal.postMessage({
            type: 'markText',
            data: {
                'from': from,
                'to': to,
                'style': style,
                'id': id
            }
        });
        return id;
    }
    static clearMarker(id) {
        untypedGlobal.postMessage({
            type: 'clearMarker',
            data: {
                'id': id
            }
        });
    }
    static ping() {
        untypedGlobal.postMessage({
            type: 'ping',
            data: ''
        });
    }
}
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["OK"] = 0] = "OK";
    ErrorType[ErrorType["INCOMPLETE"] = 1] = "INCOMPLETE";
    ErrorType[ErrorType["INTERPRETER"] = 2] = "INTERPRETER";
    ErrorType[ErrorType["SML"] = 3] = "SML"; // SML raised an exception
})(ErrorType || (ErrorType = {}));
class IncrementalInterpretation {
    constructor() {
        this.semicoli = [];
        this.data = [];
        this.disabled = false;
        this.debounceCallNecessary = false;
        this.interpreter = untypedGlobal.Interpreter;
        this.initialState = this.interpreter.getFirstState();
    }
    clear() {
        this.semicoli.length = 0;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].marker !== -1) {
                Communication.clearMarker(this.data[i].marker);
            }
        }
        this.data.length = 0;
    }
    disable() {
        this.disabled = true;
        this.clear();
    }
    enable() {
        this.disabled = false;
    }
    handleChangeAt(pos, added, removed) {
        if (this.disabled) {
            return;
        }
        this.doDebounce(pos, added, removed);
    }
    go() {
        Communication.registerHandler('interpret', (data) => {
            this.handleChangeAt(data.pos, data.added, data.removed);
        });
        Communication.registerHandler('clear', (data) => {
            this.clear();
        });
    }
    doDebounce(pos, added, removed) {
        clearTimeout(this.debounceTimeout);
        if (!this.debounceCallNecessary) {
            if (!this.isHandlingNecessary(pos, added, removed)) {
                Communication.ping(); // Let the frontend know I'm not dead
                return;
            }
            else {
                this.debounceCallNecessary = true;
            }
        }
        if (!this.debounceMinimumPosition || this.compare(pos, this.debounceMinimumPosition) === -1) {
            this.debounceMinimumPosition = pos;
        }
        this.debounceTimeout = setTimeout(() => {
            this.debounceTimeout = null;
            this.debounceCallNecessary = false;
            let minPos = this.debounceMinimumPosition;
            this.debounceMinimumPosition = null;
            this.debouncedHandleChangeAt(minPos);
        }, 400);
    }
    debouncedHandleChangeAt(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            let anchor = this.binarySearch(pos);
            anchor = this.findNonErrorAnchor(anchor);
            this.deleteAllAfter(anchor);
            let baseIndex = this.findBaseIndex(anchor);
            let basePos;
            if (baseIndex !== -1) {
                basePos = this.copyPos(this.semicoli[baseIndex]);
            }
            else {
                basePos = { line: 0, ch: 0 };
            }
            let remainingText = yield Communication.getCode(basePos);
            if (baseIndex !== -1) {
                remainingText = remainingText.substr(1);
                basePos.ch = basePos.ch + 1;
            }
            this.sendFinishedData(baseIndex);
            this.reEvaluateFrom(basePos, baseIndex, anchor, remainingText);
            Communication.sendOutputFinished();
        });
    }
    sendFinishedData(upTo) {
        let out = '';
        for (let i = 0; i <= upTo; i++) {
            out += this.data[i].output;
        }
        Communication.sendPartialOutput(out);
    }
    copyPos(pos) {
        return { line: pos.line, ch: pos.ch };
    }
    reEvaluateFrom(basePos, baseIndex, anchor, remainingText) {
        let splitByLine = remainingText.split('\n');
        let lastPos = basePos;
        let partial = '';
        let errorEncountered = false;
        let previousState = (baseIndex === -1) ? null : this.data[baseIndex].state;
        let previousCounter = (baseIndex === -1) ? -1 : this.data[baseIndex].successCounter;
        for (let i = 0; i < splitByLine.length; i++) {
            let lineOffset = 0;
            if (i === 0) {
                lineOffset = basePos.ch;
            }
            let start = -1;
            let line = splitByLine[i];
            let sc;
            if (i !== 0) {
                partial += '\n';
            }
            while ((sc = line.indexOf(';', start + 1)) !== -1) {
                partial += line.substring(start + 1, sc);
                if (baseIndex >= anchor) {
                    // actually need to handle this
                    let semiPos = { line: (basePos.line + i), ch: sc + lineOffset };
                    if (errorEncountered) {
                        this.addErrorSemicolon(semiPos, '', Communication.markText(lastPos, semiPos, 'eval-fail'));
                        lastPos = this.copyPos(semiPos);
                        lastPos.ch++;
                        previousState = null;
                        partial = '';
                    }
                    else {
                        let ret = this.evaluate(previousState, partial);
                        if (ret.result === ErrorType.INCOMPLETE) {
                            this.addIncompleteSemicolon(semiPos);
                            partial += ';';
                        }
                        else if (ret.result === ErrorType.OK) {
                            let className = 'eval-success';
                            if ((previousCounter + 1) % 2 === 1) {
                                className = 'eval-success-odd';
                            }
                            this.addSemicolon(semiPos, ret.state, Communication.markText(lastPos, semiPos, className), ret.warnings, ++previousCounter);
                            lastPos = this.copyPos(semiPos);
                            lastPos.ch++;
                            previousState = ret.state;
                            partial = '';
                        }
                        else if (ret.result === ErrorType.SML) {
                            // TODO
                            this.addSMLErrorSemicolon(semiPos, ret.error, Communication.markText(lastPos, semiPos, 'eval-fail'));
                            lastPos = this.copyPos(semiPos);
                            lastPos.ch++;
                            previousState = ret.state;
                            partial = '';
                        }
                        else {
                            // TODO: mark error position with red color
                            let errorMessage = this.getErrorMessage(ret.error, partial, lastPos);
                            this.addErrorSemicolon(semiPos, errorMessage, Communication.markText(lastPos, semiPos, 'eval-fail'));
                            lastPos = this.copyPos(semiPos);
                            lastPos.ch++;
                            previousState = null;
                            errorEncountered = true;
                            partial = '';
                        }
                        // Send partial
                        if (this.data.length > 0) {
                            let output = this.data[this.data.length - 1].output;
                            Communication.sendPartialOutput(output);
                        }
                    }
                }
                else {
                    partial += ';';
                }
                baseIndex++;
                start = sc;
            }
            partial += line.substr(start + 1);
        }
    }
    evaluate(oldState, partial) {
        let ret;
        try {
            if (oldState === null) {
                ret = this.interpreter.interpret(partial + ';', this.initialState, interpreterSettings);
            }
            else {
                ret = this.interpreter.interpret(partial + ';', oldState, interpreterSettings);
            }
        }
        catch (e) {
            // TODO: switch over e's type
            if (this.getPrototypeName(e) === 'IncompleteError') {
                return {
                    state: null,
                    result: ErrorType.INCOMPLETE,
                    error: e,
                    warnings: []
                };
            }
            else {
                return {
                    state: null,
                    result: ErrorType.INTERPRETER,
                    error: e,
                    warnings: []
                };
            }
        }
        if (ret.evaluationErrored) {
            return {
                state: ret.state,
                result: ErrorType.SML,
                error: ret.error,
                warnings: ret.warnings
            };
        }
        else {
            return {
                state: ret.state,
                result: ErrorType.OK,
                error: null,
                warnings: ret.warnings
            };
        }
    }
    getPrototypeName(object) {
        let proto = Object.getPrototypeOf(object);
        if (proto.constructor && proto.constructor.name) {
            return proto.constructor.name;
        }
        else {
            return '';
        }
    }
    getErrorMessage(error, partial, startPos) {
        if (error.position !== undefined) {
            let position = this.calculateErrorPos(partial, startPos, error.position);
            return 'Line ' + position[0] + ': \\*' +
                this.getPrototypeName(error) + '\\*: ' + this.outputEscape(error.message);
        }
        else {
            return this.getPrototypeName(error) + ': ' +
                this.outputEscape(error.message);
        }
    }
    calculateErrorPos(partial, startPos, offset) {
        let pos = { line: startPos.line, ch: startPos.ch };
        for (let i = 0; i < offset; i++) {
            let char = partial.charAt(i);
            if (char === '\n') {
                pos.line++;
                pos.ch = 0;
            }
            else {
                pos.ch++;
            }
        }
        return [pos.line + 1, pos.ch + 1];
    }
    addSemicolon(pos, newState, marker, warnings, newCounter) {
        this.semicoli.push(pos);
        let baseIndex = this.findBaseIndex(this.data.length - 1);
        let baseStateId = this.initialState.id + 1;
        if (baseIndex !== -1) {
            baseStateId = this.data[baseIndex].state.id + 1;
        }
        this.data.push({
            state: newState,
            marker: marker,
            error: false,
            output: this.computeNewStateOutput(newState, baseStateId, warnings, newCounter),
            successCounter: newCounter
        });
    }
    addIncompleteSemicolon(pos) {
        this.semicoli.push(pos);
        this.data.push({
            state: null,
            marker: -1,
            error: false,
            output: '',
            successCounter: 0
        });
    }
    addErrorSemicolon(pos, errorMessage, marker) {
        this.semicoli.push(pos);
        this.data.push({
            state: null,
            marker: marker,
            error: true,
            output: '\\3' + errorMessage,
            successCounter: 0
        });
    }
    addSMLErrorSemicolon(pos, error, marker) {
        this.semicoli.push(pos);
        let outputErr = '\\*Uncaught SML exception\\*: ' + this.outputEscape(error.toString()) + '\n';
        this.data.push({
            state: null,
            marker: marker,
            error: true,
            output: '\\3' + outputErr,
            successCounter: 0
        });
    }
    outputEscape(str) {
        return str.replace(/\\/g, "\\\\");
    }
    printBasis(state, dynamicBasis, staticBasis, indent = 0) {
        let out = '';
        let fullst = '>';
        let emptyst = ' ';
        let cD = new Date();
        if (cD.getMonth() === 9 && cD.getDate() >= 25) {
            fullst = "🎃";
        }
        else if (cD.getMonth() === 11 && cD.getDate() >= 24 && cD.getDate() <= 26) {
            fullst = "🎄";
        }
        else if (cD.getMonth() === 11 && cD.getDate() === 31) {
            fullst = "🎊";
        }
        else if (cD.getMonth() === 0 && cD.getDate() === 1) {
            fullst = "🎆";
        }
        else if (cD.getMonth() === 1 && cD.getDate() === 14) {
            fullst = "🍫";
        }
        else if (cD.getMonth() === 2 && cD.getDate() === 14) {
            fullst = "🍫";
        }
        else if (cD.getMonth() === 6 && cD.getDate() === 7) {
            fullst = "🎋";
        }
        let stsym = indent === 0 ? fullst : emptyst;
        let istr = '';
        for (let i = 0; i < indent; ++i) {
            istr += '  ';
        }
        for (let i in dynamicBasis.valueEnvironment) {
            if (dynamicBasis.valueEnvironment.hasOwnProperty(i)) {
                if (staticBasis) {
                    out += stsym + ' ' + istr + this.printBinding(state, [i, dynamicBasis.valueEnvironment[i],
                        staticBasis.getValue(i)], false) + '\n';
                }
                else {
                    out += stsym + ' ' + istr + this.printBinding(state, [i, dynamicBasis.valueEnvironment[i], undefined], false) + '\n';
                }
            }
        }
        for (let i in dynamicBasis.typeEnvironment) {
            if (dynamicBasis.typeEnvironment.hasOwnProperty(i)) {
                if (staticBasis.typeEnvironment.hasOwnProperty(i)) {
                    if (this.getPrototypeName(staticBasis.getType(i).type) === "CustomType") {
                        out += stsym + ' ' + istr + 'datatype \\*' + staticBasis.getType(i).type
                            + '\\* = {\n';
                        for (let j of staticBasis.getType(i).constructors) {
                            out += emptyst + '   ' + istr + this.printBinding(state, [j, dynamicBasis.valueEnvironment[j],
                                staticBasis.getValue(j)]) + '\n';
                        }
                        out += emptyst + ' ' + istr + '};\n';
                    }
                }
            }
        }
        for (let i in dynamicBasis.typeEnvironment) {
            if (dynamicBasis.typeEnvironment.hasOwnProperty(i)) {
                if (staticBasis.typeEnvironment.hasOwnProperty(i)) {
                    if (this.getPrototypeName(staticBasis.getType(i).type) === "FunctionType") {
                        out += stsym + ' ' + istr + 'type \\*'
                            + staticBasis.getType(i).type.parameterType + ' = '
                            + staticBasis.getType(i).type.returnType + '\\*;\n';
                    }
                }
            }
        }
        for (let i in dynamicBasis.structureEnvironment) {
            if (dynamicBasis.structureEnvironment.hasOwnProperty(i)) {
                out += stsym + ' ' + istr + 'structure \\*' + i + '\\* = struct\n';
                if (staticBasis) {
                    out += this.printBasis(state, dynamicBasis.getStructure(i), staticBasis.getStructure(i), indent + 1);
                }
                else {
                    out += this.printBasis(state, dynamicBasis.getStructure(i), undefined, indent + 1);
                }
                out += emptyst + ' ' + istr + 'end;\n';
            }
        }
        return out;
    }
    computeNewStateOutput(state, id, warnings, stateCounter) {
        let startWith = (stateCounter % 2 === 0) ? '\\1' : '\\2';
        let res = '';
        let curst = state;
        for (let i = state.id; i >= id; --i) {
            if (curst.id === i) {
                res = this.printBasis(curst, curst.getDynamicChanges(i - 1), curst.getStaticChanges(i - 1), 0) + res;
            }
            while (curst.id >= i) {
                curst = curst.parent;
            }
        }
        let needNewline = false;
        for (let val of warnings) {
            res += this.outputEscape(val.message);
            needNewline = !val.message.endsWith('\n');
        }
        if (res.trim() === '') {
            res = '>\n';
        }
        if (needNewline) {
            res += '\n';
        }
        res = startWith + res;
        return res;
    }
    /*
    private computeNewStateOutputInternal(state: any, id: number) {
        if ( state.id < id ) {
            return '';
        }
        let output = '';
        if ( state.parent !== undefined ) {
            output += this.computeNewStateOutputInternal(state.parent, id);
        }
        if (state.dynamicBasis.valueEnvironment !== undefined) {
            let valEnv = state.dynamicBasis.valueEnvironment;
            for (let i in valEnv) {
                if (valEnv.hasOwnProperty(i)) {
                    if (state.getDynamicValue(i, false) === undefined) {
                        continue;
                    }
                    output += this.printBinding(state, [i, state.getDynamicValue(i),
                        state.getStaticValue(i)]);
                    output += '\n';
                }
            }
        }
        return output;
    }*/
    printBinding(state, bnd, acon = true) {
        let res = '';
        let value = bnd[1][0];
        let type = bnd[2];
        if (type) {
            type = type[0];
        }
        let protoName = this.getPrototypeName(value);
        if (protoName === 'ValueConstructor' && acon) {
            res += 'con';
        }
        else if (protoName === 'ExceptionConstructor') {
            res += 'exn';
        }
        else {
            res += 'val';
        }
        if (value) {
            if (type && type.isOpaque()) {
                res += ' \\*' + bnd[0] + ' = <' + this.outputEscape(type.getOpaqueName()) + '>\\*';
            }
            else {
                res += ' \\*' + bnd[0] + ' = ' + this.outputEscape(value.toString(state)) + '\\*';
            }
        }
        else {
            return res + ' \\*' + bnd[0] + ' = undefined\\*;';
        }
        if (type) {
            return res + ': \\_' + this.outputEscape(type.toString(state)) + '\\_;';
        }
        else {
            return res + ': undefined;';
        }
    }
    stringArrayContains(arr, search) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].indexOf(search) !== -1) {
                return true;
            }
        }
        return false;
    }
    isHandlingNecessary(pos, added, removed) {
        if (this.stringArrayContains(added, ';') || this.stringArrayContains(removed, ';')) {
            return true;
        }
        if (this.semicoli.length === 0) {
            return false;
        }
        let lastSemicolon = this.semicoli[this.semicoli.length - 1];
        if (this.compare(lastSemicolon, pos) === -1) {
            return false;
        }
        return true;
    }
    findBaseIndex(index) {
        for (let i = index; i >= 0; i--) {
            if (this.data[i].state !== null) {
                return i;
            }
        }
        return -1;
    }
    findNonErrorAnchor(anchor) {
        for (let i = anchor; i >= 0; i--) {
            if (!this.data[i].error) {
                return i;
            }
        }
        return -1;
    }
    deleteAllAfter(index) {
        this.semicoli.length = index + 1;
        for (let i = index + 1; i < this.data.length; i++) {
            if (this.data[i].marker !== -1) {
                Communication.clearMarker(this.data[i].marker);
            }
        }
        this.data.length = index + 1;
    }
    binarySearch(pos) {
        let left = 0;
        let right = this.semicoli.length - 1;
        while (left <= right) {
            let center = Math.floor((left + right) / 2);
            let element = this.semicoli[center];
            let cmp = this.compare(pos, element);
            if (cmp === -1) {
                right = center - 1;
                if (left > right) {
                    return center - 1; // the element left of center is the next best element
                }
            }
            else if (cmp === 1) {
                left = center + 1;
                if (left > right) {
                    return center; // center is the next best element
                }
            }
            else {
                return center - 1;
            }
        }
        return -1;
    }
    compare(posa, posb) {
        if (posa.line === posb.line) {
            return Math.sign(posa.ch - posb.ch);
        }
        else {
            return Math.sign(posa.line - posb.line);
        }
    }
}
untypedGlobal.importScripts('/interpreter.js');
Communication.init();
let ii = new IncrementalInterpretation();
ii.go();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })
/******/ ]);
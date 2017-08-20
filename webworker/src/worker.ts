let untypedGlobal: any = global;

class Communication {
    static handlers: any;
    static nextId: number;
    static freeIds: Set<number>;

    static init() {
        Communication.handlers = {};
        Communication.nextId = 1;
        Communication.freeIds = new Set<number>();
        untypedGlobal.onmessage = function(e: any) {
            let message = e.data;
            if (message.type) {
                if (Communication.handlers[message.type]) {
                    Communication.handlers[message.type](message.data);
                }
            }
        };
    }

    static registerHandler(type: string, func: (msg: any) => any) {
        Communication.handlers[type] = func;
    }

    static clearHandler(type: string) {
        delete Communication.handlers[type];
    }

    static setOutput(output: string) {
        untypedGlobal.postMessage({
            type: 'output',
            data: output
        });
    }

    static getCode(pos: any): Promise<string> {
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

    static markText(from: any, to: any, style: string): number {
        let id: number;
        if (Communication.freeIds.size > 0) {
            let it = Communication.freeIds.values();
            id = it.next().value;
            Communication.freeIds.delete(id);
        } else {
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

    static clearMarker(id: number) {
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

enum ErrorType {
    OK = 0, // Interpret successfull
    INCOMPLETE, // The given partial string was incomplete SML code
    INTERPRETER, // The interpreter failed, e.g. compile error etc.
    SML // SML raised an exception
}

interface IncrementalStateValues {
    state: any;
    marker: number;
    output: string;
    error: boolean;
}

class IncrementalInterpretation {
    semicoli: any[];
    data: IncrementalStateValues[];
    debounceTimeout: any;
    debounceMinimumPosition: any;
    debounceCallNecessary: boolean;
    interpreter: any;
    disabled: boolean;
    initialState: any;

    constructor() {
        this.semicoli = [];
        this.data = [];

        this.disabled = false;
        this.debounceCallNecessary = false;

        this.interpreter = untypedGlobal.Interpreter;
        this.initialState = this.interpreter.getFirstState(true);
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

    handleChangeAt(pos: any, added: string[], removed: string[]) {
        if (this.disabled) {
            return;
        }
        this.doDebounce(pos, added, removed);
    }

    go() {
        Communication.registerHandler('interpret', (data: any) => {
            this.handleChangeAt(data.pos, data.added, data.removed);
        });
        Communication.registerHandler('clear', (data: any) => {
            this.clear();
        });
    }

    private doDebounce(pos: any, added: string[], removed: string[]) {
        clearTimeout(this.debounceTimeout);
        if (!this.debounceCallNecessary) {
            if (!this.isHandlingNecessary(pos, added, removed)) {
                Communication.ping(); // Let the frontend know I'm not dead
                return;
            } else {
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

    private async debouncedHandleChangeAt(pos: any) {
        let anchor = this.binarySearch(pos);
        anchor = this.findNonErrorAnchor(anchor);
        this.deleteAllAfter(anchor);
        let baseIndex = this.findBaseIndex(anchor);
        let basePos: any;
        if (baseIndex !== -1) {
            basePos = this.copyPos(this.semicoli[baseIndex]);
        } else {
            basePos = {line: 0, ch: 0};
        }
        let remainingText = await Communication.getCode(basePos);
        if (baseIndex !== -1) {
            remainingText = remainingText.substr(1);
            basePos.ch = basePos.ch + 1;
        }
        this.reEvaluateFrom(basePos, baseIndex, anchor, remainingText);
        this.recomputeOutput();
    }

    private recomputeOutput() {
        let out = '';
        for (let i = 0; i < this.data.length; i++) {
            out += this.data[i].output;
        }

        Communication.setOutput(out);
    }

    private copyPos(pos: any): any {
        return {line: pos.line, ch: pos.ch};
    }

    private reEvaluateFrom(basePos: any, baseIndex: number, anchor: number, remainingText: string) {
        let splitByLine: string[] = remainingText.split('\n');
        let lastPos = basePos;
        // console.log(remainingText);
        let partial = '';
        let errorEncountered = false;
        let previousState = (baseIndex === -1) ? null : this.data[baseIndex].state;
        for (let i = 0; i < splitByLine.length; i++) {
            let lineOffset = 0;
            if (i === 0) {
                lineOffset = basePos.ch;
            }
            let start = -1;
            let line = splitByLine[i];
            let sc: number;
            if (i !== 0) {
                partial += '\n';
            }
            while ((sc = line.indexOf(';', start + 1)) !== -1) {
                partial += line.substring(start + 1, sc);
                if (baseIndex >= anchor) {
                    // actually need to handle this

                    let semiPos = {line: (basePos.line + i), ch: sc + lineOffset};
                    if (errorEncountered) {
                        this.addErrorSemicolon(semiPos, '', Communication.markText(lastPos, semiPos, 'eval-fail'));
                        lastPos = this.copyPos(semiPos);
                        lastPos.ch++;
                        previousState = null;

                        partial = '';
                    } else {
                        let ret = this.evaluate(previousState, partial);
                        if (ret.result === ErrorType.INCOMPLETE) {
                            this.addIncompleteSemicolon(semiPos);
                            partial += ';';
                        } else if (ret.result === ErrorType.OK) {
                            this.addSemicolon(semiPos, ret.state, Communication.markText(lastPos, semiPos, 'eval-success'),
                                ret.warnings);
                            lastPos = this.copyPos(semiPos);
                            lastPos.ch++;
                            previousState = ret.state;

                            partial = '';
                        } else if (ret.result === ErrorType.SML) {
                            // TODO
                            this.addSMLErrorSemicolon(semiPos, ret.error,
                                Communication.markText(lastPos, semiPos, 'eval-fail'));
                            lastPos = this.copyPos(semiPos);
                            lastPos.ch++;
                            previousState = ret.state;

                            partial = '';
                        } else {
                            // TODO: mark error position with red color
                            let errorMessage = this.getErrorMessage(ret.error, partial, lastPos);
                            this.addErrorSemicolon(semiPos, errorMessage,
                                Communication.markText(lastPos, semiPos, 'eval-fail'));
                            lastPos = this.copyPos(semiPos);
                            lastPos.ch++;
                            previousState = null;
                            errorEncountered = true;

                            partial = '';
                        }
                    }
                } else { // no need
                    partial += ';';
                }
                baseIndex++;
                start = sc;
            }
            partial += line.substr(start + 1);
        }
        // console.log(this);
    }

    private evaluate(oldState: any, partial: string): { [name: string]: any } {
        let ret: any;
        try {
            if (oldState === null) {
                ret = this.interpreter.interpret(partial + ';', this.initialState, true);
            } else {
                ret = this.interpreter.interpret(partial + ';', oldState, true);
            }
        } catch (e) {
            // TODO: switch over e's type
            // console.log(e);
            if (this.getPrototypeName(e) === 'IncompleteError') {
                return {
                    state: null,
                    result: ErrorType.INCOMPLETE,
                    error: e,
                    warnings: []
                };
            } else {
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
        } else {
            return {
                state: ret.state,
                result: ErrorType.OK,
                error: null,
                warnings: ret.warnings
            };
        }
    }

    private getPrototypeName(object: any): string {
        let proto: any = Object.getPrototypeOf(object);
        if (proto.constructor && proto.constructor.name) {
            return proto.constructor.name;
        } else {
            return '';
        }
    }

    private getErrorMessage(error: any, partial: string, startPos: any): string {
        if (error.position !== undefined) {
            let position = this.calculateErrorPos(partial, startPos, error.position);
            return 'Zeile ' + position[0] + ' Spalte ' + position[1] + ': ' +
                this.getPrototypeName(error) + ': ' + error.message;
        } else {
            return 'Unbekannte Position: ' + this.getPrototypeName(error) + ': ' + error.message;
        }
    }

    private calculateErrorPos(partial: string, startPos: any, offset: number): [number, number] {
        let pos = {line: startPos.line, ch: startPos.ch};
        for (let i = 0; i < offset; i++) {
            let char = partial.charAt(i);
            if (char === '\n') {
                pos.line ++;
                pos.ch = 0;
            } else {
                pos.ch++;
            }
        }
        return [pos.line + 1, pos.ch + 1];
    }

    private addSemicolon(pos: any, newState: any, marker: number, warnings: any) {
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
            output: this.computeNewStateOutput(newState, baseStateId, warnings)
        });
    }

    private addIncompleteSemicolon(pos: any) {
        this.semicoli.push(pos);
        this.data.push({
            state: null,
            marker: -1,
            error: false,
            output: ''
        });
    }

    private addErrorSemicolon(pos: any, errorMessage: any, marker: number) {
        this.semicoli.push(pos);
        this.data.push({
            state: null,
            marker: marker,
            error: true,
            output: errorMessage
        });
    }

    private addSMLErrorSemicolon(pos: any, error: any, marker: number) {
        this.semicoli.push(pos);
        let outputErr: string;
        if (error.prettyPrint) {
            outputErr = 'Uncaught SML exception: ' + error.prettyPrint() + '\n';
        } else {
            outputErr = 'Unknown Uncaught SML exception\n';
        }
        this.data.push({
            state: null,
            marker: marker,
            error: true,
            output: outputErr
        });
    }

    private computeNewStateOutput(state: any, id: number, warnings: any[]) {
        let res = this.computeNewStateOutputInternal(state, id);
        for (let val of warnings) {
            res += val.message;
        }
        return res;
    }

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
    }

    private printBinding(state: any, bnd: [any, any[], any[]]) {
        let res = '> ';

        let value = bnd[1][0];
        let type: any = bnd[2];
        if (type) {
            type = type[0];
        }

        let protoName = this.getPrototypeName(value);
        if (protoName === 'ValueConstructor') {
            res += 'con';
        } else if (protoName === 'ExceptionConstructor') {
            res += 'exn';
        } else {
            res += 'val';
        }

        if (value) {
            res += ' ' + bnd[0] + ' = ' + value.prettyPrint(state);
        } else {
            return res + ' ' + bnd[0] + ' = undefined;';
        }

        if (type) {
            return res + ': ' + type.prettyPrint() + ';';
        } else {
            return res + ': undefined;';
        }
    }

    private stringArrayContains(arr: string[], search: string) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].indexOf(search) !== -1) {
                return true;
            }
        }
        return false;
    }

    private isHandlingNecessary(pos: any, added: string[], removed: string[]) {
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

    private findBaseIndex(index: number): any {
        for (let i = index; i >= 0; i--) {
            if (this.data[i].state !== null) {
                return i;
            }
        }
        return -1;
    }

    private findNonErrorAnchor(anchor: number) {
        for (let i = anchor; i >= 0; i--) {
            if (!this.data[i].error) {
                return i;
            }
        }
        return -1;
    }

    private deleteAllAfter(index: number) {
        this.semicoli.length = index + 1;
        for (let i = index + 1; i < this.data.length; i++) {
            if (this.data[i].marker !== -1) {
                Communication.clearMarker(this.data[i].marker);
            }
        }
        this.data.length = index + 1;
    }

    private binarySearch(pos: any): number {
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
            } else if (cmp === 1) {
                left = center + 1;
                if (left > right) {
                    return center; // center is the next best element
                }
            } else {
                return center - 1;
            }
        }
        return -1;
    }

    private compare(posa: any, posb: any) {
        if (posa.line === posb.line) {
            return Math.sign(posa.ch - posb.ch);
        } else {
            return Math.sign(posa.line - posb.line);
        }
    }
}

untypedGlobal.importScripts('/interpreter.js');
Communication.init();
let ii = new IncrementalInterpretation();
ii.go();

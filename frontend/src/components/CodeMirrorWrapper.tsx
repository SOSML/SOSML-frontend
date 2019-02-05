import * as React from 'react';
import new_worker from '@sosml/webworker';

const CodeMirror: any = require('react-codemirror');
require('codemirror/lib/codemirror.css');
require('../mllike.js');

/* imports for code folding */
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/foldcode.js');
require('../sml-fold.js');
require('codemirror/addon/fold/foldgutter.css');

require('codemirror/addon/edit/matchbrackets.js');
import './CodeMirrorWrapper.css';

class CodeMirrorSubset {
    cm: any;

    constructor(cm: any) {
        this.cm = cm;
    }

    getCode(pos: any): string {
        return this.cm.getRange(pos, {'line': this.cm.lineCount() + 1, 'ch' : 0}, '\n');
    }

    getValue(): string {
        return this.cm.getValue();
    }

    markText(from: any, to: any, style: string) {
        return this.cm.markText(from, to, {
            className: style
        });
    }
}

class IncrementalInterpretationHelper {
    markers: any;
    outputCallback: (code: string) => any;
    disabled: boolean;
    worker: Worker;
    codemirror: CodeMirrorSubset;
    workerTimeout: any;
    timeout: number;
    wasTerminated: boolean;
    partialOutput: string;

    constructor(outputCallback: (code: string) => any) {
        this.disabled = false;
        this.outputCallback = outputCallback;
        this.markers = {};

        this.worker = new_worker();
        this.worker.onmessage = this.onWorkerMessage.bind(this);
        this.workerTimeout = null;
        this.wasTerminated = true;
        this.partialOutput = '';
        this.timeout = 5000;
    }

    setTimeout(num: number) {
        this.timeout = num;
    }

    restartWorker() {
        this.worker.terminate();
        this.worker = new_worker();
        this.worker.onmessage = this.onWorkerMessage.bind(this);
    }

    onWorkerMessage(e: any) {
        let message = e.data;
        if (message.type === 'getcode') {
            this.worker.postMessage({
                type: 'code',
                data: this.codemirror.getCode(message.data)
            });
        } else if (message.type === 'markText') {
            let data = message.data;
            let marker = this.codemirror.markText(data.from, data.to, data.style);
            this.markers[data.id] = marker;
        } else if (message.type === 'clearMarker') {
            let id = message.data.id;
            if (this.markers[id]) {
                this.markers[id].clear();
                delete this.markers[id];
            }
        } else if (message.type === 'partial') {
            this.partialOutput += message.data;
            this.outputCallback(this.partialOutput);
            this.startTimeout();
        } else if (message.type === 'ping' || message.type === 'finished') {
            // The worker is letting us know that he is not dead or finished
            this.partialOutput = '';
            if (this.workerTimeout !== null) {
                clearTimeout(this.workerTimeout);
                this.workerTimeout = null;
            }
        }
    }

    clear() {
        this.worker.postMessage({
            type: 'clear',
            data: ''
        });
    }

    disable() {
        this.disabled = true;
        this.clear();
    }

    enable() {
        this.disabled = false;
    }

    handleChangeAt(pos: any, added: string[], removed: string[], codemirror: CodeMirrorSubset) {
        if (this.disabled) {
            return;
        }
        this.codemirror = codemirror;
        if (this.wasTerminated) { // Re-evaluate everything
            added = codemirror.getValue().split('\n');
            removed = [];
            pos = {line: 0, ch: 0};
            this.wasTerminated = false;
            this.worker.postMessage({
                type: 'settings',
                data: localStorage.getItem('interpreterSettings')
            });
        }
        this.worker.postMessage({
            type: 'interpret',
            data: {
                'pos': pos,
                'added': added,
                'removed': removed
            }
        });
        this.startTimeout();
    }

    private startTimeout() {
        if (this.workerTimeout !== null) {
            clearTimeout(this.workerTimeout);
        }
        this.workerTimeout = setTimeout(() => {
            this.restartWorker();
            let out = '';
            let timeoutStr = 'Die Ausführung wurde unterbrochen, da sie zu lange gedauert hat.';
            if (this.partialOutput.trim() === '') {
                out = timeoutStr;
            } else if (this.partialOutput.endsWith('\n')) {
                out = this.partialOutput + timeoutStr;
            } else {
                out = this.partialOutput + '\n' + timeoutStr;
            }
            this.outputCallback(out);
            this.workerTimeout = null;
            this.clearAllMarkers();
            this.wasTerminated = true;
            this.partialOutput = '';
        }, this.timeout + 400);
    }

    private clearAllMarkers() {
        for (let key in this.markers) {
            if (this.markers.hasOwnProperty(key)) {
                this.markers[key].clear();
            }
        }
        this.markers = {};
    }
}

export interface Props {
    flex?: boolean;
    onChange?: (x: string) => void;
    code: string;
    readOnly?: boolean;
    outputCallback: (code: string) => any;
    useInterpreter?: boolean;
    timeout: number;
}

class CodeMirrorWrapper extends React.Component<Props, any> {
    editor: any;
    evalHelper: IncrementalInterpretationHelper;

    constructor(props: Props) {
        super(props);

        this.evalHelper = new IncrementalInterpretationHelper(this.props.outputCallback);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
    }

    render() {
        /* Get the autoIndent setting from the local storage */
        const interfaceSettings = localStorage.getItem('interfaceSettings');
        let autoIndent = true;
        if (typeof interfaceSettings === 'string') {
            autoIndent = !!JSON.parse(interfaceSettings).autoIndent;
        }

        const options = {
            lineNumbers: true,
            mode: 'text/sml',
            indentUnit: 2,
            smartIndent: autoIndent,
            tabSize: 2,
            matchBrackets: true,
            lineWrapping: true,
            readOnly: this.props.readOnly ? true : false,
            foldGutter: {
                minFoldSize: 2
            },
            gutters: [
                'CodeMirror-linenumbers', 'CodeMirror-foldgutter'
            ]
        };
        this.evalHelper.setTimeout(this.props.timeout);
        let classAdd = '';
        if (this.props.flex) {
            classAdd = 'flexy flexcomponent';
        }
        let value = '';
        if (this.props.code) {
            value = this.props.code;
        }
        return (
            <CodeMirror className={classAdd} ref={(editor: any) => {this.editor = editor; }}
                onChange={this.handleChange}
                value={value} options={options}/>
        );
    }

    componentDidUpdate(prevProps: Props, prevState: any) {
        if (prevProps.code !== this.props.code) {
            if (this.editor) {
                this.editor.getCodeMirror().setValue(this.props.code);
                if (this.props.onChange) {
                    this.props.onChange(this.props.code);
                }
            }
        } else if (prevProps.useInterpreter !== this.props.useInterpreter) {
            if (this.props.useInterpreter) {
                this.evalHelper.enable();
                this.handleChangeEvent(this.editor.getCodeMirror(), {
                    from: {line: 0, ch: 0},
                    text: this.editor.getCodeMirror().getValue().split('\n'),
                    removed: []
                });
            } else {
                this.evalHelper.disable();
            }
        }
    }

    componentDidMount() {
        if (!this.props.useInterpreter) {
            this.evalHelper.disable();
        }
        var GCodeMirror = this.editor.getCodeMirrorInstance();
        let keyMap = GCodeMirror.keyMap;
        keyMap.default['Shift-Tab'] = 'indentLess';
        keyMap.default.Tab = function(cm2: any) {
            if (cm2.somethingSelected()) {
                return cm2.indentSelection('add');
            } else {
                return GCodeMirror.commands.insertSoftTab(cm2);
            }
        };
        let cm: any = this.editor.getCodeMirror();
        cm.refresh();
        cm.on('change', this.handleChangeEvent);

        this.evalHelper.clear();
    }

    componentWillUnmount() {
        let cm: any = this.editor.getCodeMirror();
        cm.off('change', this.handleChangeEvent);
    }

    /*
    This is the react-codemirror change handler
    */
    handleChange(newValue: string) {
        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    }

    /*
    This is the codemirror change handler
    */
    handleChangeEvent(codemirror: any, change: any) {
        // console.log(change);
        // console.log(codemirror.getValue());
        this.evalHelper.handleChangeAt(change.from, change.text, change.removed, new CodeMirrorSubset(codemirror));
    }
}

export default CodeMirrorWrapper;

import { DEFAULT_THEME } from './config';
import { getColor } from './theme';

export interface InterpreterSettings {
    allowUnicodeInStrings: boolean;
    allowVector: boolean;
    allowSuccessorML: boolean;
    disableElaboration: boolean;
    disableEvaluation: boolean;
    allowLongFunctionNames: boolean;
    allowStructuresAnywhere: boolean;
    allowSignaturesAnywhere: boolean;
    allowFunctorsAnywhere: boolean;
    strictMode: boolean;
}

export interface InterfaceSettings {
    fullscreen: boolean;
    timeout: number;
    errorColor: string;
    successColor1: string;
    successColor2: string;
    outputHighlight: boolean;
    autoIndent: boolean;
    userContributesEnergy: boolean;
    theme: string;
    maxTabCount: number;
    globalLastCache: boolean;
    showHiddenFiles: boolean;
    advancedMode: boolean;
}

export enum FileType {
    LOCAL = 1,
    SERVER
}

export interface File {
    name: string;
    info: any;
    type: FileType;
}

export const HIDDEN_FILE_PREFIX = '.GRF_SD/';

function fillObjectWithString(obj: any, str: string | null) {
    if (typeof str === 'string') {
        let data: any = JSON.parse(str);
        for (let name in data) {
            if (data.hasOwnProperty(name)) {
                obj[name] = data[name];
            }
        }
    }
}

export function getInterpreterSettings(): InterpreterSettings {
    let str: string | null = localStorage.getItem('interpreterSettings');
    let ret: InterpreterSettings = {
        allowUnicodeInStrings: true,
        allowSuccessorML : false,
        disableElaboration: false,
        disableEvaluation: false,
        allowVector: true,
        allowLongFunctionNames: false,
        allowStructuresAnywhere: false,
        allowSignaturesAnywhere: false,
        allowFunctorsAnywhere: false,
        strictMode: true,
    };
    fillObjectWithString(ret, str);
    return ret;
}

export function setInterpreterSettings(settings: InterpreterSettings) {
    // TODO
}

export function getInterfaceSettings(): InterfaceSettings {
    let str: string | null = localStorage.getItem('interfaceSettings');
    let ret: InterfaceSettings = {
        fullscreen: false,
        timeout: 5000,
        errorColor: getColor(DEFAULT_THEME, 'error'),
        successColor1: getColor(DEFAULT_THEME, 'success'),
        successColor2: getColor(DEFAULT_THEME, 'success_alt'),
        outputHighlight: true,
        autoIndent: true,
        userContributesEnergy: false,
        theme: DEFAULT_THEME,
        maxTabCount: 75,
        globalLastCache: true,
        showHiddenFiles: false,
        advancedMode: false
    };
    fillObjectWithString(ret, str);
    return ret;
}

export function setInterfaceSettings(settings: InterfaceSettings) {
    // TODO
    // NOTE: Need to adjust set 'tabCount' if 'maxTabCount' changed
}

export function getLastCachedFile(): string | undefined {
    if (!getInterfaceSettings().globalLastCache) {
        return undefined;
    }

    let lcf: string | null = localStorage.getItem('lastCachedFile');
    if (lcf === null) {
        return undefined;
    } else {
        return <string> lcf;
    }
}

export function setLastCachedFile(name: string) {
    localStorage.setItem('lastCachedFile', name);
}

function getNewTabId(): number {
    let maxTabCount = getInterfaceSettings().maxTabCount;

    let tabid: string | null = localStorage.getItem('tabCount');

    if (tabid === null) {
        localStorage.setItem('tabCount', '0');
        return 0;
    }

    let result: number = ((+tabid) + 1) % maxTabCount;
    localStorage.setItem('tabCount', '' + result);

    return result;
}

let tabId = -1;

export function getTabId(): number {
    if (tabId === -1) {
        tabId = getNewTabId();
    }
    return tabId;
}

export function setTabId(newId: number) {
    tabId = newId;
}

export class Database {
    private static instance: Database;
    private database: IDBDatabase;
    private dbRequest: any;

    static getInstance(): Promise<Database> {
        if (Database.instance == null) {
            Database.instance = new Database();
        }
        return Database.instance.getReady();
    }

    getReady(): Promise<Database> {
        return new Promise((resolve: (val: any) => void, reject: (err: any) => void) => {
            if (this.database != null) {
                resolve(this);
            } else if (this.dbRequest == null) {
                this.init();
            }
            this.dbRequest.onsuccess = (event: any) => {
                this.database = event.target.result;
                resolve(this);
            };
            this.dbRequest.onerror = (error: any) => {
                reject('Database could not be loaded');
            };
        });
    }

    getFiles(allowHidden: boolean = false): Promise<File[]> {
        return new Promise( (resolve: (val: any) => void, reject: (err: any) => void) => {
            let cursorReq = this.database.transaction(['files']).objectStore('files').openCursor();
            cursorReq.onerror = (event: any) => {
                reject('Error during read');
            };
            let files: File[] = [];
            cursorReq.onsuccess = (event: any) => {
                let cursor = event.target.result;
                if (cursor) {
                    if (cursor.value !== undefined &&
                        (!cursor.value.hidden || allowHidden)) {
                        files.push({
                            name: cursor.key,
                            info: cursor.value,
                            type: FileType.LOCAL
                        });
                    }
                    cursor.continue();
                } else {
                    resolve(files);
                }
            };
        });
    }

    saveFile(name: string, content: string, isHidden: boolean = false): Promise<boolean> {
        let fileName = (isHidden ? HIDDEN_FILE_PREFIX : '') + name;
        return new Promise( (resolve: (val: any) => void, reject: (err: any) => void) => {
            let request = this.database.transaction(['files'], 'readwrite').objectStore('files').put({
                name: fileName, value: content, date: new Date(), hidden: isHidden
            });
            request.onerror = (event) => {
                reject(false);
            };
            request.onsuccess = (event) => {
                resolve(true);
            };
        });
    }

    getFile(fileName: string, isHidden: boolean = false): Promise<string> {
        let name = (isHidden ? HIDDEN_FILE_PREFIX : '') + fileName;
        return new Promise( (resolve: (val: any) => void, reject: (err: any) => void) => {
            let request = this.database.transaction(['files']).objectStore('files').get(name);
            request.onerror = (event) => {
                reject('Error during read');
            };
            request.onsuccess = (event: any) => {
                try {
                    resolve(event.target.result.value);
                } catch (e) {
                    reject('Reading ' + name + ' failed with error ' +  e.name + ': ' + e.message);
                }
            };
        });
    }

    deleteFile(fileName: string, isHidden: boolean = false): Promise<boolean> {
        let name = (isHidden ? HIDDEN_FILE_PREFIX : '') + fileName;
        return new Promise( (resolve: (val: any) => void, reject: (err: any) => void) => {
            let request = this.database.transaction(['files'], 'readwrite').objectStore('files').delete(name);
            request.onerror = (event) => {
                reject(false);
            };
            request.onsuccess = (event) => {
                resolve(true);
            };
        });
    }

    private init(): void {
        this.dbRequest = window.indexedDB.open('FilesDB', 1);
        this.dbRequest.onupgradeneeded = (event: any) => {
            let db = event.target.result;
            db.createObjectStore('files', { keyPath: 'name'});
        };
        this.dbRequest.onsuccess = (event: any) => {
            this.database = event.target.result;
        };
    }
}

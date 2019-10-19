/*

Defines API used to communicate with the backend server.

*/

export class API {
    static EMULATE: boolean = false;
    static LAST_SHARE: Date | undefined;

    static fallbackInterpreter(code: string): Promise<string> {
        return fetch('/api/fallback/',
            {
                headers: {
                  'Accept': 'text/plain',
                  'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({'code': code})
            }
        ).then(function(response: any) {
            if (!response.ok) {
                return Promise.reject(response.status);
            } else {
                return response.text();
            }
        });
    }

    static shareCode(code: string): Promise<string> {
        if (API.LAST_SHARE !== undefined) {
            if (new Date().getTime() - API.LAST_SHARE.getTime() <= 15000) {
                return Promise.reject('Please wait a little until you try to share again.');
            }
        }
        API.LAST_SHARE = new Date();
        return fetch('/api/share/',
            {
                headers: {
                  'Accept': 'text/plain',
                  'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({'code': code})
            }
        ).then(function(response: any) {
            if (!response.ok) {
                return Promise.reject(response.status);
            } else {
                return response.text();
            }
        });
    }

    static loadSharedCode(hash: string): Promise<string> {
        return fetch('/api/share/' + hash,
            {
                headers: {
                  'Accept': 'text/plain',
                  'Content-Type': 'application/json'
                },
                method: 'GET'
            }
        ).then(function(response: any) {
            if (!response.ok) {
                return Promise.reject(response.status);
            } else {
                return response.text();
            }
        });
    }

    static getCodeExamplesList(): Promise<string[]> {
        return fetch('/api/list/',
            {
                headers: {
                  'Accept': 'text/json',
                  'Content-Type': 'application/json'
                },
                method: 'GET'
            }
        ).then(function(response: any) {
            if (!response.ok) {
                return Promise.reject(response.status);
            } else {
                return response.json();
            }
        }).then(function(data: any) {
            return data.codes.map((name: any) => {
                return name.replace('.sml', '');
            });
        });
    }

    static getCodeExample(name: string): Promise<String> {
        return fetch('/code/' + name.replace(/\//g, '%2F'),
            {
                headers: {
                  'Accept': 'text/plain',
                  'Content-Type': 'application/json'
                },
                method: 'GET'
            }
        ).then(function(response: any) {
            if (!response.ok) {
                return Promise.reject(response.status);
            } else {
                return response.text();
            }
        });
    }
}

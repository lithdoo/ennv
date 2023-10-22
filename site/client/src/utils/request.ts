

class FetchSender {

    send(request: ERequset) {
        const {
            _method: method, _path: path, _json: json, _query: query, _body: body
        } = request

        const queryString = !query ? '' : (
            '?' + Array.from(Object.entries(query))
                .filter(([_, value]) => typeof value === 'string')
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&')
        )

        const bodyData =
            body ? body :
                json ? JSON.stringify(json)
                    : null

        const connect = fetch(path + queryString, {
            method,
            headers: json ? { 'Content-Type': 'application/json' } : {},
            body: bodyData
        })

        return {
            json: () => connect.then(response => response.json())
        }
    }
}

export class ERequset {

    static sender = new FetchSender()

    static get(path: string) {
        const _this = new ERequset()
        _this._method = 'GET'
        _this._path = path
        return _this
    }

    static post(path: string) {
        const _this = new ERequset()
        _this._method = 'POST'
        _this._path = path
        return _this
    }

    static delete(path: string) {
        const _this = new ERequset()
        _this._method = 'DELETE'
        _this._path = path
        return _this
    }

    static put(path: string) {
        const _this = new ERequset()
        _this._method = 'PUT'
        _this._path = path
        return _this
    }

    _path: string = ''
    _method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET'
    _json?: any
    _query?: { [key: string]: string }
    _body: any


    body(data:any){
        this._body = data
        return this
    }

    json(data:any){
        this._json = data
        return this
    }

    query(data:{ [key: string]: string }){
        this._query = data
        return this
    }

    send() { return ERequset.sender.send(this) }
}


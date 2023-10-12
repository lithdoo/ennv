import test from 'ava';

import { EnActionHandler, EnActions, actions } from './index'

test('actions', (t) => {
    t.true(actions instanceof EnActions)
});

test('regist', (t) => {
    class TextHandler implements EnActionHandler {
        element: HTMLElement = {} as HTMLElement
        onMsg(msg: unknown) { console.log(msg) }
        onComplete(res: Response) { console.log(res) }
        onError(msg: unknown) { console.log(msg) }

        constructor(id:string){
            this.element.innerHTML = id
        }
    }

    actions.regist('test', {
        name: 'test',
        icon: './test.icon.png',
        apply: (file) => file.size < 10000
    }, ({ actionId }) => new TextHandler(actionId))

    const test = actions.all.get('test') as any
    const handler = test.createHandler({actionId:'tid'})
    t.true(test.option.name === 'test')
    t.true(test.option.apply({size:9999}))
    t.true(test.option.icon === './test.icon.png')
    t.true(handler.element.innerHTML === 'tid' )
})
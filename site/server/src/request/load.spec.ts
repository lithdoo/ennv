import test from 'ava';
import supertest from 'supertest'
import {server} from '../index.spec'

server.setExtraFiles({ scripts: ['test.js'], stylesheets: ['test.css'] })

const request = supertest.agent(server.app.listen())

test('scripts', async (t) => {
    const respond = await request.get('/load/script/list')
        .expect(200)

    t.true((respond.body as string[]).indexOf('test.js') >= 0)
})


test('stylesheets',async (t) => {
    const respond = await request.get('/load/stylesheet/list')
        .expect(200)

     t.true((respond.body as string[]).indexOf('test.css') >= 0)
})
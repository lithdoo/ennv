import test from 'ava';
import supertest from 'supertest'
import {server} from '../index.spec'
import { diskHandler } from './disk';

import {EnFile, EnFileDisk} from '@ennv/disk'

diskHandler.regist('test', new class implements EnFileDisk{
    typeName = 'test'

    async getFile(path: string): Promise<EnFile<undefined>> {
        if(path === '/test.md'){
            return {
                basename:'test.md',
                filename:'/test.md',
                lastmod: new Date().toDateString(),
                size: 0,
                type:'file',
                etag: null,
                symlink: false,
                extra:undefined
            }
        }else{
            throw new Error('file not found')
        }
    }

    async getDirContent(path: string): Promise<EnFile<undefined>[]> {
        if(path === '/'){
            return [{
                basename:'test.md',
                filename:'/test.md',
                lastmod: new Date().toDateString(),
                size: 0,
                type:'file',
                etag: null,
                symlink: false,
                extra:undefined
            }]
        }else{
            return []
        }
    }

})

const request = supertest.agent(server.app.listen())

test('file', async (t) => {
    const respond = await request.get(`/disk/file/test?path=${encodeURIComponent('/test.md')}`)
        .expect(200)

    t.true(respond.body.size === 0)
})

test('dir', async (t) => {
    const respond = await request.get(`/disk/dir/content/test?path=${encodeURIComponent('/')}`)
        .expect(200)

    t.true(respond.body[0].filename === '/test.md')
})



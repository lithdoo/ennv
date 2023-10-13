import test from 'ava';
import { EnnvServer } from './index'
import { diskHandler } from './request/file';

export const server = new EnnvServer()

test('loadFileDisk',(t)=>{
    
    server.loadFileDisk('loadFileDisk',{
        typeName: 'loadFileDisk',
        async getFile(path: string){ throw Error(`getFile:${path}`)},
        async getDirContent(path: string){ throw Error(`getDirContent:${path}`)}
    })

    t.true(diskHandler.fileDisks.has('loadFileDisk'))
})
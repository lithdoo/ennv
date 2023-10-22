import { ERequset } from "@/utils/request";
import { EnFile } from "@ennv/disk";


const removelast = (str:string)=> {
    if(str[str.length-1] === '/'){
        return str.substring(0, str.length - 1)
    }else{
        return str
    }
}

export const getDiskList = 
    // () => ERequset.get('/disk/list')
    // .send().json() as Promise<string[]>
    async() => ['test0','test1']

export const getDirContent = 
    // (keyName: string, path: string) => ERequset.get(`/dir/content/${keyName}`)
    // .query({ path })
    // .send().json() as Promise<EnFile[]>
    async(_: string, path: string): Promise<EnFile[]> => [{
        basename:'test.md',
        filename: removelast(path) + '/test.md',
        lastmod: new Date().toDateString(),
        size: 0,
        type:'file',
        etag: null,
        symlink: false,
        extra:undefined
    },{
        basename:'test_dir0',
        filename: removelast(path) + '/test_dir0',
        lastmod: new Date().toDateString(),
        size: 0,
        type:'directory',
        etag: null,
        symlink: false,
        extra:undefined
    },{
        basename:'test_dir1',
        filename: removelast(path) + '/test_dir1',
        lastmod: new Date().toDateString(),
        size: 0,
        type:'directory',
        etag: null,
        symlink: false,
        extra:undefined
    }]


export const getDirFolders = 
    // (keyName: string, path: string) => ERequset.get(`/dir/content/${keyName}`)
    // .query({ path })
    // .send().json() as Promise<EnFile[]>
    async(_: string, path: string): Promise<EnFile[]> => [{
        basename:'test_dir0',
        filename: removelast(path) + '/test_dir0',
        lastmod: new Date().toDateString(),
        size: 0,
        type:'directory',
        etag: null,
        symlink: false,
        extra:undefined
    },{
        basename:'test_dir1',
        filename: removelast(path) + '/test_dir1',
        lastmod: new Date().toDateString(),
        size: 0,
        type:'directory',
        etag: null,
        symlink: false,
        extra:undefined
    }]

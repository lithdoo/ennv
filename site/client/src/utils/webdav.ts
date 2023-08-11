import { createClient, ResponseDataDetailed } from 'webdav'


const client = createClient('http://localhost:4001/webdav/')




function isResponseDataDetailed(argu: ResponseDataDetailed<unknown> | unknown): argu is ResponseDataDetailed<unknown> {
    return !!(argu as any).data
}

export const getDirContents = (path: string) => client.getDirectoryContents(path)
    .then(list => list instanceof Array ? list : list.data)

export const getDirFolders = (path: string) => client.getDirectoryContents(path)
    .then(list => list instanceof Array ? list : list.data)
    .then(list => list.filter(v => v.type === 'directory'))

// export const getDirFoldersWithLeafField = (path:string)=>{
//     client.getDirectoryContents(path,{
//         d
//     })
// }

export const getFileDetail = (path: string) => client.stat(path).then((file) => isResponseDataDetailed(file) ? file.data : file)

export interface FileStat {
    filename: string;
    basename: string;
    lastmod: string;
    size: number;
    type: "file" | "directory";
    etag: string | null;
    mime?: string;
}

; (window as any).client = client
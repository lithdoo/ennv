import { createClient } from 'webdav'


const client = createClient('http://localhost:4001/webdav/')

client.getDirectoryContents('/').then(data => {
    console.log('webdav', data)
})


export const getDirContents = (path: string) => client.getDirectoryContents(path)
    .then(list => list instanceof Array ? list : list.data)

export const getDirFolders = (path: string) => client.getDirectoryContents(path)
    .then(list => list instanceof Array ? list : list.data)
    .then(list => list.filter(v => v.type === 'directory'))

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
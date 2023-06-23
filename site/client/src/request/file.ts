import { ERequset } from "@/utils/request";

export const getDiskList = () => ERequset.get('/file/disk/list')
    .send().json() as Promise<string[]>

export const getDirFolders = (path: string) => ERequset.get('/file/dir/content/folders')
    .query({ path })
    .send().json() as Promise<{ name: string, isLeaf: boolean }[]>

export const getDirContent =(path: string) =>  (ERequset.get('/file/dir/content')
    .query({ path })
    .send().json() as Promise<{ name: string, path: string, isFolder: boolean }[]>)
    .then(list=>list.filter(v=>v.isFolder).concat(list.filter(v=>!v.isFolder)))

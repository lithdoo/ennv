import { ERequset } from "@/utils/request";

export const getDiskList = () => ERequset.get('/file/disk/list')
    .send().json() as Promise<string[]>

export const getDirFolders = (path: string) => ERequset.get('/file/dir/content/folders')
    .query({ path })
    .send().json() as Promise<{ name: string ,isLeaf: boolean}[]>

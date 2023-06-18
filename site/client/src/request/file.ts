import { ERequset } from "@/utils/request";

interface FolderContentItem { name: string, isFolder: boolean }

export const getDiskList = () => ERequset.get('/file/disk/list')
    .send().json() as Promise<string[]>

export const getDirFolders = (path: string[]) => ERequset.post('/file/dir/content/folders')
    .query({ filterFolder: 'true' }).json({ path })
    .send().json() as Promise<FolderContentItem[]>
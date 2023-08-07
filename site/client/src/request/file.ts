// import { EnFile, EnFileDetail, EnFolder, EnFolderDetail } from "@/model/file";
// import { assign } from "@/utils/base";
// import { ERequset } from "@/utils/request";

// export const getDiskList = () => ERequset.get('/file/disk/list')
//     .send().json() as Promise<string[]>

// export const getDirFolders = (path: string) => ERequset.get('/file/dir/content/folders')
//     .query({ path })
//     .send().json() as Promise<{ name: string, isLeaf: boolean }[]>

// export const getDirContent = (path: string) => (ERequset.get('/file/dir/content')
//     .query({ path })
//     .send().json() as Promise<{ name: string, path: string, isFolder: boolean }[]>)
//     .then(list => list.filter(v => v.isFolder).concat(list.filter(v => !v.isFolder)))

// export const getFolderDetail = (folder: EnFolder) => ERequset.get('/file/folder/detail')
//     .query({ path: folder.path })
//     .send().json()
//     .then(data => assign(new EnFolderDetail, folder, {
//         updateTime: data.updateTime,
//         createTime: data.createTime
//     }))

// export const getFileDetail = (file: EnFile) => ERequset.get('/file/detail')
//     .query({ path: file.path })
//     .send().json()
//     .then(data => assign(new EnFileDetail, file, {
//         updateTime: data.updateTime,
//         createTime: data.createTime,
//         size: data.size
//     }))
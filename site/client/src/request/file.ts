import { ERequset } from "@/utils/request";
import { EnFile } from "@ennv/disk";

export const getDiskList = () => ERequset.get('/disk/list')
    .send().json() as Promise<string[]>


export const getDirContent = (keyName: string, path: string) => ERequset.get(`/dir/content/${keyName}`)
    .query({ path })
    .send().json() as Promise<EnFile[]>

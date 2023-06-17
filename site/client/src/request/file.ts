import { ERequset } from "@/utils/request";

export const getDiskList = () => ERequset.get('/file/disk/list')
    .send().json() as Promise<string[]>


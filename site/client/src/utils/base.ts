// import { FileType } from "@/model/file"

import { FileType } from "./file"

export const assign = <T extends object>(base:T,...next:(Partial<T>)[])=> Object.assign(base,...next)


export const filename = (path:string) => path.split('/').reverse()[0] 

export const fileicon = (path:string) => FileType.type(filename(path)).icon
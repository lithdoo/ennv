import Router from 'koa-router';
import { EnFileDisk } from '@ennv/disk';
export declare const disk: Router<any, {}>;
export declare const diskHandler: {
    fileDisks: Map<string, EnFileDisk<unknown>>;
    regist<T>(fd: EnFileDisk<T>): void;
    getFile(key: string, path: string): Promise<import("@ennv/disk").EnFile<unknown>>;
    getDirContent(key: string, path: string): Promise<import("@ennv/disk").EnFile<unknown>[]>;
    getKeyNameList(): string[];
};

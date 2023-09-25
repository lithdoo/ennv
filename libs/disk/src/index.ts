import { Stream } from 'stream';

export interface EnFile<Extra = undefined> {
    filename: string;
    basename: string;
    lastmod: string;
    size: number;
    type: "file" | "directory";
    etag: string | null;
    symlink: boolean,
    extra: Extra
}

export interface EnFileDisk<Extra = undefined> {
    typeName: string,
    getFile(path: string): Promise<EnFile<Extra>>
    getDirContent(path: string): Promise<EnFile<Extra>[]>
    getFileBuffer?(path: string): Promise<Buffer>
    getFileReadStream?(path: string): Promise<Stream>
    getFileWriteStream?(path: string): Promise<Stream>
}

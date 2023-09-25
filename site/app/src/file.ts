import { EnFile, EnFileDisk } from '@ennv/disk'
import fs from 'fs'
import { basename as getBasename, resolve, } from 'path'
import { Stream } from 'stream'

export class LocalFile implements EnFileDisk {

    rootDir: string
    typeName = 'LOCAL_FILE'

    constructor(path: string) {
        this.rootDir = path
        if (!fs.existsSync(this.rootDir)) {
            throw new Error('directory is not exist!')
        }
        if (!fs.statSync(path).isDirectory()) {
            throw new Error('input should be directory!')
        }
    }

    private validateFileName(filename: string) {
        if (filename[0] !== '/') throw new Error('filename is not allowed!')
    }

    getLocalPath(filename: string) {
        this.validateFileName(filename)
        return resolve(this.rootDir, `.${filename}`)
    }

    async getFile(filename: string): Promise<EnFile> {
        const localPath = this.getLocalPath(filename)
        const basename = getBasename(filename)
        if (!basename) {
            throw new Error('filename is not allowed!')
        }
        if (!fs.existsSync(localPath)) {
            throw new Error('file is not exist')
        }
        const stat = await fs.promises.stat(localPath)
        const isDirectory = stat.isDirectory()
        const isFile = stat.isFile()
        const isSymlink = stat.isFile()
        const lastmod = stat.ctime.toString()

        if (!isFile && !isDirectory) {
            throw new Error('file type is not allowed!')
        }

        return {
            basename,
            filename,
            lastmod,
            type: isDirectory ? 'directory' : 'file',
            etag: '',
            size: stat.size,
            symlink: isSymlink,
            extra: undefined
        }

    }

    async getDirContent(filename: string): Promise<EnFile[]> {
        const localPath = this.getLocalPath(filename)

        if (!fs.existsSync(localPath)) {
            throw new Error('dir is not exist')
        }

        const nameList = await fs.promises.readdir(localPath)

        const list = (await Promise.all(
            nameList.map(
                basename => fs.promises.stat(
                    resolve(localPath, basename)
                ).then(stat => ({
                    stat,
                    basename,
                    filename: `${filename}/${basename}`
                }))
            ))
        ).filter(v => v.stat.isDirectory() || v.stat.isFile())

        return list.map(({ stat, basename, filename }) => {
            const isDirectory = stat.isDirectory()
            const isSymlink = stat.isFile()
            const lastmod = stat.ctime.toString()
            return {
                basename,
                filename,
                lastmod,
                type: isDirectory ? 'directory' : 'file',
                etag: '',
                size: stat.size,
                symlink: isSymlink,
                extra: undefined
            }
        })
    }

    async getFileBuffer(path: string): Promise<Buffer> {
        const localPath = this.getLocalPath(path)
        return await fs.promises.readFile(localPath)
    }

    async getFileReadStream(path: string): Promise<Stream> {
        const localPath = this.getLocalPath(path)
        return fs.createReadStream(localPath)
    }

    async getFileWriteStream(path: string): Promise<Stream> {
        const localPath = this.getLocalPath(path)
        return fs.createWriteStream(localPath)
    }
}

import type { Request } from "express"

export interface UploadedFile {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    path: string
    size: number
    filename: string
}

export interface CloudinaryUploadResult {
    url: string
    publicId: string
}

export interface UploadOptions {
    folder?: string
    formats?: string[]
    maxSize?: number // in bytes
    transformation?: any[]
}

export interface UploadField {
    name: string
    maxCount: number
}

// Extended Express Request with file(s)
export interface RequestWithFile extends Request {
    file?: UploadedFile
    files?:
        | {
        [fieldname: string]: UploadedFile[]
    }
        | UploadedFile[]
}

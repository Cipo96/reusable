export interface IAttachmentDTO {
    ID: number | string;
    FileName?: string;
    FileContentType?: string;
    FileExtension?: string;
    FilePath?: string;
    AttachmentType?: AttachmentType;
    FileDataBase64?: string;
    IsImage?: boolean;
    FileThumbnailBase64?: string;
    TrustedUrl?: any;
}

export enum AttachmentType {
    FILE = 1,
    LINK = 2,
    DROPBOX = 3
}

export enum CropOptionEnum {
    ROTATE = 1,
    FLIP = 2
}

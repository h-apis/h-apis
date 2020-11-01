import {HitomiReaderFile} from '../types';
import getImageUrlRawFunction from '../common';

export default function getImageUrlFromRaw(galleryNumber: string | number, readerFileData: HitomiReaderFile): string {
    return getImageUrlRawFunction(galleryNumber, readerFileData)
}

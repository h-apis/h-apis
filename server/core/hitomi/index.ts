import * as hitomiService from './service';
import fse from 'fs-extra';
import path from 'path';
import HitomiDataManager from "./dataManager";

/**
 * 갤번을 입력하면 파일을 다운로드해준다.
 */
class HitomiCore {
    public directory: string;
    private dao: HitomiDataManager;

    constructor(directory: string) {
        this.directory = directory;

        const dbFilePath = path.join(directory, 'hitomi.db');
        this.dao = new HitomiDataManager(dbFilePath);
    }

    async download(galleryNumber: number) {
        const {title, files, id} = await hitomiService.getGalleryMetaDataFromHitomi(galleryNumber);
        const escapedTitle = HitomiCore.escapeForDirectory(title);
        const imageUrlList = files.map((file) => hitomiService.getImageUrlFrom(galleryNumber, file));
        const targetDirectory = path.join(this.directory, escapedTitle);

        await fse.ensureDir(targetDirectory);
        await Promise.all(imageUrlList.map((url, index) =>
            hitomiService.downloadImage(url, path.join(targetDirectory, files[index].name))
        ));

        await this.dao.insert({
            rawTitle: title,
            title: escapedTitle,
            galleryNumber: parseInt(id),
            thumbnailFileName: files[0].name,
        });
    }

    async getDownloadedData() {
        // NOTE 적절한 위치를 찾지 못함. 동시성 처리에 문제가 있을 수 있음.
        await this.synchronizeWithDirectory();
        return this.dao.getAll();
    }

    async getThumbnailImage(galleryNumber: number): Promise<string> {
        const item = await this.dao.getOne({galleryNumber});
        if (item?.thumbnailFileName) {
            return path.join(this.directory, item.title, item.thumbnailFileName);
        } else {
            return '';
        }
    }

    /**
     * 디렉토리 내에 있는 실제 작품들과 데이터베이스 내에 있는 리스트가 일치하는지 확인한다.
     * 데이터베이스에는 있지만 실제 작품이 삭제되거나 이동되어서 없는 경우는 데이터베이스에서 데이터를 삭제한다.
     */
    async synchronizeWithDirectory(): Promise<string[]> {
        const directoryList = await fse.readdir(this.directory);
        return await this.dao.refreshByDirectoryTitle(directoryList);
    }

    /**
     * 디렉토리명에 특수문자가 들어갈 수 없으므로, 전부 + 처리한다.
     * 추가로 공백은 _ 처리한다.
     * @private
     */
    private static escapeForDirectory(target: string) {
        return target
            .replace(/[ ]/g, '_')
            .replace(/[&\/\\#,+()$~%.'":*?<>{}|]/g, '+')
    }
}

export default HitomiCore;

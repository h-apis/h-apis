import fse, {ReadStream} from 'fs-extra';
import path from 'path';
import HitomiDataManager from './dataManager';
import getMetadataFromReader from './functions/getMetadataFromReader';
import getImageUrlFromRaw from './functions/getImageUrlFromRaw';
import downloadImage from './functions/downloadImage';
import titleMapper from './mapper/titleMapper';
import bypassAxios from '../../common/bypassAxios';

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
        const {title, files, id} = await getMetadataFromReader(galleryNumber);
        const escapedTitle = titleMapper.escapeTitle(title);
        const imageUrlList = files.map((file) => getImageUrlFromRaw(galleryNumber, file));
        const targetDirectory = path.join(this.directory, escapedTitle);

        await fse.ensureDir(targetDirectory);
        await Promise.all(imageUrlList.map((url, index) =>
            downloadImage(url, path.join(targetDirectory, files[index].name))
        ));

        await this.dao.upsert({
            title,
            id: parseInt(id),
            thumbnail: {
                file: files[0].name
            }
        });
    }

    async getDownloadedData() {
        // NOTE 적절한 위치를 찾지 못함. 동시성 처리에 문제가 있을 수 있음.
        await this.synchronizeWithDirectory();
        return this.dao.getAll();
    }

    async getThumbnailImage(id: number): Promise<ReadStream | undefined> {
        const item = await this.dao.getOne({id});
        const thumbnailFile = item?.thumbnail?.file;
        const thumbnailImageUrl =  item?.thumbnail?.imageUrl;
        if (thumbnailImageUrl) {
            const {data} = await bypassAxios.get(thumbnailImageUrl, {
                responseType: 'stream',
                headers: {
                    referer: 'https://hitomi.la/'
                }
            });
            return data;
        } else if (thumbnailFile) {
            return fse.createReadStream(
                path.join(this.directory, titleMapper.escapeTitle(item.title || ''), thumbnailFile)
            );
        } else {
            return undefined;
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
}

export default HitomiCore;

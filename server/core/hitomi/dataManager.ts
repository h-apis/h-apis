import DataStore from 'nedb';
import {difference} from 'lodash';

type HitomiDTO = {
    title: string;
    rawTitle: string; // no escaped title
    galleryNumber: number;
    thumbnailFileName?: string;
}

class HitomiDataManager {
    private db: DataStore<HitomiDTO>;
    private dbFilePath: string;

    constructor(dataPath: string) {
        this.dbFilePath = dataPath;
        this.db = new DataStore<HitomiDTO>({
            filename: dataPath,
            autoload: true
        });

    }

    insert(newData: HitomiDTO) {
        return new Promise((resolve, reject) => {
            this.db.findOne({
                galleryNumber: newData.galleryNumber
            }, (err, alreadyExistsData) => {
                if (!alreadyExistsData) {
                    this.db.insert(newData, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    this.db.update(alreadyExistsData, newData, undefined, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            })
        });
    }

    async refreshByDirectoryTitle(titleList: string[]) {
        const dbExistsList = this.getAll().map((doc) => doc.title);
        const dbExistButNoFilesTitleList = difference(dbExistsList, titleList);

        await Promise.all(dbExistButNoFilesTitleList.map((title) => new Promise((resolve, reject) => {
                this.db.remove({title}, (err) => {
                    if (err) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            })
        ));

        return dbExistButNoFilesTitleList;
    }

    getAll() {
        return this.db.getAllData();
    }

    getOne(query: Partial<HitomiDTO>): Promise<HitomiDTO> {
        return new Promise((resolve, reject) => {
            this.db.findOne(query, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

export default HitomiDataManager;

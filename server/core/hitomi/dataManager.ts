import DataStore from 'nedb';
import {difference} from 'lodash';

type HitomiDTO = {
    title: string;
    rawTitle: string; // no escaped title
    galleryNumber: number;
}

class HitomiDataManager {
    private db: DataStore;
    private dbFilePath: string;

    constructor(dataPath: string) {
        this.dbFilePath = dataPath;
        this.db = new DataStore<HitomiDTO>({
            filename: dataPath,
            autoload: true,
        });

    }

    insert(data: HitomiDTO) {
        return new Promise((resolve, reject) => {
            this.db.insert(data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
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
}

export default HitomiDataManager;

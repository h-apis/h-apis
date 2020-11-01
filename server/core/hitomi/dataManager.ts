import DataStore from 'nedb';
import {difference} from 'lodash';
import {HitomiDTO} from './types';
import titleMapper from './mapper/titleMapper';

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

    upsert(newData: Partial<HitomiDTO>) {
        return new Promise((resolve, reject) => {
            this.db.findOne({
                id: newData.id
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
        const dbExistsList = this.getAll().map((doc) => titleMapper.escapeTitle(doc.title));
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

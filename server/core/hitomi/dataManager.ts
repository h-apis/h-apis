import DataStore from 'nedb';

type HitomiDTO = {
    title: string;
    rawTitle: string; // no escaped title
    galleryNumber: number;
}

class HitomiDataManager {
    private db: DataStore;

    constructor() {
        this.db = new DataStore<HitomiDTO>({
            autoload: true
        });
    }

    async insert(data: HitomiDTO) {
        await this.db.insert(data);
    }

    getAll() {
        return this.db.getAllData();
    }
}

export default HitomiDataManager;

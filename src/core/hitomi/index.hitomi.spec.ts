import * as hitomi from './index';

describe('hitomi', () => {
    it('getList', async () => {
        const galleryNumberList = await hitomi.getList();

        console.log(galleryNumberList);
    });

    it('getGalleryMetadata', async () => {
        const result = await hitomi.getGalleryMetaData(1761941);
        console.log(result);
    });
})

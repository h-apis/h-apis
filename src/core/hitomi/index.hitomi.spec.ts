import * as hitomi from './index';
import {assert} from 'chai';

describe('hitomi', () => {
    it('getList', async () => {
        const galleryNumberList = await hitomi.getList();
        assert.isArray(galleryNumberList);
    });

    it('getGalleryMetadata', async () => {
        const result = await hitomi.getGalleryMetaData(1761941);
        console.log(result);
        assert.isObject(result);
    });

    it('getGalleryMetadataFromHitomi', async () => {
        const result = await hitomi.getGalleryMetaDataFromHitomi(1761941);
        console.log(result);
        assert.isObject(result);
    });

    it('getReaderCommonJSFile', async () => {
        const result = await hitomi.getImageUrlList();
        assert.isArray(result);
        assert.isNotEmpty(result);
    });

    it('getImageData', async function () {
        this.timeout(50000);
        const dummyUrl = 'https://ab.hitomi.la/images/0/72/1923b3e2d6e5b904617ad54a9140c5017d1014910967b62d99bc98d0488eb720.jpg';
        const result = await hitomi.getImageData(dummyUrl);
        assert.exists(result)
    })
})

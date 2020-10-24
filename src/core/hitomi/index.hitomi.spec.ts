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
    })
})

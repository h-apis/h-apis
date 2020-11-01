import fse from 'fs-extra';
import {assert} from 'chai';
import getListFromNozomi from './functions/getListFromNozomi';
import getMetadataFromGallery from './functions/getMetadataFromGallery';
import getMetadataFromReader from './functions/getMetadataFromReader';
import downloadImage from './functions/downloadImage';

describe('hitomi', () => {
    it('getList', async () => {
        const galleryNumberList = await getListFromNozomi();
        assert.isArray(galleryNumberList);
    });

    it('getGalleryMetadata', async () => {
        const result = await getMetadataFromGallery(1761941);
        console.log(result);
        assert.isObject(result);
    });

    it('getGalleryMetadataFromHitomi', async () => {
        const result = await getMetadataFromReader(1761941);
        // console.log(result);
        assert.isObject(result);
    });

    it('downloadImage', async function () {
        this.timeout(50000);
        const dummyUrl = 'https://ab.hitomi.la/images/0/72/1923b3e2d6e5b904617ad54a9140c5017d1014910967b62d99bc98d0488eb720.jpg';
        const targetImageFileUrl = './image.jpg';
        try {
            await downloadImage(dummyUrl, targetImageFileUrl);
            assert.ok('downloaded')
        } catch (e) {
            assert.fail(e)
        } finally {
            fse.removeSync(targetImageFileUrl);
        }
    })
})

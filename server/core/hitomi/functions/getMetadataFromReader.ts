import {HitomiReaderMetadata} from '../types';
import {GALLERY_URL} from '../constants';
import bypassAxios from '../../../common/bypassAxios';

/**
 * 히토미에서 직접 내려준 데이터 정리값. 그러나 reader phase 에서 사용하고 있기 때문에,
 * 시리즈 및 캐릭터등의 인덱스에서 보여주는 정보를 가지고있지 않다.
 * 하지만 구조상 히토미에서 직접 제공해주는 데이터기 때문에 속도는 훨씬 빠르다. (파싱이 없기 때문)
 * @param galleryNumber
 */
export default async function getMetadataFromReader(galleryNumber = 644511): Promise<HitomiReaderMetadata> {
    const url = `${GALLERY_URL}/${galleryNumber}.js`;
    const {data} = await bypassAxios.get<string>(url);
    const resultObject = JSON.parse(data.replace('var galleryinfo = ', '')) as HitomiReaderMetadata;

    resultObject.files.forEach((file) => {
        // [workaround] webp 나 avif 포맷은 가지고싶은 파일 종류가 아니므로, 순수 이미지 포맷의 데이터를 요구한다.
        Object.assign(file, {haswebp: 0, hasavif: 0});
    });

    return resultObject;
}

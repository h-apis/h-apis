import bypassAxios from '../../../common/bypassAxios';
import {BYTE, FETCH_DATA_COUNT, LTN_URL} from '../constants';

export type HitomiFetchQuery = Partial<{
    page: number;
    language: string;
    type: string;
}>

export default async function getListFromNozomi(query: HitomiFetchQuery) {
    const {page = 1, language = 'all'} = query;

    const startByte = (page - 1) * FETCH_DATA_COUNT * BYTE;
    const endByte = (page * FETCH_DATA_COUNT * BYTE) - 1;

    const result = await bypassAxios.get<Buffer>(`${LTN_URL}/index-${language}.nozomi`, {
        params: {page},
        responseType: 'arraybuffer',
        headers: {
            'Range': `bytes=${startByte}-${endByte}`
        }
    });

    const galleryNumberList = [];
    for (let i = 0; i < result.data.byteLength / 4; i++) {
        galleryNumberList.push(result.data.readUInt32BE(i * 4));
    }

    return galleryNumberList;
}

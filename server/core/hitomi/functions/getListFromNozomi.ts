import bypassAxios from '../../../common/bypassAxios';
import {LTN_URL} from '../constants';

export default async function getListFromNozomi() {
    const result = await bypassAxios.get<Buffer>(`${LTN_URL}/index-all.nozomi`, {
        responseType: 'arraybuffer',
        headers: {
            'Range': 'bytes=0-99'
        }
    });

    const galleryNumberList = [];
    for (let i = 0; i < result.data.byteLength / 4; i++) {
        galleryNumberList.push(result.data.readUInt32BE(i * 4));
    }

    return galleryNumberList;
}

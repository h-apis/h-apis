import bypassAxios from '../../../common/bypassAxios';
import fse from 'fs-extra';

/**
 * 이미지 CDN 서브도메인은 referer check 를 한다.
 * 그렇지 않으면 403 에러를 내기 때문에 약간의 조작을 요한다.
 */
export default async function downloadImage(url: string, filePath: string) {
    const {data} = await bypassAxios.get(url, {
        responseType: 'stream',
        headers: {
            referer: 'https://hitomi.la/'
        }
    });

    return new Promise((resolve, reject) => {
        const writeStream = fse.createWriteStream(filePath);
        data.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

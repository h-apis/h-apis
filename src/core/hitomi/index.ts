import bypassAxios from "../../common/bypassAxios";
import cheerio from 'cheerio';
import fs from 'fs';
import getImageUrl from './common';

/*
 * 메인페이지의 <div class="gallery-content"/> 에 데이터블록을 태우는 순서
 *
 * galleryblock.js 에서..
 *
 * fetch_nozomi();
 *
 * fetch_nozomi() ->
 * [put_results_on_page -> get_block -> put_results_on_page ...] (재귀호출중)
 *
 * 그 이후 순차적으로
 * set_title();
 * set_feed_url();
 * fetch_languages(); -> searchlib.js 에 종속성 있음
 * fetch_nozomiurl(); 실행됨
 */


/*
 * fetch_nozomi 동작 순서
 * - //ltn.hitomi.la/index-all.nozomi <- 를 만들기위해 이것저것 조작함
 * - 그리고 ajax
 * responseType: arraybuffer
 * Range: (pageNumber -1) * galleries_per_page=25 * 4 ~ <-number + galleriees_per_page * 4 - 1
 * 완료되면 nozomi 에갤번 push / total_items 에 전체 카운트 정립
 * put_results_on_page
 */

/*
 * put_results_on_page 동작 순서
 * 전역 nozomi, galleries_per_page 로 몇번 반복해야할지 정리 (페이지 표기 카운트)
 * //ltn.hitomi.la/galleryblock/1762275.html <- 를 만들기위한 스트링 템플릿
 *
 */

const textMapper = (_: number, element: cheerio.Element) => element.firstChild.data;

/**
 * [workaround] 이 부분은 사이트의 구조에 굉장히 민감한 코드로, 쉽게 바뀔 수 있다.
 */
function parseGalleryBlock(galleryNumber: number, html: string) {
    const $ = cheerio.load(html);
    const mainDiv = $('div:nth-child(1)');
    const thumbDiv = mainDiv.find('.dj-img-cont');
    const artistsDiv = mainDiv.find('.artist-list');
    const contentsDiv = mainDiv.find('.dj-content table');

    //TODO characters
    const type = contentsDiv.find('td:contains("Type")').parent().find('a').first().text();
    const language = contentsDiv.find('td:contains("Language")').parent().find('a').first().text();
    const title = mainDiv.find('h1 a').attr('title')
    const href = `https://hitomi.la{mainDiv.find('a:nth-child(1)').attr('href')}`;
    const thumbnail = `https:${thumbDiv.find('.dj-img1 img').attr('src')}`;
    const artists = artistsDiv.find('li a').map(textMapper).toArray()
    const series = contentsDiv.find('td:contains("Series")').parent().find('td:nth-child(2)').find('li a').map(textMapper).toArray();
    const tags = contentsDiv.find('.relatedtags li a').map(textMapper).toArray();

    return {
        galleryNumber, tags, language, title, artists, type, series,
        urls: {
            href,
            reader: `https://hitomi.la/reader/${galleryNumber}.html`,
            thumbnail,
        }
    };
}

export async function getList() {
    const result = await bypassAxios.get<Buffer>('https://ltn.hitomi.la/index-all.nozomi', {
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

export async function getGalleryMetaData(galleryNumber: number = 644511) {
    const url = `https://ltn.hitomi.la/galleryblock/${galleryNumber}.html`;
    const result = await bypassAxios.get<string>(url);
    return parseGalleryBlock(galleryNumber, result.data);
}

/**
 * 히토미에서 직접 내려준 데이터 정리값. 그러나 reader phase 에서 사용하고 있기 때문에,
 * 시리즈 및 캐릭터등의 인덱스에서 보여주는 정보를 가지고있지 않다.
 * 하지만 구조상 히토미에서 직접 제공해주는 데이터기 때문에 속도는 훨씬 빠르다. (파싱이 없기 때문)
 * @param galleryNumber
 */
export async function getGalleryMetaDataFromHitomi(galleryNumber: number = 644511) {
    const url = `https://ltn.hitomi.la/galleries/${galleryNumber}.js`;
    const {data} = await bypassAxios.get<string>(url);
    return JSON.parse(data.replace('var galleryinfo = ', ''));
}

/**
 * 리더에서 발생하는 이미지 가져오기 로직을 그대로 사용한다.
 * common.js 에서..
 * url_from_url_from_hash -> url_from_url -> subdomain_from_url -> subdomain_from_galleryid
 * @param galleryNumber
 */
export async function getImageUrlList(galleryNumber: number = 644511) {
    const {files = []} = await getGalleryMetaDataFromHitomi(galleryNumber);

    return files.map((file: any) => {
        Object.assign(file, {haswebp: 0, hasavif: 0});
        return getImageUrl(galleryNumber, file);
    });
}

/**
 * 이미지 CDN 서브도메인은 referer check 를 한다.
 * 그렇지 않으면 403 에러를 내기 때문에 약간의 조작을 요한다.
 */
export async function getImageData(url: string) {
    const {data} = await bypassAxios.get(url, {
        responseType: 'arraybuffer',
        headers: {
            referer: 'https://hitomi.la/'
        }
    });
    return data;
}

export function downloadImageData(data: any) {
    fs.writeFileSync('./image.jpg', data, 'binary')
}

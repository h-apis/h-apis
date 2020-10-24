import bypassAxios from "../../common/bypassAxios";
import cheerio from 'cheerio';
import Element = cheerio.Element;

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

const textMapper = (_: number, element: Element) => element.firstChild.data;

/**
 * [workaround] 이 부분은 사이트의 구조에 굉장히 민감한 코드로, 쉽게 바뀔 수 있다.
 * @param html
 */
function parseGalleryBlock(html: string) {
    const $ = cheerio.load(html);
    const mainDiv = $('div:nth-child(1)');
    const thumbDiv = mainDiv.find('.dj-img-cont');
    const artistsDiv = mainDiv.find('.artist-list');
    const contentsDiv = mainDiv.find('.dj-content table');

    const type = contentsDiv.find('td:contains("Type")').parent().find('a').first().text();
    const language = contentsDiv.find('td:contains("Language")').parent().find('a').first().text();
    const title = mainDiv.find('h1 a').attr('title')
    const href = mainDiv.find('a:nth-child(1)').attr('href');
    const thumbnailImage = thumbDiv.find('.dj-img1 img').attr('src');
    const artists = artistsDiv.find('li a').map(textMapper).toArray()
    const series = contentsDiv.find('td:contains("Series")').parent().find('td:nth-child(2)').find('li a').map(textMapper).toArray();
    const tags = contentsDiv.find('.relatedtags li a').map(textMapper).toArray();

    return {tags, language, title, artists, type, href, thumbnailImage, series};
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
    return parseGalleryBlock(result.data);
}

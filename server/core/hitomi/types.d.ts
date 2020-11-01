export type HitomiTag = {
    name: string;
    type: 'female' | 'male' | 'none'
}

export type HitomiReaderTag = {
    tag: string;
    // 둘중 하나가 1이거나, 둘다 아예 존재하지 않는 프로퍼티(공통태그) 이거나
    female?: string;
    male?: string;
}

export type HitomiReaderFile = {
    width: number;
    hash: string;
    hasavif: number;
    haswebp: number;
    height: number;
    name: string; // with extension
}

export type HitomiReaderMetadata = {
    language: string;
    type: string;
    tags: HitomiReaderTag[];
    japanese_title?: string;
    title: string;
    date: string;
    id: string; // 갤번
    language_localname: string;
    files: HitomiReaderFile[]
}

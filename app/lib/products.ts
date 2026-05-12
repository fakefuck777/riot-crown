import { makeSVG } from '~/lib/makeSVG';

export interface ProductData {
  id:          string;
  name:        string;
  price:       string;
  material:    string;
  imageUrl:    string;
  size:        'large' | 'tall' | 'wide' | 'standard';
  gridArea?:   string;
  stock?:      number;
  descriptions: Record<string, string>;
  detailsList:  Record<string, string[]>;
  accent:      string;
  sizes?:      string[];
}

export function getDescription(p: ProductData, locale: string): string {
  return p.descriptions[locale] ?? p.descriptions['ZH'] ?? '';
}
export function getDetails(p: ProductData, locale: string): string[] {
  return p.detailsList[locale] ?? p.detailsList['ZH'] ?? [];
}

export const PRODUCTS: ProductData[] = [
  {
    id: '01', name: 'Void Chain — No. 1', price: '¥ 4,200',
    material: '18K RAW GOLD / OXIDIZED SILVER',
    imageUrl: makeSVG('01', 600, 800, '#C9A84C', 'Void Chain'),
    size: 'large', gridArea: '1 / 1 / 3 / 3', stock: 2,
    accent: '#C9A84C',
    descriptions: {
      ZH: '一条拒绝被定义的链。18K原色黄金与氧化银的碰撞，每一节都是手工锻造，不对称的重量感让它贴着锁骨时有一种无法忽视的存在感。',
      EN: 'A chain that refuses definition. 18K raw gold meets oxidized silver — each link hand-forged, the asymmetric weight impossible to ignore against the collarbone.',
      JP: '定義を拒む鎖。18Kローゴールドと酸化銀の衝突、一節一節が手鍛造。非対称な重さが鎖骨に触れるとき、無視できない存在感を放つ。',
      KR: '정의를 거부하는 체인. 18K 원색 골드와 산화 은의 충돌, 각 링크는 수작업으로 단조. 비대칭적인 무게감이 쇄골에 닿을 때 무시할 수 없는 존재감을 발한다.',
      FR: 'Une chaîne qui refuse toute définition. Or brut 18K contre argent oxydé — chaque maillon forgé à la main, le poids asymétrique impossible à ignorer contre la clavicule.',
    },
    detailsList: {
      ZH: ['18K 原色黄金 / 氧化银', '手工锻造，限量 12 件', '链长 42cm，可定制', '附品牌黑盒包装'],
      EN: ['18K RAW GOLD / OXIDIZED SILVER', 'HAND-FORGED, LIMITED TO 12', 'LENGTH 42CM, CUSTOMIZABLE', 'BRAND BLACK BOX INCLUDED'],
      JP: ['18K ローゴールド / 酸化銀', '手鍛造、限定12点', 'チェーン長42cm、カスタマイズ可', 'ブランドブラックボックス付属'],
      KR: ['18K 원색 골드 / 산화 은', '수작업 단조, 한정 12점', '체인 길이 42cm, 맞춤 가능', '브랜드 블랙박스 포함'],
      FR: ['OR BRUT 18K / ARGENT OXYDÉ', 'FORGÉ À LA MAIN, LIMITÉ À 12', 'LONGUEUR 42CM, PERSONNALISABLE', 'BOÎTE NOIRE DE MARQUE INCLUSE'],
    },
    sizes: ['40cm', '42cm', '45cm'],
  },
  {
    id: '02', name: 'Brutalist Cuff', price: '¥ 3,100',
    material: 'LIQUID CHROME / TITANIUM',
    imageUrl: makeSVG('02', 300, 800, '#F2F2F2', 'Brutalist Cuff'),
    size: 'tall', gridArea: '1 / 3 / 3 / 4', stock: 7,
    accent: '#F2F2F2',
    descriptions: {
      ZH: '镜面钛金属手环。表面经液态铬处理，反射周围环境的同时扭曲它。戴上它，你的手腕变成一面破碎的镜子。',
      EN: 'Mirror-finish titanium cuff. Liquid chrome treatment reflects the world around you — and distorts it. Your wrist becomes a broken mirror.',
      JP: 'ミラー仕上げのチタンカフ。液体クロム処理が周囲の世界を反射し、歪める。あなたの手首は割れた鏡になる。',
      KR: '미러 피니시 티타늄 커프. 리퀴드 크롬 처리가 주변 세계를 반사하고 왜곡한다. 당신의 손목은 깨진 거울이 된다.',
      FR: 'Manchette en titane finition miroir. Le traitement chrome liquide reflète le monde autour de vous — et le déforme. Votre poignet devient un miroir brisé.',
    },
    detailsList: {
      ZH: ['液态铬 / 航空钛合金', '内径 58mm，可微调', '镜面抛光处理', '限量 20 件'],
      EN: ['LIQUID CHROME / AEROSPACE TITANIUM', 'INNER DIA. 58MM, ADJUSTABLE', 'MIRROR POLISH FINISH', 'LIMITED TO 20'],
      JP: ['液体クロム / 航空宇宙チタン', '内径58mm、微調整可', 'ミラーポリッシュ仕上げ', '限定20点'],
      KR: ['리퀴드 크롬 / 항공우주 티타늄', '내경 58mm, 조절 가능', '미러 폴리시 피니시', '한정 20점'],
      FR: ['CHROME LIQUIDE / TITANE AÉROSPATIAL', 'DIAM. INT. 58MM, AJUSTABLE', 'FINITION MIROIR POLI', 'LIMITÉ À 20'],
    },
    sizes: ['S (内径56mm)', 'M (内径58mm)', 'L (内径60mm)'],
  },
  {
    id: '03', name: 'Decay Ring', price: '¥ 1,800',
    material: 'OXIDIZED BRASS',
    imageUrl: makeSVG('03', 300, 800, '#C9A84C', 'Decay Ring'),
    size: 'tall', gridArea: '1 / 4 / 3 / 5', stock: 11,
    accent: '#C9A84C',
    descriptions: {
      ZH: '氧化黄铜戒指，刻意保留了铸造时的粗粝纹理。时间会让它的颜色继续变深，每一枚都在你手上独自老去。',
      EN: 'Oxidized brass ring, deliberately rough with casting texture. Time deepens its color. Each one ages alone on your finger.',
      JP: '酸化真鍮のリング、鋳造時の粗い質感をあえて残した。時間が色を深め、それぞれがあなたの指の上で独自に老いていく。',
      KR: '산화 황동 반지, 주조 시의 거친 질감을 의도적으로 남겼다. 시간이 색을 깊게 하고, 각각이 당신의 손가락 위에서 홀로 늙어간다.',
      FR: 'Bague en laiton oxydé, texture de fonte délibérément brute. Le temps approfondit sa couleur. Chacune vieillit seule à votre doigt.',
    },
    detailsList: {
      ZH: ['氧化黄铜', '尺寸 10-22 号可选', '自然氧化处理，颜色随时间变化', '附尺寸指南'],
      EN: ['OXIDIZED BRASS', 'SIZES 10–22 AVAILABLE', 'NATURAL PATINA, COLOR EVOLVES OVER TIME', 'SIZE GUIDE INCLUDED'],
      JP: ['酸化真鍮', 'サイズ10〜22対応', '自然パティナ、色は時間とともに変化', 'サイズガイド付属'],
      KR: ['산화 황동', '사이즈 10–22 가능', '자연 산화, 색상은 시간이 지남에 따라 변화', '사이즈 가이드 포함'],
      FR: ['LAITON OXYDÉ', 'TAILLES 10–22 DISPONIBLES', 'PATINE NATURELLE, COULEUR ÉVOLUE AVEC LE TEMPS', 'GUIDE DES TAILLES INCLUS'],
    },
    sizes: ['10号', '12号', '14号', '16号', '18号', '20号', '22号'],
  },
  {
    id: '04', name: 'Shard Pendant', price: '¥ 2,600',
    material: 'RAW SILVER / ONYX',
    imageUrl: makeSVG('04', 400, 800, '#FF1293', 'Shard Pendant'),
    size: 'tall', gridArea: '1 / 5 / 3 / 6', stock: 3,
    accent: '#FF1293',
    descriptions: {
      ZH: '原银碎片镶嵌黑玛瑙。形状来自一块被锤击碎裂的银板，没有两片相同。你拿到的那一片，是唯一的。',
      EN: 'Raw silver shard set with black onyx. The shape comes from a silver plate shattered by hammer — no two alike. The piece you receive is the only one.',
      JP: '生銀の破片にブラックオニキスをセット。形状はハンマーで砕かれた銀板から生まれ、二つと同じものはない。あなたが手にする一片は唯一無二。',
      KR: '원은 파편에 블랙 오닉스를 세팅. 형태는 망치로 부서진 은판에서 탄생, 두 개가 같은 것은 없다. 당신이 받는 조각은 유일한 것.',
      FR: 'Éclat d\'argent brut serti d\'onyx noir. La forme vient d\'une plaque d\'argent brisée au marteau — aucune pareille. La pièce que vous recevez est unique.',
    },
    detailsList: {
      ZH: ['925 原银 / 天然黑玛瑙', '每件形状唯一，不可复制', '链长 45cm 银链', '限量 8 件'],
      EN: ['925 RAW SILVER / NATURAL BLACK ONYX', 'EACH SHAPE UNIQUE, UNREPEATABLE', '45CM SILVER CHAIN', 'LIMITED TO 8'],
      JP: ['925生銀 / 天然ブラックオニキス', '各形状ユニーク、複製不可', '45cmシルバーチェーン', '限定8点'],
      KR: ['925 원은 / 천연 블랙 오닉스', '각 형태 유일, 복제 불가', '45cm 실버 체인', '한정 8점'],
      FR: ['ARGENT BRUT 925 / ONYX NOIR NATUREL', 'CHAQUE FORME UNIQUE, IRRÉPRODUCTIBLE', 'CHAÎNE ARGENT 45CM', 'LIMITÉ À 8'],
    },
  },
  {
    id: '05', name: 'Sovereign Knuckle', price: '¥ 3,400',
    material: 'CHROME / RESIN',
    imageUrl: makeSVG('05', 400, 800, '#FF1293', 'Sovereign'),
    size: 'tall', gridArea: '1 / 6 / 3 / 7', stock: 5,
    accent: '#FF1293',
    descriptions: {
      ZH: '四指铬合金指环，内嵌粉色树脂。暴力与柔软同时存在于一件首饰里。戴上它的手，握拳时会发光。',
      EN: 'Four-finger chrome knuckle ring with pink resin inlay. Violence and softness coexist in one piece. The hand that wears it glows when it makes a fist.',
      JP: '4本指クロム合金ナックルリング、ピンクレジンインレイ。暴力と柔らかさが一つの作品に共存する。それを着けた手は、拳を握ると輝く。',
      KR: '4손가락 크롬 너클 링, 핑크 레진 인레이. 폭력과 부드러움이 하나의 작품에 공존한다. 그것을 착용한 손은 주먹을 쥘 때 빛난다.',
      FR: 'Bague de poing en chrome quatre doigts avec incrustation de résine rose. Violence et douceur coexistent en une seule pièce. La main qui la porte brille quand elle serre le poing.',
    },
    detailsList: {
      ZH: ['铬合金 / 粉色树脂', '适合食指至小指，尺寸可定制', '内侧树脂手工注入', '限量 15 件'],
      EN: ['CHROME ALLOY / PINK RESIN', 'INDEX TO PINKY, SIZE CUSTOMIZABLE', 'HAND-INJECTED RESIN INTERIOR', 'LIMITED TO 15'],
      JP: ['クロム合金 / ピンクレジン', '人差し指〜小指対応、サイズカスタマイズ可', '内側レジン手作業注入', '限定15点'],
      KR: ['크롬 합금 / 핑크 레진', '검지~소지 대응, 사이즈 맞춤 가능', '내측 레진 수작업 주입', '한정 15점'],
      FR: ['ALLIAGE CHROME / RÉSINE ROSE', 'INDEX À AURICULAIRE, TAILLE PERSONNALISABLE', 'RÉSINE INTÉRIEURE INJECTÉE À LA MAIN', 'LIMITÉ À 15'],
    },
  },
  {
    id: '06', name: 'Monolith Collar', price: '¥ 5,900',
    material: '18K GOLD / BLACKENED STEEL',
    imageUrl: makeSVG('06', 800, 400, '#C9A84C', 'Monolith Collar'),
    size: 'wide', gridArea: '3 / 1 / 4 / 4', stock: 1,
    accent: '#C9A84C',
    descriptions: {
      ZH: '黑化钢项圈，18K金点缀。贴颈设计，像一道无声的宣言。全球限量 3 件，这是最后 1 件。',
      EN: 'Blackened steel collar with 18K gold accents. Sits flush against the neck like a silent declaration. 3 made worldwide. This is the last one.',
      JP: '黒化スチールカラー、18Kゴールドアクセント。首に密着し、無言の宣言のよう。世界限定3点。これが最後の1点。',
      KR: '블랙 스틸 칼라, 18K 골드 악센트. 목에 밀착되어 무언의 선언처럼. 전 세계 한정 3점. 이것이 마지막 1점.',
      FR: 'Collier en acier noirci avec accents or 18K. Épouse le cou comme une déclaration silencieuse. 3 pièces dans le monde. Celle-ci est la dernière.',
    },
    detailsList: {
      ZH: ['18K 黄金 / 黑化钢', '颈围 32-38cm 可调', '全球限量 3 件', '附证书与编号'],
      EN: ['18K GOLD / BLACKENED STEEL', 'NECK 32–38CM ADJUSTABLE', 'WORLDWIDE LIMITED TO 3', 'CERTIFICATE & NUMBER INCLUDED'],
      JP: ['18Kゴールド / 黒化スチール', '首回り32〜38cm調整可', '世界限定3点', '証明書・番号付属'],
      KR: ['18K 골드 / 블랙 스틸', '목둘레 32–38cm 조절 가능', '전 세계 한정 3점', '증명서 및 번호 포함'],
      FR: ['OR 18K / ACIER NOIRCI', 'TOUR DE COU 32–38CM AJUSTABLE', 'LIMITÉ À 3 DANS LE MONDE', 'CERTIFICAT ET NUMÉRO INCLUS'],
    },
  },
  {
    id: '07', name: 'Relic Earring', price: '¥ 980',
    material: 'OXIDIZED SILVER',
    imageUrl: makeSVG('07', 400, 400, '#F2F2F2', 'Relic Earring'),
    size: 'standard', gridArea: '3 / 4 / 4 / 6', stock: 14,
    accent: '#F2F2F2',
    descriptions: {
      ZH: '氧化银不对称耳环。一长一短，一重一轻。不成对是设计，不是缺陷。',
      EN: 'Oxidized silver asymmetric earrings. One long, one short. One heavy, one light. The mismatch is the design, not a flaw.',
      JP: '酸化銀の非対称イヤリング。一方は長く、一方は短い。一方は重く、一方は軽い。アンバランスはデザインであり、欠陥ではない。',
      KR: '산화 은 비대칭 귀걸이. 하나는 길고 하나는 짧다. 하나는 무겁고 하나는 가볍다. 불일치가 디자인이지 결함이 아니다.',
      FR: 'Boucles d\'oreilles asymétriques en argent oxydé. Une longue, une courte. Une lourde, une légère. L\'asymétrie est le design, pas un défaut.',
    },
    detailsList: {
      ZH: ['氧化 925 银', '左耳 6cm / 右耳 3cm', '925 银耳针', '单只或成对均可购买'],
      EN: ['OXIDIZED 925 SILVER', 'LEFT 6CM / RIGHT 3CM', '925 SILVER POST', 'SOLD SINGLE OR AS PAIR'],
      JP: ['酸化925銀', '左耳6cm / 右耳3cm', '925銀ポスト', '片耳・ペア両方販売'],
      KR: ['산화 925 은', '왼쪽 6cm / 오른쪽 3cm', '925 실버 포스트', '단품 또는 페어 판매'],
      FR: ['ARGENT 925 OXYDÉ', 'GAUCHE 6CM / DROITE 3CM', 'TIGE ARGENT 925', 'VENDU À L\'UNITÉ OU EN PAIRE'],
    },
  },
  {
    id: '08', name: 'Void Torque', price: '¥ 6,200',
    material: 'TITANIUM / RAW GOLD',
    imageUrl: makeSVG('08', 300, 800, '#C9A84C', 'Void Torque'),
    size: 'tall', gridArea: '3 / 6 / 5 / 7', stock: 4,
    accent: '#C9A84C',
    descriptions: {
      ZH: '钛金属扭矩手环，原色黄金焊点。扭转的形态来自金属在极限压力下的自然变形，每一件的扭曲角度都不同。',
      EN: 'Titanium torque bangle with raw gold weld points. The twisted form comes from metal deforming under extreme pressure — every piece twists at a different angle.',
      JP: 'チタントルクバングル、ローゴールド溶接点。ねじれた形状は極限の圧力下での金属の自然変形から生まれ、各ピースのねじれ角度は異なる。',
      KR: '티타늄 토크 뱅글, 원색 골드 용접점. 비틀린 형태는 극한의 압력 하에서 금속이 자연 변형된 것으로, 각 피스의 비틀림 각도가 다르다.',
      FR: 'Jonc torque en titane avec points de soudure or brut. La forme tordue vient de la déformation naturelle du métal sous pression extrême — chaque pièce se tord à un angle différent.',
    },
    detailsList: {
      ZH: ['航空钛合金 / 18K 原色黄金', '内径 60mm', '每件扭曲角度唯一', '限量 10 件'],
      EN: ['AEROSPACE TITANIUM / 18K RAW GOLD', 'INNER DIA. 60MM', 'EACH TWIST ANGLE UNIQUE', 'LIMITED TO 10'],
      JP: ['航空宇宙チタン / 18Kローゴールド', '内径60mm', '各ねじれ角度ユニーク', '限定10点'],
      KR: ['항공우주 티타늄 / 18K 원색 골드', '내경 60mm', '각 비틀림 각도 유일', '한정 10점'],
      FR: ['TITANE AÉROSPATIAL / OR BRUT 18K', 'DIAM. INT. 60MM', 'CHAQUE ANGLE DE TORSION UNIQUE', 'LIMITÉ À 10'],
    },
  },
  {
    id: '09', name: 'Obsidian Band', price: '¥ 2,100',
    material: 'BLACKENED STEEL / RESIN',
    imageUrl: makeSVG('09', 800, 400, '#A8A8A8', 'Obsidian Band'),
    size: 'wide', gridArea: '4 / 1 / 5 / 4', stock: 8,
    accent: '#A8A8A8',
    descriptions: {
      ZH: '黑化钢宽版手环，内嵌黑色树脂。哑光表面吸收光线，戴上它的手腕像是消失在黑暗里。',
      EN: 'Wide blackened steel bangle with black resin inlay. The matte surface absorbs light. The wrist that wears it disappears into darkness.',
      JP: '幅広黒化スチールバングル、ブラックレジンインレイ。マット表面が光を吸収する。それを着けた手首は闇に消えていく。',
      KR: '와이드 블랙 스틸 뱅글, 블랙 레진 인레이. 무광 표면이 빛을 흡수한다. 그것을 착용한 손목은 어둠 속으로 사라진다.',
      FR: 'Large jonc en acier noirci avec incrustation de résine noire. La surface mate absorbe la lumière. Le poignet qui le porte disparaît dans l\'obscurité.',
    },
    detailsList: {
      ZH: ['黑化钢 / 黑色树脂', '宽度 25mm，内径 58mm', '哑光喷砂处理', '限量 25 件'],
      EN: ['BLACKENED STEEL / BLACK RESIN', 'WIDTH 25MM, INNER DIA. 58MM', 'MATTE SANDBLAST FINISH', 'LIMITED TO 25'],
      JP: ['黒化スチール / ブラックレジン', '幅25mm、内径58mm', 'マットサンドブラスト仕上げ', '限定25点'],
      KR: ['블랙 스틸 / 블랙 레진', '폭 25mm, 내경 58mm', '무광 샌드블라스트 피니시', '한정 25점'],
      FR: ['ACIER NOIRCI / RÉSINE NOIRE', 'LARGEUR 25MM, DIAM. INT. 58MM', 'FINITION SABLÉE MATE', 'LIMITÉ À 25'],
    },
  },
  {
    id: '10', name: 'Void Stud', price: '¥ 750',
    material: 'OXIDIZED SILVER',
    imageUrl: makeSVG('10', 400, 400, '#FF1293', 'Void Stud'),
    size: 'standard', gridArea: '4 / 4 / 5 / 6', stock: 2,
    accent: '#FF1293',
    descriptions: {
      ZH: '氧化银星形耳钉，粉色镭射涂层。Y2K的闪与暗黑的底，两种语言同时说。库存仅剩 2 件。',
      EN: 'Oxidized silver star stud with pink laser coating. Y2K flash meets dark base — two languages spoken at once. Only 2 left.',
      JP: '酸化銀スタースタッド、ピンクレーザーコーティング。Y2Kの輝きとダークベース、二つの言語が同時に語られる。残り2点。',
      KR: '산화 은 스타 스터드, 핑크 레이저 코팅. Y2K의 반짝임과 다크 베이스, 두 언어가 동시에 말한다. 2개 남음.',
      FR: 'Clou étoile en argent oxydé avec revêtement laser rose. Flash Y2K rencontre base sombre — deux langages parlés à la fois. Plus que 2.',
    },
    detailsList: {
      ZH: ['氧化 925 银 / 镭射涂层', '直径 8mm', '925 银耳针', '限量 30 件，接近售罄'],
      EN: ['OXIDIZED 925 SILVER / LASER COATING', 'DIAMETER 8MM', '925 SILVER POST', 'LIMITED TO 30, NEARLY SOLD OUT'],
      JP: ['酸化925銀 / レーザーコーティング', '直径8mm', '925銀ポスト', '限定30点、ほぼ完売'],
      KR: ['산화 925 은 / 레이저 코팅', '직경 8mm', '925 실버 포스트', '한정 30점, 거의 매진'],
      FR: ['ARGENT 925 OXYDÉ / REVÊTEMENT LASER', 'DIAMÈTRE 8MM', 'TIGE ARGENT 925', 'LIMITÉ À 30, PRESQUE ÉPUISÉ'],
    },
  },
  {
    id: '11', name: 'Micro Charm', price: '¥ 280',
    material: 'BRASS / ENAMEL',
    imageUrl: makeSVG('11', 400, 400, '#FF1293', 'Micro Charm'),
    size: 'standard', stock: 40,
    accent: '#FF1293',
    descriptions: {
      ZH: '黄铜珐琅小挂件，Y2K风格粉色星形。可挂在包包、手机链或项链上。入门级的叛逆。',
      EN: 'Brass enamel micro charm, Y2K pink star. Clip it to a bag, phone chain, or necklace. Entry-level rebellion.',
      JP: '真鍮エナメルマイクロチャーム、Y2Kピンクスター。バッグ、スマホチェーン、ネックレスに。入門レベルの反抗。',
      KR: '황동 에나멜 마이크로 참, Y2K 핑크 스타. 가방, 폰 체인, 목걸이에 달아보세요. 입문 수준의 반항.',
      FR: 'Micro-charm en émail de laiton, étoile rose Y2K. À accrocher sur un sac, une chaîne de téléphone ou un collier. Rébellion niveau débutant.',
    },
    detailsList: {
      ZH: ['黄铜 / 粉色珐琅', '直径 15mm', '附 5cm 延伸链', '可叠戴'],
      EN: ['BRASS / PINK ENAMEL', 'DIAMETER 15MM', '5CM EXTENSION CHAIN INCLUDED', 'STACKABLE'],
      JP: ['真鍮 / ピンクエナメル', '直径15mm', '5cm延長チェーン付属', 'スタッキング可'],
      KR: ['황동 / 핑크 에나멜', '직경 15mm', '5cm 연장 체인 포함', '레이어링 가능'],
      FR: ['LAITON / ÉMAIL ROSE', 'DIAMÈTRE 15MM', 'CHAÎNE D\'EXTENSION 5CM INCLUSE', 'SUPERPOSABLE'],
    },
  },
  {
    id: '12', name: 'Thread Ring', price: '¥ 150',
    material: 'STERLING SILVER',
    imageUrl: makeSVG('12', 400, 400, '#F2F2F2', 'Thread Ring'),
    size: 'standard', stock: 60,
    accent: '#F2F2F2',
    descriptions: {
      ZH: '极细925银线戒指，0.8mm线径。轻到几乎感觉不到，但戴上就不想摘下来。可叠戴三到五枚。',
      EN: '925 silver thread ring, 0.8mm wire. So light you barely feel it — but once on, you won\'t take it off. Stack three to five.',
      JP: '925銀スレッドリング、0.8mmワイヤー。ほとんど感じないほど軽い、でも一度着けたら外したくない。3〜5本重ね着け可。',
      KR: '925 실버 스레드 링, 0.8mm 와이어. 거의 느껴지지 않을 만큼 가볍지만, 한번 끼면 빼고 싶지 않다. 3~5개 레이어링 가능.',
      FR: 'Bague fil en argent 925, fil 0,8mm. Si légère que vous la sentez à peine — mais une fois portée, vous ne l\'enlèverez plus. Superposez-en trois à cinq.',
    },
    detailsList: {
      ZH: ['925 纯银', '线径 0.8mm', '尺寸 10-22 号', '适合叠戴'],
      EN: ['925 PURE SILVER', 'WIRE 0.8MM', 'SIZES 10–22', 'DESIGNED FOR STACKING'],
      JP: ['925純銀', 'ワイヤー0.8mm', 'サイズ10〜22', 'スタッキング向け'],
      KR: ['925 순은', '와이어 0.8mm', '사이즈 10–22', '레이어링용'],
      FR: ['ARGENT PUR 925', 'FIL 0,8MM', 'TAILLES 10–22', 'CONÇU POUR SUPERPOSITION'],
    },
    sizes: ['10号', '12号', '14号', '16号', '18号', '20号', '22号'],
  },
  {
    id: '13', name: 'Y2K Anklet', price: '¥ 320',
    material: 'CHROME / CRYSTAL',
    imageUrl: makeSVG('13', 400, 400, '#C9A84C', 'Y2K Anklet'),
    size: 'standard', stock: 25,
    accent: '#C9A84C',
    descriptions: {
      ZH: '镀铬脚链，镶嵌透明水晶。Y2K千禧风格的代表单品，踝骨处的一道光。',
      EN: 'Chrome-plated anklet set with clear crystals. The defining Y2K millennium piece — a streak of light at the ankle.',
      JP: 'クロームメッキアンクレット、クリアクリスタルセット。Y2K千年紀スタイルの代表作、足首に光の筋。',
      KR: '크롬 도금 발찌, 클리어 크리스탈 세팅. Y2K 밀레니엄 스타일의 대표 아이템, 발목의 빛 한 줄기.',
      FR: 'Bracelet de cheville chromé serti de cristaux transparents. La pièce emblématique du style Y2K millénaire — un trait de lumière à la cheville.',
    },
    detailsList: {
      ZH: ['镀铬合金 / 透明水晶', '链长 22-26cm 可调', '龙虾扣', '防水处理'],
      EN: ['CHROME-PLATED ALLOY / CLEAR CRYSTAL', 'LENGTH 22–26CM ADJUSTABLE', 'LOBSTER CLASP', 'WATER-RESISTANT'],
      JP: ['クロームメッキ合金 / クリアクリスタル', '長さ22〜26cm調整可', 'ロブスタークラスプ', '耐水処理'],
      KR: ['크롬 도금 합금 / 클리어 크리스탈', '길이 22–26cm 조절 가능', '랍스터 클라스프', '방수 처리'],
      FR: ['ALLIAGE CHROMÉ / CRISTAL TRANSPARENT', 'LONGUEUR 22–26CM AJUSTABLE', 'FERMOIR HOMARD', 'RÉSISTANT À L\'EAU'],
    },
  },
  {
    id: '14', name: 'Void Choker', price: '¥ 480',
    material: 'VELVET / OXIDIZED SILVER',
    imageUrl: makeSVG('14', 400, 400, '#A8A8A8', 'Void Choker'),
    size: 'standard', stock: 18,
    accent: '#A8A8A8',
    descriptions: {
      ZH: '黑色丝绒颈链，氧化银中心坠饰。贴颈的压迫感与柔软的触感同时存在。Y2K暗黑美学的入门款。',
      EN: 'Black velvet choker with oxidized silver center drop. The pressure of it against the neck, the softness of the velvet — both at once. Y2K dark aesthetic, entry point.',
      JP: 'ブラックベルベットチョーカー、酸化銀センタードロップ。首への圧迫感とベルベットの柔らかさが同時に存在する。Y2Kダーク美学の入門点。',
      KR: '블랙 벨벳 초커, 산화 은 센터 드롭. 목에 닿는 압박감과 벨벳의 부드러움이 동시에 존재한다. Y2K 다크 미학의 입문점.',
      FR: 'Collier ras-du-cou en velours noir avec pendentif central en argent oxydé. La pression contre le cou, la douceur du velours — les deux à la fois. Esthétique sombre Y2K, point d\'entrée.',
    },
    detailsList: {
      ZH: ['黑色丝绒 / 氧化 925 银', '颈围 30-36cm 可调', '中心坠饰直径 12mm', '附延伸链'],
      EN: ['BLACK VELVET / OXIDIZED 925 SILVER', 'NECK 30–36CM ADJUSTABLE', 'CENTER DROP DIAMETER 12MM', 'EXTENSION CHAIN INCLUDED'],
      JP: ['ブラックベルベット / 酸化925銀', '首回り30〜36cm調整可', 'センタードロップ直径12mm', '延長チェーン付属'],
      KR: ['블랙 벨벳 / 산화 925 은', '목둘레 30–36cm 조절 가능', '센터 드롭 직경 12mm', '연장 체인 포함'],
      FR: ['VELOURS NOIR / ARGENT 925 OXYDÉ', 'TOUR DE COU 30–36CM AJUSTABLE', 'PENDENTIF CENTRAL DIAMÈTRE 12MM', 'CHAÎNE D\'EXTENSION INCLUSE'],
    },
  },
  {
    id: '15', name: 'Pixel Earring', price: '¥ 390',
    material: 'ACRYLIC / CHROME',
    imageUrl: makeSVG('15', 400, 400, '#FF1293', 'Pixel Earring'),
    size: 'standard', stock: 35,
    accent: '#FF1293',
    descriptions: {
      ZH: '亚克力像素风格耳环，镀铬边框。数字美学与首饰的碰撞，Y2K游戏感十足。轻量设计，全天佩戴无负担。',
      EN: 'Acrylic pixel-style earrings with chrome frame. Digital aesthetic meets jewelry — full Y2K game energy. Lightweight, all-day wear.',
      JP: 'アクリルピクセルスタイルイヤリング、クロームフレーム。デジタル美学とジュエリーの衝突、Y2Kゲーム感満載。軽量設計、一日中着用可。',
      KR: '아크릴 픽셀 스타일 귀걸이, 크롬 프레임. 디지털 미학과 주얼리의 충돌, Y2K 게임 감성 가득. 경량 디자인, 하루 종일 착용 가능.',
      FR: 'Boucles d\'oreilles style pixel en acrylique avec cadre chromé. Esthétique numérique rencontre bijou — énergie jeu Y2K totale. Légères, port toute la journée.',
    },
    detailsList: {
      ZH: ['彩色亚克力 / 镀铬合金', '尺寸 20×20mm', '925 银耳针', '多色可选'],
      EN: ['COLORED ACRYLIC / CHROME-PLATED ALLOY', 'SIZE 20×20MM', '925 SILVER POST', 'MULTIPLE COLORS AVAILABLE'],
      JP: ['カラーアクリル / クロームメッキ合金', 'サイズ20×20mm', '925銀ポスト', '複数カラー展開'],
      KR: ['컬러 아크릴 / 크롬 도금 합금', '사이즈 20×20mm', '925 실버 포스트', '다양한 색상 가능'],
      FR: ['ACRYLIQUE COLORÉ / ALLIAGE CHROMÉ', 'TAILLE 20×20MM', 'TIGE ARGENT 925', 'PLUSIEURS COULEURS DISPONIBLES'],
    },
  },
];

export function getProduct(id: string): ProductData | undefined {
  return PRODUCTS.find(p => p.id === id);
}

/** Aggregate stock from static catalog data (replace with Storefront API for production). */
export function getCatalogStockStats() {
  const stocked = PRODUCTS.filter((p): p is ProductData & { stock: number } => p.stock != null);
  if (stocked.length === 0) {
    return { totalUnits: 0, lowSkuCount: 0, minStock: 0, listedSkuCount: 0 };
  }
  const totalUnits = stocked.reduce((s, p) => s + p.stock, 0);
  const lowSkuCount = stocked.filter(p => p.stock <= 5).length;
  const minStock = Math.min(...stocked.map(p => p.stock));
  return { totalUnits, lowSkuCount, minStock, listedSkuCount: stocked.length };
}

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
    id: '01', name: 'Millennium Chain — N°1', price: '¥ 4,200',
    material: '18K RAW GOLD / OXIDIZED SILVER',
    imageUrl: makeSVG('01', 600, 800, '#C9A84C', 'CHAIN N°1'),
    size: 'large', gridArea: '1 / 1 / 3 / 3', stock: 2,
    accent: '#C9A84C',
    descriptions: {
      ZH: '18K 原色金與氧化銀相扣，每一節手工鍛打；鏈節的細微落差讓鉻金色澤在鎖骨上緩慢移動，像千禧年專輯封面的高光。不對稱垂墜剛好貼合頸線——限量釋出，亮得乾淨、不講玄學只講工藝。',
      EN: '18K raw gold meets oxidized silver in hand-forged links—subtle variance so chrome-toned light travels the collarbone like a CD jewel-case highlight. Asymmetric drape, small-batch release: millennium shine, craft-first.',
      JP: '18Kローゴールドと酸化銀の手鍛造リンク。わずかな揺らぎが鎖骨でクローム調の光を運び、ミレニアム頃のジャケット写真のハイライトのよう。非対称の垂れ、少量ロット—輝きは潔く、職人仕事が主役。',
      KR: '18K 로우 골드와 산화 은을 링크마다 수작업 단조—미세한 차이가 쇄골 위에서 크롬 톤의 빛을 옮긴다. 비대칭 드롭, 소량 릴리스: 밀레니엄 샤인, 장인 솜씨가 앞.',
      FR: 'Or brut 18K et argent oxydé, maillons forgés à la main—de légères variations font voyager une lumière chromée sur la clavicule, comme le reflet d’un boîtier CD. Tombé asymétrique, petite série : éclat millénaire, le geste avant le concept.',
    },
    detailsList: {
      ZH: ['18K 原色黃金 / 氧化銀', '手作鍛造 · 本批次僅 12 節可售鏈長', '標準 42cm · 可預約其他長度', '霧黑外盒 · 工坊序號'],
      EN: ['18K RAW GOLD / OXIDIZED SILVER', 'HAND-FORGED — 12-LINK BATCH THIS DROP', '42CM STANDARD — OTHER LENGTHS ON REQUEST', 'MATTE BLACK BOX + ATELIER CARD'],
      JP: ['18K ローゴールド / 酸化銀', '手鍛造・本ロット12リンク', '標準42cm・別長さは要予約', 'マットブラックボックス＋カード'],
      KR: ['18K 로우 골드 / 산화 은', '수작업 단조 · 이번 드롭 12링크', '표준 42cm · 다른 길이 문의', '매트 블랙 박스 + 카드'],
      FR: ['OR BRUT 18K / ARGENT OXYDÉ', 'FORGÉ À LA MAIN — LOT 12 MAILLONS', '42CM STANDARD — AUTRES LONGUEURS SUR DEMANDE', 'BOÎTE NOIRE MATE + CARTE ATELIER'],
    },
    sizes: ['40cm', '42cm', '45cm'],
  },
  {
    id: '02', name: 'Brutalist Cuff', price: '¥ 3,100',
    material: 'LIQUID CHROME / TITANIUM',
    imageUrl: makeSVG('02', 300, 800, '#F2F2F2', 'CUFF'),
    size: 'tall', gridArea: '1 / 3 / 3 / 4', stock: 7,
    accent: '#F2F2F2',
    descriptions: {
      ZH: '航太鈦鏡面拋光，液態鉻般的冷白反光；寬版臂環內徑貼腕，像把 early-2000s 科幻介面折成一圈金屬。千禧乾淨 × 工業俐落，沒有劇場台詞，只有光線在手腕上跑。',
      EN: 'Aerospace titanium, mirror-polished to a liquid-chrome white sheen. The cuff sits close—early-2000s UI folded into metal. Millennium-clean meets industrial line; no monologue, just light racing the wrist.',
      JP: '航空宇宙チタンをミラー仕上げ—リキッドクロームのような白い反射。幅広カフが手首に密着、early-2000sのUIを金属に折りたたんだよう。ミレニアムの潔さ×工業的なライン。',
      KR: '항공우주 티타늄 미러 폴리시—리퀴드 크롬 같은 화이트 쉔. 와이드 커프가 손목에 밀착, early-2000s UI를 금속으로 접은 느낌. 밀레니엄 클린 × 인더스트리얼 라인.',
      FR: 'Titane aérospatial poli miroir—éclat blanc façon chrome liquide. Le jonc épouse le poignet, comme une interface début 2000 pliée en métal. Ligne millénaire × rigueur industrielle.',
    },
    detailsList: {
      ZH: ['液態鉻質感 / 航太鈦合金', '內徑 58mm（另有 S／L）', '鏡面拋光 · 建議乾布輕拭', '限量 20 件'],
      EN: ['LIQUID-CHROME FINISH / AEROSPACE TI', 'INNER DIA. 58MM (S / L ALSO)', 'MIRROR POLISH — SOFT CLOTH CARE', 'LIMITED 20'],
      JP: ['液体クロム調 / 航空宇宙チタン', '内径58mm（S/Lあり）', 'ミラーポリッシュ・柔らかい布で', '限定20点'],
      KR: ['리퀴드 크롬 톤 / 항공우주 티타늄', '내경 58mm (S/L)', '미러 폴리시 · 부드러운 천 관리', '한정 20점'],
      FR: ['FINITION CHROME LIQUIDE / TITANE AÉRO', 'DIAM. INT. 58MM (S / L AUSSI)', 'POLI MIROIR — CHIFFON DOUX', 'LIMITÉ À 20'],
    },
    sizes: ['S（內徑 56mm）', 'M（內徑 58mm）', 'L（內徑 60mm）'],
  },
  {
    id: '03', name: 'Decay Ring', price: '¥ 1,800',
    material: 'OXIDIZED BRASS',
    imageUrl: makeSVG('03', 300, 800, '#C9A84C', 'DECAY'),
    size: 'tall', gridArea: '1 / 4 / 3 / 5', stock: 11,
    accent: '#C9A84C',
    descriptions: {
      ZH: '氧化黃銅保留鑄造肌理，色澤會隨配戴慢慢加深——像千禧年桌面小物被時間刷上一層柔焦。粗獷但不髒，低調仍有 bling 的溫度，適合每天戴著「讓它變成你的版本」。',
      EN: 'Oxidized brass keeps cast grain so the tone deepens with wear—like a Y2K desk talisman softened by time. Raw, never grubby; quiet shine that still reads as bling. Meant to become yours.',
      JP: '酸化真鍮に鋳造の肌理を残し、装着で色が深まる—ミレニアム頃の机の小物が時間で柔らかくなったよう。ラフだが汚くなく、静かなのにblingの温度。育てるリング。',
      KR: '산화 황동에 주조 질감을 남기고 착용으로 색이 깊어진다—Y2K 책상 위 소품이 시간에 부드러워진 느낌. 거칠지만 지저분하지 않고, 조용한 bling. 함께 숙성되는 링.',
      FR: 'Laiton oxydé, grain de coulée conservé—la patine s’approfondit au port, comme un petit objet de bureau Y2K adouci par le temps. Brut, jamais sale ; un éclat discret qui reste bling.',
    },
    detailsList: {
      ZH: ['氧化黃銅 · 自然養色', '美／港碼 10–22', '避免浸泡清潔劑以保留層次', '附尺寸對照小卡'],
      EN: ['OXIDIZED BRASS — LIVING PATINA', 'US / HK SIZES 10–22', 'AVOID HARSH SOAKS TO KEEP LAYERS', 'SIZE CARD INCLUDED'],
      JP: ['酸化真鍮・育つパティナ', 'サイズ10〜22', '強い浸漬は避けて層をキープ', 'サイズカード同梱'],
      KR: ['산화 황동 · 살아가는 패티나', '사이즈 10–22', '강한 세척은 피해 레이어 유지', '사이즈 카드 포함'],
      FR: ['LAITON OXYDÉ — PATINE VIVANTE', 'TAILLES 10–22', 'ÉVITER TREMPAGE AGRESSIF', 'CARTE TAILLES INCLUSE'],
    },
    sizes: ['10號', '12號', '14號', '16號', '18號', '20號', '22號'],
  },
  {
    id: '04', name: 'Shard Pendant', price: '¥ 2,600',
    material: 'RAW SILVER / ONYX',
    imageUrl: makeSVG('04', 400, 800, '#FF1293', 'SHARD'),
    size: 'tall', gridArea: '1 / 5 / 3 / 6', stock: 3,
    accent: '#FF1293',
    descriptions: {
      ZH: '925 銀裂片鑲黑瑪瑙，輪廓來自手工槌開的銀板——沒有兩片完全相同。水晶般的黑與原銀的冷白對撞，像 early-2000s 圖形軟體裡被裁切下來的一塊形狀，乾淨、限量、可穿戴。',
      EN: '925 silver shard with black onyx, cut from a hand-hammered plate—no two silhouettes match. Cool silver against glassy black reads like a shape clipped in early-2000s design software: graphic, limited, wearable.',
      JP: '925銀の破片にブラックオニキス—手槌きの銀板から切り出し、シルエットは二つとない。冷たい銀とガラス質の黒、early-2000sのDTPで切り抜いた形のよう。グラフィックで限定。',
      KR: '925 은 파편에 블랙 오닉스—손으로 두드린 은판에서, 실루엣은 모두 다름. 차가운 은과 글래시 블랙, early-2000s 그래픽에서 잘라낸 형태처럼. 한정, 착용 가능한 그래픽.',
      FR: 'Éclat argent 925 et onyx noir, découpé dans une plaque martelée—jamais deux silhouettes. Argent froid sur noir vitreux, comme une forme découpée dans un logiciel graphique début 2000 : épuré, limité, portable.',
    },
    detailsList: {
      ZH: ['925 銀 / 天然黑瑪瑙', '每形唯一 · 工坊編號', '45cm 銀鏈 · 鎖骨下緣剛好', '限量 8 件'],
      EN: ['925 SILVER / NATURAL ONYX', 'EACH FORM UNIQUE — SERIALIZED', '45CM SILVER CHAIN — COLLARBONE SWEET SPOT', 'LIMITED 8'],
      JP: ['925銀 / 天然オニキス', '各形ユニーク・シリアル', '45cmシルバーチェーン', '限定8点'],
      KR: ['925 은 / 천연 오닉스', '형태마다 유일 · 시리얼', '45cm 실버 체인', '한정 8점'],
      FR: ['ARGENT 925 / ONYX NATUREL', 'CHAQUE FORME UNIQUE — SÉRIALISÉ', 'CHAÎNE ARGENT 45CM', 'LIMITÉ À 8'],
    },
  },
  {
    id: '05', name: 'Sovereign Knuckle', price: '¥ 3,400',
    material: 'CHROME / RESIN',
    imageUrl: makeSVG('05', 400, 800, '#FF1293', 'KNUCKLE'),
    size: 'tall', gridArea: '1 / 6 / 3 / 7', stock: 5,
    accent: '#FF1293',
    descriptions: {
      ZH: '鉻合金四指跨度，內嵌粉樹脂——金屬的硬與樹脂的軟在同一平面，像千禧年遊戲 UI 的按鍵配色。握拳時高光沿稜線跑動；粉色不是可愛標籤，是 chromatic accent。',
      EN: 'Chrome-alloy knuckle span with pink resin inlay—hard metal and soft color on one plane, like Y2K game UI keys. Highlights run the edges when you close your fist; pink reads as chromatic accent, not cute.',
      JP: 'クロム合金の4指スパンにピンクレジン—硬い金属と柔らかい色が同一面に、Y2KゲームUIのキー配色のよう。拳を握ると稜線に光が走る；ピンクはキュートではなくクロマティックアクセント。',
      KR: '크롬 합금 4지 스팬에 핑크 레진—단단한 금속과 부드러운 색이 한 평면에, Y2K 게임 UI 키 색감. 주먹을 쥐면 모서리로 하이라이트; 핑크는 큐트가 아니라 크로매틱 액센트.',
      FR: 'Jonc quatre doigts en alliage chromé, résine rose—métal dur et couleur douce sur un même plan, comme les touches d’une interface jeu Y2K. Fermez le poing : la lumière court sur les arêtes ; le rose est accent chromatique, pas « mignon ».',
    },
    detailsList: {
      ZH: ['鉻合金 / 粉樹脂鑲嵌', '食指至小指 · 尺寸可預約調整', '內側樹脂手工澆注', '限量 15 件'],
      EN: ['CHROME ALLOY / PINK RESIN INLAY', 'INDEX TO PINKY — CUSTOM FIT ON REQUEST', 'HAND-POURED RESIN INTERIOR', 'LIMITED 15'],
      JP: ['クロム合金 / ピンクレジン', '人差し指〜小指・サイズ調整可', '内側レジン手作業', '限定15点'],
      KR: ['크롬 합금 / 핑크 레진', '검지~소지 · 사이즈 문의 조정', '내측 레진 수작업', '한정 15점'],
      FR: ['ALLIAGE CHROME / RÉSINE ROSE', 'INDEX À AURICULAIRE — AJUSTEMENT SUR DEMANDE', 'RÉSINE INTÉRIEURE COULÉE À LA MAIN', 'LIMITÉ À 15'],
    },
  },
  {
    id: '06', name: 'Monolith Collar', price: '¥ 5,900',
    material: '18K GOLD / BLACKENED STEEL',
    imageUrl: makeSVG('06', 800, 400, '#C9A84C', 'MONOLITH'),
    size: 'wide', gridArea: '3 / 1 / 4 / 4', stock: 1,
    accent: '#C9A84C',
    descriptions: {
      ZH: '黑化鋼項圈內弧貼頸，18K 金點如星屑排列——份量感強，線條卻收得很乾淨。全球僅三件的工坊線；這一條為本批次最後庫存，錯過即完售，只留下照片裡那道頸光。',
      EN: 'Blackened steel collar, inner curve flush to the throat; 18K gold pins read like stardust in a tight row. Strong presence, clean silhouette. Three pieces worldwide—this listing is the last of the run.',
      JP: '黒化スチールカラーが首の内弧に密着、18Kゴールドのピンが星屑のように並ぶ。存在感は強いのにシルエットは潔い。世界3点のライン—この掲載がラスト在庫。',
      KR: '블랙 스틸 칼라가 목 안쪽 곡선에 밀착, 18K 골드 핀이 성처럼 배열. 존재감은 크고 실루엣은 깔끔. 전 세계 3점 라인—이 리스트가 마지막 재고.',
      FR: 'Collier acier noirci, courbe intérieure au ras de la gorge ; points or 18K comme poussière d’étoiles serrée. Présence forte, ligne nette. Trois pièces au monde—ce stock est le dernier de la série.',
    },
    detailsList: {
      ZH: ['18K 黃金 / 黑化鋼', '頸圍 32–38cm · 可微調', '全球限量 3 · 附證書與編號', '霧黑盒裝'],
      EN: ['18K GOLD / BLACKENED STEEL', 'NECK 32–38CM — ADJUSTABLE', 'WORLDWIDE 3 — CERT + SERIAL', 'MATTE BLACK PRESENTATION'],
      JP: ['18Kゴールド / 黒化スチール', '首回り32〜38cm調整可', '世界限定3・証明書付', 'マットブラック梱包'],
      KR: ['18K 골드 / 블랙 스틸', '목둘레 32–38cm 조절', '전 세계 3점 · 증명서', '매트 블랙 패키지'],
      FR: ['OR 18K / ACIER NOIRCI', 'TOUR DE COU 32–38CM RÉGLABLE', '3 PIÈCES MONDIALES — CERTIF + N°', 'PRÉSENTATION NOIRE MATE'],
    },
  },
  {
    id: '07', name: 'Relic Earring', price: '¥ 980',
    material: 'OXIDIZED SILVER',
    imageUrl: makeSVG('07', 400, 400, '#F2F2F2', 'RELIC'),
    size: 'standard', gridArea: '3 / 4 / 4 / 6', stock: 14,
    accent: '#F2F2F2',
    descriptions: {
      ZH: '氧化銀一長一短、一輕一重——「不對稱」是設計語言，不是瑕疵。像左右耳各自挑了不同的千禧年單曲；戴起來先被看見的是態度，其次才是對稱與否。',
      EN: 'Oxidized silver—one long, one short, one light, one heavy. Asymmetry is the design language, not a flaw. Each ear picked a different Y2K single; attitude shows before symmetry does.',
      JP: '酸化銀、長短と軽重のアンバランス—非対称は設計言語で欠陥ではない。耳ごとに違うY2Kシングルを選んだよう。対称より先に態度が見える。',
      KR: '산화 은—한쪽은 길고 짧고, 가볍고 무겁다. 비대칭은 결함이 아니라 디자인 언어. 귀마다 다른 Y2K 싱글을 고른 듯. 대칭보다 먼저 태도가 보인다.',
      FR: 'Argent oxydé—long court, lourd léger. L’asymétrie est le langage du design, pas un défaut. Chaque oreille a choisi un single Y2K différent ; l’attitude passe avant la symétrie.',
    },
    detailsList: {
      ZH: ['氧化 925 銀', '左約 6cm／右約 3cm', '925 銀耳針', '可單購或成對'],
      EN: ['OXIDIZED 925 SILVER', 'LEFT ~6CM / RIGHT ~3CM', '925 SILVER POST', 'SOLD SINGLE OR AS PAIR'],
      JP: ['酸化925銀', '左約6cm / 右約3cm', '925銀ポスト', '片耳・ペア販売'],
      KR: ['산화 925 은', '왼쪽 약 6cm / 오른쪽 약 3cm', '925 실버 포스트', '단품 또는 페어'],
      FR: ['ARGENT 925 OXYDÉ', 'GAUCHE ~6CM / DROITE ~3CM', 'TIGE ARGENT 925', 'À L’UNITÉ OU EN PAIRE'],
    },
  },
  {
    id: '08', name: 'Arc Torque Bangle', price: '¥ 6,200',
    material: 'TITANIUM / RAW GOLD',
    imageUrl: makeSVG('08', 300, 800, '#C9A84C', 'TORQUE'),
    size: 'tall', gridArea: '3 / 6 / 5 / 7', stock: 4,
    accent: '#C9A84C',
    descriptions: {
      ZH: '鈦金屬扭矩手環，原色金焊點沿弧線分布——扭角由工坊逐件校對，沒有完全相同的曲率。建築感的 brutalist 線條，邊緣仍保留鉻系冷光，像把一座小橋戴在手腕上。',
      EN: 'Titanium torque bangle with raw gold welds tracing the arc—each twist angle set in the atelier, no two curves identical. Brutalist architecture in profile, edges still carrying a chrome-cool glint.',
      JP: 'チタンのトルクバングルにローゴールドの溶接点が弧をなぞる—ねじれ角はアトリエで一点ずつ。曲率は二つとない。ブルータリストな建築ラインにクロームの冷たい縁光。',
      KR: '티타늄 토크 뱅글, 로우 골드 용접이 호를 따라—비틀림 각도는 아틀리에에서 개별 세팅. 곡률이 모두 다름. 브루탈리스트 실루엣에 크롬 쿨한 모서리 광.',
      FR: 'Jonc torque titane, soudures or brut suivant l’arc—chaque angle réglé à l’atelier, aucune courbure identique. Profil brutaliste, arêtes encore d’un éclat froid chromé.',
    },
    detailsList: {
      ZH: ['航太鈦 / 18K 原色金', '內徑 60mm', '每件扭角略異 · 工坊品', '限量 10 件'],
      EN: ['AEROSPACE TI / 18K RAW GOLD', 'INNER DIA. 60MM', 'TWIST VARIES PER PIECE', 'LIMITED 10'],
      JP: ['航空宇宙チタン / 18Kローゴールド', '内径60mm', 'ねじれは個体差あり', '限定10点'],
      KR: ['항공우주 티타늄 / 18K 로우 골드', '내경 60mm', '비틀림은 개체별 차이', '한정 10점'],
      FR: ['TITANE AÉRO / OR BRUT 18K', 'DIAM. INT. 60MM', 'TORSION LÉGÈREMENT UNIQUE', 'LIMITÉ À 10'],
    },
  },
  {
    id: '09', name: 'Obsidian Band', price: '¥ 2,100',
    material: 'BLACKENED STEEL / RESIN',
    imageUrl: makeSVG('09', 800, 400, '#A8A8A8', 'BAND'),
    size: 'wide', gridArea: '4 / 1 / 5 / 4', stock: 8,
    accent: '#A8A8A8',
    descriptions: {
      ZH: '黑化鋼寬版環，內線灌入霧黑樹脂——霧面吞光但不死氣，像舊 CRT 關機前最後一幀的深灰。低調 luxury，適合與細戒疊戴，把千禧年的「暗色高光」留在手腕。',
      EN: 'Wide blackened steel with matte black resin inlay—the finish drinks light without going flat, like the last gray frame before a CRT powers down. Quiet luxury; stacks with slim rings for Y2K shadow-shine.',
      JP: '幅広の黒化スチールにマットブラックレジン—光を飲んでも死なない、CRTが消える直前のグレーのよう。クワイエットラグジュアリー。細いリングと重ねてY2Kの影のハイライト。',
      KR: '와이드 블랙 스틸에 매트 블랙 레진—빛을 삼켜도 밋밋하지 않음, CRT 꺼지기 직전 프레임 같은 그레이. 조용한 럭셔리. 슬림 링과 스택하면 Y2K 섀도우 샤인.',
      FR: 'Large anneau acier noirci, résine noire mate—avale la lumière sans s’aplatir, comme la dernière trame grise d’un CRT qui s’éteint. Luxe discret ; se superpose aux anneaux fins pour une brillance d’ombre Y2K.',
    },
    detailsList: {
      ZH: ['黑化鋼 / 霧黑樹脂', '寬約 25mm · 內徑 58mm', '噴砂霧面 · 建議乾拭', '限量 25 件'],
      EN: ['BLACKENED STEEL / MATTE RESIN', '~25MM WIDE — INNER 58MM', 'SANDBLAST MATTE — DRY WIPE CARE', 'LIMITED 25'],
      JP: ['黒化スチール / マットレジン', '幅約25mm・内径58mm', 'サンドブラスト・乾拭き推奨', '限定25点'],
      KR: ['블랙 스틸 / 매트 레진', '폭 약 25mm · 내경 58mm', '샌드블라스트 · 건조 닦기', '한정 25점'],
      FR: ['ACIER NOIRCI / RÉSINE MATE', '~25MM DE LARGE — INT. 58MM', 'SABLAGE MAT — ENTRETIEN AU SEC', 'LIMITÉ À 25'],
    },
  },
  {
    id: '10', name: 'Chromatic Star Stud', price: '¥ 750',
    material: 'OXIDIZED SILVER',
    imageUrl: makeSVG('10', 400, 400, '#FF1293', 'STAR'),
    size: 'standard', gridArea: '4 / 4 / 5 / 6', stock: 2,
    accent: '#FF1293',
    descriptions: {
      ZH: '氧化銀星形耳釘，粉紫雷射鍍層在暗底上偏光——很小顆，但折射很滿；像 CD 殼在燈下轉一角。庫存僅餘 2，適合當入門款或第二耳洞亮點。',
      EN: 'Oxidized silver star with a pink-laser shift over a dark base—tiny footprint, full refraction, like a CD case catching one lamp angle. Only two left; perfect as a first stud or a second-hole sparkle.',
      JP: '酸化銀の星にピンクシフトのレーザー調—ダークベースで小さいのに屈折は満タン。CDケースが一角だけ灯りを拾うよう。残り2点、ファーストスタッドにも。',
      KR: '산화 은 스타에 핑크 시프트 레이저 톤—다크 베이스에 작지만 굴절은 풀. CD 케이스가 한 각도만 빛 잡는 듯. 2개 남음, 첫 스터드나 세컨 홀에.',
      FR: 'Étoile argent oxydé, décalage rose type laser sur fond sombre—petit format, refraction maxi, comme un boîtier CD qui capte une seule lampe. Plus que deux ; idéal premier clou ou second trou.',
    },
    detailsList: {
      ZH: ['氧化 925 銀 / 偏光鍍層', '直徑約 8mm', '925 銀耳針', '本批次僅剩極少庫存'],
      EN: ['OXIDIZED 925 / IRIDESCENT COAT', '~8MM DIAMETER', '925 SILVER POST', 'VERY LOW STOCK THIS DROP'],
      JP: ['酸化925銀 / 偏光コート', '直径約8mm', '925銀ポスト', '在庫僅少'],
      KR: ['산화 925 / 이리데슨트 코팅', '직경 약 8mm', '925 실버 포스트', '재고 매우 적음'],
      FR: ['ARGENT 925 OXYDÉ / COUCHE IRISÉE', '~8MM DE DIAMÈTRE', 'TIGE ARGENT 925', 'STOCK TRÈS BAS'],
    },
  },
  {
    id: '11', name: 'Micro Charm', price: '¥ 280',
    material: 'BRASS / ENAMEL',
    imageUrl: makeSVG('11', 400, 400, '#FF1293', 'CHARM'),
    size: 'standard', stock: 40,
    accent: '#FF1293',
    descriptions: {
      ZH: '黃銅琺瑯迷你星星——可掛包鍊、手機繩或細項鍊。入門級的千禧閃點，像把像素信仰縮成一粒扣；從小地方開始堆疊你的 chrome 層次。',
      EN: 'Brass enamel micro star—clip to bag chain, phone strap, or a fine necklace. Entry-level millennium sparkle; a pixel-sized accent to start stacking chrome layers.',
      JP: '真鍮エナメルのマイクロスター—バッグチェーン、スマホストラップ、細いネックレスに。入門のミレニアムキラメキ。ピクセルサイズのアクセントからクロームを重ねる。',
      KR: '황동 에나멜 마이크로 스타—가방 체인, 폰 스트랩, 가는 목걸이에. 입문용 밀레니엄 스파클. 픽셀 크기 액센트로 크롬 레이어 시작.',
      FR: 'Mini étoile émail sur laiton—sac, dragonne téléphone ou chaîne fine. Premier éclat millénaire ; un accent taille pixel pour commencer à empiler le chrome.',
    },
    detailsList: {
      ZH: ['黃銅 / 粉色琺瑯', '直徑約 15mm', '附約 5cm 延長鏈', '可多件疊掛'],
      EN: ['BRASS / PINK ENAMEL', '~15MM DIAMETER', '+5CM EXTENSION RING', 'STACK MULTIPLE CHARMS'],
      JP: ['真鍮 / ピンクエナメル', '直径約15mm', '約5cm延長リング付', '複数重ね可'],
      KR: ['황동 / 핑크 에나멜', '직경 약 15mm', '약 5cm 연장 링 포함', '여러 개 레이어링'],
      FR: ['LAITON / ÉMAIL ROSE', '~15MM DE DIAMÈTRE', 'ANNEAU +5CM INCLUS', 'SUPERPOSABLE'],
    },
  },
  {
    id: '12', name: 'Thread Ring', price: '¥ 150',
    material: 'STERLING SILVER',
    imageUrl: makeSVG('12', 400, 400, '#F2F2F2', 'THREAD'),
    size: 'standard', stock: 60,
    accent: '#F2F2F2',
    descriptions: {
      ZH: '極細 925 銀線戒，線徑 0.8mm——輕到像沒戴，反光卻很誠實。三至五枚疊戴時，手指像被千禧年的細格線編碼；乾淨、好搭、每天都想留著。',
      EN: 'Ultra-fine 925 wire ring at 0.8mm—feather-light, honest flash. Stack three to five and your fingers read like millennial grid lines: clean, easy, everyday.',
      JP: '極細925ワイヤー0.8mm—軽くて正直な反射。3〜5本重ねれば指がミレニアムのグリッドラインのように。クリーンで毎日。',
      KR: '초미세 925 와이어 0.8mm—가볍고 반사는 솔직. 3~5개 스택하면 손가락이 밀레니엄 그리드 라인처럼. 데일리 클린.',
      FR: 'Anneau fil 925 ultra-fin, 0,8 mm—si léger, éclat honnête. Superposez trois à cinq : les doigts deviennent lignes de grille millénaire ; clean, quotidien.',
    },
    detailsList: {
      ZH: ['925 純銀', '線徑 0.8mm', '美／港碼 10–22', '為疊戴設計'],
      EN: ['925 STERLING', 'WIRE 0.8MM', 'US / HK 10–22', 'MADE FOR STACKING'],
      JP: ['925スターリング', 'ワイヤー0.8mm', 'サイズ10〜22', 'スタッキング向け'],
      KR: ['925 스털링', '와이어 0.8mm', '사이즈 10–22', '스택 전용'],
      FR: ['ARGENT 925', 'FIL 0,8MM', 'TAILLES 10–22', 'PENSÉ POUR SUPERPOSITION'],
    },
    sizes: ['10號', '12號', '14號', '16號', '18號', '20號', '22號'],
  },
  {
    id: '13', name: 'Y2K Anklet', price: '¥ 320',
    material: 'CHROME / CRYSTAL',
    imageUrl: makeSVG('13', 400, 400, '#C9A84C', 'ANKLET'),
    size: 'standard', stock: 25,
    accent: '#C9A84C',
    descriptions: {
      ZH: '鍍鉻腳鏈鑲透明水晶——踝骨一道乾淨高光，走動時碎光跟著節奏跳。千禧代表單品：不敘事、只負責把 early-2000s 的派對燈留在身上。',
      EN: 'Chrome-plated anklet with clear crystal—a clean highlight on the bone; walking sets tiny sparks in rhythm. Signature Y2K piece: less story, more keeping the party lights on your skin.',
      JP: 'クロームメッキアンクレットにクリアクリスタル—踝にクリーンなハイライト。歩くたびリズムでキラめく。Y2Kの代表アイテム、語りより肌に灯りを残す。',
      KR: '크롬 도금 발찌에 클리어 크리스탈—발목뼈에 깔끔한 하이라이트. 걸을 때 리듬으로 스파클. Y2K 시그니처, 스토리보다 피부에 파티 라이트.',
      FR: 'Chaîne de cheville chromée, cristal clair—reflet net sur l’os ; marcher fait danser des étincelles. Pièce signature Y2K : garder les lumières de soirée sur la peau.',
    },
    detailsList: {
      ZH: ['鍍鉻合金 / 透明水晶', '鏈長約 22–26cm · 可調', '龍蝦扣', '日常防潑水 · 建議拭乾'],
      EN: ['CHROME-PLATED ALLOY / CRYSTAL', '22–26CM ADJUSTABLE', 'LOBSTER CLASP', 'SPLASH-SAFE — PAT DRY'],
      JP: ['クローム合金 / クリアクリスタル', '22〜26cm調整可', 'ロブスタークラスプ', '日常撥水・拭き取り'],
      KR: ['크롬 도금 합금 / 크리스탈', '22–26cm 조절', '랍스터 클라스프', '생활 방수 · 닦아 건조'],
      FR: ['ALLIAGE CHROMÉ / CRISTAL', '22–26CM RÉGLABLE', 'FERMOIR HOMARD', 'ÉCLABOUSSURES OK — SÉCHER'],
    },
  },
  {
    id: '14', name: 'Noir Velvet Choker', price: '¥ 480',
    material: 'VELVET / OXIDIZED SILVER',
    imageUrl: makeSVG('14', 400, 400, '#A8A8A8', 'CHOKER'),
    size: 'standard', stock: 18,
    accent: '#A8A8A8',
    descriptions: {
      ZH: '黑絲絨帶配氧化銀墜——觸感柔、視覺收，中心一點冷金屬把 Y2K 的「暗黑可愛」壓在剛好的比例。像 afterparty 後留在頸上的細節：神秘，但線條乾淨。',
      EN: 'Black velvet band with an oxidized silver drop—soft touch, tight visual; one cool metal note balances Y2K noir-cute. Afterparty detail on the neck: moody, still clean-lined.',
      JP: '黒ベルベットに酸化銀ドロップ—触りは柔らか、見た目は締まる。一点の冷たい金属がY2Kノワール・キュートを整える。アフター後の首元のディテール、ムーディーでもラインは潔い。',
      KR: '블랙 벨벳 밴드에 산화 은 드롭—촉감은 부드럽고 실루엣은 타이트. 한 점의 차가운 메탈이 Y2K 누아르 큐트를 밸런스. 애프터 파티 목선 디테일, 무드 있고 라인은 깔끔.',
      FR: 'Ruban velours noir et pendentif argent oxydé—doux au toucher, silhouette serrée ; une note métal froide équilibre le noir-mignon Y2K. Détail de nuque post-soirée : sombre, lignes nettes.',
    },
    detailsList: {
      ZH: ['黑色絲絨 / 氧化 925 銀', '頸圍約 30–36cm · 可調', '墜飾直徑約 12mm', '附延長鏈'],
      EN: ['BLACK VELVET / OXIDIZED 925', 'NECK ~30–36CM ADJUSTABLE', 'DROP ~12MM', 'EXTENSION CHAIN INCLUDED'],
      JP: ['ブラックベルベット / 酸化925銀', '首回り30〜36cm調整可', 'ドロップ直径約12mm', '延長チェーン付'],
      KR: ['블랙 벨벳 / 산화 925 은', '목둘레 약 30–36cm', '드롭 약 12mm', '연장 체인 포함'],
      FR: ['VELOURS NOIR / ARGENT 925 OXYDÉ', 'COU ~30–36CM RÉGLABLE', 'PENDENTIF ~12MM', 'CHAÎNE EXTENSION INCLUSE'],
    },
  },
  {
    id: '15', name: 'Pixel Earring', price: '¥ 390',
    material: 'ACRYLIC / CHROME',
    imageUrl: makeSVG('15', 400, 400, '#FF1293', 'PIXEL'),
    size: 'standard', stock: 35,
    accent: '#FF1293',
    descriptions: {
      ZH: '壓克力像素塊，鍍鉻邊框——數位圖形變成耳上小方塊，輕量所以能從早戴到晚。像把螢幕角落裁一塊貼在耳垂，全開 Y2K game energy，但不幼稚。',
      EN: 'Acrylic pixel blocks in a chrome frame—digital graphics become ear-sized squares, light enough for all-day wear. Screen-corner clipped to the lobe: full Y2K game energy, not juvenile.',
      JP: 'アクリルのピクセルブロックにクローム枠—デジタル図形が耳サイズのスクエアに。軽くて終日OK。画面の角を耳垂にクリップしたようなY2Kゲーム感、子供っぽくない。',
      KR: '아크릴 픽셀 블록, 크롬 프레임—디지털 그래픽이 귀 크기 사각형으로. 가벼워 종일 착용. 화면 모서리를 귓불에 클립한 듯한 Y2K 게임 에너지, 유치하지 않음.',
      FR: 'Blocs acrylique pixel, cadre chrome—le graphique digital devient carré taille oreille, léger pour la journée. Coin d’écran épinglé au lobe : énergie jeu Y2K, pas enfantin.',
    },
    detailsList: {
      ZH: ['彩色壓克力 / 鍍鉻合金', '約 20×20mm', '925 銀耳針', '多色可選'],
      EN: ['COLORED ACRYLIC / CHROME FRAME', '~20×20MM', '925 SILVER POST', 'MULTIPLE COLORS'],
      JP: ['カラーアクリル / クローム枠', '約20×20mm', '925銀ポスト', '複数カラー'],
      KR: ['컬러 아크릴 / 크롬 프레임', '약 20×20mm', '925 실버 포스트', '복수 컬러'],
      FR: ['ACRYLIQUE COLORÉ / CADRE CHROME', '~20×20MM', 'TIGE ARGENT 925', 'PLUSIEURS COULEURS'],
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

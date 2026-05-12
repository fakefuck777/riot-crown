import type { Locale } from '~/lib/i18n';

export const LEGAL_PAGE_IDS = ['privacy', 'terms', 'returns', 'contact'] as const;
export type LegalPageId = (typeof LEGAL_PAGE_IDS)[number];

export function isLegalPageId(s: string | undefined): s is LegalPageId {
  return s !== undefined && (LEGAL_PAGE_IDS as readonly string[]).includes(s);
}

export type LegalBlock = { type: 'h2' | 'p'; text: string };

export type LegalDoc = {
  title: string;
  description: string;
  blocks: LegalBlock[];
};

const EN: Record<LegalPageId, LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    description:
      'How RIOT CROWN collects, uses, and protects personal data when you browse or purchase.',
    blocks: [
      { type: 'h2', text: 'Overview' },
      {
        type: 'p',
        text:
          'This policy describes how we handle information in connection with this website and checkout flow. It is provided for transparency; adjust with counsel before relying on it as binding legal text in your jurisdiction.',
      },
      { type: 'h2', text: 'Data we may collect' },
      {
        type: 'p',
        text:
          'Contact details you enter at checkout (email, name, phone, shipping address), technical data such as IP address, browser type, device identifiers, and cookies used for session, cart, analytics, and fraud prevention.',
      },
      { type: 'h2', text: 'How we use data' },
      {
        type: 'p',
        text:
          'To fulfill orders, communicate about purchases, improve the site, comply with law, and secure transactions. Analytics, if enabled, uses aggregated or pseudonymous data as described by the provider you configure.',
      },
      { type: 'h2', text: 'Retention & sharing' },
      {
        type: 'p',
        text:
          'We retain order-related data as needed for accounting, disputes, and legal obligations. Processors (e.g. Shopify, payment, email, hosting) receive data only as required to provide their services.',
      },
      { type: 'h2', text: 'Your choices' },
      {
        type: 'p',
        text:
          'Depending on your region you may have rights to access, correct, delete, or export personal data, or to object to certain processing. Contact us at the address below to exercise these rights.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms governing use of the RIOT CROWN website and purchases.',
    blocks: [
      { type: 'h2', text: 'Agreement' },
      {
        type: 'p',
        text:
          'By using this site you agree to these terms. If you do not agree, do not use the site. We may update terms; continued use after changes constitutes acceptance where permitted by law.',
      },
      { type: 'h2', text: 'Products & pricing' },
      {
        type: 'p',
        text:
          'Descriptions, images, and availability are provided in good faith; limited editions may sell out. Prices and taxes display at checkout when connected to a live store.',
      },
      { type: 'h2', text: 'Prohibited use' },
      {
        type: 'p',
        text:
          'No unlawful use, no interference with security or operations, no automated scraping that degrades service, and no resale schemes that violate our policies.',
      },
      { type: 'h2', text: 'Disclaimer' },
      {
        type: 'p',
        text:
          'The site is provided “as is” to the extent permitted by law. Some jurisdictions do not allow certain limitations; those limits apply only to the maximum extent allowed.',
      },
    ],
  },
  returns: {
    title: 'Shipping & Returns',
    description: 'Shipping timelines, final sale policy, and defect handling for RIOT CROWN.',
    blocks: [
      { type: 'h2', text: 'Shipping' },
      {
        type: 'p',
        text:
          'Orders ship from Tokyo where stated on product pages. Carriers and transit times vary by destination; tracking is provided when available from the fulfillment system.',
      },
      { type: 'h2', text: 'Final sale' },
      {
        type: 'p',
        text:
          'Many pieces are sold as final sale due to limited production. Confirm size and details before purchase. This does not limit your statutory rights where mandatory law requires otherwise.',
      },
      { type: 'h2', text: 'Defective or damaged items' },
      {
        type: 'p',
        text:
          'If an item arrives materially damaged or defective, contact us within the window stated at purchase with photos. We will repair, replace, or refund as appropriate per our guarantee copy on the site.',
      },
    ],
  },
  contact: {
    title: 'Contact',
    description: 'Reach RIOT CROWN for orders, press, and wholesale inquiries.',
    blocks: [
      { type: 'h2', text: 'Customer & order support' },
      {
        type: 'p',
        text:
          'Email void@riotcrown.com with your order reference if applicable. We aim to respond within two business days. Replace this address with your production inbox before launch.',
      },
      { type: 'h2', text: 'Press & collaborations' },
      {
        type: 'p',
        text:
          'Use the same email with subject line “PRESS” or “COLLAB”. No phone hotline is published on this demo site.',
      },
    ],
  },
};

const ZH: Record<LegalPageId, LegalDoc> = {
  privacy: {
    title: '隐私权政策',
    description: '说明 RIOT CROWN 在您浏览或购买时如何收集、使用与保护个人资料。',
    blocks: [
      { type: 'h2', text: '概要' },
      {
        type: 'p',
        text:
          '本政策说明与本网站及结账流程相关的个人信息处理方式，旨在提供透明信息；正式上线前请依您运营所在地法令与顾问调整为具法律约束力的文本。',
      },
      { type: 'h2', text: '可能收集的资料' },
      {
        type: 'p',
        text:
          '您在结账填写的联系方式（电子邮件、姓名、电话、寄送地址）、技术资料如 IP、浏览器类型、设备识别码，以及用于会话、购物车、分析与防诈的 Cookie。',
      },
      { type: 'h2', text: '使用目的' },
      {
        type: 'p',
        text:
          '用于履行订单、购买相关通知、改善网站、遵守法令与交易安全。若启用第三方分析，将依该服务供应商之政策处理汇总或假名化资料。',
      },
      { type: 'h2', text: '保存与分享' },
      {
        type: 'p',
        text:
          '订单相关资料于会计、争议与法定保存期间内保留。受托方（如 Shopify、支付、邮件、主机）仅在提供服务所需范围内接收资料。',
      },
      { type: 'h2', text: '您的权利' },
      {
        type: 'p',
        text:
          '依您所在地法令，您可能享有查阅、更正、删除、可携式副本或拒绝特定处理等权利。请通过下方联系方式提出请求。',
      },
    ],
  },
  terms: {
    title: '服务条款',
    description: '规范您使用 RIOT CROWN 网站与购买行为的条款。',
    blocks: [
      { type: 'h2', text: '同意' },
      {
        type: 'p',
        text:
          '使用本网站即表示您同意本条款；若不同意请勿使用。我们可更新条款；在法令允许范围内，您持续使用视为接受修订后的条款。',
      },
      { type: 'h2', text: '商品与定价' },
      {
        type: 'p',
        text:
          '商品描述、影像与库存状态为善意提供；限量商品可能售罄。实际价格与税费以在线商店结账页为准。',
      },
      { type: 'h2', text: '禁止行为' },
      {
        type: 'p',
        text:
          '禁止违法使用、破坏安全性或运营、造成服务负载的自动化抓取，以及违反我方政策的转售行为。',
      },
      { type: 'h2', text: '免责声明' },
      {
        type: 'p',
        text:
          '在法令允许范围内，本网站按「现状」提供。部分法域不允许特定责任限制，于该等情形下仅在法定上限内适用。',
      },
    ],
  },
  returns: {
    title: '运送与退换货',
    description: '运送时效、最终销售政策与瑕疵处理说明。',
    blocks: [
      { type: 'h2', text: '运送' },
      {
        type: 'p',
        text:
          '商品页标示由东京出货者，将自东京寄送。实际物流与天数依目的地与承运商而定；若接入正式商店系统，将提供可取得的追踪信息。',
      },
      { type: 'h2', text: '最终销售' },
      {
        type: 'p',
        text:
          '多数作品因限量生产为最终销售；请于购买前确认尺寸与细节。此叙述不影响您在强制法令下的权利。',
      },
      { type: 'h2', text: '瑕疵或运送损坏' },
      {
        type: 'p',
        text:
          '若商品送达时有重大瑕疵或损坏，请于购买页面载明之期限内联系并提供照片；我们将依网站「保障」文案提供修复、换货或退款等适当处理。',
      },
    ],
  },
  contact: {
    title: '联系我们',
    description: '订单、媒体与合作咨询。',
    blocks: [
      { type: 'h2', text: '客服与订单' },
      {
        type: 'p',
        text:
          '请发邮件至 void@riotcrown.com，并附上订单编号（如有）。我们目标于两个工作日内回复。正式上线前请改为实际客服邮箱。',
      },
      { type: 'h2', text: '媒体与联名' },
      {
        type: 'p',
        text:
          '请使用同一邮箱，主题注明「PRESS」或「COLLAB」。本示范站未提供电话专线。',
      },
    ],
  },
};

/** JP / KR / FR: aligned substance; replace email with yours before launch. */
const JP: Record<LegalPageId, LegalDoc> = {
  privacy: {
    title: 'プライバシーポリシー',
    description: 'RIOT CROWN が個人データをどのように扱うかの概要です。',
    blocks: [
      { type: 'h2', text: 'ご案内' },
      {
        type: 'p',
        text:
          'お客様の地域の法令に従い、注文履行・セキュリティ・分析のために必要な範囲でデータを処理します。詳細は英語版または現地語の最終文書を参照してください。ご質問は void@riotcrown.com まで。',
      },
    ],
  },
  terms: {
    title: '利用規約',
    description: '本サイトの利用および購入に関する条件の概要です。',
    blocks: [
      { type: 'h2', text: '同意' },
      {
        type: 'p',
        text:
          '本サイトを利用することで本規約に同意したものとみなします。商品説明・価格・限定販売については各ページの表示に従います。詳細は英語版を併せてご確認ください。',
      },
    ],
  },
  returns: {
    title: '配送・返品',
    description: '配送と返品・瑕疵対応の概要です。',
    blocks: [
      { type: 'h2', text: '配送・最終販売' },
      {
        type: 'p',
        text:
          '東京発送の記載がある商品は東京から発送されます。限定品はファイナルセールの場合があります。到着時の瑕疵はサイト記載の保証に従い対応します。',
      },
    ],
  },
  contact: {
    title: 'お問い合わせ',
    description: 'ご注文・取材・協業の連絡先です。',
    blocks: [
      {
        type: 'p',
        text: 'メール: void@riotcrown.com（2営業日以内の返信を目安）',
      },
    ],
  },
};

const KR: Record<LegalPageId, LegalDoc> = {
  privacy: {
    title: '개인정보 처리방침',
    description: 'RIOT CROWN의 개인정보 처리 개요입니다.',
    blocks: [
      { type: 'h2', text: '개요' },
      {
        type: 'p',
        text:
          '주문 이행, 보안, 분석을 위해 관련 법령이 허용하는 범위에서 데이터를 처리합니다. 상세는 영문 정책을 참고하시고 문의는 void@riotcrown.com 으로 주세요.',
      },
    ],
  },
  terms: {
    title: '이용약관',
    description: '사이트 이용 및 구매 조건의 개요입니다.',
    blocks: [
      {
        type: 'p',
        text:
          '사이트 이용 시 본 약관에 동의한 것으로 간주됩니다. 상품·가격·한정판매는 각 페이지 안내를 따릅니다.',
      },
    ],
  },
  returns: {
    title: '배송 및 반품',
    description: '배송, 파이널 세일, 불량 처리 안내입니다.',
    blocks: [
      {
        type: 'p',
        text:
          '도쿄 발송 표기 상품은 도쿄에서 발송됩니다. 한정품은 파이널 세일일 수 있으며, 도착 시 불량은 사이트에 명시된 보증에 따릅니다.',
      },
    ],
  },
  contact: {
    title: '문의',
    description: '주문·프레스·협업 문의입니다.',
    blocks: [{ type: 'p', text: '이메일: void@riotcrown.com (영업일 기준 2일 내 회신 목표)' }],
  },
};

const FR: Record<LegalPageId, LegalDoc> = {
  privacy: {
    title: 'Politique de confidentialité',
    description: 'Comment RIOT CROWN traite les données personnelles.',
    blocks: [
      {
        type: 'p',
        text:
          'Nous traitons les données nécessaires aux commandes, à la sécurité et à l’amélioration du site, conformément aux lois applicables. Détails complets : version anglaise. Contact : void@riotcrown.com.',
      },
    ],
  },
  terms: {
    title: 'Conditions d’utilisation',
    description: 'Conditions d’utilisation du site et d’achat.',
    blocks: [
      {
        type: 'p',
        text:
          'L’utilisation du site vaut acceptation des présentes conditions. Produits, prix et éditions limitées selon les pages. Litiges selon les lois applicables.',
      },
    ],
  },
  returns: {
    title: 'Livraison & retours',
    description: 'Expédition depuis Tokyo, vente finale et défauts.',
    blocks: [
      {
        type: 'p',
        text:
          'Les délais et transporteurs varient. Certaines pièces sont en vente finale. En cas de défaut à la réception, suivez la garantie indiquée sur le site.',
      },
    ],
  },
  contact: {
    title: 'Contact',
    description: 'Commandes, presse et partenariats.',
    blocks: [{ type: 'p', text: 'Email : void@riotcrown.com (réponse visée sous 2 jours ouvrés).' }],
  },
};

const BY_LOCALE: Record<Locale, Record<LegalPageId, LegalDoc>> = {
  EN,
  ZH,
  JP,
  KR,
  FR,
};

export function getLegalDoc(page: LegalPageId, locale: Locale): LegalDoc {
  return BY_LOCALE[locale][page];
}

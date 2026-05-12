const MAIN = import.meta.env.VITE_MAIN_SITE_URL ?? 'http://localhost:3000';

export function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        margin: 0,
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        background: '#050505',
        color: '#c9c9c9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '36rem',
      }}
    >
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: '#c9a84c', textTransform: 'uppercase' }}>
        RIOT CROWN — side dev
      </p>
      <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f2f2f2', margin: '0.75rem 0 1rem' }}>
        此資料夾僅供本機輔助（非主視覺稿）
      </h1>
      <p style={{ lineHeight: 1.65, margin: 0 }}>
        正式品牌與購物體驗請使用專案根目錄的 Hydrogen 主站：
        <code style={{ display: 'block', marginTop: '1rem', padding: '0.5rem 0.75rem', background: '#111', color: '#eee' }}>
          npm run dev
        </code>
      </p>
      <a
        href={MAIN}
        style={{
          marginTop: '2rem',
          color: '#c9a84c',
          fontSize: '0.85rem',
          textDecoration: 'underline',
        }}
      >
        開啟主站 → {MAIN}
      </a>
    </div>
  );
}

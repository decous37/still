import type { Metadata } from 'next';
import './globals.css';
import './air.css';
import './live.css';
import './fill.css';

export const metadata: Metadata = {
  title: 'Still',
  description:
    '约 1–3 分钟的安静文字练习 / A quiet one-to-three minute word practice.',
};

/**
 * 首次绘制前应用主题与文档语言，避免深色用户看到白屏闪烁。
 * 这里的取值顺序与客户端偏好读取保持一致：已保存的值 → 浏览器偏好 → 默认。
 */
const prePaintBootstrap = `
(function () {
  var root = document.documentElement;
  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  var theme = read('still:theme');
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;

  var lang = read('still:lang');
  if (lang !== 'zh-CN' && lang !== 'en') {
    lang = (navigator.language || 'en').toLowerCase().indexOf('zh') === 0
      ? 'zh-CN' : 'en';
  }
  root.lang = lang;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: prePaintBootstrap }} />
        {children}
      </body>
    </html>
  );
}

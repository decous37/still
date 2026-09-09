# Still 鼠标卡顿与漂移诊断记录

更新：2026-09-09。

## 用户描述

用户描述的问题是指针本身短暂停住，再向其他方向跳跃；这不等同于按钮 hover 上浮。因此本记录只把已经有证据的网页样式风险收束，不宣布根因。

## 已确认代码事实

- 当前入口链为 `app/page.tsx` -> `components/still/air-app.tsx` -> `components/still/live-practice.tsx`。
- 旧 `still-app.tsx`、`start-scene.tsx`、`practice-scene.tsx` 等文件已删除，不在当前入口链上。
- 未发现自定义鼠标跟随效果或持续 `mousemove` 监听。
- `vite.config.ts` 只在 `CODEX_SANDBOX === 'seatbelt'` 时启用文件轮询。
- 修改前存在重叠 hover 位移：`app/air.css` 中 `.letter-piece:hover` 上移 3px，`app/live.css` 中 `.live-stage .letter-piece:hover:not(:disabled)` 上移 2px。
- 修改前已禁用或已使用的字块仍可能匹配旧的全局 `.letter-piece:hover`。

## 本轮处理

已完成的低风险整理：

- `app/air.css` 的全局 `.letter-piece:hover` 不再做 `transform`，只在 `(hover: hover) and (pointer: fine)` 下为可用、未使用字块改变背景。
- `app/live.css` 的字块上浮限定为 `(hover: hover) and (pointer: fine)` 且 `:not(:disabled):not(.is-used)`。

这项修改能降低 hover 命中边缘造成的视觉抖动风险，但不能单独证明已经修复用户描述的“指针停住再跳跃”。

## 尚未完成的实测

本轮未启动 GUI 性能录制，也未真实复现用户设备上的指针漂移。以下对照仍需在可复现环境中做：

1. 空白区域持续移动 vs 字块边缘慢速移动。
2. 不点击、连续点击、自动换题三个场景。
3. Codex 内嵌预览 vs 独立 Chrome。
4. 开发服务 vs 生产构建预览。
5. 同浏览器静态空白页 vs 本站页面。
6. 若静态页面也异常，再检查其他应用中的指针表现。

## 判定规则

- 只有当异常和本站 hover/渲染/主线程记录稳定对应时，才把它归为网页问题。
- 若生产预览正常而开发服务异常，优先检查 HMR、轮询、重复服务和 CPU 占用。
- 若独立 Chrome 正常而内嵌预览异常，记录宿主差异，不用业务代码掩盖。
- 若静态页面或其他应用也异常，交由用户决定是否调整系统鼠标、触控板、驱动或扩展环境。

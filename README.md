# 🏢 台北雪梨灣社區機車停車位電腦選號系統

一個專為社區設計的機車停車位自動分配系統，提供公平的電腦抽籤機制和即時視覺化介面。

## ✨ 功能特色

- 🎯 **雙輪抽籤機制**：支援第一輪常規抽籤和第二輪偏好選擇
- 🎲 **即時抽籤動畫**：每3秒自動抽出住戶，提供流暢的視覺體驗
- 🏗️ **建築分群管理**：依據住戶棟別限制可抽取停車區域
- 📊 **詳細結果顯示**：即時顯示車位分布、已分配狀態和剩餘車位
- ⏸️ **彈性控制**：支援暫停/繼續抽籤流程
- 📱 **響應式設計**：適配桌面、平板、手機各種螢幕尺寸

## 🎨 預覽

系統包含三個主要介面：
- **開始畫面**：系統介紹和抽籤規則說明
- **抽籤畫面**：即時顯示抽籤過程和結果
- **結果總覽**：完整的車位分配詳情

## 🏗️ 技術架構

### 前端
- **React 18** + **TypeScript** + **Vite** - 現代化前端開發
- **Radix UI** + **shadcn/ui** + **Tailwind CSS** - 美觀且無障礙的 UI 組件
- **Wouter** - 輕量級路由管理
- **TanStack Query** - 伺服器狀態管理
- **Framer Motion** - 流暢動畫效果

### 後端
- **Node.js** + **Express.js** - 高效能 Web 伺服器
- **TypeScript** - 型別安全的開發體驗
- **記憶體儲存** - 快速資料存取，適合抽籤場景
- **RESTful API** - 簡潔的 API 設計

### 開發工具
- **tsx** - TypeScript 直接執行
- **Drizzle ORM** - 型別安全的資料庫操作（已配置）
- **Zod** - 執行時型別驗證

## 🏢 系統配置

### 建築分組規則
```
AB棟 (44戶)  → AB區(42位) + B3區(2位)
C棟 (83戶)   → B3區 + B2區
D棟 (84戶)   → B3區 + B2區
E棟 (89戶)   → B3區 + B2區
F棟 (96戶)   → B3區 + B2區
GH棟 (40戶)  → B2區(40位預留)
IJ棟 (40戶)  → B1區(40位預留)
```

### 停車區域配置
- **AB區**：42個車位
- **B3區**：140個車位
- **B2區**：462個車位
- **B1區**：122個車位

## 🚀 快速開始

### 環境需求
- Node.js 18+
- npm 或 yarn

### 安裝與執行
```bash
# 克隆專案
git clone <repository-url>
cd parking-assignment-system

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器將在 http://localhost:5000 啟動

### 生產部署
```bash
# 建構應用
npm run build

# 啟動生產伺服器
npm start
```

## 📁 專案結構

```
├── client/src/           # 前端原始碼
│   ├── components/       # React 組件
│   │   ├── ui/          # shadcn/ui 基礎組件
│   │   └── ...          # 功能組件
│   ├── contexts/        # React Context
│   ├── hooks/           # 自定義 Hook
│   ├── lib/             # 工具函式
│   ├── pages/           # 頁面組件
│   └── App.tsx          # 應用程式進入點
├── server/              # 後端原始碼
│   ├── index.ts         # Express 伺服器
│   ├── routes.ts        # API 路由
│   ├── storage.ts       # 資料儲存邏輯
│   ├── units.json       # 住戶資料
│   └── second.json      # 第二輪需求資料
├── shared/              # 共用型別定義
│   └── schema.ts        # 資料結構定義
└── ...                  # 設定檔案
```

## 🎯 核心功能

### 第一輪抽籤
1. 載入住戶資料並隨機排序
2. 依據建築分組規則限制可抽取區域
3. 每3秒自動抽取一位住戶
4. 隨機分配符合資格的停車位

### 第二輪抽籤
1. 載入第二輪需求住戶資料
2. 依據住戶偏好區域進行配置
3. 優先分配偏好區域車位
4. 無可用偏好車位時分配其他區域

### 視覺化顯示
- 🟢 **綠色**：友善車位（身障專用）
- 🔴 **紅色**：不適合車位
- ⚪ **白色**：一般可用車位
- ⚫ **灰色**：第一輪已分配
- 🔵 **藍色**：第二輪已分配

## 🔧 API 端點

```
GET  /api/parking/state       # 獲取當前抽籤狀態
POST /api/parking/start       # 開始第一輪抽籤
POST /api/parking/draw        # 抽取下一個住戶
POST /api/parking/reset       # 重置抽籤狀態
POST /api/parking/second      # 開始第二輪抽籤
POST /api/parking/draw-second # 第二輪抽籤
```

## 🎨 設計系統

採用 shadcn/ui 設計系統，提供：
- 無障礙設計標準
- 一致的視覺語言
- 深色/淺色主題支援
- 響應式佈局

## 🔄 資料流程

1. **初始化**：載入住戶資料，生成停車位清單
2. **抽籤開始**：住戶隨機排序，開始自動抽籤
3. **車位分配**：根據建築規則分配合適車位
4. **結果顯示**：即時更新分配狀態和剩餘車位
5. **第二輪處理**：針對第二車位需求進行額外分配

## 🛠️ 開發指引

### 程式碼風格
- 使用 TypeScript 嚴格模式
- 遵循 ESLint 規則
- 採用函數式 React 組件
- 使用 React Hooks 管理狀態

### 資料處理
- 使用 Zod 進行資料驗證
- 採用不可變資料更新模式
- 透過 TanStack Query 管理 API 狀態

## 📝 更新日誌

### v1.1.0 (2025-01-05)
- 修復第二輪抽籤自動繼續問題
- 重新設計開始畫面視覺元素
- 優化車位顯示功能，支援第二輪車位標示
- 改善 UI 組件的響應式設計

### v1.0.0 (2025-01-02)
- 完成基礎架構建置
- 實現雙輪抽籤機制
- 建立視覺化抽籤介面
- 支援即時狀態更新

## 🤝 參與貢獻

歡迎提交 Issue 和 Pull Request！

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 🙏 致謝

感謝所有參與開發和測試的社區成員！

---

<div align="center">
Made with ❤️ for 台北雪梨灣社區
</div>
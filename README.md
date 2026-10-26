# Jacobs’ Cozy Little Academy

可直接部署至 GitHub Pages 的靜態 3D 諮詢服務網站。無建置步驟、後端、資料庫或 API Key。

## 直接從資料夾開啟

雙擊 `index.html` 即可啟動完整 3D 教室，無須安裝套件或啟動伺服器。請保留 `services.css`、`services.js` 與完整 `js/` 資料夾的相對位置。網站已改用預先打包的一般腳本，支援 `file://`；所有 3D 幾何與貼圖均在本機產生。

## HTTP 本機預覽（選用）

在本目錄執行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

開啟 http://127.0.0.1:8765/ 。複製信箱優先使用 Clipboard API，無法使用時改用本機複製備援；若瀏覽器仍拒絕，會顯示信箱讓你手動複製。

## 檔案

- `index.html`：唯一現有首頁；四項服務詳細 HTML 完整保留。
- `services.css`：原始版型加上奶油白、木色、薄荷綠的教室與響應式視覺。
- `services.js`：switchView、data-target、Hash、popstate、Esc、信箱 Toast、預約對話框。
- `js/academy-scene.bundle.js`：已打包的執行檔，HTML 直接載入，不需 ES Modules 或網路。
- `js/academy-scene.js`：Three.js 場景、低多邊形家具及老師、Raycaster、CanvasTexture、相機補間與生活動畫。
- `js/vendor/`：本機 Three.js 0.170.0、OrbitControls 與 MIT 授權。OrbitControls 的 import 改用相對路徑。
- `backup/`：三個檔案修改前的完整備份。
- `tests/verify_content.py`：原始服務內容、Mailto 與本機資源完整性檢查。

## 操作

拖曳旋轉、滾輪縮放；手機單指旋轉、雙指縮放。點擊四個工作區會平滑聚焦並顯示原始服務摘要與收費，再點「查看完整服務」進入詳細頁。下方快速入口、文字服務卡片與所有按鈕支援鍵盤。點老師揮手並顯示歡迎訊息；點鈴鐺跳動並開啟預約視窗。四項預約選擇直接沿用對應詳細頁的原始 Mailto，寄信不等於已完成預約。

「返回總覽」恢復初始鏡頭。Esc 關閉對話框、關閉教室介紹或返回首頁。詳細頁可捲動與選取文字，也可透過 `#service-rf`、`#service-ai`、`#service-transition`、`#service-fresh` 直接開啟。

手機預設省電模式，降低像素密度、關閉陰影、限制更新頻率並減少葉片與螢幕動畫。頁面隱藏或進入詳細頁時停止場景更新。尊重 prefers-reduced-motion，停用生活動畫及相機補間。WebGL 不可用時顯示文字說明並保留全部服務入口。

## GitHub Pages

1. 將 `index.html`、`services.css`、`services.js` 和完整 `js/` 上傳到儲存庫同一層。備份、測試與 README 不影響執行，可不部署備份。
2. 在 GitHub 儲存庫的 Settings → Pages，選 Deploy from a branch。
3. 選擇放置網站檔案的分支與 `/ (root)`，儲存。
4. 部署完成後開啟 Pages 提供的網址，檢查首頁及四個 Hash 連結。

所有執行模組使用相對路徑，可部署到專案型 Pages 子目錄。若合併到其他網站，將本專案完整放進如 `consulting-academy/` 子目錄，不要覆蓋其他網站首頁。此工作目錄沒有其他首頁，也沒有需求中提及的 `index(1).html`，因此以現有 `index.html` 作為原始來源並保留備份。

## 驗證與限制

執行：

```sh
python3 tests/verify_content.py
node --check services.js
node --check js/academy-scene.js
```

已通過四項詳細服務 HTML 逐字比對、所有原始 Mailto 比對、靜態資源與模組路徑檢查，以及 JavaScript 語法檢查。瀏覽器實測成功渲染場景、四項詳細服務入口、RF 教室摘要、Hash 直接進入、Esc 返回、複製信箱成功 Toast 與四選項預約對話框；檢查時未發現 console warning/error。

尚未在實體手機、各瀏覽器與正式 GitHub Pages 環境逐一驗證。郵件客戶端是否開啟取決於使用者裝置設定；未發送測試郵件。未接線上付款或實際預約後端。Google Fonts 是可選外部字型，無網路時使用系統字型。3D 為原生幾何模型，採簡化肢體與動作，未使用大型人物模型或聊天機器人。

## 辦公室人物更新

新增兩位在前方通道散步、停留張望的顧客、一位坐在相談區的顧客，以及兩位在 RF 與 AI 工作站操作電腦的員工。員工有交錯敲鍵盤、頭部轉動與呼吸動作。人物動畫沿用頁面隱藏暫停與減少動態效果設定。

## 修改 3D 原始碼後重新打包

交付時已包含 bundle，一般開啟網站不需要執行以下指令。只有修改 `js/academy-scene.js` 後才需要重新產出：

```sh
npm exec --yes --package=esbuild@0.25.12 -- esbuild js/academy-scene.js --bundle --format=iife --target=es2020 --minify --legal-comments=linked --outfile=js/academy-scene.bundle.js
```

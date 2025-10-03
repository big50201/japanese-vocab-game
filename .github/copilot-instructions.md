## 🔥 1. 簡述

- 使用 React 開發
- 專案框架使用 [Next.js](https://nextjs.org/) 或 [Vite](https://vitejs.dev/) 視情況二選一
- 使用 Typescript 開發
- 使用 ESLint 做基本的規範檢查
- 使用 Prettier 做風格檢查
  ```json
  {
    "tabWidth": 2,
    "semi": false,
    "singleQuote": false,
    "printWidth": 160,
    "bracketSpacing": true,
    "bracketSameLine": false,
    "trailingComma": "none",
    "arrowParens": "always"
  }
  ```
- 提交至 git 的程式碼必須符合 ESLint 和 Prettier 規範
- 各專案 ESLint 規則按 [Next.js](https://nextjs.org/) 或 [Vite](https://vitejs.dev/) 預設配置，視情況做額外拓展
- 如果必須停用某 eslint 規則，請針對該規則加上名稱，例： `// eslint-disable-next-line react-hooks/exhaustive-deps`，避免停用所有規則，並且註解加上說明
- 後台專案使用 [Ant Design](https://ant.design/index-cn) 做為基礎 UI 組件與設計語言
- 每個專案在 README.md 說明可運行的穩定 nodejs 版本
- 專案打包壓縮檔給維運更新時：
  - 壓縮內容不包含最外層的資料夾
  - 命名格式: my-project-name-{M_D_HH_mm_ss}.zip
  - 靜態資源必須在 static 資料夾內 (CDN)
- 開發專案 node 版本使用 20.10.0
  - 在 package.json 配置專案的 node 版本
    ```json
    {
      "engines": {
        "node": "~20.10.0"
      }
    }
    ```
  - 在各專案的根目錄配置 .npmrc 強制限制 npm install 之前會先檢查 node 版本是否符合 package.json 要求
    ```json
    {
      "engineStrict": true
    }
    ```
- 維護 package.json 的 version 版本號，並且在網頁上將版本號展示 (和企劃討論，顯示在某個位置，或者 console.log)，版本號更新的規則參考[這裡](https://semver.org/lang/zh-TW/)
- 維護 CHANGELOG.md 紀錄每個版本的更新日誌

## 🔥 2. 命名規範

關於格式，不同情況採用不同的格式，一共有四種風格：

- 大駝峰式命名 (例: UpperCamelCase)
- 小駝峰式命名 (例: lowerCamelCase)
- 烤肉串式命名 (例: kebab-case)
- 大蛇式命名 (例: UPPER_SNAKE_CASE)

### 2.1 風格

#### 2.1.1 Javascript 變數

- 小駝峰式命名

  ```jsx
  const [userName, setUserName] = useState()
  const copyToClipboard = () => {}
  ```

#### 2.1.2 Javascript 常數

- 大蛇式命名
- 只有基本型別的值 (string, number, boolean) 為常數時，使用此方法來命名，其他 (object, array, map..) 都不算常數

  ```jsx
  const LIMIT_SIZE = 24
  ```

#### 2.1.3 Javascript React 組件

- 名稱：大駝峰式命名
- 屬性：小駝峰式命名
- Hooks: 小駝峰式命名

  ```jsx
  export default function Detail({ userName }) {
    const [state, setState] = useState("")
    return <div>{userName}</div>
  }
  ```

#### 2.1.4 Typescript 型別

- 名稱 - 大駝峰式命名
- 屬性 - 小駝峰式命名

  ```typescript
  interface UserInfo {
    name: string
    avatarUrl: string
    age: number
  }
  ```

#### 2.1.5 CSS Class

- 烤肉串式命名

  ```css
  .header {
  }
  .header-title {
  }
  .header-description {
  }
  ```

#### 2.1.6 檔案與資料夾

- 烤肉串式命名

  ```
  - src
    - components
      - header.js
      - image-viewer.js
    - utils
      - copy-to-clipboard.js
    - pages
      - homepage
        - index.js
      - about-us
        - index.js
  ```

  ```jsx
  // pages/homepage/index.js
  // import 的時候，還是根據他是什麼東西，用屬於他的方式來命名
  import ImageViewer from "@components/image-viewer"
  import copyToClipboard from "@utils/copy-to-clipboard"
  ```

#### 2.1.7 路由路徑

- 烤肉串式命名

  ```
  https://jable.tv/new-release/
  https://jable.tv/tags/short-hair/
  ```

### 2.2 內容

好的命名要有以下特徵

- 目的: 為什麼而存在，例如 `getUserName` 的目的是獲取用戶名稱
- 合約: 使用統一的字詞表達相同的概念，例如 `is` 開頭的變數應該是布林值

#### 2.2.1 布林值命名合約

- 表示某個邏輯的狀態，條件判斷，狀態標記時，以 is 開頭

  ```jsx
  const isPending = true // 表示是否正在進行某個操作
  const isRead = false // 表示是否已讀
  ```

- 表示是否擁有某種屬性或特徵時，以 has 開頭

  ```jsx
  const hasPermission = true // 表示是否具有某項權限
  const hasError = false // 表示是否存在錯誤
  ```

- 表示是否有能力或權限執行某些動作，以 can 開頭

  ```jsx
  const canEdit = true // 表示是否能夠進行編輯操作
  const canDelete = false // 表示是否能夠進行刪除操作
  ```

- 表示某個過程是否已經開始，以 start 開頭

  ```jsx
  const startLoading = true // 表示是否已經開始加載
  const startAnimation = false // 表示是否已經開始動畫
  ```

- 表示某個過程是否已經結束，以 end 開頭

  ```jsx
  const endLoading = true // 表示是否已經結束加載
  const endAnimation = false // 表示是否已經結束動畫
  ```

#### 2.2.2 函數命名的合約

- 以「動詞+名詞」格式命名

  ```jsx
  function fetchUsers() {
    // 獲取用戶
  }
  function calculateTotalPrice() {
    // 計算總價
  }
  ```

- 表示同步的獲取數據，以 get 開頭

  ```jsx
  const getUserName = () => {
    // 返回用戶名稱
  }
  const getCurrentTime = () => {
    // 返回當前時間
  }
  ```

- 表示非同步的獲取數據，以 fetch 開頭

  ```jsx
  const fetchUserById = () => {
    // 返回 promise
  }
  ```

- 表示檢查某個條件或狀態，以 validate 開頭

  ```jsx
  const validateEmail = () => {
    // 返回信箱格式是否通過驗證
  }
  ```

- 表示處理事件或操作，以 handle 開頭

  ```jsx
  const handleButtonClick = () => {
    // 處理按鈕點擊事件
  }
  const handleFormSubmit = () => {
    // 處理處理表單提交
  }
  ```

- 表示格式化數據，以 format 開頭

  ```jsx
  const formatCurrency = () => {
    // 格式化金額為貨幣格式
  }

  const formatDateForDisplay = () => {
    // 格式化日期以供顯示
  }
  ```

- 表示解析數據，以 parse 開頭

  ```jsx
  const parseMessage = () => {
    // 解析 Message 數據
  }
  ```

- 表示生成新的數據，以 generate 開頭
  ```jsx
  const generateUniqueId = () => {
    // 生成唯一標識符
  }
  ```

#### 2.2.3 陣列命名的合約

- 表示列表時，結尾加 list

  ```jsx
  const userList = []
  const newsList = []
  ```

- 表示矩陣(二維陣列)時，以 matrix 結尾
  ```jsx
  const boardMatrix = [] // 棋盤矩陣
  ```

#### 2.2.4 迴圈內命名的合約

- 使用 Array.map 或 Array.forEach 時，以該陣列名稱的單數名詞命名

  ```jsx
  cityList.map((city) => {
    // ...
  })
  ```

- 使用 for 陳述式，迴圈索引以 i, j, k ... 命名
  ```jsx
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      console.log(i, j)
    }
  }
  ```

#### 2.2.5 建立有意義的區別

- 如果有一個字詞，無論存不存在於命名裡，對於他的涵義來說沒有區別，就不應該存在
- 例如 `userData` `userInfo` `theUser` 和 `user` 在理解上沒有任何區別，那就應該命名為 `user`

<!-- TOC --><a name="226-"></a>

#### 2.2.6 參考上下文資訊簡化命名

不好 😰

```jsx
const car = {
  carBrand: "Suzuki",
  carColor: "White"
}

const Image = ({ imgSrc, imgWidth, imgHeight }) => {
  return <img src={imgSrc} width={imgWidth} height={imgHeight} />
}
```

好 😃

```jsx
const car = {
  brand: "Suzuki",
  color: "White"
}

const Image = ({ src, width, height }) => {
  return <img src={src} width={width} height={height} />
}
```

#### 2.2.7 不必要的短命名

- 不要發明其他人不能理解的單字，例如 `fName` `lName`

#### 2.2.8 不必要的長命名

- 雖然命名的表達清楚，但是涵義太多了，不好理解
- 遇到這種情況，可能不是單純的命名問題，有可能是抽象太混亂了

不好 😰

```jsx
const fetchProductsAndFilterByBrandAndRender = () => {
  // ...
}
```

好 😃

```jsx
const fetchProducts = () => {
  // ...
}
const filterProductsByBrand = () => {
  // ...
}
const renderProducts = () => {
  // ...
}
```

### 2.3 參考單字

| 常見動詞                | 常見名詞               |
| ----------------------- | ---------------------- |
| create / 新增/創建/添加 | url / 網址             |
| read / 讀取/獲取/查看   | title / 標題           |
| update / 更新/編輯      | content / 內容         |
| delete / 刪除/移除      | description / 描述     |
| generate / 生成         | container / 容器(大)   |
| destroy / 銷毀          | wrapper / 容器(中)     |
| get / 獲取              | box / 容器(小)         |
| set / 設置              | admin / 管理員         |
| open / 打開             | operator / 值班        |
| close / 關閉            | customerService / 客服 |
| download / 下載         | permission / 權限      |
| upload / 上傳           | role / 角色            |
| save / 保存             | user / 用戶            |
| load / 讀取             | account / 帳號         |
| filter / 過濾           | player / 玩家          |
| parse / 解析            | brand / 品牌           |
| convert / 轉換          | type / 類型            |
| connect / 連接          | status / 狀態          |
| calculate / 計算        | switch / 開關          |
| handle / 處理           | freeze / 凍結          |
| validate / 驗證         | search / 查詢          |
| check / 檢查            | time / 時間            |
| find / 查找             | date / 日期            |
| fetch / 提取            | phone / 手機號         |
| submit / 提交           | count / 數量           |
| receive / 領取          | record / 數據          |
| collapse / 折疊         | qrcode / 二維碼        |
| trigger / 觸發          | system / 系統          |
| toggle / 切換           | channel / 渠道         |
| export / 導出           | action / 操作          |
| reset / 重置            | range / 範圍           |
| review / 審核/審查      | history / 歷史紀錄     |
| freeze / 凍結           | detail / 詳情/明細     |
| recharge / 充值         | config / 配置          |
| withdraw / 提款         | domain / 域名          |
| bet / 投注              | template / 模板        |
|                         | order / 訂單           |
|                         | amount / 金額          |
|                         | upline / 上線          |
|                         | downline / 下線        |
|                         | income / 收入/收益     |
|                         | balance / 餘額         |
|                         | rebate / 返水          |
|                         | firstRecharge / 首充   |
|                         | total / 總額           |
|                         | prev / 前一個          |
|                         | next / 下一個          |
|                         | start / 開始           |
|                         | end / 結束             |
|                         | agent / 商戶(代理商)   |
|                         | confirm / 確認         |
|                         | cancel / 取消          |
|                         | fen / 分(金額單位)     |
|                         | yuan / 元(金額單位)    |
|                         | batch / 批次           |
|                         | rest / 剩餘            |
|                         | tip / 提示             |
|                         | notify / 通知          |
|                         | visible / 顯示         |
|                         | info / 資訊            |
|                         | method / 方式          |

## 🔥 3. 檔案結構規範

後台

```
dashboard
└── apps
  └── [project-name]
    └── src
      ├── component
      │   └── [component-name]
      │       └── index.tsx
      ├── hook
      │   └── [hook-name]
      │       └── index.ts
      ├── i18n
      │   ├── [locales]
      │   │   ├── messages.po
      │   │   └── messages.ts
      │   └── index.ts
      ├── msw
      │   ├── browser.ts
      │   └── middleware.ts
      ├── routes
      │   ├── _auth
      │   │   └── _layout
      │   │       └── [first-menu-name]
      │   │           └── [second-menu-name]
      │   │               ├── index.tsx
      │   │               ├── index.lazy.tsx
      │   │               ├── -component
      │   │               │   └── [component-name]
      │   │               │       └── index.tsx
      │   │               ├── -hook
      │   │               │   └── [hook-name]
      │   │               │       └── index.ts
      │   │               ├── -service
      │   │               │   └── [service-name]
      │   │               │       ├── index.ts
      │   │               │       ├── constants
      │   │               │       │   └── index.ts
      │   │               │       ├── hook
      │   │               │       │   ├── index.ts
      │   │               │       │   └── [hook-name].ts
      │   │               │       ├── type
      │   │               │       │   └── index.ts
      │   │               │       ├── schema
      │   │               │       │   └── index.ts
      │   │               │       └── mock
      │   │               │           └── index.ts
      │   │               └── -util
      │   │                   └── index.tsx
      │   └── -service
      │        └── [service-name]
      │             ├── index.ts
      │             ├── constant
      │             │   └── index.ts
      │             ├── hook
      │             │   ├── index.ts
      │             │   └── [hook-name].ts
      │             ├── type
      │             │   └── index.ts
      │             ├── schema
      │             │   └── index.ts
      │             └── mock
      │                 └── index.ts
      ├── service
      │    └── [service-name]
      │        ├── index.ts
      │        ├── constant
      │        │   └── index.ts
      │        ├── hook
      │        │   ├── index.ts
      │        │   └── [hook-name].ts
      │        ├── type
      │        │   └── index.ts
      │        ├── schema
      │        │   └── index.ts
      │        └── mock
      │            └── index.ts
      ├── store
      │   └── [store-files]
      │       └── index.ts
      ├── type
      │   └── index.ts
      └── util
        └── [utility-functions]
            └── index.ts

```

通用套件

```
└── packages
  ├── configs
  │   ├── eslint
  │   │   └── index.mjs
  │   ├── tailwindcss
  │   │   └── antd-color.css
  │   ├── typescript
  │   │   └── index.json
  │   └── vite
  │       └── index.mjs
  ├── utils
  │   ├── src
  │   │    ├── [utils-name]
  │   │        └── index.ts | index.tsx
  ├── antd-ex
  │   ├── src
  │   │   ├── component
  │   │   │   └── [component-name]
  │   │   │       └── index.tsx
  │   │   ├── layout
  │   │   │   └── index.tsx
  │   │   └── index.tsx
  │   └── hook
  │       └── [hook-name]
  │           └── index.ts
  └── types
      ├── index.ts
      └── package.json
```

聊天室

```
my-app
├── node_modules
├── public
└── src
    ├── assets
    │   ├── aaa.jpg
    │   └── bbb.mp4
    ├── components
    │   ├── core
    │   │   ├── modal
    │   │   │   ├── index.tsx
    │   │   │   └── modal.tsx
    │   │   ├── spinner
    │   │   │   ├── index.tsx
    │   │   │   └── spinner.tsx
    │   │   ├── stepper
    │   │   │   ├── index.tsx
    │   │   │   └── stepper.tsx
    │   │   └── image-viewer
    │   │       ├── index.tsx
    │   │       └── image-viewer.tsx
    │   ├── page
    │   │   ├── customer
    │   │   │   ├── index.tsx
    │   │   │   └── customer.tsx
    │   │   └── service
    │   │       ├── index.tsx
    │   │       └── service.tsx
    │   └── feature
    │       ├── header
    │       │   ├── index.tsx
    │       │   └── header.tsx
    │       ├── chat-window
    │       │   ├── index.tsx
    │       │   ├── chat-window.tsx
    │       │   ├── hooks
    │       │   │   ├── use-show-latest-message.tsx
    │       │   │   └── use-set-last-proof-card-id.tsx
    │       │   ├── components
    │       │   │   └── draggable-service-button.tsx
    │       │   └── utils
    │       │       └── convert-message.ts
    │       ├── chat-form
    │       │   ├── index.tsx
    │       │   └── chat-form.tsx
    │       ├── message
    │       │   ├── index.tsx
    │       │   ├── confirm-card
    │       │   │   └── index.tsx
    │       │   ├── finish-card
    │       │   │   └── index.tsx
    │       │   ├── ship-card
    │       │   │   └── index.tsx
    │       │   ├── proof-card
    │       │   │   └── index.tsx
    │       │   ├── image
    │       │   │   └── index.tsx
    │       │   ├── text
    │       │   │   └── index.tsx
    │       │   ├── video
    │       │   │   └── index.tsx
    │       │   ├── system-text
    │       │   │   └── index.tsx
    │       │   ├── provider
    │       │   │   └── index.tsx
    │       │   └── wrapper
    │       │       └── index.tsx
    │       ├── modal
    │       │   ├── index.tsx
    │       │   ├── account-select
    │       │   │   └── index.tsx
    │       │   ├── buyer-transfer-finish
    │       │   │   └── index.tsx
    │       │   ├── cancel-order
    │       │   │   └── index.tsx
    │       │   ├── confirm
    │       │   │   └── index.tsx
    │       │   ├── order-error
    │       │   │   └── index.tsx
    │       │   ├── rating
    │       │   │   └── index.tsx
    │       │   ├── stop-order
    │       │   │   └── index.tsx
    │       │   └── transfer-check
    │       │       └── index.tsx
    │       └── fallback-loading
    │           └── index.tsx
    ├── utils
    │   ├── upload-image.ts
    │   └── get-image-size.ts
    ├── hooks
    │   ├── use-window-size.ts
    │   └── use-input.ts
    ├── services
    ├── store
    ├── styles
    └── config
        ├── theme.ts
        └── routes.ts
```

## 🔥 4. 程式碼規範

### 4.1 HTML

- 如果不需要 favicon，請在 HTML 的 `<head>` 裡增加 `<link rel="icon" href="data:;base64,=">` 避免向伺服器請求圖示

#### 4.1.1 結構與內容分離

不好 😰

```html
<div class="container">
  <img class="content" src="img.jpg" />
  <img class="content" src="img.jpg" />
  <img class="content" src="img.jpg" />
</div>
```

好 😃

```html
<div class="container">
  <div class="row">
    <div class="col">
      <img class="content" src="img.jpg" />
    </div>
    <div class="col">
      <img class="content" src="img.jpg" />
    </div>
    <div class="col">
      <img class="content" src="img.jpg" />
    </div>
  </div>
</div>
```

### 4.2 CSS

- 避免作用域污染問題
- 避免行內樣式
- 避免不必要的 `!important`

- 關於後台專案

  - 使用 antd 開發
  - 調整 antd 組件樣式，參考[定制主題](https://ant.design/docs/react/customize-theme-cn)
  - 不要修改 antd 提供的 class 樣式屬性
  - 如果 antd 提供的定制方式不能滿足需求，使用 Tailwind CSS 輔助，並且配置以下功能
    - 設定 [preflight](https://tailwindcss.com/docs/preflight) 為 false 停用 CSS 初始化
    - 設定 [important](https://tailwindcss.com/docs/configuration#important) 為 true 或是 #root 提高優先級
  - 後台不需要考慮行動裝置，視 1280px 為最小裝置寬度設計 RWD

- 關於非後台專案

  - 使用 Tailwind CSS 開發

#### 4.2.1 RWD

- 行動裝置優先：由小寫到大

```css
.text {
  font-size: 12px;
}

@media (min-width: 640px) {
  .text {
    font-size: 16px;
  }
}

@media (min-width: 1280px) {
  .text {
    font-size: 24px;
  }
}
```

#### 4.2.2 Tailwind CSS 配合classNames 工具

- 使用 @repo/utils 中的 classNames 函數組合樣式
- 利用條件判斷動態套用樣式
- 保持樣式代碼的可讀性和維護性

不好 😰

```javascript
// 直接字串拼接，難以閱讀和維護
<div className={`{otherProps.className ?otherProps.className:"text-blue-6"`} />
```

```javascript
// 多個三元運算符嵌套，可讀性差

<div
  className={`
    w-[300px]
    ${isActive ? "bg-blue-5" : "bg-gray-2"}
    ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-6"}
    ${size === "large" ? "px-6 py-3" : size === "small" ? "px-2 py-1" : "px-4 py-2"}
  `}
/>
```

好 😃

```typescript
import { classNames } from "@repo/utils"

// 使用 classNames 組合基礎樣式和條件樣式

<div
  className={classNames(
    "w-[300px]", // 基礎樣式
    {
       "opacity-50": isDisabled
    },
    otherProps.className // 外部傳入的樣式覆蓋
  )}
/>

// 複雜條件樣式的清晰組織

<div
  className={classNames(
    // 基礎樣式
    "transition-all duration-200 rounded-lg",
    // 狀態樣式
    {
      "bg-blue-5 text-white": isActive,
      "bg-gray-2 text-gray-7": !isActive,
      "opacity-50 cursor-not-allowed": isDisabled,
      "hover:bg-blue-6": !isDisabled && isActive,
      "hover:bg-gray-3": !isDisabled && !isActive
    },
    // 尺寸樣式
    {
      "px-6 py-3 text-lg": size === "large",
      "px-2 py-1 text-sm": size === "small",
      "px-4 py-2": size === "medium"
    },
    // 外部樣式
    className
  )}
/>
```

#### 4.2.3 Tailwind CSS 類別偵測規範

- **核心原則：使用完整類別名稱** - Tailwind 會掃描原始檔案尋找類別名稱，必須確保類別名稱完整存在於代碼中
- **避免動態字串拼接** - 透過字串拼接或模板字面量插值構建的類別名稱無法被 Tailwind 偵測到

不好 😰

```javascript
// 動態拼接，Tailwind 無法偵測到完整類別名稱
const DEFAULT_WIDTH = 300
className={`w-[${DEFAULT_WIDTH}px]`}

// 使用變數構建類別名稱
const color = "red"
className={`bg-${color}-500`}

// 複雜的動態組合
className={`text-${error ? 'red' : 'green'}-600`}
```

好 😃

```typescript
// 定義完整的類別名稱常數
const DEFAULT_CLASSNAME = "w-[300px]"
className={DEFAULT_CLASSNAME}

// 使用對象映射完整類別名稱
const colorVariants = {
  red: "bg-red-5 text-white",
  green: "bg-green-5 text-white",
  blue: "bg-blue-5 text-white"
} as const

function ButtonTest({ color }: { color: keyof typeof colorVariants }) {
  return <button className={colorVariants[color]}>Click me</button>
}

// 組合完整類別名稱
const buttonVariants = {
  size: {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg"
  },
  variant: {
    primary: "bg-blue-6 hover:bg-blue-7 text-white",
    secondary: "bg-gray-2 hover:bg-gray-3 text-gray-9"
  }
} as const

<button className={classNames(
  "transition-all duration-200 rounded",
  buttonVariants.size[size],
  buttonVariants.variant[variant]
)}>
  Button
</button>
```

**處理動態需求的建議：**

```typescript
// 如果確實需要動態類別，使用 Tailwind 的 safelist 功能
// 在 CSS 中明確指定需要生成的類別
// @source inline("w-[100px] w-[200px] w-[300px] w-[400px]")

// 或者定義涵蓋所有可能值的完整映射
const widthVariants = {
  100: "w-[100px]",
  200: "w-[200px]",
  300: "w-[300px]",
  400: "w-[400px]"
} as const

function DynamicWidth({ width }) {
  return <div className={widthVariants[width]} />
}
```

### 4.3 Javascript

- 遵守各專案的 eslint 和 prettier 規範
- 正確性 > 可讀性 > 效能
- React 不使用 Class Component

#### 4.3.1 合理的抽象化

- 抽象化需要平衡，避免過度抽象與抽象不足
- 抽象化的目的是
  - 更好的可讀性: 組織清晰，使程式碼更容易閱讀理解
  - 更好的可維護性: 邏輯獨立，有更清楚的職責與關注點分離
  - 更好的重用性: 提取可重複使用的邏輯
  - 更好的可測試性: 單元測試
- 在 React 裡，抽象化的主要手段有三種
  - 函數：JS 邏輯
  - 自定義 Hook：JS 邏輯 + React 狀態操作邏輯 + 副作用
  - 組件：JS 邏輯 + React 狀態操作邏輯 + 副作用 + UI

不好 😰

```jsx
function UserList() {
  const [users, setUsers] = useState([])
  const [value, setValue] = useState("")

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
      })
  }, [])

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(value.toLowerCase())
  })

  return (
    <div>
      <input value={value} onChange={onChange} />
      <div>
        {filteredUsers.map((user) => (
          <div>{user.name}</div>
        ))}
      </div>
    </div>
  )
}
```

好 😃

```jsx
// 專注於處理表單輸入
function useInput(initialValue) {
  const [value, setValue] = useState(initialValue)
  const handleChange = (e) => {
    setValue(e.target.value)
  }
  return [value, handleChange]
}

// 專注於獲取用戶數據
function useUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
      })
  }, [])

  return users
}

// 專注於用戶數據的篩選
function filterUsersByName(users, name) {
  return users.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()))
}

// 清晰分工的主組件
function UserList() {
  const [value, handleChange] = useInput("")
  const users = useUsers()
  const filteredUsers = filterUsersByName(users, value)

  return (
    <div>
      <input value={value} onChange={handleChange} />
      <div>
        {filteredUsers.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </div>
  )
}
```

#### 4.3.2 增強函數純度，盡量設計純函數

- 輸入同一個參數，永遠都會回傳相同的結果
- 沒有副作用，例如: API 請求，偵測系統裝置，修改函數外部資料
- 提升函數的可預測性與可測試性

不好 😰

```jsx
let value = 0
const add = (num) => {
  value += num
  return value
}
add(1)
console.log(value) // 1
```

好 😃

```jsx
const add = (a, b) => a + b
const value = 0
const newValue = add(1)
console.log(newValue) // 1
```

#### 4.3.3 增強不可變性，盡量保證變數不會被修改

不好 😰

```jsx
const originalArray = [1, 2, 3]
const newArray = originalArray
newArray.push(4)

console.log(originalArray) // [1, 2, 3, 4]
console.log(newArray) // [1, 2, 3, 4]
```

好 😃

```jsx
const originalArray = [1, 2, 3]
const newArray = [...originalArray, 4]

console.log(originalArray) // [1, 2, 3]
console.log(newArray) // [1, 2, 3, 4]
```

或者也可以這樣 😃

```jsx
function add(array, value) {
  const result = array.slice(0)
  result.push(value)
  return result
}
// 主線任務上保持不可變性
const originalArray = [1, 2, 3]
const newArray = add(originalArray, 4)
console.log(originalArray)
console.log(newArray)
```

#### 4.3.4 將不依賴狀態的變數提升至組件外

不好 😰

```jsx
const App = () => {
  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Age",
      dataIndex: "age"
    }
  ]
  return <Table columns={columns} dataSource={dataSource} />
}
```

好 😃

```jsx
const columns = [
  {
    title: 'Name',
    dataIndex： 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age'
  }
]

const App = () => {
  const [dataSource, setDataSource] = useState([])
  return <Table columns={columns} dataSource={dataSource} />
}
```

#### 4.3.5 封裝複雜的判斷條件

- 四個以上的條件需要封裝
- 封裝的函數要具有描述性的名稱

不好 😰

```jsx
if (status === "finish" && !isEmpty(data) && data.length > 0 && && data.length < 10 ) {
  // ...
}
```

好 😃

```jsx
const shouldShowData = (status, data) => {
  return status === "finish" && !isEmpty(data) && data.length > 0 && && data.length < 10;
};

if (shouldShowData(status, data)) {
  // ...
}
```

#### 4.3.6 減少不必要的狀態與副作用

不好 😰

```jsx
function App() {
  const data = useDataSource()
  const [showData, setShowData] = useState([])

  useEffect(() => {
    if (data.length > 10) {
      setShowData(true)
    } else {
      setShowData(false)
    }
  }, [data])

  return <div>{showData && <p>{data}</p>}</div>
}
```

好 😃

```jsx
function App() {
  const data = useDataSource()
  const showData = data.length > 10

  return <div>{showData && <p>{data}</p>}</div>
}
```

#### 4.3.7 定義常數(魔術數字)

不好 😰

```jsx
function convertSecondsToMinutes(seconds) {
  return seconds / 60
}
```

好 😃

```jsx
const SECONDS_PER_MINUTE = 60
function convertSecondsToMinutes(seconds) {
  return seconds / SECONDS_PER_MINUTE
}
```

#### 4.3.8 什麼時候需要 useCallback

- 傳遞給子組件

  ```jsx
  const ParentComponent = () => {
    const handleClick = useCallback(() => {}, [])
    return <ChildComponent onClick={handleClick} />
  }

  const ChildComponent = ({ onClick }) => {
    return <button onClick={onClick}>Click me</button>
  }
  ```

- 使用在 useEffect 的依賴列表中

  ```jsx
  const ExampleComponent = () => {
    const fetchData = useCallback(async () => {}, [])

    useEffect(() => {
      fetchData()
    }, [fetchData])

    return <div>Example Component</div>
  }
  ```

#### 4.3.9 什麼時候需要 useMemo

- 計算效能消耗比較大的值

  ```jsx
  const MyComponent = ({ data }) => {
    const expensiveValue = useMemo(() => {
      // 假設這段程式碼效能消耗很大
      return computeExpensiveValue(data)
    }, [data])
  }
  ```

- 傳遞給子組件 (引用類型的值)

  ```jsx
  const ParentComponent = () => {
    const stringValue = "Hello, world!"
    const numberValue = 42
    const arrayValue = useMemo(() => {
      return [1, 2, 3]
    })
    return <ChildComponent stringValue={stringValue} numberValue={numberValue} arrayValue={arrayValue} />
  }
  ```

- 使用在 useEffect 的依賴列表中 (引用類型的值)

  ```jsx
  const ExampleComponent = () => {
    const arrayValue = useMemo(() => [1, 2, 3])

    useEffect(() => {
      console.log(arrayValue)
    }, [arrayValue])

    return <div>Example Component</div>
  }
  ```

#### 4.3.8使用 zod default 代替可選串連 (?.)

- 優先使用 zod 的 `.default()` 來處理 undefined 或 null 值，提供更強的型別安全和資料驗證

  好 😃

  ```typescript
  import { z } from "zod"

  // - 使用 zod default 提供預設值和型別安全
  const userSchema = z.object({
    name: z.string(),
    email: z.string().default("system@mail.com"),
    preferences: z
      .object({
        theme: z.string(),
        notifications: z.boolean()
      })
      .default({
        theme: "light",
        notifications: false
      })
  })

  // API 回應資料可能不完整
  const apiResponse = {
    name: "John",
    age: 32
    // preferences 可能 undefined
  }

  const user = userSchema.parse(apiResponse)
  // user 現在有完整的型別和預設
  console.log(user.preferences.theme) // "light"
  console.log(user.email) // "system@mail.com"
  ```

  不好 😰

  ```typescript
  //  - 使用可選串連但缺乏型別安全
  const user = apiResponse
  const age = user?.age ?? 0
  const theme = user?.preferences?.theme ?? "light"
  // 需要手動處理每個可能的 undefined 值
  ```

- 可選串連 (?.) 適合在無法使用 zod 或需要簡單存取的情況
- 選取的屬性值有可能是 undefined 或 null 時

  ```javascript
  getUserList().then((response) => {
    // 假設我們可以確定 response.data 存在，但不一定有 response.data.user
    const list = response.data.user?.list
  })
  ```

- 選取的陣列特定元素可能是 undefined 或 null 時

  ```javascript
  const arr = [1, 2, 3]
  const myNumber = arr?.[99]
  ```

### 4.4 Typescript

- 使用 5.x 版本
- 定義型別優先使用 interface，需要 type 功能時才使用
- 不使用 React.FC 定義 Functional Component
- 定義 React Component children 類型時，使用 `ReactNode`
- 減少使用 any 類型，優先使用具體的類型。在必要 any 時，優先考慮使用 unknown

#### 4.4.1 依賴型別推論

不好 😰

```tsx
const LIMIT: number = 100

const App = () => {
  const [visible, setVisible] = useState<boolean>(false)
}
```

好 😃

```tsx
const LIMIT = 100

const App = () => {
  const [visible, setVisible] = useState(false)
}
```

#### 4.4.2 使用 React ComponentProps 協助定義類型

- 可以減少大量的類型重定義，以及尋找外部程式庫的類型
- 更多用法[在這裡](https://react-typescript-cheatsheet.netlify.app/docs/react-types/componentprops/)

不好 😰

```tsx
interface Props {
  visible: boolean // 自己定義的，其他的都是 HTML video 的屬性
  src: string
  width: number
  height: number
  autoPlay: boolean
  loop: boolean
  muted: boolean
  playsInline: boolean
  poster: string
  preload: string
  className: string
}

const Video = (props: Props) => {
  const { visible, ...rest } = props
  return visible ? <video {...rest} /> : null
}
```

好 😃

```tsx
import { ComponentProps } from "react"

interface Props extends ComponentProps<"video"> {
  visible: boolean
}

const Video = (props: Props) => {
  const { visible, ...rest } = props
  return visible ? <video {...rest} /> : null
}
```

#### 4.4.3 什麼時候需要斷言

- 先考慮能不能以 satisfies 替代斷言，如果可以，satisfies 是更好的選擇
- 如果 TypeScript 無法給你正確的型別推論，但你知道正確是什麼的時候，就需要斷言
- 例如：選取 html 元素的時候
  ```typescript
  const myCanvas = document.getElementById("my-canvas") as HTMLCanvasElement
  ```
- 例如：過濾聯合型別值的時候

  ```typescript
  type Male = {
    name: string
    sex: 0
    length: number
  }

  type Female = {
    name: string
    sex: 1
    size: string
  }

  type Person = Male | Female

  const personList: Person[] = [
    {
      name: "mike",
      sex: 0,
      length: 30
    },
    {
      name: "bling",
      sex: 1,
      size: "F"
    }
  ]

  personList
    .filter((person) => {
      return person.sex === 1
    })
    .forEach((person) => {
      console.log(person.size) // 報錯: 類型 Male 沒有屬性 size
    })

  personList
    .filter((person): person is Female => {
      return person.sex === 1
    })
    .forEach((person) => {
      console.log(person.size) // 現在 TypeScript 知道這是 Female 類型
    })
  ```

#### 4.4.4 什麼時候使用 enum

- 有限且固定的值：例如表示一周的日子、權限代號
- 需要自動編號
- 當作型別定義使用

  ```typescript
  enum Days {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
  }
  const day: Days = 0
  ```

  ```typescript
  enum Days {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
  }
  interface Weekend {
    day: Days.Saturday | Days.Sunday
  }
  const weekend: Weekend = {
    day: 0
  }
  ```

  <!-- TOC --><a name="-6-"></a>

## 🔥 5. TanStack Query (React Query) 使用規範

#### 核心概念

- **伺服器狀態管理**：TanStack Query 專門用於管理伺服器狀態（非同步資料），包括資料的獲取、快取、同步和更新。
- **快取機制**：它會自動快取查詢結果，並在背景重新獲取過期資料（stale-while-revalidate），提升應用程式的響應速度和使用者體驗。
- **請勿用於客戶端狀態**：對於表單狀態、彈窗開關等純客戶端狀態，應繼續使用 `useState` 或 `Zustand` 等工具。

#### Query Keys 規範

- **唯一性與結構化**：`queryKey` 是查詢的唯一標識符，也是快取的核心。它必須是一個陣列。

- **包含所有依賴**：`queryKey` 必須包含所有會影響查詢結果的變數。當這些變數改變時，React Query 會自動重新查詢。

#### Query 選項規範

- **enabled**：控制查詢是否自動執行的布林值。當設為 `false` 時，查詢不會自動執行，需要手動觸發。常用於條件查詢或依賴其他狀態的查詢。

  ```typescript
  const { data } = useQuery({
    queryKey: ["brand-config", params],
    queryFn: () => fetchBrandConfig(params),
    enabled: tableParams.enabled // 只有在 table 啟用時才執行查詢
  })
  ```

- **signal**：用於在查詢被取消時中止請求，避免記憶體洩漏和不必要的網路請求。React Query 會自動提供這個參數，並在組件卸載或查詢被替換時觸發取消操作。

  ```typescript
  // 在 queryFn 中正確使用 signal
  queryFn: async ({ signal }) => {
    return await fetcher(
      {
        method: "get",
        url: "/api/todos",
        signal // 將 signal 傳遞給 HTTP 請求
      },
      schema
    )
  }
  ```

  **重要性**：

  - **防止記憶體洩漏**：當組件卸載但請求仍在進行時，signal 會中止請求
  - **避免競態條件**：當新查詢觸發時，舊查詢會被自動取消
  - **提升效能**：減少不必要的網路請求和資料處理

  #### signal 在 TanStack Query 和 API 中的使用規範

  - **React Query 自動管理**：React Query 會在適當時機（組件卸載、查詢條件改變、手動取消等）自動觸發 signal
  - **在 fetcher 中使用**：將 signal 參數傳遞給底層的 HTTP 請求庫（如 axios、fetch）
  - **不需要手動處理**：開發者不需要手動建立或管理，React Query 會自動處理

#### Query Functions (`queryFn`) 規範

- **保持簡潔**：`queryFn` 的職責是**非同步獲取資料並返回一個 Promise**。將複雜的資料轉換邏輯移出 `queryFn`。
- **錯誤處理**：`queryFn` 中不需要 `try/catch`。如果請求失敗，直接讓 Promise `reject`。React Query 會自動捕獲錯誤並將其儲存在 `error` 狀態中。

好 😃

```typescript
const readTodos = async () => {
  return await fetcher(
    {
      method: "get",
      url: "/api/todos"
    },
    schema
  )
}
```

不好 😰

```typescript
const readTodos = async () => {
  try {
    const response = await fetcher(
      {
        method: "get",
        url: "/api/todos"
      },
      schema
    )
  } catch (error) {
    // 不要在 queryFn 中處理錯誤或返回 null
    console.error(error)
    return null
  }
}
```

#### Mutations (`useMutation`) 規範

- **用於資料變更**：使用 `useMutation` 執行任何會**建立、更新或刪除**伺服器資料的操作。
- **同步快取**：在 `mutation` 成功後，使用專用的 `refresh` hooks 來刷新相關查詢，實現 services 間的自動聯動。

  ```typescript
  // brand-config/-services/delete-brand-config/hook/index.ts
  import { useRefresh as useRefreshBrandConfig } from "../read-brand-config/hook"
  import { useRefresh as useRefreshOtherData } from "../read-other-data/hook"

  const { mutate } = useMutation({
    mutationFn: deleteBrandConfig,
    onSuccess: () => {
      // 刷新相關的查詢資料，services 間自動聯動
      useRefreshBrandConfig()
      useRefreshOtherData()
    }
  })
  ```

#### 封裝為自定義 Hooks

- **提高重用性**：將 `useQuery` 和 `useMutation` 封裝在自定義 Hooks 中，便於在不同組件中重用，並統一管理 `queryKey` 和 `queryFn`。
- **命名規範**：

  - 查詢 Hooks: `useRead[Resource]`，例如 `useReadTodos`。
  - 變更 Hooks: `use[Action][Resource]`，例如 `useCreateTodo`。

  ```typescript
  // service/hook/use-read-todos/index.ts
  export const useReadTodos = (params) => {
    return useQuery({
      enabled: params.enabled,
      queryKey: ["todos", params],
      queryFn: async ({ signal }) => {
        return await fetcher(
          {
            method: "get",
            url,
            signal,
            params
          },
          schema
        )
      }
    })
  }

  // service/hook/use-create-todo/index.ts
  export const useCreateTodo = () => {
    const refreshTodos = useRefreshTodos()
    const mutation = useMutation({
    mutationFn: async (params: {id:number,title:string}) =>{
      return await fetcher(
        {
          method: "post",
          url: `${url}`,
          data:  {
            id: params.id
            title: params.title
          }
        },
        schema
      )
    },
    onSuccess: () => {
      refreshTodos()
      }
    })
  }
  ```

#### Refresh Hook 規範 (`generateRefreshHook`)

- **目的**：為每個查詢 service 產生專用的 refresh hook，實現 services 間的自動聯動，避免在 React 組件中手動管理資料刷新。
- **實作方式**：使用 `generateRefreshHook` 工具函數來產生 `useRefresh` hook。
- **QueryKey 匹配**：只要 `queryKey` 陣列中有任一元素匹配，就會觸發刷新。建議每個 service 的第一個 key 保持唯一性。

```typescript
// read-brand-config/hook/index.ts
import { generateRefreshHook } from "@/utils/generate-refresh-hook"

export const useBrandConfigQuery = (params) => {
  return useQuery({
    queryKey: ["brand-config", params], // 第一個 key 'brand-config' 用於 refresh hook 匹配
    queryFn: () => fetchBrandConfig(params)
  })
}

// 產生專用的 refresh hook
export const useRefresh = generateRefreshHook(["brand-config"])
```

```typescript
// delete-brand-config/hook/index.ts
import { useRefresh as useRefreshBrandConfig } from "../read-brand-config/hook"
import { useRefresh as useRefreshOtherData } from "../read-other-data/hook"

export const useDeleteBrandConfig = () => {
  return useMutation({
    mutationFn: deleteBrandConfig,
    onSuccess: () => {
      // Services 間自動聯動，刷新相關查詢
      useRefreshBrandConfig()
      useRefreshOtherData()
    }
  })
}
```

- **優勢**：
  - Services 間的依賴關係在 service 層面處理，組件無需關心
  - 避免在組件中尋找 parent/children 來手動觸發重新 fetch
  - 更清晰的責任分離和更好的可維護性

## 🔥 6.Git 提交規則

本專案採用 [慣例式提交 (Conventional Commits)](https://www.conventionalcommits.org/zh-hant/v1.0.0/) 規範。

#### 提交格式

```
<類型>[可選的作用範圍]: <描述>

[可選的正文]

[可選的頁腳]
```

#### 提交類型

- **feat**: 新增功能
- **fix**: 修復bug
- **docs**: 文件更新
- **style**: 代碼格式調整（不影響程式邏輯）
- **refactor**: 重構（既非新增功能，也非修復錯誤）
- **perf**: 性能優化
- **test**: 增加或修改測試
- **build**: 修改建置系統或外部依賴（如 webpack、npm）
- **ci**: 修改 CI 配置檔案和腳本
- **chore**: 其他不修改 src 或測試檔案的更動
- **revert**: 回退先前的提交

#### 重大變更

- 使用 `!` 標示：`feat!:` 或 `fix!:`
- 或在頁腳使用 `BREAKING CHANGE:` 說明
- 重大變更對應語意化版本的 MAJOR

#### 語意化版本對應關係

本專案遵循 [語意化版本控制 (Semantic Versioning)](https://semver.org/lang/zh-TW/) 規範。

**版本號格式**：`主版本號.次版本號.修訂號` (例如：`1.2.3`)

| 提交類型          | 版本號影響 | 說明                 | 範例              |
| ----------------- | ---------- | -------------------- | ----------------- |
| `fix:`            | **PATCH**  | 修復錯誤，向後相容   | `1.0.0` → `1.0.1` |
| `feat:`           | **MINOR**  | 新增功能，向後相容   | `1.0.0` → `1.1.0` |
| `BREAKING CHANGE` | **MAJOR**  | 重大變更，不向後相容 | `1.0.0` → `2.0.0` |

**實際應用範例**：

```bash
# 修復錯誤 → 版本從 1.2.3 升為 1.2.4
fix: 修復登入按鈕無法點擊的問題

# 新增功能 → 版本從 1.2.4 升為 1.3.0
feat: 新增用戶頭像上傳功能

# 重大變更 → 版本從 1.3.0 升為 2.0.0
feat!: 重構 API，移除舊版登入接口

BREAKING CHANGE: 舊版 /api/login 已移除，請使用 /api/v2/auth
```

**重大變更的判斷標準**：

- 移除或修改現有 API
- 更改函數參數或回傳值結構
- 移除組件的 props 或更改其行為
- 更改資料庫結構或格式
- 任何會導致現有程式碼無法正常運作的變更

#### 範例

**基本提交**：

```
feat: 新增用戶登入功能
fix: 修復表單驗證錯誤
docs: 更新 API 文件
```

**包含作用範圍**：

```
feat(登入頁面): 新增 OAuth 登入支援
fix(parser): 修復陣列解析問題
```

**重大變更**：

```
feat!: 移除舊版 API 支援

BREAKING CHANGE: 舊版 API 已不再支援，請使用新版 API
```

**回退提交**：

```
revert: 回退登入功能

Refs: 676104e, a215868
```

#### 規範要點

1. 提交訊息必須清晰明瞭，描述所做的更改。
2. 每次提交應專注於一個功能或修復，避免混合多個更改。
3. 使用 `git rebase -i` 清理提交歷史，確保提交訊息符合規範。
4. 若提交包含重大變更，需在頁腳中加入 `BREAKING CHANGE` 說明。
5. 使用 `git squash` 合併多個提交，保持提交歷史簡潔。

# fukugem_website

# 📂 專案結構說明

## 🌐 前台頁面 (公開頁面)

`src/pages/public/HomePage.tsx` | 首頁 - 顯示文章列表、分類篩選 |
`src/pages/public/ArticleView.tsx` | 文章詳情頁 - 顯示完整文章內容 |
`src/pages/public/TaggedArticles.tsx` | 標籤文章頁 - 顯示特定標籤的文章 |

---

## 🔐 後台頁面 (管理員頁面)

`src/pages/admin/Login.tsx` | 登入頁面 |
`src/pages/admin/Dashboard.tsx` | 管理員儀表板 |

---

## 🧩 共用組件

### 前台佈局組件

`src/components/public/Layout.tsx` | 前台頁面佈局 (導航、頁尾) |
`src/components/public/RichTextEditor.tsx` | 富文本編輯器 |

### 後台佈局組件


`src/components/admin/AdminLayout.tsx` | 後台頁面佈局 (側邊欄、導航) |
`src/components/admin/ProtectedRoute.tsx` | 路由保護 (檢查登入狀態) |

---

## 🛠 核心功能檔案

`src/App.tsx` | 主應用程式、路由設定 |
`src/hooks/useBlogData.ts` | 部落格資料的 CRUD 操作 |
`src/auth/AuthContext.tsx` | 管理員登入驗證 |
`src/types/blog.ts` | TypeScript 類型定義 |

---

## 🎨 樣式與配置

`src/index.css` | 全域樣式、日式風格定義 |
`tailwind.config.js` | Tailwind CSS 配置 |
`index.html` | HTML 模板 |




1. 文章管理 (/admin/articles)

文章列表（已發布/草稿）
新增文章
編輯文章
刪除文章
發布/取消發布

2. 分類管理 (/admin/categories)

分類列表
新增分類 (主分類、子分類)
編輯分類（名稱、描述、顏色）
刪除分類

先修改資料結構 (types/blog.ts, useBlogData.ts)
建立分類管理頁面 (CategoriesManagement.tsx)
更新路由 (App.tsx)
修改前台導航 (Layout.tsx)
調整首頁邏輯 (HomePage.tsx)

3. 標籤管理 (/admin/tags)

標籤列表（顯示使用次數）
編輯標籤名稱
刪除標籤
合併標籤



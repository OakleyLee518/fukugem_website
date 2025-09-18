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


先修改資料結構 (types/blog.ts, useBlogData.ts)
建立分類管理頁面 (CategoriesManagement.tsx)
更新路由 (App.tsx)
修改前台導航 (Layout.tsx)
調整首頁邏輯 (HomePage.tsx)
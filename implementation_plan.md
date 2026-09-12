# Refactoring Implementation Plan: Campus Lost & Found MVP

## Goal
Streamline and refactor the existing codebase into a simple, reliable **Campus Lost & Found MVP** for the **AWS Deploy Your First App Weekend Challenge**, using strictly **React + Tailwind CSS + AWS Amplify + Amazon DynamoDB**.

---

## 1. Scope & Service Simplification

| Feature / Service | Status | Action |
| :--- | :--- | :--- |
| **AWS Amplify** | ✅ Keep | Deployment & Hosting configuration ([amplify.yml](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/amplify.yml)) |
| **Amazon DynamoDB** | ✅ Keep | Single Table schema `CampusLF_Items` for reports |
| **Amazon Cognito** | ❌ Remove | Replace with simple local profile / inline reporter info |
| **Amazon S3** | ❌ Remove | Use optional image URL or standard category icons |
| **Claims System** | ❌ Remove | Replace with simple **Contact Reporter** modal/info |
| **Admin Dashboard** | ❌ Remove | Unnecessary for MVP; remove `/admin` route & page |
| **Messaging System** | ❌ Remove | Unnecessary for MVP; remove chat/inbox logic |

---

## 2. Refactoring Steps

### Phase 1: Clean Data Layer & DynamoDB Helper ([src/data/mockData.js](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/data/mockData.js))
- Standardize item schema:
  `itemId`, `type` (`LOST`|`FOUND`), `itemName`, `category`, `description`, [date](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/pages/ReportItemPage.jsx#56-67), `location`, `color`, `brand`, `identifyingFeatures`, `status` (`ACTIVE`|`RESOLVED`), `reporterName`, `reporterContact`, `createdAt`, `updatedAt`.
- Provide seamless DynamoDB integration helper with graceful localStorage fallback when offline/demo.
- Keep statuses simple: `ACTIVE` and `RESOLVED`.

### Phase 2: Navigation & Header Refactoring ([src/components/layout/Header.jsx](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/components/layout/Header.jsx))
- Streamline header nav: **Home**, **Browse Items**, **Report Lost**, **Report Found**, **My Reports**.
- Remove Admin link, Login/Register pages if not needed, or replace with simple local profile switch.

### Phase 3: Home & Landing Page ([src/pages/LandingPage.jsx](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/pages/LandingPage.jsx))
- Keep existing clean hero section, quick search bar, statistics, and 3-step guide.
- Update CTAs: *Report Lost Item*, *Report Found Item*, *Browse Items*.

### Phase 4: Browse Marketplace ([src/pages/BrowsePage.jsx](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/pages/BrowsePage.jsx))
- Filter items by **Type** (*All, Lost, Found*), **Category** (12 fixed categories), and **Location** (9 campus locations).
- Keyword search across `itemName`, `description`, `brand`, and `location`.

### Phase 5: Item Details Page ([src/pages/ItemDetailPage.jsx](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/pages/ItemDetailPage.jsx))
- Display all item metadata and status badge (*ACTIVE* / *RESOLVED*).
- Replace complex claims modal with a simple **Contact Reporter** modal showing `reporterName` & `reporterContact`.
- Add **Mark as Resolved** action button.

### Phase 6: Report Lost / Found Forms ([src/pages/ReportItemPage.jsx](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/pages/ReportItemPage.jsx))
- Include fields: `itemName`, `category`, `description`, [date](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/pages/ReportItemPage.jsx#56-67), `location`, `color`, `brand`, `identifyingFeatures`, `reporterName`, `reporterContact`.

### Phase 7: My Reports Page ([src/pages/MyReportsPage.jsx](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/pages/MyReportsPage.jsx))
- Display user's created reports with View, Edit, Delete, and Mark as Resolved actions.

### Phase 8: Route Setup & Unused File Cleanup
- Update [App.jsx](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/App.jsx) with active MVP routes.
- Remove redundant pages/components ([AdminDashboardPage.jsx](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/pages/AdminDashboardPage.jsx), complex authentication modals).
- Verify `npm run build`.
- Update [README.md](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/README.md) to reflect the 2-service AWS Architecture (Amplify + DynamoDB).

---

## Verification Plan
1. Test all 6 core pages: Home, Browse, Item Details, Report Lost, Report Found, My Reports.
2. Verify Search & Filters on Browse page.
3. Verify status workflow (`ACTIVE` -> `RESOLVED`).
4. Ensure `npm run build` succeeds with 0 errors.

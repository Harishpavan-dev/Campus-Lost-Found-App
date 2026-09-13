# Weekend Deployment Challenge: Campus Lost & Found Platform

**#deployment**

---

## What Your App Does

**Campus Lost & Found** is a modern, serverless web application purpose-built for university students to report, search, and recover lost or misplaced items across campus — in real time, with zero login friction.

### The Problem It Solves

Every university campus has the same frustrating problem: thousands of personal belongings — scientific calculators, student ID cards, laptops, wallets, keys, and more — go missing every week in lecture halls, laboratories, libraries, and cafeterias. The traditional systems for handling this are deeply flawed:

- **Fragmented communication channels**: Lost-item announcements get scattered across random WhatsApp groups, Instagram stories, physical pinboards on bulletin boards, and security office logbooks. There is no single source of truth.
- **High friction for reporting**: Students must physically visit the campus security desk during working hours, fill out paper forms, or navigate complex portal logins — creating barriers that discourage immediate reporting when time is critical.
- **No structured search capability**: Without proper categorization, building-level filtering, or keyword search, older posts quickly sink out of sight, making it nearly impossible for someone to match a found item to the person who lost it.

These bottlenecks mean that many items are never reunited with their owners, even when a fellow student has already found them and is eager to return them.

### How It Works — A User Experience Walkthrough

Campus Lost & Found solves each of these problems through a streamlined four-step user journey, accessible entirely from a student's phone or laptop browser — no app installation, no account creation, no passwords:

**Step 1 — Real-Time Campus Dashboard (Landing Page)**:
The moment a student opens the platform, they land on a vibrant, data-rich dashboard. Prominently displayed at the top are four live aggregate metrics: *Total Lost Items*, *Total Found Items*, *Items Recovered*, and *Active Reports*. These numbers update dynamically as the application syncs with Amazon DynamoDB in the background, giving students instant situational awareness. Below the metrics, six popular category shortcuts — *ID Cards, Calculators, Electronics, Keys, Wallets, Bags* — let users jump directly to filtered results with a single tap. A clear 3-step visual guide (*Report → Search & Match → Safely Recover*) explains the full workflow for first-time visitors.

**Step 2 — Multi-Filter Marketplace Browse Page**:
The browse page serves as the central marketplace for all campus reports. Students can perform instant keyword searches across item names, descriptions, brands, colors, and building names. Four dropdown filters allow further narrowing by **Report Type** (🔴 LOST vs 🟢 FOUND), **Category** (12 categories including calculators, electronics, ID cards, clothing, books), **Campus Location** (Library, Computer Lab, Main Building, Cafeteria, Playground, Science Block, Auditorium, Sports Complex, Hostel), and **Status** (ACTIVE vs RESOLVED). A loading spinner appears while the app fetches real-time data from DynamoDB, and a "Reset Filters" button surfaces whenever active filters are applied.

**Step 3 — Streamlined Report Submission**:
Dedicated color-coded forms (red gradient for LOST, green gradient for FOUND) let any student submit a report in under 30 seconds. The form captures critical item parameters: Name, Category, Building Location, Date, Brand, Color, and Unique Identifying Marks. Crucially, a mandatory **Student Identification Section** requires the reporter's Full Name, Institutional Email, and Phone/WhatsApp Number. This eliminates the need for user accounts while ensuring accountability — every report is directly traceable to a real person. Upon submission, a polished confirmation modal pops up showing the submitted item details, with quick-action buttons to view the report, browse the marketplace, or submit another report.

**Step 4 — Item Detail View & Direct Recovery**:
Each item has its own detailed specification page showing comprehensive metadata (category, location, date, color, brand, identifying features, status) alongside the reporter's contact information. Students can copy contact details to their clipboard with one click and reach out directly via email or WhatsApp to coordinate safe item recovery. Report owners can mark items as **RESOLVED** once the item has been successfully returned.

**Step 5 — My Reports Management Console**:
The "My Reports" page provides a view-only management console where students can review their active listings and mark reports as RESOLVED when items are recovered.

---

## How You Built It

### Technology Stack

| Layer | Technology | Role |
|:---|:---|:---|
| **Frontend Framework** | React 19 (Vite 8 build engine) | Component-based SPA rendering and state management |
| **Styling** | Tailwind CSS v4 + Custom HSL design tokens | Utility-first CSS framework with curated color system |
| **Icons** | Lucide React | Clean, consistent 24px icon library |
| **Client-Side Routing** | React Router DOM v7 | Multi-page navigation without full page reloads |
| **Cloud Database SDK** | `@aws-sdk/client-dynamodb` (AWS SDK v3) | Direct browser-to-DynamoDB CRUD operations |
| **Deployment & Hosting** | AWS Amplify | Automated CI/CD from GitHub with CloudFront CDN |
| **Cloud Database** | Amazon DynamoDB | Serverless NoSQL storage for all campus reports |

### Development Process & Key Decisions

**Decision 1: Zero-Login Architecture**

The single most important architectural decision was eliminating all authentication barriers. Traditional lost-and-found portals require user registration, email verification, and login — adding 2-5 minutes of friction before a student can even report a missing item. In a campus emergency (losing an ID card minutes before an exam, or a wallet right before lunch), those minutes matter.

Instead of implementing AWS Cognito or any authentication service, I embedded student verification directly into every report submission form. Required fields for Full Name, Student Email, and Phone/WhatsApp Number ensure accountability without access barriers. This means any student can contribute to the community immediately — no signup wall, no password to forget.

**Decision 2: Hybrid Local-Cloud Data Pipeline**

The data layer ([mockData.js](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/data/mockData.js) and [itemService.js](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/services/itemService.js)) uses a hybrid approach: the UI immediately renders from a lightweight `localStorage` cache while an asynchronous DynamoDB scan runs in the background. When the cloud sync completes, the local cache is seamlessly updated and the UI re-renders. This guarantees that the app feels instant on first load (no blank screen while waiting for network), but always reflects the latest cloud state once the network response arrives.

The code achieves this with a clean pattern:

```javascript
export const syncWithDynamoDB = async () => {
  try {
    const liveItems = await fetchItemsFromDynamoDB();
    if (liveItems && Array.isArray(liveItems)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(liveItems));
      return liveItems;
    }
  } catch (e) {
    console.warn('DynamoDB sync notice:', e);
  }
  return getAllItems(); // Graceful fallback to cached data
};
```

**Decision 3: Direct SDK vs. API Gateway**

To keep the architecture minimal for this weekend challenge, I chose to use `@aws-sdk/client-dynamodb` directly from the browser instead of building a full backend with API Gateway and Lambda. This eliminates an entire tier of infrastructure (API Gateway configuration, Lambda cold starts, IAM role chaining) while still providing real, functional cloud persistence. For a production system, an API Gateway layer would be essential for security, but for this MVP deployment challenge, the direct SDK approach gets a working app live in hours rather than days.

**Decision 4: Spacious Ergonomic UI System**

Most campus utility apps suffer from cramped, cluttered interfaces. I made a deliberate design choice to use generous padding (`p-8 sm:p-10`), expanded container widths (`max-w-7xl / 1440px`), and large rounded corners (`rounded-3xl`) throughout the app. Rich metadata pills (📍 Location, 📅 Date, 🎨 Color) fill cards with useful visual information, eliminating empty white space while ensuring the interface never feels overwhelming.

### Challenges Encountered & How I Overcame Them

**Challenge 1: Vite Blocks `AWS_`-Prefixed Environment Variables**

Vite's security model intentionally strips any environment variables not prefixed with `VITE_`. When I first configured the DynamoDB credentials as standard `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`, they were silently dropped during the build process, causing all DynamoDB operations to fail with `CredentialsProviderError`.

*Resolution*: I prefixed all AWS variables with `VITE_AWS_` (e.g., `VITE_AWS_REGION`, `VITE_AWS_ACCESS_KEY_ID`, `VITE_AWS_SECRET_ACCESS_KEY`, `VITE_AWS_DYNAMODB_TABLE_ITEMS`) and accessed them via `import.meta.env.VITE_AWS_REGION` in a centralized [awsConfig.js](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/config/awsConfig.js) module. The same variables were configured in AWS Amplify's Environment Variables settings panel.

**Challenge 2: DynamoDB AttributeValue Type Mapping**

Unlike higher-level ORMs, the raw `@aws-sdk/client-dynamodb` requires explicit type wrappers for every single attribute: `{ S: "string" }` for strings, `{ N: "123" }` for numbers. My initial `PutItemCommand` payloads failed because I was passing plain JavaScript objects.

*Resolution*: I built a dedicated [dynamoService.js](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/services/dynamoService.js) module with two helper functions: [formatDynamoItem()](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/services/dynamoService.js#16-38) (which wraps every attribute in `{ S: value }` notation for writes) and [parseDynamoItem()](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/services/dynamoService.js#39-62) (which unwraps the `?.S` accessors for reads). This clean separation means the rest of the application never deals with DynamoDB's wire format.

**Challenge 3: Card Layout Inconsistency Across Content Lengths**

Item cards initially had fixed heights, creating ugly blank spaces when descriptions were short and overflow when they were long.

*Resolution*: I refactored [ItemCard.jsx](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/components/items/ItemCard.jsx) to use dynamic flexbox sizing with `flex-grow` for the description area, combined with metadata pills (📍 Location, 📅 Date, 🎨 Color) that provide consistent visual weight regardless of description length. Every card now looks balanced whether it has one sentence or a full paragraph.

---

## AWS Services Used / Architecture Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT TIER (Browser)                     │
│                                                             │
│  ┌─────────────────────┐    ┌──────────────────────────┐    │
│  │  React 19 + Vite 8  │───►│  @aws-sdk/client-dynamodb│    │
│  │  (Tailwind CSS v4)  │    │  (AWS SDK v3 - Browser)  │    │
│  └──────────┬──────────┘    └───────────┬──────────────┘    │
│             │ HTTPS                     │ AWS API Calls      │
└─────────────┼───────────────────────────┼───────────────────┘
              │                           │
┌─────────────▼───────────────────────────▼───────────────────┐
│                    AWS CLOUD INFRASTRUCTURE                  │
│                                                             │
│  ┌──────────────────────────────────────────────┐           │
│  │          AWS AMPLIFY (Hosting & CI/CD)        │           │
│  │  ┌────────────────┐  ┌────────────────────┐  │           │
│  │  │ Amazon          │  │ Amplify CI/CD       │  │           │
│  │  │ CloudFront CDN  │  │ Build Pipeline      │  │           │
│  │  │ (Global Edge)   │  │ (GitHub Webhooks)   │  │           │
│  │  └────────────────┘  └────────────────────┘  │           │
│  └──────────────────────────────────────────────┘           │
│                                                             │
│  ┌──────────────────────────────────────────────┐           │
│  │       AMAZON DYNAMODB (Serverless NoSQL)      │           │
│  │                                               │           │
│  │  Table: CampusLF_Items                        │           │
│  │  Primary Key: itemId (String)                 │           │
│  │  Billing: PAY_PER_REQUEST (On-Demand)         │           │
│  │  Region: ap-south-1 (Mumbai)                  │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### AWS Services Deep Dive

**1. AWS Amplify — Hosting & Continuous Deployment**

AWS Amplify serves as the complete hosting and CI/CD solution. The workflow is:
- The GitHub repository (`Harishpavan-dev/Campus-Lost-Found-App`) is connected to AWS Amplify via OAuth.
- Whenever code is pushed to the `main` branch, Amplify automatically triggers the CI pipeline: it runs `npm ci` (clean dependency install), executes `npm run build` (Vite production build), and deploys the optimized `dist/` bundle.
- The built assets are distributed globally via **Amazon CloudFront CDN**, ensuring fast load times regardless of the user's geographic location.
- Amplify provides a free SSL-secured HTTPS endpoint, ensuring all data-in-transit is encrypted.

The [amplify.yml](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/amplify.yml) build specification defines this pipeline:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**2. Amazon DynamoDB — Serverless NoSQL Database**

Amazon DynamoDB provides the primary persistent storage layer. The single table `CampusLF_Items` stores every lost-and-found report with the following schema:

| Attribute | Data Type | Key | Description |
|:---|:---|:---|:---|
| `itemId` | String (S) | **PK** | Auto-generated unique ID (e.g., `item-1789277038212`) |
| `type` | String (S) | — | `LOST` or `FOUND` |
| `itemName` | String (S) | — | Title of the item |
| `category` | String (S) | — | Category slug (e.g., `calculator`, `electronics`) |
| `description` | String (S) | — | Detailed description |
| `location` | String (S) | — | Campus building slug (e.g., `library`, `cafeteria`) |
| [date](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/pages/ReportItemPage.jsx#49-63) | String (S) | — | Date the item was lost/found |
| `color` | String (S) | — | Primary color |
| `brand` | String (S) | — | Brand or manufacturer |
| `identifyingFeatures` | String (S) | — | Unique distinguishing marks |
| `status` | String (S) | — | `ACTIVE` or `RESOLVED` |
| `reporterName` | String (S) | — | Full name of the reporter |
| `reporterContact` | String (S) | — | Email and phone number |
| `createdAt` | String (S) | — | ISO creation timestamp |
| `updatedAt` | String (S) | — | ISO modification timestamp |

The table uses **On-Demand (PAY_PER_REQUEST) billing**, meaning there are no provisioned capacity charges — the app only pays for actual read/write operations. This is ideal for a campus application with unpredictable traffic patterns (quiet during breaks, high during exam season).

Three SDK operations power the app:
- **`ScanCommand`**: Reads all items from the table on page load.
- **`PutItemCommand`**: Writes new lost/found reports to the table.
- **`UpdateItemCommand`**: Updates item status from `ACTIVE` to `RESOLVED`.

---

## What You Learned

Building and deploying Campus Lost & Found for this weekend challenge was a concentrated learning experience. Here are the key takeaways:

**1. Serverless Data Plumbing with AWS SDK v3**

Before this project, my experience with DynamoDB was limited to theoretical understanding. Actually building the [formatDynamoItem()](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/services/dynamoService.js#16-38) and [parseDynamoItem()](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/src/services/dynamoService.js#39-62) helper functions — manually wrapping and unwrapping every attribute in `{ S: "value" }` notation — gave me a deep, hands-on understanding of how DynamoDB's wire protocol works. I now appreciate why higher-level libraries like the DynamoDB Document Client exist, but I also understand exactly what they abstract away.

**2. The Power (and Simplicity) of AWS Amplify CI/CD**

Setting up continuous deployment took less than 10 minutes. Connecting the GitHub repository, configuring the [amplify.yml](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/amplify.yml) build spec, and adding environment variables in the Amplify console was all it took. From that point on, every `git push` to `main` automatically built and deployed the app — zero manual intervention. This dramatically changed my mental model of deployment from "scary final step" to "push and forget."

**3. Robust Error Handling in Client-Side Cloud Apps**

Because the browser SDK calls DynamoDB directly, network failures, credential initialization delays, and CORS issues can all surface at runtime. I learned to build resilient fallback logic at every integration point: if the DynamoDB `ScanCommand` fails, the app gracefully falls back to the local `localStorage` cache. If a `PutItemCommand` fails, the item is still saved locally and the user sees their report immediately. No blank screens, no unhandled promise rejections, no broken states.

**4. Environment Variable Security Across Build Pipelines**

Vite's security-first approach of stripping non-`VITE_` prefixed variables was a surprise that taught me an important lesson about build-pipeline security. Different frameworks (Next.js uses `NEXT_PUBLIC_`, Vite uses `VITE_`, CRA uses `REACT_APP_`) each have their own conventions, and misunderstanding them can silently break your entire backend integration with no obvious error message.

**5. Ergonomic Design Pays Off**

Small design choices — metadata pills instead of empty space, generous padding, high-contrast status badges, and a spacious 1440px container — transformed what could have been a utilitarian tool into something that feels genuinely pleasant to use. Students are more likely to report items (and check for their lost items) when the experience is enjoyable rather than bureaucratic.

---

## Link to App or Repo

| Resource | Link |
|:---|:---|
| **🌐 Live Deployed Application** | [https://main.d16hffjcmfdw3j.amplifyapp.com/](https://main.d16hffjcmfdw3j.amplifyapp.com/) |
| **💻 Source Code Repository** | [https://github.com/Harishpavan-dev/Campus-Lost-Found-App](https://github.com/Harishpavan-dev/Campus-Lost-Found-App) |

The deployed application is live and fully functional on AWS Amplify with real-time Amazon DynamoDB integration. The GitHub repository is public and contains the complete source code, [amplify.yml](file:///c:/Users/haris/OneDrive/Desktop/Lost%20Find/amplify.yml) build spec, seed scripts, and environment configuration examples.

---

*Built with React 19, Tailwind CSS v4, AWS Amplify, and Amazon DynamoDB for the AWS Deploy Your First App Weekend Challenge.*

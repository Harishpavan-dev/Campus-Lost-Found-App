# Campus Lost & Found MVP 🎓

A centralized, student-friendly web application for reporting, searching, and recovering lost and found items on college campuses.

Built for the **AWS Deploy Your First App Weekend Challenge**.

---

## 🏗️ Architecture

```text
              Student / User
                    │
                    ▼
           React + Tailwind CSS
                    │
                    ▼
               AWS Amplify (Hosting)
                    │
                    ▼
            Amazon DynamoDB (Database)
                    │
                    ▼
            CampusLF_Items Table
```

### AWS Services Used (2 Services)
1. **AWS Amplify**: Continuous deployment & hosting directly from GitHub.
2. **Amazon DynamoDB**: Serverless NoSQL table storing item reports.

---

## 🌟 Key Features

* **Home Page**: Stats dashboard, 3-step workflow guide, and quick action shortcuts.
* **Browse & Search**: Instant filter by report type (*Lost / Found*), category, and campus location.
* **Item Details**: Detailed metadata, reporter contact modal, and status workflow (*ACTIVE* / *RESOLVED*).
* **Report Item**: Simple, fast reporting form for lost or found belongings.
* **My Reports**: Manage, resolve, and delete created item reports.

---

## 🗄️ DynamoDB Table Schema (`CampusLF_Items`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `itemId` | String (PK) | Unique item ID |
| `type` | String | `LOST` or `FOUND` |
| `itemName` | String | Name/title of item |
| `category` | String | Item category (ID Card, Wallet, Keys, etc.) |
| `description` | String | Detailed description |
| `date` | String | Date item was lost/found |
| `location` | String | Campus location |
| `color` | String | Color of item |
| `brand` | String | Brand / manufacturer |
| `identifyingFeatures` | String | Unique identifiers |
| `status` | String | `ACTIVE` or `RESOLVED` |
| `reporterName` | String | Name of student reporting |
| `reporterContact` | String | Email/Phone to contact |
| `createdAt` | String | Timestamp |

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## ⚡ Deployment with AWS Amplify

1. Push this repository to **GitHub**.
2. Go to **AWS Amplify Console** → Select **Host web app**.
3. Connect your GitHub repository and main branch.
4. Set environment variables:
   - `VITE_AWS_REGION=ap-south-1` (or your region)
   - `VITE_AWS_DYNAMODB_TABLE_ITEMS=CampusLF_Items`
5. Deploy! Your app will be live on an HTTPS Amplify URL.

# ScanSafe

**ScanSafe** is a full-stack web application that helps users quickly identify potentially unsafe ingredients in food products based on their **personal allergens and dietary restrictions**.

You can scan a product label or barcode, and ScanSafe automatically extracts the ingredient list, normalizes it, and flags ingredients that conflict with their saved preferences.

---

## 🔗 Live Demo

> Check out the webapp: https://scansafe-312586010242.europe-west1.run.app 

---

## 🧠 Why ScanSafe?

Reading ingredient labels is time-consuming and error-prone, especially for users with allergies or dietary restrictions. Labels often use inconsistent wording, uncommon ingredient names, or formatting that makes manual checking difficult.

ScanSafe solves this by:

* Turning **unstructured label images into structured data**
* Matching ingredients against **user-specific allergen profiles**
* Handling OCR noise and spelling variations automatically

---

## ⚙️ How It Works (High Level)

1. Users signs up and saves allergen / dietary preferences
2. Then the user scans a product label image or barcode
3. Backend runs OCR and extracts raw ingredient text
4. Ingredients are cleaned, normalized, and fuzzy-matched
5. Results are compared against the user’s saved restrictions
6. The app returns flagged and verified ingredients

---

## 🏗️ Stack

```
React, Vite, Django, PostgreSQL, Python. 
Supporting Libraries: EasyOCR, OpenCV, RapidFUZZ, Pillow, Numpy
Cloud: Google Cloud, Google Cloud SQL, BigQuery
```

### Key Components

* **Frontend**: React UI for scanning, results, and user profiles
* **Backend API**: Handles auth, scans, matching logic, and persistence
* **Database**: Stores users, allergens, ingredients, and scan results
* **OCR Pipeline**: Extracts ingredient text from product labels
* **Matching Engine**: Uses fuzzy matching to handle OCR errors

---

## 🧩 Core Features

* User authentication and profile management
* Persistent allergen and dietary preference storage
* OCR-based ingredient extraction from images
* Ingredient normalization and fuzzy matching
* Barcode (GTIN) decoding for faster lookups
* Scan result storage and reuse
* Cloud deployment using Docker containers

---

## 🛠️ Tech Stack

**Frontend**

* React
* JavaScript / HTML / CSS

**Backend**

* Python
* REST API (FastAPI / Django REST)
* PostgreSQL

**Processing & Utilities**

* OpenCV (image preprocessing)
* EasyOCR (text extraction)
* RapidFuzz (fuzzy string matching)
* Pyzbar (barcode decoding)

**Infrastructure**

* Docker
* Google Cloud Platform (Cloud Run / Cloud SQL)

---

## 🧪 Example API Endpoints

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | /auth/register     | Create user account      |
| POST   | /auth/login        | Authenticate user        |
| POST   | /scan              | Submit image or barcode  |
| GET    | /scan/{id}         | Retrieve scan results    |
| PUT    | /profile/allergens | Update user restrictions |

---

## 🧠 Engineering Decisions

* **PostgreSQL** was chosen for strong relational guarantees between users, allergens, and scans
* **Fuzzy matching** handles OCR noise and spelling variations reliably
* **Barcode caching** avoids repeated OCR for common products
* **Containerization** ensures consistent local and cloud deployments

---

## ⚠️ Known Limitations

* OCR accuracy depends on image quality and lighting
* OCR processing is currently synchronous
* Ingredient database coverage is expanding

---

## 🚀 Future Improvements

* Asynchronous OCR job processing
* Redis-backed caching and rate limiting
* Expanded ingredient knowledge base
* Mobile-optimized scanning experience
* Improved observability and metrics

---

## 🧑‍💻 Local Development

```bash
# Clone repository
git clone https://github.com/ShlokB05/ScanSafe.git
cd scansafe

# Backend
cd backend
pip install -r requirements.txt
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📌 Summary

ScanSafe demonstrates full-stack ownership of a real-world backend problem involving OCR, data normalization, user-specific logic, and cloud deployment. The project emphasizes correctness, reliability, and backend design over simple CRUD functionality.

# ExamHack Backend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

**IMPORTANT:** The backend needs a Google AI API key to perform real AI analysis.

#### Get Your Free Google AI API Key:
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the generated API key (starts with `AIza...`)

#### Create `.env` File:
1. Copy the `.env.example` file:
   ```bash
   cp .env.example .env
   ```
   
2. Open `.env` and replace `your_google_ai_api_key_here` with your actual API key:
   ```
   GOOGLE_AI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### 3. Start the Server
```bash
npm start
```

The server will run on `http://localhost:5000`

---

## 🔍 Troubleshooting

### Backend Returns Dummy/Mock Data
**Symptom:** You see generic questions instead of real analysis from your PDFs.

**Cause:** Missing or invalid Google AI API key.

**Solution:**
1. Check if `.env` file exists in the `server` folder
2. Verify the API key is correct (no extra spaces or quotes)
3. Restart the server after creating/updating `.env`
4. Check server console logs for:
   - ✅ `API Response Received (Direct)` = Working correctly
   - ❌ `Using mock analysis fallback` = API key issue

### Server Won't Start
- Make sure you ran `npm install` first
- Check if port 5000 is already in use
- Verify Node.js version is 16+ (`node --version`)

---

## 📁 Project Structure

```
server/
├── index.js              # Main server entry point
├── routes/
│   └── analyze.js        # API endpoint for PDF analysis
├── services/
│   ├── aiService.js      # Google Gemini AI integration
│   ├── pdfService.js     # PDF text extraction
│   └── scraperService.js # Web scraping for past papers
├── .env                  # Environment variables (YOU CREATE THIS)
└── .env.example          # Template for environment variables
```

---

## 🧪 Testing the Backend

1. Start the server: `npm start`
2. The server should show: `🚀 Server running on port 5000`
3. Upload a course code and PDFs through the frontend
4. Watch the server console for processing logs
5. Verify you see real AI analysis, not mock data

---

## 🔑 API Key Security

- **Never commit `.env` to Git** (it's already in `.gitignore`)
- Keep your API key private
- Don't share your `.env` file
- If you accidentally expose your key, regenerate it at [Google AI Studio](https://aistudio.google.com/app/apikey)

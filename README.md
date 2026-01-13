# ExamHack 🎓

AI-powered exam preparation assistant that scrapes past papers, analyzes patterns, and generates personalized cheat sheets.

## Features

- 🤖 **AI-Powered Analysis**: Uses Google's Gemini AI to analyze exam patterns
- 📄 **Automatic Paper Scraping**: Fetches past papers from university libraries
- 🎨 **Modern UI**: Beautiful dark mode with smooth animations
- 🔐 **Google Authentication**: Secure login with Firebase
- 📊 **Research History**: Track your previous searches
- ⚡ **Fast & Responsive**: Built with React + Vite

## Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS
- Framer Motion
- Firebase Authentication

**Backend:**
- Node.js + Express
- Google Generative AI (Gemini)
- Puppeteer (web scraping)
- PDF.js (PDF processing)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Google AI API key
- Firebase project

### 1. Clone the repository
```bash
git clone https://github.com/nishchayy07/ExamHack.git
cd ExamHack
```

### 2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google AI API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

**Get your API keys:**
- **Google AI API**: https://aistudio.google.com/app/apikey
- **Firebase**: https://console.firebase.google.com/

### 4. Run the application

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm start
```

The app will be available at `http://localhost:5173`

## Project Structure

```
ExamHack/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # React context (Auth)
│   └── firebase.js       # Firebase configuration
├── server/                # Backend source code
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── middleware/       # Express middleware
└── public/               # Static assets
```

## Features in Detail

### Dark Mode
- Pure black theme (`#050505`) for OLED displays
- Smooth transitions between light/dark modes
- Consistent styling across all pages

### Profile Dropdown
- Quick access to research history
- One-click sign out
- Responsive design

### AI Analysis
- Pattern recognition in past papers
- Important topics identification
- Cheat sheet generation

## Security

⚠️ **Never commit your `.env` file to version control!**

The `.env` file contains sensitive API keys and should remain local. The repository includes `.env.example` files as templates.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Author

**Nishchay** - [GitHub](https://github.com/nishchayy07)

---

Made with ❤️ for students everywhere

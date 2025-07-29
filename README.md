# Snap & Learn - AI Object Detection App

A beautiful, single-page web application that uses your device's camera to capture photos of objects and identifies them using Google's Gemini Vision AI. No signup required - just point, snap, and learn!

## ✨ Features

- **Instant Camera Access**: Use your device's built-in camera with smooth capture experience
- **AI-Powered Recognition**: Leverages Google Gemini Vision API for accurate object identification
- **Rich Information Display**: Get detailed descriptions, confidence scores, and interesting facts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Privacy-First**: Images are processed securely and never stored
- **No Registration**: Start using immediately without any account creation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Cloud Platform account with Gemini API access
- A Supabase account (for secure API proxy)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snap-and-learn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `GOOGLE_API_KEY`: Your Google Gemini API key (set in Supabase Edge Function environment)

4. **Set up Supabase Edge Function**
   
   The app uses a Supabase Edge Function to securely proxy requests to the Google Gemini Vision API. The function is located in `supabase/functions/detect-object/`.

   To deploy the function:
   - Follow Supabase documentation to set up the Supabase CLI
   - Deploy the function with your Google API key as an environment variable

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Frontend Components

- **App.tsx**: Main application state management and routing
- **CameraCapture.tsx**: Handles camera access, video preview, and image capture
- **ObjectResults.tsx**: Displays AI analysis results with confidence scores
- **ErrorDisplay.tsx**: User-friendly error handling and retry mechanisms
- **LoadingSpinner.tsx**: Elegant loading states during AI processing

### Backend Integration

- **Supabase Edge Function**: Secure proxy for Google Gemini Vision API calls
- **Image Processing**: Client-side image compression for optimal performance
- **Error Handling**: Comprehensive error management throughout the pipeline

## 🎨 Design System

- **Colors**: Blue primary (#3B82F6), Emerald secondary (#10B981), Orange accent (#F97316)
- **Typography**: System fonts with careful hierarchy and spacing
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design with progressive enhancement

## 🔒 Security & Privacy

- **No Data Storage**: Images are processed in memory and immediately discarded
- **Secure API Calls**: All external API calls go through authenticated Edge Functions
- **Client-Side Processing**: Image compression and basic processing happen locally
- **HTTPS Only**: All communications are encrypted

## 🌐 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

Requires camera access and modern JavaScript features.

## 📱 Mobile Considerations

- Optimized for touch interactions
- Uses rear camera by default on mobile devices
- Responsive layouts for all screen sizes
- Handles device orientation changes

## 🧪 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Code Organization

- `/src/components`: Reusable React components
- `/src/services`: API integration and external service calls
- `/supabase/functions`: Serverless functions for backend logic
- Clean separation of concerns with modular architecture

## 🚀 Deployment

### Frontend (Netlify/Vercel)

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Ensure environment variables are configured

### Backend (Supabase)

1. Deploy Edge Functions using Supabase CLI
2. Set environment variables in Supabase dashboard
3. Verify function URLs in frontend configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini Vision API for AI-powered object recognition
- Supabase for secure serverless functions
- Lucide React for beautiful icons
- Tailwind CSS for rapid UI development

## 🔧 Troubleshooting

### Camera Access Issues
- Ensure you're accessing the site via HTTPS
- Check browser permissions for camera access
- Try refreshing the page if camera doesn't start

### API Errors
- Verify your Google API key is valid and has Gemini API access
- Check that Supabase environment variables are set correctly
- Monitor Supabase function logs for detailed error information

### Performance Issues
- Images are automatically compressed to optimize performance
- Ensure stable internet connection for API calls
- Consider image quality vs. processing speed trade-offs
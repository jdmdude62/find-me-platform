# Find.Me - AI-Powered Human Empowerment Platform

## Overview

Find.Me is a privacy-first self-discovery platform designed to help people discover what they're naturally drawn toward through honest reflection. This is Session 1 of a comprehensive discovery journey.

## Features

### 🔒 Privacy-First Architecture
- **Local-only data storage** - all responses stay on user's device
- **No server-side data collection** - complete user ownership
- **Transparent privacy practices** - users can verify data handling
- **Data export functionality** - users control their information

### 📱 Mobile-Optimized Experience  
- **Responsive design** for phone, tablet, and desktop
- **Voice input integration** using Web Speech API
- **Touch-friendly interface** with iOS zoom prevention
- **Progressive enhancement** with graceful fallbacks

### 💾 Session Management
- **Auto-save every 30 seconds** with visual feedback
- **Pause/resume capability** across browser sessions
- **Progress tracking** with time estimates
- **Session persistence** using localStorage

### 📊 Live Analytics Dashboard
- **Real-time session monitoring** for demonstrations
- **Completion rate tracking** and drop-off analysis
- **Device performance metrics** (mobile vs desktop usage)
- **Session duration tracking** for optimization

## Technical Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage:** Browser localStorage with privacy-by-design
- **Voice Input:** Web Speech API with browser compatibility detection
- **Hosting:** Static site optimized for Vercel deployment
- **Analytics:** Client-side only, no external tracking

## Deployment

### Prerequisites
- Vercel account (free tier available)
- Modern web browser for testing
- HTTPS hosting (required for voice input functionality)

### Quick Deploy to Vercel

1. **Upload Files:**
   - `index.html` (main platform)
   - `vercel.json` (configuration)
   - `README.md` (this file)

2. **Automatic Deployment:**
   - Vercel will auto-detect static site
   - HTTPS enabled automatically
   - Global CDN distribution included

3. **Custom Domain (Optional):**
   - Add your domain in Vercel dashboard
   - DNS configuration handled automatically
   - SSL certificate provisioned automatically

### Local Development
```bash
# Serve locally for testing
npx serve .

# Or use any static file server
python -m http.server 8000
```

## Browser Compatibility

### Full Feature Support
- **Chrome/Edge 80+** - Complete functionality including voice input
- **Safari 14+** - Complete functionality including voice input
- **Firefox 80+** - Core functionality (limited voice input support)

### Mobile Support  
- **iOS Safari 14+** - Optimized with zoom prevention
- **Android Chrome 80+** - Full voice input support
- **Mobile Firefox** - Core functionality

## Usage Analytics

The platform includes privacy-respecting analytics that track:
- Session completion rates
- Question-level drop-off points  
- Device type distribution
- Session duration patterns

**No personal data is collected or transmitted.**

## Session 1 Questions

1. **Foundation Questions (1-6):** Basic setup and current situation
2. **Transition Point (7):** Preparation for deeper reflection
3. **Deep Reflection (8-11):** Engagement patterns, energy, values
4. **Summary (12):** Integration and next steps

## Data Export

Users can export their complete session data in JSON format including:
- All question responses
- Session metadata (duration, device, timestamps)
- No personally identifiable information beyond user inputs

## Privacy Compliance

- **GDPR Compliant:** User data never leaves their device
- **CCPA Compliant:** No data sale or sharing possible
- **No cookies required** for core functionality
- **Transparent data practices** with real-time verification

## Support

For technical issues or questions:
- Check browser console for error messages
- Verify HTTPS is enabled for voice input
- Ensure localStorage is available and not blocked

## Version History

- **v1.0:** Complete Session 1 platform with all 12 questions
- **Mobile optimization** with voice input and responsive design
- **Privacy-first architecture** with local storage only
- **Live analytics dashboard** for demonstration purposes

## License

This project is part of the AI-Powered Human Empowerment initiative.

---

**Deployment URL:** `https://your-project.vercel.app`  
**Status:** ✅ Production Ready  
**Last Updated:** June 16, 2025

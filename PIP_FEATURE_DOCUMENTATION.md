# Live Score Picture-in-Picture (PiP) Feature

## Overview

The Live Score PiP feature provides a floating window that displays real-time tennis match scores on your web app. This feature allows users to keep track of live matches while browsing other parts of the website.

## Features

### ✅ Picture-in-Picture Window
- **Floating Design**: Always stays on top of other content
- **Draggable**: Users can move the window anywhere on screen
- **Resizable States**: Minimize/maximize functionality
- **Smart Positioning**: Automatically constrains to screen boundaries

### ✅ Real-Time Score Updates
- **Auto-refresh**: Updates every 15 seconds automatically
- **Live Match Integration**: Fetches data from Firebase
- **Multiple Match Support**: Toggle between different live matches
- **Connection Status**: Shows online/offline indicator

### ✅ Interactive Controls
- **Minimize/Maximize**: Collapse to header only or expand full view
- **Sound Toggle**: Enable/disable score update notifications
- **Auto-update Toggle**: Turn on/off automatic refreshes
- **Close Button**: Hide the PiP window completely

### ✅ Responsive Design
- **Desktop Navigation**: "Live Scores" button in top navigation
- **Mobile Navigation**: Toggle button in mobile menu
- **Touch Friendly**: Optimized for mobile devices
- **Dark Mode**: Supports both light and dark themes

## How to Use

### Opening the PiP Window
1. **Desktop**: Click the "Live Scores" button in the top navigation bar
2. **Mobile**: Open the mobile menu and tap "Show Live Scores"
3. **Keyboard**: The PiP window will appear in the top-left corner

### Controlling the Window
- **Move**: Click and drag the header bar to reposition
- **Minimize**: Click the minimize button (square icon) to collapse
- **Close**: Click the X button to hide the window
- **Settings**: Use the sound and auto-update toggle buttons

### Viewing Multiple Matches
- If multiple live matches are available, tabs will appear
- Click on "Match 1", "Match 2", etc. to switch between matches
- Each match shows real-time scores and game status

## Technical Implementation

### Components
- `LiveScorePiP`: Main floating window component
- `PiPProvider`: Global state management context
- `usePiP()`: React hook for PiP controls

### Data Flow
1. **Firebase Integration**: Fetches live match data from Firestore
2. **Real-time Updates**: Polls for new scores every 15 seconds
3. **State Management**: Uses React Context for global PiP state
4. **Position Persistence**: Remembers window position during session

### File Structure
```
components/
├── live-score-pip.tsx          # Main PiP component
├── navigation.tsx              # Updated with PiP controls
lib/
├── pip-context.tsx             # PiP state management
├── firebase-operations.ts      # Data fetching
app/
├── layout.tsx                  # PiP provider integration
```

## Demo Data

When no live matches are available in Firebase, the system shows demo data:
- Rafael Nadal vs Novak Djokovic (Bhimavaram Open)
- Serena Williams vs Maria Sharapova (Club Championship)

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support  
- ✅ Safari: Full support
- ✅ Mobile browsers: Touch optimized

## Future Enhancements

- **Video Integration**: Live video feeds for major matches
- **Match Statistics**: Detailed game analytics
- **Push Notifications**: Browser notifications for score updates
- **Multi-device Sync**: Sync PiP state across devices
- **Keyboard Shortcuts**: Hotkeys for PiP controls

## Usage Statistics

The PiP feature tracks:
- Window position preferences
- Auto-update usage patterns
- Match viewing frequency
- User engagement metrics

---

*This feature enhances the user experience by providing seamless access to live tennis scores without interrupting website navigation.*
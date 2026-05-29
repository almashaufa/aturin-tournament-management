# Tournament Connection Flow

## Connected Experience Overview

The app now simulates a fully connected tournament management system where Admin and Scorekeeper roles share the same tournament data.

## How It Works

### Admin Flow:
1. **Login** → Select **Admin** role → Choose **Bulu Tangkis**
2. **Create Tournament** (`/admin/buat-turnamen`)
   - Fill in tournament details
   - Submit form
   - Receive a **6-character access code** (e.g., `ABC123`)
   - **Copy button** copies the code to clipboard
   - Code is stored in localStorage with tournament data

### Scorekeeper Flow:
1. **Login** → Select **Penulis Skor** role
2. **Enter Access Code** (`/access-code-entry`)
   - Enter the 6-character code from Admin
   - System validates against existing tournaments
   - If valid: Navigate to match list
   - If invalid: Show error message
3. **View Matches** (`/penulis-skor`)
   - See all matches from tournaments (shared via localStorage)
   - Select and score matches

## Sample Data

The app includes demo data for testing:
- **Demo Access Code**: `DEMO99`
- **Tournament**: Turnamen Bulu Tangkis Nasional 2026
- **4 Teams**: Tim Merah, Tim Biru, Tim Hijau, Tim Kuning
- **4 Matches**: 2 completed, 2 upcoming

## Data Sharing

All data is shared between Admin and Scorekeeper via:
- **AppContext**: React Context for state management
- **localStorage**: Persists data across sessions
- **Real-time sync**: Changes made in Admin immediately visible to Scorekeeper

## Key Features

✅ **Visible Access Code**: Displayed clearly after tournament creation
✅ **Copy to Clipboard**: One-click copy button with visual feedback
✅ **Code Validation**: Checks entered code against stored tournaments
✅ **Shared Mock Data**: Same data visible to both Admin and Scorekeeper
✅ **No Empty Pages**: Access code entry leads directly to match list
✅ **No UI Changes**: Preserves existing design system

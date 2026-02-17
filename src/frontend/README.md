# Smart Janghai - Frontend

A modern government portal for Janghai with live voting, news, schemes, jobs, and more.

## Features

- **Live Voting System**: Real-time poll voting with countdown timer and animated charts
- **News & Updates**: Latest news and announcements
- **Government Schemes**: Information about available schemes
- **Job Listings**: Current job opportunities
- **Admin Dashboard**: Complete management interface
- **Internet Identity**: Secure authentication via Internet Computer

## Local Development

### Prerequisites

- [dfx](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (Internet Computer SDK)
- Node.js 18+ and pnpm

### Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   pnpm install
   ```

2. **Start local Internet Computer replica:**
   ```bash
   dfx start --clean --background
   ```

3. **Deploy backend canister:**
   ```bash
   dfx deploy backend
   ```

4. **Generate TypeScript bindings:**
   ```bash
   dfx generate backend
   ```

5. **Start frontend development server:**
   ```bash
   pnpm start
   ```

6. **Access the application:**
   Open http://localhost:3000 in your browser

### Internet Identity Login

The application uses Internet Identity for authentication:

1. Click "Login" in the header or admin login page
2. You'll be redirected to Internet Identity
3. Create a new identity or use an existing one
4. After successful login, you'll be redirected back to the app

**First-time users:** You'll be prompted to set up your profile (name, mobile, email) after logging in.

### Admin Access

The first principal to interact with the backend automatically becomes an admin. To become an admin:

1. Deploy the backend canister
2. Log in with Internet Identity
3. You are now an admin

Admins can:
- Create and manage polls
- Set voting duration and end time
- Reset polls
- Manage users, news, schemes, jobs, and media
- Access the admin dashboard at `#admin-dashboard`

### Live Poll Management

#### Creating a Poll (Admin Only)

1. Log in as an admin
2. Navigate to the homepage
3. Scroll to the "Live Poll" section
4. In the "Admin Poll Controls" panel:
   - Add candidate names
   - Set duration in minutes
   - Click "Create/Update Poll"

#### Voting (Authenticated Users)

1. Log in with Internet Identity
2. Navigate to the homepage
3. View the live poll with countdown timer
4. Click "Vote" next to your preferred candidate
5. Your vote is recorded and results update in real-time

#### Poll Features

- **Countdown Timer**: Shows time remaining until voting closes
- **Real-time Results**: Vote counts update automatically every 3 seconds
- **Animated Charts**: Bar chart visualization with smooth transitions
- **Duplicate Prevention**: Each authenticated user can vote only once per poll
- **Auto-close**: Voting automatically stops when the timer reaches zero

#### Resetting a Poll (Admin Only)

1. In the "Admin Poll Controls" panel
2. Click "Reset Poll"
3. Confirm the action
4. All votes are cleared and the poll is removed

### Project Structure


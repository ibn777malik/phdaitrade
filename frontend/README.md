# AI Trading Bot Dashboard (Frontend)

## Overview

This Next.js frontend provides a real-time dashboard to monitor and interact with the AI Trading Bot.  
It displays active trades, performance charts, risk metrics, and bot status updates via WebSocket connection.

---

## Features

- Live active trades list with status and P/L  
- Interactive charts for performance tracking  
- Risk management dashboard  
- Real-time notifications panel  
- User authentication and session management  
- Responsive UI built with modern React tools  

---

## File Structure

/components # React components (TradeList, Charts, Notifications)
/pages # Next.js pages (dashboard, login, API routes)
/contexts # React context for global state management
/utils # API clients and helper functions
/styles # CSS or Tailwind styles

yaml
Copy

---

## Technologies Used

- **Next.js** — React framework with server-side rendering  
- **React Context API** — State management  
- **Socket.IO Client** — Real-time data updates  
- **Chart.js / Recharts** — Data visualization  
- **Tailwind CSS / Chakra UI** — Styling  
- **Axios / Fetch** — API requests  
- **JWT / NextAuth.js** — Authentication  

---

## Getting Started

1. Clone the repo  
2. Create `.env.local` with backend API and WebSocket URLs  
3. Run `npm install` to install dependencies  
4. Start the development server with `npm run dev`  

---

## Environment Variables Example (`.env.local`)

NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3001

yaml
Copy

- `NEXT_PUBLIC_API_URL`: URL of your backend REST API  
- `NEXT_PUBLIC_WS_URL`: URL of your backend WebSocket server  

These values should be set according to your deployment environment (local, staging, production) for easy configuration.

---

## Contribution

Open to contributions! Please submit issues or pull requests for improvements or new features.

---

## License

MIT License
# AI Trading Bot Backend

## Overview

This backend service powers the AI Trading Bot which runs 24/7 to execute trades automatically using pre-generated PhD-level AI trading strategies.  
It connects to MetaTrader 4/5 platforms through the MetaApi service to manage live trading operations securely and efficiently.

---

## Features

- Core trading logic using advanced pre-generated AI strategies  
- Real-time trade execution on MT4/MT5 via MetaApi  
- Risk management and dynamic lot sizing  
- Notification system (Telegram, email) for trade alerts and errors  
- WebSocket server for pushing live trade updates to the frontend dashboard  
- Logging and error handling for reliability  

---

## File Structure

/src
├── strategies/ # AI trading strategies logic
├── metaapi/ # MetaApi MT4/MT5 connection and wrappers
├── services/ # Helpers: risk management, notifications, signals
├── controllers/ # Trade lifecycle management
├── websocket/ # WebSocket server for real-time frontend communication
├── utils/ # Utilities like logging
├── config/ # Configuration and environment variables
└── index.js # Main app entry point

yaml
Copy

---

## Technologies Used

- **Node.js** — Backend runtime  
- **MetaApi SDK** — Bridge to MT4/MT5 brokers  
- **WebSocket (Socket.IO)** — Real-time communication  
- **MongoDB (optional)** — Data persistence and logging  
- **Telegram API** — Notifications  
- **dotenv** — Environment variables  
- **PM2** — Process manager for uptime  

---

## Getting Started

1. Clone the repo  
2. Create a `.env` file with required API keys, account info, and URLs  
3. Run `npm install` to install dependencies  
4. Start the backend with `pm2 start index.js` for continuous operation  

---

## Environment Variables Example (`.env`)

METAAPI_TOKEN=your_metaapi_token
MT_ACCOUNT_ID=your_mt4_5_account_id
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

Backend URLs - configurable for local or production
BACKEND_API_URL=http://localhost:3000
FRONTEND_WS_URL=http://localhost:3001

yaml
Copy

- Use `BACKEND_API_URL` internally if your backend calls itself or for documentation purposes.
- Use `FRONTEND_WS_URL` to configure the WebSocket URL that the backend uses to push real-time events.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve strategies or add features.

---

## License

MIT License
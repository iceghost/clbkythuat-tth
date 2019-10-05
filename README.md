To start the server in development, use `npm run dev`
To start the server in production, use `npm start`

.env file should have the following structure:
```
FACEBOOK_ACCESS_TOKEN=...
DATABASE_URL=postgresql://user:pass@host:port/database
DATABASE_SSL=false
PORT=...
<!-- Socket server -->
SOCKET_HOST=localhost:3000
```
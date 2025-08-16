# Entry Express Boilerplate
This is an express js boilerplate for creating, and handling users, like logging in, retrieveing user data, etc.
It comes with a bunch of security measures in place, like helmet,
hpp, csrf-protection, etc. It also has a bunch of authentication middlewares.

## Needed .env variables
```
NODE_ENV = development
PORT = 5000
JWT_SECRET = your_jwt_secret
JWT_ACCESS_TOKEN_EXPIRATION = '3m'
JWT_REFRESH_TOKEN_EXPIRATION = '30d'
COOKIE_SECRET = your_cookie_secret
SESSION_SECRET = your_session_secret
CSRF_SECRET = your_csrf_secret
MONGO_URI = mongodb://localhost:27017/entry-boilerplate

SMTP_HOST = smtp.mail.com
SMTP_PORT = 587
SMTP_USER = abcdef123456
SMTP_PASS = abcdef123456
SENDER_MAIL = your@email.com
REPLY_TO = reply.your@email.com
```
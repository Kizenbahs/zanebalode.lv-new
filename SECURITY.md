# Security Guidelines

This document outlines the security measures implemented in this Next.js application.

## Security Features

### 1. Security Headers
The application includes comprehensive security headers to protect against common web vulnerabilities:

- **Content Security Policy (CSP)**: Restricts resource loading to prevent XSS attacks
- **Strict Transport Security (HSTS)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables browser XSS filtering
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

### 2. Middleware Protection
The `middleware.ts` file provides an additional security layer that:
- Blocks suspicious URL patterns (path traversal, .env files, etc.)
- Adds security headers to all requests
- Implements basic rate limiting headers

### 3. Environment Variable Security
- Use `.env.local` for local development (never commit this file)
- Environment variables are validated on application startup
- Required variables are checked in production

### 4. Input Validation
Security utilities are available in `lib/security.ts`:
- `sanitizeInput()`: Sanitizes user input to prevent XSS
- `isValidUrl()`: Validates URLs to prevent open redirects
- `validateFileUpload()`: Validates file uploads

## Best Practices

### Environment Variables
1. Never commit `.env.local` or `.env` files to version control
2. Use `.env.example` as a template for required variables
3. Rotate API keys regularly
4. Use different keys for development and production

### Dependencies
1. Regularly run `npm audit` to check for vulnerabilities
2. Keep dependencies up to date
3. Review and update security patches promptly

### Code Security
1. Always validate and sanitize user input
2. Use parameterized queries if using a database
3. Implement proper authentication and authorization
4. Use HTTPS in production
5. Keep Next.js and React updated to the latest stable versions

## Security Commands

```bash
# Check for vulnerabilities
npm run security:check

# Fix automatically fixable vulnerabilities
npm run security:fix

# Audit with moderate level
npm run security:audit
```

## Reporting Security Issues

If you discover a security vulnerability, please:
1. Do not open a public issue
2. Contact the maintainers privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Additional Resources

- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)


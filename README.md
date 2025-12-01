<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1XJPVIY2d3f7J0Z-M5zrFVV-Nr4ZKFz7q

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your `GEMINI_API_KEY` (if needed).

3. Run the app:
   ```bash
   npm run dev
   ```

## Performance Monitoring

This project includes **Vercel Speed Insights** for real-time performance monitoring:
- Core Web Vitals tracking (LCP, FID, CLS, FCP, TTFB)
- Real User Monitoring (RUM)
- Performance metrics dashboard in Vercel

Speed Insights automatically collects and reports performance data when deployed on Vercel.

## Security

This project includes comprehensive security measures:
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Middleware protection against common attacks
- Environment variable validation
- Input sanitization utilities

See [SECURITY.md](SECURITY.md) for detailed security information.

### Security Commands

```bash
# Check for vulnerabilities
npm run security:check

# Fix automatically fixable vulnerabilities
npm run security:fix

# Audit with moderate level
npm run security:audit
```

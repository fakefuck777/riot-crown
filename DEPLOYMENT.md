# Deployment Guide - Riot Crown Y2K Pearl Chrome Theme

## GitHub Sync Setup

### 1. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Riot Crown Y2K Pearl Chrome theme"
git branch -M main
git remote add origin https://github.com/yourusername/riot-crown.git
git push -u origin main
```

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

- `SHOPIFY_CLI_TOKEN` - Your Shopify CLI token
- `SHOPIFY_SHOP` - Your shop.myshopify.com domain
- `PUBLIC_STOREFRONT_API_TOKEN` - Your storefront token
- `SESSION_SECRET` - 32+ character random string

### 3. Enable GitHub Actions

The workflow is already configured in `.github/workflows/deploy.yml`.

It will automatically:
- Run TypeScript check
- Run ESLint
- Build the project
- Deploy to Shopify Oxygen on push to main

## Shopify Oxygen Deployment

### Prerequisites

1. Shopify store with Hydrogen hosting enabled
2. Shopify CLI installed and authenticated
3. Storefront API access token configured

### Steps

1. **Authenticate Shopify CLI**
```bash
shopify auth login
```

2. **Link to your store**
```bash
shopify app dev
# or
shopify hydrogen link
```

3. **Deploy**
```bash
shopify hydrogen deploy
```

4. **Promote to production**
```bash
shopify hydrogen promote
```

## Environment Variables

### Required for Production

```bash
SESSION_SECRET=your-32-char-random-string
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-token
PUBLIC_STORE_DOMAIN=your-shop.myshopify.com
PUBLIC_CHECKOUT_DOMAIN=checkout.shopify.com
```

### Optional Marketing

```bash
KLAVIYO_API_KEY=your-klaviyo-key
TIKTOK_PIXEL_ID=your-tiktok-pixel-id
META_PIXEL_ID=your-meta-pixel-id
GOOGLE_GA_ID=G-XXXXXXXXXX
```

## Verification Checklist

### Before Deployment
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] All environment variables configured
- [ ] GitHub Secrets added

### After Deployment
- [ ] Homepage loads correctly
- [ ] 3D hero renders
- [ ] Product pages display
- [ ] Cart functionality works
- [ ] Multi-language switching works
- [ ] Analytics pixels fire
- [ ] SEO routes accessible (`/robots.txt`, `/sitemap.xml`)

## Rollback

If deployment fails:

1. Check GitHub Actions logs
2. Fix issues locally
3. Re-commit and push

To rollback to previous version:
```bash
shopify hydrogen versions
shopify hydrogen rollback <version-id>
```

## Monitoring

Recommended monitoring tools:
- Shopify Analytics
- Google Analytics 4
- Sentry (error tracking)
- Shopify web vitals

## Support

If you encounter issues:
1. Check Shopify Hydrogen documentation
2. Review GitHub Actions logs
3. Verify environment variables
4. Test locally with `npm run preview`

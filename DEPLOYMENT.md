# Deployment Guide - Boreas

## Overview

Boreas is configured for deployment on Vercel with automatic CI/CD via GitHub Actions.

## Environment Variables

### Required for Production

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Application Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_secret_key_here

# WhatsApp Business API (when implemented)
WHATSAPP_BUSINESS_API_KEY=your_whatsapp_api_key
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_token

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Development Only

```bash
# Copy .env.example to .env.local and fill in your values
cp .env.example .env.local
```

## Deployment Steps

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run database migrations:
   ```bash
   npx supabase db push
   ```
3. Copy your Supabase URL and keys from the project settings

### 2. Vercel Deployment

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the Boreas project

2. **Configure Environment Variables:**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add all required variables listed above
   - Make sure to set them for Production, Preview, and Development

3. **Deploy:**
   - Vercel will automatically deploy on every push to main branch
   - First deployment will take 2-3 minutes

### 3. Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS with your domain provider:
   ```
   Type: CNAME
   Name: @ (or subdomain)
   Value: cname.vercel-dns.com
   ```

## CI/CD Pipeline

### GitHub Actions

The `.github/workflows/ci.yml` file provides:

- **Build Testing:** Ensures the app builds successfully
- **Type Checking:** TypeScript validation
- **Linting:** Code quality checks
- **Security Audit:** Dependency vulnerability scanning
- **Multi-Node Testing:** Tests on Node.js 18 and 20

### Automatic Deployments

- **Main Branch:** Deploys to production
- **Develop Branch:** Deploys to preview environment
- **Pull Requests:** Creates preview deployments

## Monitoring

### Performance

- Vercel provides built-in analytics
- Core Web Vitals monitoring
- Function execution logs

### Error Tracking

- Next.js built-in error reporting
- Vercel Error Tracking
- Consider adding Sentry for production

## Rollback Strategy

### Quick Rollback

1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"

### Git Rollback

```bash
# Revert last commit
git revert HEAD

# Or revert to specific commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
```

## Database Migrations

### Apply Migrations

```bash
# Local development
npx supabase db reset

# Production (via Supabase dashboard)
# Apply migrations manually in SQL Editor
```

### Backup Strategy

- Supabase provides automatic daily backups
- Point-in-time recovery available
- Consider custom backup scripts for critical data

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] Supabase RLS policies are enabled
- [ ] API rate limiting is configured
- [ ] CORS settings are restrictive
- [ ] Dependencies are up to date
- [ ] Security headers are configured

## Performance Optimization

### Build Optimization

- Next.js automatically optimizes builds
- Image optimization via `next/image`
- Automatic code splitting

### Monitoring

- Monitor Core Web Vitals in Vercel dashboard
- Set up alerts for performance degradation
- Regular lighthouse audits

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check TypeScript errors
   - Verify environment variables
   - Review dependency versions

2. **Runtime Errors:**
   - Check Vercel function logs
   - Verify Supabase connection
   - Review API endpoint responses

3. **Performance Issues:**
   - Analyze bundle size
   - Check image optimization
   - Review database query performance

### Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Review security audit reports
- Monitor performance metrics
- Backup critical data

### Health Checks

- Automated uptime monitoring
- API endpoint testing
- Database connection verification
# 🚀 Goldium DApp - Domain Deployment Guide

## 📋 Quick Start

### Option 1: Vercel (Recommended - Free)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Upload the `goldium-manual-deploy` folder (zip it first)
5. Set environment variables:
   - `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`
   - `NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com`
6. Deploy! Your app will be live at `https://your-project.vercel.app`

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag and drop the `goldium-manual-deploy` folder (zip it first)
4. Set environment variables in Site Settings
5. Your app will be live at `https://your-site.netlify.app`

### Option 3: Traditional Hosting (Hostinger, cPanel, etc.)
1. Upload `goldium-manual-deploy` folder contents to your hosting via FTP/File Manager
2. In your hosting control panel:
   - Set Node.js version to 16+
   - Run: `npm install`
   - Run: `npm run build`
   - Set startup file to `server.js` or `npm start`
3. Configure environment variables

## 🌐 Custom Domain Setup

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

### For Traditional Hosting:
1. Point your domain to hosting server
2. Configure web server (Apache/Nginx)
3. Set up SSL certificate

## ⚙️ Environment Variables

Add these to your hosting platform:

```
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_JUPITER_API=https://quote-api.jup.ag/v6
```

## 🔧 Advanced Configuration

### For Production Optimization:
1. Enable compression (gzip/brotli)
2. Set up CDN
3. Configure caching headers
4. Enable HTTPS

### Performance Tips:
- Use Solana RPC endpoints with good performance
- Consider using paid RPC providers for better reliability
- Enable image optimization
- Set up monitoring

## 🚨 Troubleshooting

### Build Issues:
- Ensure Node.js 16+ is installed
- Clear cache: `npm run clean` or delete `.next` folder
- Check environment variables are set correctly

### Runtime Issues:
- Check browser console for errors
- Verify Solana network connectivity
- Ensure wallet adapter is working

### Common Fixes:
- If wallet connection fails: Check RPC endpoint
- If transactions fail: Verify network (mainnet/devnet)
- If UI breaks: Check for missing environment variables

## 📱 Features Included

✅ Wallet Connection (Phantom, Solflare, etc.)
✅ Token Swapping via Jupiter
✅ Portfolio Analytics
✅ Market Dashboard
✅ Transaction History
✅ Notification Center
✅ Staking Interface
✅ Real-time Price Data
✅ Responsive Design
✅ Dark Theme

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Solana Documentation](https://docs.solana.com)
- [Next.js Documentation](https://nextjs.org/docs)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Check hosting platform logs
4. Ensure your domain DNS is configured correctly

---

**🎉 Congratulations! Your Goldium DApp is ready for the world!**

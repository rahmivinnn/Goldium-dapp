const fs = require('fs');
const path = require('path');

console.log('🚀 Goldium Domain Deployment Manager');
console.log('===================================');

async function main() {
  try {
    console.log('📦 Preparing deployment package...');
    
    // Create comprehensive deployment guide
    const deploymentGuide = `# 🚀 Goldium DApp - Domain Deployment Guide

## 📋 Quick Start

### Option 1: Vercel (Recommended - Free)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Upload the \`goldium-manual-deploy\` folder (zip it first)
5. Set environment variables:
   - \`NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta\`
   - \`NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com\`
6. Deploy! Your app will be live at \`https://your-project.vercel.app\`

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag and drop the \`goldium-manual-deploy\` folder (zip it first)
4. Set environment variables in Site Settings
5. Your app will be live at \`https://your-site.netlify.app\`

### Option 3: Traditional Hosting (Hostinger, cPanel, etc.)
1. Upload \`goldium-manual-deploy\` folder contents to your hosting via FTP/File Manager
2. In your hosting control panel:
   - Set Node.js version to 16+
   - Run: \`npm install\`
   - Run: \`npm run build\`
   - Set startup file to \`server.js\` or \`npm start\`
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

\`\`\`
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_JUPITER_API=https://quote-api.jup.ag/v6
\`\`\`

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
- Clear cache: \`npm run clean\` or delete \`.next\` folder
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

✅ Wallet Connection (Phantom, Solflare, etc.)\n✅ Token Swapping via Jupiter\n✅ Portfolio Analytics\n✅ Market Dashboard\n✅ Transaction History\n✅ Notification Center\n✅ Staking Interface\n✅ Real-time Price Data\n✅ Responsive Design\n✅ Dark Theme

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
`;

    fs.writeFileSync('DOMAIN_DEPLOYMENT_GUIDE.md', deploymentGuide);
    
    // Create a simple server.js for traditional hosting
    const serverJs = `const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
  .once('error', (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(\`> Ready on http://\${hostname}:\${port}\`);
  });
});
`;

    fs.writeFileSync(path.join('goldium-manual-deploy', 'server.js'), serverJs);
    
    // Update package.json with deployment scripts
    const packagePath = path.join('goldium-manual-deploy', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "node server.js",
      "build": "next build",
      "dev": "next dev",
      "clean": "rimraf .next out"
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    
    // Create deployment instructions
    const quickStart = `# 🚀 QUICK DEPLOYMENT INSTRUCTIONS

## Ready-to-Deploy Package: goldium-manual-deploy/

### 🎯 Fastest Deployment (Vercel - Recommended):
1. Zip the 'goldium-manual-deploy' folder
2. Go to vercel.com and create account
3. Upload the zip file
4. Add environment variables:
   - NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   - NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
5. Deploy! ✨

### 📁 Package Contents:
- Complete Next.js application
- All source code and components
- Configuration files
- Public assets
- Server setup for traditional hosting

### 🌐 Your Domain Options:
- Vercel: your-project.vercel.app (free custom domain)
- Netlify: your-site.netlify.app (free custom domain)
- Traditional hosting: your-domain.com

See DOMAIN_DEPLOYMENT_GUIDE.md for detailed instructions.
`;
    
    fs.writeFileSync('QUICK_START.md', quickStart);
    
    console.log('\n🎉 Domain Deployment Package Ready!');
    console.log('=====================================');
    console.log('📁 Files created:');
    console.log('   • goldium-manual-deploy/ (Complete deployment package)');
    console.log('   • DOMAIN_DEPLOYMENT_GUIDE.md (Detailed instructions)');
    console.log('   • QUICK_START.md (Quick deployment steps)');
    console.log('   • server.js (Added to deployment package)');
    console.log('\n🚀 Next Steps:');
    console.log('1. Choose your hosting platform (Vercel recommended)');
    console.log('2. Follow QUICK_START.md for fastest deployment');
    console.log('3. Or see DOMAIN_DEPLOYMENT_GUIDE.md for detailed options');
    console.log('4. Zip the goldium-manual-deploy folder');
    console.log('5. Upload to your chosen platform');
    console.log('6. Configure environment variables');
    console.log('7. Deploy and enjoy your live Goldium DApp!');
    console.log('\n🌐 Your app will be accessible at your custom domain!');
    
  } catch (error) {
    console.error('❌ Deployment preparation failed:', error.message);
    process.exit(1);
  }
}

main();
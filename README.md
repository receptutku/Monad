# Monad Parallel Auctions Frontend

A modern, elegant frontend for commit-reveal based uniform price batch auctions on Monad blockchain.

## 🚀 Features

- **Commit-Reveal Mechanism**: MEV-resistant auction system
- **Uniform Price Discovery**: Fair clearing price for all participants
- **Parallel Execution**: Finalize multiple pools simultaneously
- **Modern UI/UX**: Premium design with smooth animations
- **Wallet Integration**: RainbowKit for seamless wallet connection
- **Real-time Updates**: Live pool status and bid tracking
- **Responsive Design**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + RainbowKit
- **State Management**: React Query
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/monad-parallel-auctions.git
cd monad-parallel-auctions
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update contract addresses in `src/lib/constants.ts`:
```typescript
export const CONTRACTS = {
  PARALLEL_AUCTIONS: '0x...', // Your deployed contract address
  MOCK_ERC20: '0x...', // Your MockERC20 contract address
} as const;
```

5. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── market/            # Market page
│   └── pool/[id]/         # Pool detail pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── web3/             # Web3 related components
│   ├── auction/          # Auction specific components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
└── types/                # TypeScript type definitions
```

## 🎯 Key Components

### Auction Flow
- **CreatePoolModal**: Create new auction pools
- **CommitBidForm**: Submit secret bids
- **RevealBidForm**: Reveal bids with ETH deposit
- **BidsTable**: View all revealed bids
- **FinalizeButton**: Finalize pools and allocate tokens

### UI Components
- **Button**: Customizable button with variants
- **Card**: Modern card component
- **Modal**: Accessible modal dialogs
- **Badge**: Status and category badges
- **LoadingSpinner**: Animated loading indicators
- **CountdownTimer**: Real-time countdown timers

## 🔧 Configuration

### Wallet Connection
The app uses RainbowKit for wallet connection. Configure your project ID in `src/lib/wagmi.ts`:

```typescript
export const config = getDefaultConfig({
  appName: 'Monad Parallel Auctions',
  projectId: 'YOUR_PROJECT_ID', // Get from https://cloud.walletconnect.com/
  chains: [NETWORKS.MONAD_TESTNET, ...],
});
```

### Network Configuration
Update network settings in `src/lib/constants.ts`:

```typescript
export const NETWORKS = {
  MONAD_TESTNET: {
    chainId: 10143,
    name: 'Monad Testnet',
    rpcUrl: 'https://testnet-rpc.monad.xyz',
    blockExplorer: 'https://testnet-explorer.monad.xyz',
  },
};
```

## 🎨 Customization

### Theme Colors
Modify colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        // ... more shades
      },
    },
  },
}
```

### Animations
Customize animations in `src/app/globals.css`:

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
```bash
npm run build
npm start
```

## 📱 Mobile Support

The app is fully responsive and optimized for mobile devices:
- Touch-friendly interfaces
- Optimized layouts for small screens
- Mobile wallet integration
- Progressive Web App (PWA) support

## 🔒 Security Features

- **MEV Protection**: Commit-reveal mechanism prevents front-running
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error handling and user feedback
- **Wallet Security**: Secure wallet connection and transaction handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monad](https://monad.xyz) for the amazing blockchain platform
- [RainbowKit](https://rainbowkit.com) for wallet integration
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Next.js](https://nextjs.org) for the React framework

## 📞 Support

For support, email support@monad-auctions.com or join our Discord community.

---

Built with ❤️ for the Monad ecosystem


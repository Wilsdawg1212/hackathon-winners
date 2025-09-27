# GroupSafe - Production-Ready MVP

A fully functional, blockchain-integrated group treasury management system built with Gnosis Safe, real on-chain policy enforcement, and Supabase persistence.

## 🚀 Features

- **Real Gnosis Safe Integration**: Create, propose, confirm, and execute transactions using Safe Transaction Service
- **On-Chain Policy Enforcement**: Smart contracts that block non-compliant transactions at execution time
- **Multi-Chain Support**: Gnosis Chain (default), Chiado testnet, and Ethereum mainnet
- **Persistent Activity Logging**: Supabase-backed activity tracking for all transactions
- **Owner Controls**: Pause/unpause spending, manage recipients, set transaction limits
- **Real-Time UI**: Live policy checks, transaction status, and approval workflows

## 🏗️ Architecture

### Smart Contracts (Foundry)
- **GroupOpsPolicy.sol**: Policy contract defining spending rules (paused state, allowed recipients, max per transaction)
- **GroupOpsGuard.sol**: Safe Guard that enforces policy rules at transaction execution time
- **Comprehensive Tests**: Full test coverage for all policy scenarios

### Frontend (Next.js + TypeScript)
- **Safe Integration**: Protocol Kit + API Kit for Safe transaction management
- **Real-Time Data**: Live policy status, pending transactions, activity feed
- **Multi-Wallet Support**: Wagmi integration with wallet connection
- **Responsive UI**: Modern, accessible interface with Tailwind CSS

### Backend (Next.js API Routes)
- **Policy API**: Read policy state from on-chain contracts
- **Safe API**: Propose, confirm, and execute Safe transactions
- **Activity API**: Supabase-backed activity logging and retrieval

## 🛠️ Setup Instructions

### 1. Environment Configuration

Copy the environment template and fill in your values:

```bash
cp env.example .env.local
```

Required environment variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=100                    # 100=Gnosis, 10200=Chiado, 1=Mainnet
NEXT_PUBLIC_RPC_URL=https://rpc.gnosis.gateway.fm
NEXT_PUBLIC_EXPLORER_TX_PREFIX=https://gnosis.blockscout.com/tx/

# Safe Configuration
NEXT_PUBLIC_SAFE_ADDRESS=0x...              # Your existing Safe address
SAFE_TX_SERVICE_URL=https://safe-transaction-gnosis-chain.safe.global
SAFE_API=your_safe_api_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Development Only
PRIVATE_KEY=your_private_key_for_testing     # Only for local development
```

### 2. Install Dependencies

```bash
# Frontend dependencies
npm install

# Foundry for smart contracts
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 3. Deploy Smart Contracts

```bash
# Install OpenZeppelin contracts
cd contracts
forge install OpenZeppelin/openzeppelin-contracts

# Build contracts
forge build

# Deploy to your network
forge script script/Deploy.s.sol --rpc-url $NEXT_PUBLIC_RPC_URL --broadcast --private-key $PRIVATE_KEY

# Note the deployed addresses and update your .env.local
```

### 4. Set Safe Guard

After deploying contracts, set the guard on your Safe:

```bash
# Generate calldata for setting the guard
forge script script/SetSafeGuard.s.sol --rpc-url $NEXT_PUBLIC_RPC_URL

# Submit the transaction through your Safe interface or use the frontend
```

### 5. Initialize Supabase

Create the activity table in your Supabase project:

```sql
CREATE TABLE activity (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  at timestamptz DEFAULT now(),
  type text CHECK (type IN ('EXECUTED', 'PENDING', 'BLOCKED')),
  to text NOT NULL,
  token text NOT NULL,
  amount text NOT NULL,
  actor text NOT NULL,
  tx_hash text,
  reason text
);

CREATE INDEX idx_activity_at ON activity(at DESC);
```

### 6. Run the Application

```bash
# Start the development server
npm run dev

# Open http://localhost:3000
```

## 📋 Usage Guide

### For Safe Owners

1. **Connect Wallet**: Use the wallet connection to access owner features
2. **Configure Policy**: Set allowed recipients and transaction limits
3. **Pause/Unpause**: Control spending with the pause toggle
4. **Review Approvals**: Confirm pending transactions in the Approvals page

### For Users

1. **Make Payments**: Use the Pay page to send funds through the Safe
2. **View Activity**: Track all transactions in the Activity page
3. **Check Status**: See real-time policy compliance before submitting

## 🔧 API Endpoints

### Policy Management
- `GET /api/policy/summary` - Get current policy state
- `POST /api/policy/pause` - Pause/unpause spending (owner only)

### Safe Operations
- `POST /api/safe/pay` - Submit payment request
- `GET /api/safe/approvals/list` - List pending transactions
- `POST /api/safe/approvals/confirm` - Confirm pending transaction

### Activity Tracking
- `GET /api/activity` - List activity with optional filters
- `POST /api/activity` - Append new activity (internal use)

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
forge test
```

### Frontend Testing
```bash
npm run test
```

### Integration Testing
1. Deploy to testnet (Chiado)
2. Fund test accounts with test tokens
3. Test full payment flow
4. Verify policy enforcement

## 🚨 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Safe Ownership**: Ensure only trusted addresses are Safe owners
- **Policy Configuration**: Review policy settings before enabling
- **Guard Deployment**: Verify guard is properly set on Safe
- **Network Security**: Use secure RPC endpoints in production

## 🔄 Deployment

### Production Checklist

1. **Environment**: Set production environment variables
2. **Contracts**: Deploy to mainnet with verified source code
3. **Safe**: Configure production Safe with proper owners
4. **Database**: Set up production Supabase instance
5. **Monitoring**: Implement logging and error tracking
6. **Backup**: Regular database backups and contract state snapshots

### Network-Specific Configuration

**Gnosis Chain (Recommended)**
- RPC: `https://rpc.gnosis.gateway.fm`
- Explorer: `https://gnosis.blockscout.com/tx/`
- Safe Service: `https://safe-transaction-gnosis-chain.safe.global`

**Chiado Testnet**
- RPC: `https://rpc.chiado.gnosis.gateway.fm`
- Explorer: `https://gnosis-chiado.blockscout.com/tx/`
- Safe Service: `https://safe-transaction-chiado.safe.global`

## 📚 Development

### Project Structure
```
web/
├── contracts/           # Smart contracts (Foundry)
├── src/
│   ├── app/            # Next.js pages and API routes
│   ├── components/     # React components
│   ├── lib/            # Utilities and configurations
│   └── types/          # TypeScript type definitions
└── public/             # Static assets
```

### Key Files
- `src/lib/safe.ts` - Safe integration logic
- `src/lib/supabase.ts` - Database operations
- `src/lib/chain.ts` - Chain configuration
- `contracts/src/GroupOpsPolicy.sol` - Policy contract
- `contracts/src/GroupOpsGuard.sol` - Guard contract

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information
4. Join our community discussions

---

**Built with ❤️ for the Gnosis Safe ecosystem**
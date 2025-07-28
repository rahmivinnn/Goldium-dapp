import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { TOKENS } from '../config/tokens';
import { notify } from '../utils/notifications';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  category: 'TREASURY' | 'PROTOCOL' | 'GOVERNANCE' | 'COMMUNITY';
  status: 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED' | 'CANCELLED';
  votingPower: {
    for: number;
    against: number;
    abstain: number;
  };
  quorum: number;
  threshold: number;
  startTime: number;
  endTime: number;
  executionTime?: number;
  actions: ProposalAction[];
  votes: Vote[];
  metadata: {
    ipfsHash?: string;
    tags: string[];
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
}

export interface ProposalAction {
  type: 'TRANSFER' | 'PARAMETER_CHANGE' | 'UPGRADE' | 'CUSTOM';
  target: string;
  value?: number;
  data?: string;
  description: string;
}

export interface Vote {
  voter: string;
  proposal: string;
  choice: 'FOR' | 'AGAINST' | 'ABSTAIN';
  power: number;
  timestamp: number;
  reason?: string;
}

export interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  totalVoters: number;
  totalVotingPower: number;
  participationRate: number;
  treasuryBalance: number;
  governanceTokenSupply: number;
}

export interface VotingPower {
  wallet: string;
  tokenBalance: number;
  stakedBalance: number;
  delegatedPower: number;
  totalPower: number;
  multiplier: number;
}

export interface Delegation {
  delegator: string;
  delegate: string;
  power: number;
  timestamp: number;
  active: boolean;
}

class GovernanceService {
  private proposals: Map<string, Proposal> = new Map();
  private votes: Map<string, Vote[]> = new Map();
  private delegations: Map<string, Delegation[]> = new Map();
  private votingPowers: Map<string, VotingPower> = new Map();
  private subscribers: Set<() => void> = new Set();

  constructor() {
    this.initializeGovernance();
  }

  private async initializeGovernance() {
    // Load governance data from localStorage
    try {
      const storedProposals = localStorage.getItem('governance_proposals');
      if (storedProposals) {
        const proposalsArray = JSON.parse(storedProposals);
        proposalsArray.forEach((proposal: Proposal) => {
          this.proposals.set(proposal.id, proposal);
        });
      }

      const storedVotes = localStorage.getItem('governance_votes');
      if (storedVotes) {
        const votesData = JSON.parse(storedVotes);
        Object.entries(votesData).forEach(([proposalId, votes]) => {
          this.votes.set(proposalId, votes as Vote[]);
        });
      }
    } catch (error) {
      console.error('Error loading governance data:', error);
    }

    // Initialize with sample proposals for demonstration
    if (this.proposals.size === 0) {
      this.createSampleProposals();
    }
  }

  private createSampleProposals() {
    const sampleProposals: Proposal[] = [
      {
        id: 'prop-001',
        title: 'Increase Staking Rewards APY to 12%',
        description: 'Proposal to increase the annual percentage yield for SOL staking from 8% to 12% to attract more liquidity and improve platform competitiveness.',
        proposer: 'GoldiumDAO',
        category: 'PROTOCOL',
        status: 'ACTIVE',
        votingPower: { for: 15420, against: 3280, abstain: 1100 },
        quorum: 10000,
        threshold: 60,
        startTime: Date.now() - (2 * 24 * 60 * 60 * 1000),
        endTime: Date.now() + (5 * 24 * 60 * 60 * 1000),
        actions: [
          {
            type: 'PARAMETER_CHANGE',
            target: 'StakingPool',
            description: 'Update APY parameter from 8% to 12%',
            data: JSON.stringify({ newAPY: 12 })
          }
        ],
        votes: [],
        metadata: {
          tags: ['staking', 'rewards', 'apy'],
          priority: 'HIGH'
        }
      },
      {
        id: 'prop-002',
        title: 'Treasury Allocation for Marketing Campaign',
        description: 'Allocate 50,000 GOLD tokens from treasury for a 3-month marketing campaign to increase platform adoption and user base.',
        proposer: 'MarketingTeam',
        category: 'TREASURY',
        status: 'ACTIVE',
        votingPower: { for: 8750, against: 12300, abstain: 950 },
        quorum: 10000,
        threshold: 50,
        startTime: Date.now() - (1 * 24 * 60 * 60 * 1000),
        endTime: Date.now() + (6 * 24 * 60 * 60 * 1000),
        actions: [
          {
            type: 'TRANSFER',
            target: 'MarketingWallet',
            value: 50000,
            description: 'Transfer 50,000 GOLD tokens for marketing campaign'
          }
        ],
        votes: [],
        metadata: {
          tags: ['treasury', 'marketing', 'growth'],
          priority: 'MEDIUM'
        }
      },
      {
        id: 'prop-003',
        title: 'Implement Cross-Chain Bridge to Ethereum',
        description: 'Develop and deploy a secure cross-chain bridge to enable GOLD token transfers between Solana and Ethereum networks.',
        proposer: 'TechTeam',
        category: 'PROTOCOL',
        status: 'PASSED',
        votingPower: { for: 28500, against: 4200, abstain: 2100 },
        quorum: 10000,
        threshold: 66,
        startTime: Date.now() - (10 * 24 * 60 * 60 * 1000),
        endTime: Date.now() - (3 * 24 * 60 * 60 * 1000),
        executionTime: Date.now() + (30 * 24 * 60 * 60 * 1000),
        actions: [
          {
            type: 'UPGRADE',
            target: 'Protocol',
            description: 'Deploy cross-chain bridge smart contracts',
            data: JSON.stringify({ bridgeType: 'ethereum', security: 'multisig' })
          }
        ],
        votes: [],
        metadata: {
          tags: ['cross-chain', 'ethereum', 'bridge'],
          priority: 'CRITICAL'
        }
      }
    ];

    sampleProposals.forEach(proposal => {
      this.proposals.set(proposal.id, proposal);
    });

    this.saveProposals();
  }

  public async createProposal(
    title: string,
    description: string,
    category: Proposal['category'],
    actions: ProposalAction[],
    proposer: string,
    metadata: Partial<Proposal['metadata']> = {}
  ): Promise<string> {
    const proposalId = `prop-${Date.now()}`;
    const now = Date.now();
    
    const proposal: Proposal = {
      id: proposalId,
      title,
      description,
      proposer,
      category,
      status: 'ACTIVE',
      votingPower: { for: 0, against: 0, abstain: 0 },
      quorum: 10000, // Minimum voting power required
      threshold: category === 'PROTOCOL' ? 66 : 50, // Percentage needed to pass
      startTime: now,
      endTime: now + (7 * 24 * 60 * 60 * 1000), // 7 days voting period
      actions,
      votes: [],
      metadata: {
        tags: metadata.tags || [],
        priority: metadata.priority || 'MEDIUM',
        ipfsHash: metadata.ipfsHash
      }
    };

    this.proposals.set(proposalId, proposal);
    this.votes.set(proposalId, []);
    this.saveProposals();
    this.notifySubscribers();

    notify({ type: 'success', message: 'Proposal created successfully!' });
    return proposalId;
  }

  public async vote(
    proposalId: string,
    choice: Vote['choice'],
    voter: string,
    reason?: string
  ): Promise<boolean> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      notify({ type: 'error', message: 'Proposal not found' });
      return false;
    }

    if (proposal.status !== 'ACTIVE') {
      notify({ type: 'error', message: 'Proposal is not active' });
      return false;
    }

    if (Date.now() > proposal.endTime) {
      notify({ type: 'error', message: 'Voting period has ended' });
      return false;
    }

    // Check if user already voted
    const existingVotes = this.votes.get(proposalId) || [];
    const existingVote = existingVotes.find(v => v.voter === voter);
    
    if (existingVote) {
      notify({ type: 'error', message: 'You have already voted on this proposal' });
      return false;
    }

    // Calculate voting power
    const votingPower = await this.calculateVotingPower(voter);
    
    if (votingPower.totalPower === 0) {
      notify({ type: 'error', message: 'You have no voting power' });
      return false;
    }

    // Create vote
    const vote: Vote = {
      voter,
      proposal: proposalId,
      choice,
      power: votingPower.totalPower,
      timestamp: Date.now(),
      reason
    };

    // Add vote
    existingVotes.push(vote);
    this.votes.set(proposalId, existingVotes);

    // Update proposal voting power
    switch (choice) {
      case 'FOR':
        proposal.votingPower.for += vote.power;
        break;
      case 'AGAINST':
        proposal.votingPower.against += vote.power;
        break;
      case 'ABSTAIN':
        proposal.votingPower.abstain += vote.power;
        break;
    }

    this.proposals.set(proposalId, proposal);
    this.saveProposals();
    this.saveVotes();
    this.notifySubscribers();

    notify({ type: 'success', message: `Vote cast successfully! Power: ${vote.power.toLocaleString()}` });
    return true;
  }

  public async calculateVotingPower(wallet: string): Promise<VotingPower> {
    // In a real implementation, this would query the blockchain
    // For now, we'll simulate based on token holdings and staking
    
    // Mock data - in production, fetch from blockchain
    const tokenBalance = Math.floor(Math.random() * 10000) + 1000;
    const stakedBalance = Math.floor(Math.random() * 5000);
    const delegatedPower = this.getDelegatedPower(wallet);
    
    // Calculate multiplier based on staking duration and amount
    let multiplier = 1;
    if (stakedBalance > 1000) multiplier += 0.5;
    if (stakedBalance > 5000) multiplier += 0.5;
    
    const totalPower = Math.floor((tokenBalance + stakedBalance + delegatedPower) * multiplier);
    
    const votingPower: VotingPower = {
      wallet,
      tokenBalance,
      stakedBalance,
      delegatedPower,
      totalPower,
      multiplier
    };
    
    this.votingPowers.set(wallet, votingPower);
    return votingPower;
  }

  private getDelegatedPower(wallet: string): number {
    const delegations = this.delegations.get(wallet) || [];
    return delegations
      .filter(d => d.active && d.delegate === wallet)
      .reduce((sum, d) => sum + d.power, 0);
  }

  public async delegateVotingPower(
    delegator: string,
    delegate: string,
    amount: number
  ): Promise<boolean> {
    const delegatorPower = await this.calculateVotingPower(delegator);
    
    if (amount > delegatorPower.totalPower) {
      notify({ type: 'error', message: 'Insufficient voting power to delegate' });
      return false;
    }

    const delegation: Delegation = {
      delegator,
      delegate,
      power: amount,
      timestamp: Date.now(),
      active: true
    };

    const existingDelegations = this.delegations.get(delegator) || [];
    existingDelegations.push(delegation);
    this.delegations.set(delegator, existingDelegations);

    notify({ type: 'success', message: `Delegated ${amount.toLocaleString()} voting power to ${delegate}` });
    return true;
  }

  public async executeProposal(proposalId: string): Promise<boolean> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return false;

    if (proposal.status !== 'PASSED') {
      notify({ type: 'error', message: 'Proposal has not passed' });
      return false;
    }

    // Simulate execution
    proposal.status = 'EXECUTED';
    proposal.executionTime = Date.now();
    
    this.proposals.set(proposalId, proposal);
    this.saveProposals();
    this.notifySubscribers();

    notify({ type: 'success', message: 'Proposal executed successfully!' });
    return true;
  }

  public checkProposalStatus(proposalId: string): void {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'ACTIVE') return;

    const now = Date.now();
    if (now > proposal.endTime) {
      const totalVotes = proposal.votingPower.for + proposal.votingPower.against + proposal.votingPower.abstain;
      
      if (totalVotes >= proposal.quorum) {
        const forPercentage = (proposal.votingPower.for / totalVotes) * 100;
        
        if (forPercentage >= proposal.threshold) {
          proposal.status = 'PASSED';
          notify({ type: 'success', message: `Proposal "${proposal.title}" has passed!` });
        } else {
          proposal.status = 'REJECTED';
          notify({ type: 'info', message: `Proposal "${proposal.title}" was rejected.` });
        }
      } else {
        proposal.status = 'REJECTED';
        notify({ type: 'info', message: `Proposal "${proposal.title}" failed to reach quorum.` });
      }
      
      this.proposals.set(proposalId, proposal);
      this.saveProposals();
      this.notifySubscribers();
    }
  }

  public getProposals(filter?: {
    status?: Proposal['status'];
    category?: Proposal['category'];
    proposer?: string;
  }): Proposal[] {
    let proposals = Array.from(this.proposals.values());
    
    if (filter) {
      if (filter.status) {
        proposals = proposals.filter(p => p.status === filter.status);
      }
      if (filter.category) {
        proposals = proposals.filter(p => p.category === filter.category);
      }
      if (filter.proposer) {
        proposals = proposals.filter(p => p.proposer === filter.proposer);
      }
    }
    
    return proposals.sort((a, b) => b.startTime - a.startTime);
  }

  public getProposal(proposalId: string): Proposal | null {
    return this.proposals.get(proposalId) || null;
  }

  public getVotes(proposalId: string): Vote[] {
    return this.votes.get(proposalId) || [];
  }

  public getGovernanceStats(): GovernanceStats {
    const proposals = Array.from(this.proposals.values());
    const activeProposals = proposals.filter(p => p.status === 'ACTIVE').length;
    
    const allVotes = Array.from(this.votes.values()).flat();
    const uniqueVoters = new Set(allVotes.map(v => v.voter)).size;
    const totalVotingPower = Array.from(this.votingPowers.values())
      .reduce((sum, vp) => sum + vp.totalPower, 0);
    
    const participationRate = proposals.length > 0 ? 
      (uniqueVoters / Math.max(1, this.votingPowers.size)) * 100 : 0;
    
    return {
      totalProposals: proposals.length,
      activeProposals,
      totalVoters: uniqueVoters,
      totalVotingPower,
      participationRate,
      treasuryBalance: 1250000, // Mock treasury balance
      governanceTokenSupply: 10000000 // Mock token supply
    };
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }

  private saveProposals(): void {
    try {
      const proposalsArray = Array.from(this.proposals.values());
      localStorage.setItem('governance_proposals', JSON.stringify(proposalsArray));
    } catch (error) {
      console.error('Error saving proposals:', error);
    }
  }

  private saveVotes(): void {
    try {
      const votesObject = Object.fromEntries(this.votes);
      localStorage.setItem('governance_votes', JSON.stringify(votesObject));
    } catch (error) {
      console.error('Error saving votes:', error);
    }
  }

  // Periodically check proposal statuses
  public startStatusChecker(): void {
    setInterval(() => {
      this.proposals.forEach((_, proposalId) => {
        this.checkProposalStatus(proposalId);
      });
    }, 60000); // Check every minute
  }
}

// Export singleton instance
export const governanceService = new GovernanceService();
export default governanceService;
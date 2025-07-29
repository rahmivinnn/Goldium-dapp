import { FC, useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { governanceService, Proposal, Vote, GovernanceStats, VotingPower } from '../services/governanceService';
import { notify } from '../utils/notifications';
import { SOLSCAN_CONFIG } from '../config/tokens';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';

interface CreateProposalForm {
  title: string;
  description: string;
  category: Proposal['category'];
  actionType: 'TRANSFER' | 'PARAMETER_CHANGE' | 'UPGRADE';
  actionTarget: string;
  actionValue: string;
  actionDescription: string;
}

export const GovernanceDashboard: FC = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();
  
  const [activeTab, setActiveTab] = useState<'proposals' | 'create' | 'voting' | 'stats'>('proposals');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [governanceStats, setGovernanceStats] = useState<GovernanceStats | null>(null);
  const [votingPower, setVotingPower] = useState<VotingPower | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PASSED' | 'REJECTED'>('ALL');
  
  const [createForm, setCreateForm] = useState<CreateProposalForm>({
    title: '',
    description: '',
    category: 'PROTOCOL',
    actionType: 'PARAMETER_CHANGE',
    actionTarget: '',
    actionValue: '',
    actionDescription: ''
  });

  // Load governance data
  useEffect(() => {
    loadGovernanceData();
    
    // Subscribe to governance updates
    const unsubscribe = governanceService.subscribe(() => {
      loadGovernanceData();
    });
    
    // Start status checker
    governanceService.startStatusChecker();
    
    return unsubscribe;
  }, []);

  // Calculate voting power when wallet connects
  useEffect(() => {
    if (publicKey) {
      calculateVotingPower();
    }
  }, [publicKey]);

  const loadGovernanceData = useCallback(async () => {
    try {
      const allProposals = governanceService.getProposals();
      setProposals(allProposals);
      
      const stats = governanceService.getGovernanceStats();
      setGovernanceStats(stats);
    } catch (error) {
      console.error('Error loading governance data:', error);
    }
  }, []);

  const calculateVotingPower = useCallback(async () => {
    if (!publicKey) return;
    
    try {
      const power = await governanceService.calculateVotingPower(publicKey.toString());
      setVotingPower(power);
    } catch (error) {
      console.error('Error calculating voting power:', error);
    }
  }, [publicKey]);

  const handleVote = async (proposalId: string, choice: Vote['choice'], reason?: string) => {
    if (!publicKey || !votingPower) {
      notify({ type: 'error', message: 'Please connect your wallet to vote' });
      return;
    }

    if (votingPower.totalPower === 0) {
      notify({ type: 'error', message: 'You have no voting power' });
      return;
    }

    setIsLoading(true);
    try {
      const success = await governanceService.vote(
        proposalId,
        choice,
        publicKey.toString(),
        reason
      );
      
      if (success) {
        await loadGovernanceData();
        setSelectedProposal(null);
      }
    } catch (error) {
      console.error('Error voting:', error);
      notify({ type: 'error', message: 'Failed to cast vote' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProposal = async () => {
    if (!publicKey) {
      notify({ type: 'error', message: 'Please connect your wallet to create proposals' });
      return;
    }

    if (!createForm.title || !createForm.description) {
      notify({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setIsLoading(true);
    try {
      const actions = [{
        type: createForm.actionType,
        target: createForm.actionTarget,
        value: createForm.actionValue ? parseFloat(createForm.actionValue) : undefined,
        description: createForm.actionDescription,
        data: JSON.stringify({
          type: createForm.actionType,
          target: createForm.actionTarget,
          value: createForm.actionValue
        })
      }];

      await governanceService.createProposal(
        createForm.title,
        createForm.description,
        createForm.category,
        actions,
        publicKey.toString(),
        {
          tags: [createForm.category.toLowerCase(), createForm.actionType.toLowerCase()],
          priority: 'MEDIUM'
        }
      );

      // Reset form
      setCreateForm({
        title: '',
        description: '',
        category: 'PROTOCOL',
        actionType: 'PARAMETER_CHANGE',
        actionTarget: '',
        actionValue: '',
        actionDescription: ''
      });
      
      setShowCreateForm(false);
      setActiveTab('proposals');
      await loadGovernanceData();
    } catch (error) {
      console.error('Error creating proposal:', error);
      notify({ type: 'error', message: 'Failed to create proposal' });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredProposals = () => {
    if (filter === 'ALL') return proposals;
    return proposals.filter(p => p.status === filter);
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'ACTIVE': return 'text-blue-400 bg-blue-400/20';
      case 'PASSED': return 'text-green-400 bg-green-400/20';
      case 'REJECTED': return 'text-red-400 bg-red-400/20';
      case 'EXECUTED': return 'text-purple-400 bg-purple-400/20';
      case 'CANCELLED': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryIcon = (category: Proposal['category']) => {
    switch (category) {
      case 'TREASURY': return '💰';
      case 'PROTOCOL': return '⚙️';
      case 'GOVERNANCE': return '🏛️';
      case 'COMMUNITY': return '👥';
      default: return '📋';
    }
  };

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const calculateQuorumProgress = (proposal: Proposal) => {
    const totalVotes = proposal.votingPower.for + proposal.votingPower.against + proposal.votingPower.abstain;
    return Math.min(100, (totalVotes / proposal.quorum) * 100);
  };

  const calculateApprovalRate = (proposal: Proposal) => {
    const totalVotes = proposal.votingPower.for + proposal.votingPower.against;
    if (totalVotes === 0) return 0;
    return (proposal.votingPower.for / totalVotes) * 100;
  };

  if (!publicKey) {
    return (
      <div className="bg-black/80 rounded-xl p-8 border border-gray-700">
        <div className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Governance Dashboard</h3>
          <p className="text-gray-400 mb-4">
            Connect your wallet to participate in DAO governance, vote on proposals, and help shape the future of Goldium.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Governance Dashboard</h2>
          <p className="text-gray-400">Participate in DAO governance and community decisions</p>
        </div>
        {votingPower && (
          <div className="bg-black/60 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm">Your Voting Power</div>
            <div className="text-white text-xl font-bold">{votingPower.totalPower.toLocaleString()}</div>
            <div className="text-gray-500 text-xs">Multiplier: {votingPower.multiplier}x</div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {governanceStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/80 rounded-xl p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Proposals</div>
            <div className="text-white text-2xl font-bold">{governanceStats.totalProposals}</div>
          </div>
          <div className="bg-black/80 rounded-xl p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Active Proposals</div>
            <div className="text-blue-400 text-2xl font-bold">{governanceStats.activeProposals}</div>
          </div>
          <div className="bg-black/80 rounded-xl p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Participation Rate</div>
            <div className="text-green-400 text-2xl font-bold">{governanceStats.participationRate.toFixed(1)}%</div>
          </div>
          <div className="bg-black/80 rounded-xl p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Treasury Balance</div>
            <div className="text-yellow-400 text-2xl font-bold">{(governanceStats.treasuryBalance / 1000000).toFixed(1)}M</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-black/40 rounded-lg p-1">
        {[
          { id: 'proposals', label: 'Proposals', icon: '📋' },
          { id: 'create', label: 'Create Proposal', icon: '✏️' },
          { id: 'voting', label: 'My Votes', icon: '🗳️' },
          { id: 'stats', label: 'Statistics', icon: '📊' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="flex gap-2">
              {['ALL', 'ACTIVE', 'PASSED', 'REJECTED'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>

            {/* Proposals List */}
            <div className="space-y-4">
              {getFilteredProposals().map((proposal) => (
                <div key={proposal.id} className="bg-black/80 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getCategoryIcon(proposal.category)}</span>
                      <div>
                        <h3 className="text-white text-lg font-semibold mb-1">{proposal.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(proposal.status)}`}>
                            {proposal.status}
                          </span>
                          <span className="text-gray-400 text-sm">{proposal.category}</span>
                          <span className="text-gray-500 text-sm">by {proposal.proposer}</span>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{proposal.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">{formatTimeRemaining(proposal.endTime)}</div>
                    </div>
                  </div>

                  {/* Voting Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Voting Progress</span>
                      <span className="text-gray-400 text-sm">
                        {calculateQuorumProgress(proposal).toFixed(1)}% of quorum
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${calculateQuorumProgress(proposal)}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-green-400 font-medium">{proposal.votingPower.for.toLocaleString()}</div>
                        <div className="text-gray-500">For</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-medium">{proposal.votingPower.against.toLocaleString()}</div>
                        <div className="text-gray-500">Against</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-medium">{proposal.votingPower.abstain.toLocaleString()}</div>
                        <div className="text-gray-500">Abstain</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProposal(proposal)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                    >
                      View Details
                    </button>
                    {proposal.status === 'ACTIVE' && votingPower && votingPower.totalPower > 0 && (
                      <>
                        <button
                          onClick={() => handleVote(proposal.id, 'FOR')}
                          disabled={isLoading}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        >
                          Vote For
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, 'AGAINST')}
                          disabled={isLoading}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        >
                          Vote Against
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">Create New Proposal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Title *</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter proposal title"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Description *</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Describe your proposal in detail"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Category</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="PROTOCOL">Protocol</option>
                    <option value="TREASURY">Treasury</option>
                    <option value="GOVERNANCE">Governance</option>
                    <option value="COMMUNITY">Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Action Type</label>
                  <select
                    value={createForm.actionType}
                    onChange={(e) => setCreateForm({ ...createForm, actionType: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="PARAMETER_CHANGE">Parameter Change</option>
                    <option value="TRANSFER">Transfer Funds</option>
                    <option value="UPGRADE">Protocol Upgrade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Action Target</label>
                <input
                  type="text"
                  value={createForm.actionTarget}
                  onChange={(e) => setCreateForm({ ...createForm, actionTarget: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Target contract or parameter"
                />
              </div>

              {createForm.actionType === 'TRANSFER' && (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Amount</label>
                  <input
                    type="number"
                    value={createForm.actionValue}
                    onChange={(e) => setCreateForm({ ...createForm, actionValue: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Amount to transfer"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm mb-2">Action Description</label>
                <textarea
                  value={createForm.actionDescription}
                  onChange={(e) => setCreateForm({ ...createForm, actionDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Describe what this action will do"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCreateProposal}
                  disabled={isLoading || !createForm.title || !createForm.description}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Creating...' : 'Create Proposal'}
                </button>
                <button
                  onClick={() => setActiveTab('proposals')}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'voting' && (
          <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">My Voting History</h3>
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🗳️</div>
              <p>Your voting history will appear here</p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && governanceStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Governance Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Proposals</span>
                  <span className="text-white font-medium">{governanceStats.totalProposals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Proposals</span>
                  <span className="text-blue-400 font-medium">{governanceStats.activeProposals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Voters</span>
                  <span className="text-white font-medium">{governanceStats.totalVoters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Participation Rate</span>
                  <span className="text-green-400 font-medium">{governanceStats.participationRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Voting Power</span>
                  <span className="text-white font-medium">{governanceStats.totalVotingPower.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/80 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Treasury Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Treasury Balance</span>
                  <span className="text-yellow-400 font-medium">
                    {(governanceStats.treasuryBalance / 1000000).toFixed(1)}M GOLD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Token Supply</span>
                  <span className="text-white font-medium">
                    {(governanceStats.governanceTokenSupply / 1000000).toFixed(1)}M GOLD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Treasury Ratio</span>
                  <span className="text-white font-medium">
                    {((governanceStats.treasuryBalance / governanceStats.governanceTokenSupply) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{selectedProposal.title}</h3>
              <button
                onClick={() => setSelectedProposal(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedProposal.status)}`}>
                    {selectedProposal.status}
                  </span>
                  <span className="text-gray-400 text-sm">{selectedProposal.category}</span>
                </div>
                <p className="text-gray-300">{selectedProposal.description}</p>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Actions</h4>
                <div className="space-y-2">
                  {selectedProposal.actions.map((action, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-3">
                      <div className="text-white font-medium">{action.type}</div>
                      <div className="text-gray-400 text-sm">{action.description}</div>
                      {action.value && (
                        <div className="text-gray-300 text-sm">Value: {action.value}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Voting Results</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-green-400 text-xl font-bold">{selectedProposal.votingPower.for.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">For</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 text-xl font-bold">{selectedProposal.votingPower.against.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Against</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 text-xl font-bold">{selectedProposal.votingPower.abstain.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Abstain</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-gray-400 text-sm mb-1">
                    Approval Rate: {calculateApprovalRate(selectedProposal).toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${calculateApprovalRate(selectedProposal)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {selectedProposal.status === 'ACTIVE' && votingPower && votingPower.totalPower > 0 && (
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleVote(selectedProposal.id, 'FOR')}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Vote For
                  </button>
                  <button
                    onClick={() => handleVote(selectedProposal.id, 'AGAINST')}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Vote Against
                  </button>
                  <button
                    onClick={() => handleVote(selectedProposal.id, 'ABSTAIN')}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Abstain
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernanceDashboard;
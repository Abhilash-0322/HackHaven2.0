import { useState, useEffect } from 'react';
import { 
  Coins, 
  Award, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  BookOpen, 
  User, 
  Gift, 
  Target,
  Zap,
  Star,
  Heart,
  Brain,
  Coffee,
  Clock,
  ChevronRight,
  Trophy,
  Flame,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const CoinsPage = () => {
  const { user, calmCoins, updateCalmCoins } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [rewards, setRewards] = useState([]);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    loadCoinsData();
  }, []);

  const loadCoinsData = async () => {
    setLoading(true);
    try {
      // Fetch transactions
      const transactionsResponse = await authService.authenticatedFetch(`${API_URL}/coins/transactions`);
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData || []);
      }
      
      // Update coins balance
      await updateCalmCoins();
      
      // Mock data for demo - in real app, these would come from backend
      setStreak(7); // 7-day streak
      setDailyGoals([
        { id: 1, title: "Chat with AI Therapist", target: 1, current: 1, coins: 10, completed: true, icon: MessageCircle },
        { id: 2, title: "Write in Journal", target: 1, current: 0, coins: 15, completed: false, icon: BookOpen },
        { id: 3, title: "Complete Mood Check", target: 1, current: 1, coins: 5, completed: true, icon: Heart },
        { id: 4, title: "Read Mental Health Article", target: 1, current: 0, coins: 8, completed: false, icon: Brain },
      ]);
      
      setAchievements([
        { id: 1, title: "First Steps", description: "Started your mental health journey", coins: 50, unlocked: true, icon: Star },
        { id: 2, title: "Consistent Chatter", description: "Chat for 7 days in a row", coins: 100, unlocked: true, icon: MessageCircle },
        { id: 3, title: "Mood Master", description: "Track mood for 30 days", coins: 200, unlocked: false, icon: Heart },
        { id: 4, title: "Wellness Warrior", description: "Earn 1000 total coins", coins: 300, unlocked: false, icon: Trophy },
      ]);
      
      setRewards([
        { id: 1, title: "Premium AI Insights", description: "Advanced personality analysis", cost: 100, type: "feature", icon: Brain },
        { id: 2, title: "Custom Meditation", description: "Personalized meditation sessions", cost: 150, type: "content", icon: Star },
        { id: 3, title: "1-on-1 Session", description: "Video call with certified therapist", cost: 500, type: "service", icon: User },
        { id: 4, title: "Mindfulness Course", description: "7-day guided mindfulness program", cost: 200, type: "course", icon: BookOpen },
      ]);
      
    } catch (error) {
      console.error('Error loading coins data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (source) => {
    const iconMap = {
      mental_health_chat: MessageCircle,
      journal: BookOpen,
      mood_tracking: Heart,
      appointment: User,
      daily_checkin: CheckCircle,
      achievement: Trophy
    };
    const IconComponent = iconMap[source] || Coins;
    return <IconComponent className="h-4 w-4" />;
  };

  const getTransactionColor = (type) => {
    return type === 'earn' ? 'text-green-600' : 'text-red-600';
  };

  const redeemReward = async (rewardId, cost) => {
    if (calmCoins < cost) {
      alert("You don't have enough coins for this reward!");
      return;
    }
    
    // In a real app, this would call the backend API
    try {
      const response = await authService.authenticatedFetch(`${API_URL}/coins/spend`, {
        method: 'POST',
        body: JSON.stringify({
          amount: cost,
          source: 'reward_redemption',
          description: `Redeemed reward: ${rewards.find(r => r.id === rewardId)?.title}`
        })
      });
      
      if (response.ok) {
        await updateCalmCoins();
        await loadCoinsData();
        alert("Reward redeemed successfully!");
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert("Failed to redeem reward. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calm Coins</h1>
              <p className="text-gray-600 mt-1">Earn coins through wellness activities and redeem amazing rewards</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-3xl font-bold text-indigo-600">
                <Coins className="h-8 w-8 mr-2" />
                {calmCoins}
              </div>
              <p className="text-sm text-gray-500">Current Balance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Streak & Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Current Streak</p>
                    <p className="text-3xl font-bold">{streak} days</p>
                  </div>
                  <Flame className="h-12 w-12 text-orange-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">This Week</p>
                    <p className="text-3xl font-bold">
                      {transactions.filter(t => 
                        t.transaction_type === 'earn' && 
                        new Date(t.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).reduce((sum, t) => sum + t.amount, 0)}
                    </p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Earned</p>
                    <p className="text-3xl font-bold">
                      {transactions.filter(t => t.transaction_type === 'earn').reduce((sum, t) => sum + t.amount, 0)}
                    </p>
                  </div>
                  <Award className="h-12 w-12 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Daily Goals */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Target className="h-6 w-6 mr-2 text-indigo-600" />
                  Daily Goals
                </h2>
                <span className="text-sm text-gray-500">
                  {dailyGoals.filter(g => g.completed).length}/{dailyGoals.length} completed
                </span>
              </div>
              
              <div className="space-y-4">
                {dailyGoals.map((goal) => {
                  const IconComponent = goal.icon;
                  const progress = Math.min((goal.current / goal.target) * 100, 100);
                  
                  return (
                    <div key={goal.id} className={`p-4 rounded-lg border-2 transition-all ${
                      goal.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            goal.completed ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              goal.completed ? 'text-green-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{goal.title}</h3>
                            <p className="text-sm text-gray-500">{goal.current}/{goal.target} completed</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {goal.completed && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          <div className="flex items-center text-indigo-600">
                            <Coins className="h-4 w-4 mr-1" />
                            <span className="font-medium">{goal.coins}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner border border-gray-200">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ease-out shadow-sm ${
                              goal.completed 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                                : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
                Achievements
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  
                  return (
                    <div key={achievement.id} className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked 
                        ? 'border-yellow-200 bg-yellow-50' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {achievement.title}
                          </h3>
                          <p className={`text-sm ${
                            achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {achievement.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <Coins className={`h-4 w-4 mr-1 ${
                              achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                            }`} />
                            <span className={`font-medium ${
                              achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                            }`}>
                              {achievement.coins} coins
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-gray-600" />
                Recent Activity
              </h2>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Coins className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400">Start earning coins by chatting with our AI or writing in your journal!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.transaction_type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {getTransactionIcon(transaction.source)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
                        </div>
                      </div>
                      <div className={`font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
                        {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Rewards Store */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Gift className="h-6 w-6 mr-2 text-pink-600" />
                Rewards Store
              </h2>
              
              <div className="space-y-4">
                {rewards.map((reward) => {
                  const IconComponent = reward.icon;
                  const canAfford = calmCoins >= reward.cost;
                  
                  return (
                    <div key={reward.id} className={`p-4 rounded-lg border-2 transition-all ${
                      canAfford ? 'border-indigo-200 hover:border-indigo-300' : 'border-gray-200 opacity-60'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          canAfford ? 'bg-indigo-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            canAfford ? 'text-indigo-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            canAfford ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {reward.title}
                          </h3>
                          <p className={`text-sm ${
                            canAfford ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {reward.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center">
                              <Coins className={`h-4 w-4 mr-1 ${
                                canAfford ? 'text-indigo-600' : 'text-gray-400'
                              }`} />
                              <span className={`font-bold ${
                                canAfford ? 'text-indigo-600' : 'text-gray-400'
                              }`}>
                                {reward.cost}
                              </span>
                            </div>
                            <button 
                              onClick={() => redeemReward(reward.id, reward.cost)}
                              disabled={!canAfford}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                canAfford 
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              Redeem
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips to Earn More */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Tips to Earn More
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Chat daily with our AI therapist (+5-10 coins)
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Complete your daily journal (+15 coins)
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Track your mood consistently (+5 coins)
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Maintain your wellness streak (bonus coins)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinsPage;
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center h-64">
//           <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
//           <span className="ml-2 text-lg text-gray-600">Loading coins data...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-indigo-700 mb-2">Your Calm Coins</h1>
//         <p className="text-gray-600">Earn coins through journaling and other activities, then use them for appointments</p>
//       </div>
      
//       {/* Balance Card */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="flex items-center justify-center">
//           <Coins className="h-12 w-12 text-yellow-500 mr-4" />
//           <div>
//             <p className="text-sm text-gray-500">Current Balance</p>
//             <h2 className="text-4xl font-bold text-indigo-700">{balance} Coins</h2>
//           </div>
//         </div>
//       </div>
      
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Ways to Earn */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
//             <ArrowUp className="h-5 w-5 text-green-500 mr-2" />
//             Ways to Earn Coins
//           </h3>
          
//           {exchangeRates && (
//             <ul className="space-y-3">
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Create a journal entry</span>
//                 <span className="font-medium text-green-600">+{exchangeRates.earning.journal_entry} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Complete a 7-day journaling streak</span>
//                 <span className="font-medium text-green-600">+{exchangeRates.earning.weekly_streak} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Analyze your mood in a journal</span>
//                 <span className="font-medium text-green-600">+{exchangeRates.earning.mood_analysis} coins</span>
//               </li>
//             </ul>
//           )}
//         </div>
        
//         {/* Ways to Spend */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
//             <ArrowDown className="h-5 w-5 text-red-500 mr-2" />
//             Ways to Spend Coins
//           </h3>
          
//           {exchangeRates && (
//             <ul className="space-y-3">
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>30-minute therapist session</span>
//                 <span className="font-medium text-red-600">-{exchangeRates.spending.therapist_appointment['30min']} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>60-minute therapist session</span>
//                 <span className="font-medium text-red-600">-{exchangeRates.spending.therapist_appointment['60min']} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Unlock advanced journal insights</span>
//                 <span className="font-medium text-red-600">-{exchangeRates.spending.premium_features.advanced_insights} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Access guided meditation sessions</span>
//                 <span className="font-medium text-red-600">-{exchangeRates.spending.premium_features.guided_meditation} coins</span>
//               </li>
//             </ul>
//           )}
//         </div>
//       </div>
      
//       {/* Transaction History */}
//       <div className="mt-8 bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-xl font-semibold text-indigo-700 mb-4">Transaction History</h3>
        
//         {transactions.length === 0 ? (
//           <p className="text-gray-500 text-center py-4">No transactions yet</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {transactions.map((transaction) => (
//                   <tr key={transaction._id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(transaction.timestamp)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {transaction.description}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {transaction.transaction_type === 'earn' ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Earned
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                           Spent
//                         </span>
//                       )}
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
//                       transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.amount}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CoinsPage;


// import { useState, useEffect } from 'react';
// import { Coins, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

// const CoinsPage = () => {
//   const [balance, setBalance] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [exchangeRates, setExchangeRates] = useState(null);
//   const [cryptocurrencies, setCryptocurrencies] = useState([]);
  
//   // Get the user ID from localStorage or your auth system
//   const userId = localStorage.getItem('userId') || '123'; // Replace with your actual user ID retrieval

//   // Function to increment user's coins and save the transaction
//   const incrementCoins = async (amount, description) => {
//     try {
//       // Call your backend API to increase coins
//       const response = await fetch(`/coins/increment`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId,
//           amount,
//           description
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         // Update the balance with the new value
//         setBalance(data.newBalance);
        
//         // Add the new transaction to the list
//         const newTransaction = {
//           _id: Date.now().toString(), // Temporary ID
//           timestamp: new Date().toISOString(),
//           description,
//           transaction_type: 'earn',
//           amount
//         };
        
//         setTransactions(prev => [newTransaction, ...prev]);
//       }
//     } catch (error) {
//       console.error('Error incrementing coins:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchCoinsData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch balance
//         const balanceResponse = await fetch(`/coins/balance/${userId}`);
//         if (balanceResponse.ok) {
//           const balanceData = await balanceResponse.json();
//           setBalance(balanceData.balance);
//         }
        
//         // Fetch transactions
//         const transactionsResponse = await fetch(`/coins/transactions/${userId}`);
//         if (transactionsResponse.ok) {
//           const transactionsData = await transactionsResponse.json();
//           setTransactions(transactionsData);
//         }
        
//         // Fetch exchange rates
//         const ratesResponse = await fetch('/coins/exchange-rates');
//         if (ratesResponse.ok) {
//           const ratesData = await ratesResponse.json();
//           setExchangeRates(ratesData);
//         }

//         // Fetch cryptocurrency data from CoinGecko API
//         const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1');
//         if (cryptoResponse.ok) {
//           const cryptoData = await cryptoResponse.json();
//           setCryptocurrencies(cryptoData);
//         }
//       } catch (error) {
//         console.error('Error fetching coins data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCoinsData();

//     // Record a page visit (user interaction)
//     incrementCoins(1, 'Visited Coins page');
//   }, [userId]);

//   // Track user interactions with the page to award coins
//   useEffect(() => {
//     // Track scroll events (reward for engagement)
//     const handleScroll = () => {
//       // Only trigger once per session
//       if (!localStorage.getItem('scrollRewardClaimed')) {
//         incrementCoins(2, 'Page engagement - scrolling');
//         localStorage.setItem('scrollRewardClaimed', 'true');
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
    
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Handle refresh click - gives user coins for refreshing crypto rates
//   const handleRefreshCrypto = async () => {
//     try {
//       const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1');
//       if (cryptoResponse.ok) {
//         const cryptoData = await cryptoResponse.json();
//         setCryptocurrencies(cryptoData);
//         incrementCoins(3, 'Refreshed cryptocurrency rates');
//       }
//     } catch (error) {
//       console.error('Error refreshing crypto data:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center h-64">
//           <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
//           <span className="ml-2 text-lg text-gray-600">Loading coins data...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-indigo-700 mb-2">Your Calm Coins</h1>
//         <p className="text-gray-600">Earn coins through journaling and other activities, then use them for appointments</p>
//       </div>
      
//       {/* Balance Card */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="flex items-center justify-center">
//           <Coins className="h-12 w-12 text-yellow-500 mr-4" />
//           <div>
//             <p className="text-sm text-gray-500">Current Balance</p>
//             <h2 className="text-4xl font-bold text-indigo-700">{balance} Coins</h2>
//           </div>
//         </div>
//       </div>
      
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Ways to Earn */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
//             <ArrowUp className="h-5 w-5 text-green-500 mr-2" />
//             Ways to Earn Coins
//           </h3>
          
//           {exchangeRates && (
//             <ul className="space-y-3">
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Create a journal entry</span>
//                 <span className="font-medium text-green-600">+{exchangeRates.earning.journal_entry} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Complete a 7-day journaling streak</span>
//                 <span className="font-medium text-green-600">+{exchangeRates.earning.weekly_streak} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Analyze your mood in a journal</span>
//                 <span className="font-medium text-green-600">+{exchangeRates.earning.mood_analysis} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Visit the Coins page</span>
//                 <span className="font-medium text-green-600">+1 coin</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Refresh cryptocurrency rates</span>
//                 <span className="font-medium text-green-600">+3 coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Page engagement (scrolling)</span>
//                 <span className="font-medium text-green-600">+2 coins</span>
//               </li>
//             </ul>
//           )}
//         </div>
        
//         {/* Ways to Spend */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
//             <ArrowDown className="h-5 w-5 text-red-500 mr-2" />
//             Ways to Spend Coins
//           </h3>
          
//           {exchangeRates && (
//             <ul className="space-y-3">
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>30-minute therapist session</span>
//                 <span className="font-medium text-red-600">-{exchangeRates.spending.therapist_appointment['30min']} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>60-minute therapist session</span>
//                 <span className="font-medium text-red-600">-{exchangeRates.spending.therapist_appointment['60min']} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Unlock advanced journal insights</span>
//                 <span className="font-medium text-red-600">-{exchangeRates.spending.premium_features.advanced_insights} coins</span>
//               </li>
//               <li className="flex justify-between items-center border-b pb-2">
//                 <span>Access guided meditation sessions</span>
//                 <span className="font-medium text-red-600">-{exchangeRates.spending.premium_features.guided_meditation} coins</span>
//               </li>
//             </ul>
//           )}
//         </div>
//       </div>
      
//       {/* Cryptocurrency Market Tracker - Interaction gives coins */}
//       <div className="mt-8 bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold text-indigo-700">Cryptocurrency Market</h3>
//           <button 
//             onClick={handleRefreshCrypto}
//             className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
//           >
//             <RefreshCw className="h-4 w-4 mr-1" />
//             Refresh (+3 coins)
//           </button>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {cryptocurrencies.map((crypto) => (
//                 <tr key={crypto.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <img src={crypto.image} alt={crypto.name} className="h-6 w-6 mr-2" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{crypto.name}</p>
//                         <p className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     ${crypto.current_price.toLocaleString()}
//                   </td>
//                   <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
//                     crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
//                   }`}>
//                     {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
//                     {crypto.price_change_percentage_24h.toFixed(2)}%
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     ${(crypto.market_cap / 1000000000).toFixed(2)}B
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
      
//       {/* Transaction History */}
//       <div className="mt-8 bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-xl font-semibold text-indigo-700 mb-4">Transaction History</h3>
        
//         {transactions.length === 0 ? (
//           <p className="text-gray-500 text-center py-4">No transactions yet</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {transactions.map((transaction) => (
//                   <tr key={transaction._id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(transaction.timestamp)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {transaction.description}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {transaction.transaction_type === 'earn' ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Earned
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                           Spent
//                         </span>
//                       )}
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
//                       transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.amount}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CoinsPage;
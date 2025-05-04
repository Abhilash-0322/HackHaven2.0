// import { useState, useEffect } from 'react';
// import { Coins, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

// const CoinsPage = () => {
//   const [balance, setBalance] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [exchangeRates, setExchangeRates] = useState(null);
  
//   // Get the user ID from localStorage or your auth system
//   const userId = localStorage.getItem('userId') || '123'; // Replace with your actual user ID retrieval

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
//       } catch (error) {
//         console.error('Error fetching coins data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCoinsData();
//   }, [userId]);

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


import { useState, useEffect } from 'react';
import { Coins, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

const CoinsPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  
  // Get the user ID from localStorage or your auth system
  const userId = localStorage.getItem('userId') || '123'; // Replace with your actual user ID retrieval

  // Function to increment user's coins and save the transaction
  const incrementCoins = async (amount, description) => {
    try {
      // Call your backend API to increase coins
      const response = await fetch(`/coins/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount,
          description
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the balance with the new value
        setBalance(data.newBalance);
        
        // Add the new transaction to the list
        const newTransaction = {
          _id: Date.now().toString(), // Temporary ID
          timestamp: new Date().toISOString(),
          description,
          transaction_type: 'earn',
          amount
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
      }
    } catch (error) {
      console.error('Error incrementing coins:', error);
    }
  };

  useEffect(() => {
    const fetchCoinsData = async () => {
      try {
        setLoading(true);
        
        // Fetch balance
        const balanceResponse = await fetch(`/coins/balance/${userId}`);
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          setBalance(balanceData.balance);
        }
        
        // Fetch transactions
        const transactionsResponse = await fetch(`/coins/transactions/${userId}`);
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setTransactions(transactionsData);
        }
        
        // Fetch exchange rates
        const ratesResponse = await fetch('/coins/exchange-rates');
        if (ratesResponse.ok) {
          const ratesData = await ratesResponse.json();
          setExchangeRates(ratesData);
        }

        // Fetch cryptocurrency data from CoinGecko API
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1');
        if (cryptoResponse.ok) {
          const cryptoData = await cryptoResponse.json();
          setCryptocurrencies(cryptoData);
        }
      } catch (error) {
        console.error('Error fetching coins data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinsData();

    // Record a page visit (user interaction)
    incrementCoins(1, 'Visited Coins page');
  }, [userId]);

  // Track user interactions with the page to award coins
  useEffect(() => {
    // Track scroll events (reward for engagement)
    const handleScroll = () => {
      // Only trigger once per session
      if (!localStorage.getItem('scrollRewardClaimed')) {
        incrementCoins(2, 'Page engagement - scrolling');
        localStorage.setItem('scrollRewardClaimed', 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle refresh click - gives user coins for refreshing crypto rates
  const handleRefreshCrypto = async () => {
    try {
      const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1');
      if (cryptoResponse.ok) {
        const cryptoData = await cryptoResponse.json();
        setCryptocurrencies(cryptoData);
        incrementCoins(3, 'Refreshed cryptocurrency rates');
      }
    } catch (error) {
      console.error('Error refreshing crypto data:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <span className="ml-2 text-lg text-gray-600">Loading coins data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">Your Calm Coins</h1>
        <p className="text-gray-600">Earn coins through journaling and other activities, then use them for appointments</p>
      </div>
      
      {/* Balance Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-center">
          <Coins className="h-12 w-12 text-yellow-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <h2 className="text-4xl font-bold text-indigo-700">{balance} Coins</h2>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Ways to Earn */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
            <ArrowUp className="h-5 w-5 text-green-500 mr-2" />
            Ways to Earn Coins
          </h3>
          
          {exchangeRates && (
            <ul className="space-y-3">
              <li className="flex justify-between items-center border-b pb-2">
                <span>Create a journal entry</span>
                <span className="font-medium text-green-600">+{exchangeRates.earning.journal_entry} coins</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>Complete a 7-day journaling streak</span>
                <span className="font-medium text-green-600">+{exchangeRates.earning.weekly_streak} coins</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>Analyze your mood in a journal</span>
                <span className="font-medium text-green-600">+{exchangeRates.earning.mood_analysis} coins</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>Visit the Coins page</span>
                <span className="font-medium text-green-600">+1 coin</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>Refresh cryptocurrency rates</span>
                <span className="font-medium text-green-600">+3 coins</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>Page engagement (scrolling)</span>
                <span className="font-medium text-green-600">+2 coins</span>
              </li>
            </ul>
          )}
        </div>
        
        {/* Ways to Spend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
            <ArrowDown className="h-5 w-5 text-red-500 mr-2" />
            Ways to Spend Coins
          </h3>
          
          {exchangeRates && (
            <ul className="space-y-3">
              <li className="flex justify-between items-center border-b pb-2">
                <span>30-minute therapist session</span>
                <span className="font-medium text-red-600">-{exchangeRates.spending.therapist_appointment['30min']} coins</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>60-minute therapist session</span>
                <span className="font-medium text-red-600">-{exchangeRates.spending.therapist_appointment['60min']} coins</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>Unlock advanced journal insights</span>
                <span className="font-medium text-red-600">-{exchangeRates.spending.premium_features.advanced_insights} coins</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>Access guided meditation sessions</span>
                <span className="font-medium text-red-600">-{exchangeRates.spending.premium_features.guided_meditation} coins</span>
              </li>
            </ul>
          )}
        </div>
      </div>
      
      {/* Cryptocurrency Market Tracker - Interaction gives coins */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-indigo-700">Cryptocurrency Market</h3>
          <button 
            onClick={handleRefreshCrypto}
            className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh (+3 coins)
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cryptocurrencies.map((crypto) => (
                <tr key={crypto.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={crypto.image} alt={crypto.name} className="h-6 w-6 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{crypto.name}</p>
                        <p className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${crypto.current_price.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(crypto.market_cap / 1000000000).toFixed(2)}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Transaction History */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">Transaction History</h3>
        
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.transaction_type === 'earn' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Earned
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Spent
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinsPage;
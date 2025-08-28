// // src/components/Navbar.jsx
// import { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X, Flower } from 'lucide-react';  // Changed from Lotus to Flower
// import  logo from '../assets/Calm.png'; // Assuming you have a logo image
// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();

//   const menuItems = [
//     { title: 'Home', path: '/' },
//     {title:'Therapists',path:'/therapists'},
//     { title: 'Music Therapy', path: '/musicrecommend' },
//     { title: 'Book Recommendations', path: '/books' },
//     { title: 'Mental Health Support', path: '/chat' },
//     { title: 'Journal', path: '/journal' },
//   ];

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className="bg-white bg-opacity-80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//           <Link to="/" className="flex items-center gap-2">
//         <img src={logo} alt="Mental Health Logo" className="h-17 w-12 object-contain" />
//         <span className="text-lg font-semibold text-purple-700">ZenHeaven</span>
//       </Link>
//           </div>
          
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-center space-x-4">
//               {menuItems.map((item) => (
//                 <Link
//                   key={item.title}
//                   to={item.path}
//                   className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     location.pathname === item.path
//                       ? 'text-indigo-700 bg-indigo-50'
//                       : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
//                   }`}
//                 >
//                   {item.title}
//                 </Link>
//               ))}
//             </div>
//           </div>
          
//           <div className="md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
//             >
//               {isMenuOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
//             {menuItems.map((item) => (
//               <Link
//                 key={item.title}
//                 to={item.path}
//                 className={`block px-3 py-2 rounded-md text-base font-medium ${
//                   location.pathname === item.path
//                     ? 'text-indigo-700 bg-indigo-50'
//                     : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
//                 }`}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {item.title}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Flower, Coins, LogOut, User } from 'lucide-react'; // Added LogOut and User icons
import logo from '../assets/Calm.png';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, calmCoins, logout } = useAuth();
  
  const menuItems = [
    { title: 'Home', path: '/' },
    { title: 'Journal', path: '/journal' },
    { title: 'Mental Health Support', path: '/chat' },
    { title: 'Therapists', path: '/therapists' },
    { title: 'CalmCoin', path: "/coins" }
  ];

  const publicMenuItems = [
    { title: 'Home', path: '/' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-white bg-opacity-80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="Mental Health Logo" className="h-17 w-12 object-contain" />
                <span className="text-lg font-semibold text-purple-700">Zen Heaven</span>
              </Link>
            </div>
            
            <div className="hidden md:flex md:items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu for non-authenticated users */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="bg-white bg-opacity-80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Mental Health Logo" className="h-17 w-12 object-contain" />
              <span className="text-lg font-semibold text-purple-700">Zen Heaven</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-indigo-700 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
              
              {/* Calm Coins Balance */}
              <div className="ml-4 flex items-center px-3 py-1 bg-indigo-50 rounded-full">
                <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium text-indigo-700">{calmCoins}</span>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <User className="h-4 w-4 mr-1" />
                  {user?.username || 'User'}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.full_name && <p className="font-medium">{user.full_name}</p>}
                      <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Mobile Coins Display */}
            <div className="mr-4 flex items-center px-2 py-1 bg-indigo-50 rounded-full">
              <Coins className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-xs font-medium text-indigo-700">{calmCoins}</span>
            </div>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            
            {/* Mobile user section */}
            <div className="border-t pt-2">
              <div className="px-3 py-2 text-sm text-gray-500">
                Signed in as {user?.username}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Wallet } from 'lucide-react';

// interface NavigationItem {
//   name: string;
//   href: string;
//   icon: React.ComponentType<any>;
// }

// interface SidebarProps {
//   navigation: NavigationItem[];
// }

// const Sidebar: React.FC<SidebarProps> = ({ navigation }) => {
//   const location = useLocation();

//   return (
//     <div className="hidden md:flex md:w-64 md:flex-col">
//       <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
//         <div className="flex items-center flex-shrink-0 px-4">
//           <Wallet className="h-8 w-8 text-indigo-600" />
//           <span className="ml-2 text-xl font-semibold text-gray-900">FinanceAI</span>
//         </div>
//         <div className="mt-5 flex-grow flex flex-col">
//           <nav className="flex-1 px-2 pb-4 space-y-1">
//             {navigation.map((item) => {
//               const isActive = location.pathname === item.href;
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
//                     isActive
//                       ? 'bg-indigo-100 text-indigo-600'
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <item.icon
//                     className={`mr-3 flex-shrink-0 h-6 w-6 ${
//                       isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
//                     }`}
//                   />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
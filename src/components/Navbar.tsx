import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const links = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Goals", path: "/goals" },
  { name: "Learn", path: "/learn" },
  { name: "GeminiChatBot", path: "/geminichatbot" },
  { name: "Settings", path: "/settings" },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white sticky top-0 z-50 shadow-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">FinanceAI</h1>
        <div className="flex space-x-6">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `transition-all duration-300 font-medium ${
                  isActive
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-500"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

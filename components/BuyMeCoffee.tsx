"use client";

import { motion } from "framer-motion";
import { CoffeeIcon } from "lucide-react";

const BuyMeCoffee = () => {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a
        href="https://www.buymeacoffee.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-gray-800 shadow-lg transition-all duration-300 hover:bg-yellow-300"
      >
        <CoffeeIcon className="mr-2 h-5 w-5" />
        Buy me a coffee
      </a>
    </motion.div>
  );
};

export default BuyMeCoffee;

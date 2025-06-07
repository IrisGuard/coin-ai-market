
import { useState } from 'react';

export const useDashboardData = () => {
  const stats = [
    {
      title: "Listed Coins",
      value: "12",
      icon: "Package",
      color: "text-blue-600"
    },
    {
      title: "Watchlist Items", 
      value: "24",
      icon: "Eye",
      color: "text-green-600"
    },
    {
      title: "Total Sales",
      value: "$2,450",
      icon: "DollarSign",
      color: "text-purple-600"
    },
    {
      title: "Profile Views",
      value: "156",
      icon: "TrendingUp",
      color: "text-orange-600"
    }
  ];

  const watchlistItems = [
    { id: 1, name: "1909-S VDB Lincoln Cent", currentBid: "$850", timeLeft: "2d 14h", image: "/placeholder.svg" },
    { id: 2, name: "1916-D Mercury Dime", currentBid: "$1,200", timeLeft: "5d 8h", image: "/placeholder.svg" },
    { id: 3, name: "1937-D Three-Legged Buffalo Nickel", currentBid: "$2,100", timeLeft: "1d 3h", image: "/placeholder.svg" }
  ];

  const recentTransactions = [
    { id: 1, type: "sale", coin: "Morgan Silver Dollar 1881-S", amount: "$45.00", date: "2024-01-15", status: "completed" },
    { id: 2, type: "purchase", coin: "Walking Liberty Half Dollar 1947", amount: "$28.50", date: "2024-01-12", status: "completed" },
    { id: 3, type: "sale", coin: "Indian Head Penny 1907", amount: "$12.25", date: "2024-01-10", status: "pending" }
  ];

  const favorites = [
    { id: 1, name: "Mercury Dimes", count: 8, image: "/placeholder.svg" },
    { id: 2, name: "Morgan Silver Dollars", count: 15, image: "/placeholder.svg" },
    { id: 3, name: "Buffalo Nickels", count: 6, image: "/placeholder.svg" }
  ];

  return {
    stats,
    watchlistItems,
    recentTransactions,
    favorites
  };
};

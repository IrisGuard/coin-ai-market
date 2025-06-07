
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Clock, DollarSign, Settings, Star, Eye, TrendingUp, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  usePageView();
  const { user } = useAuth();

  const stats = [
    {
      title: "Listed Coins",
      value: "12",
      icon: <Package className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "Watchlist Items",
      value: "24",
      icon: <Eye className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      title: "Total Sales",
      value: "$2,450",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-purple-600"
    },
    {
      title: "Profile Views",
      value: "156",
      icon: <TrendingUp className="w-5 h-5" />,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.user_metadata?.full_name || 'Collector'}!
              </h1>
              <p className="text-gray-600">Manage your coins, track your favorites, and monitor your sales.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="watchlist" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="watchlist" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Watchlist
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="watchlist" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Watchlist</CardTitle>
                    <CardDescription>Coins you're tracking and bidding on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {watchlistItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600">Current bid: {item.currentBid}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-2">
                              <Clock className="w-3 h-3 mr-1" />
                              {item.timeLeft}
                            </Badge>
                            <br />
                            <Button size="sm" variant="outline">Place Bid</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your buying and selling history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              transaction.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                            }`} />
                            <div>
                              <h3 className="font-semibold text-gray-900">{transaction.coin}</h3>
                              <p className="text-sm text-gray-600">{transaction.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{transaction.amount}</p>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Categories</CardTitle>
                    <CardDescription>Coin types you collect most</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {favorites.map((favorite) => (
                        <div key={favorite.id} className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                          <img src={favorite.image} alt={favorite.name} className="w-20 h-20 object-cover rounded-full mx-auto mb-4" />
                          <h3 className="font-semibold text-gray-900 mb-2">{favorite.name}</h3>
                          <Badge variant="secondary">
                            <Star className="w-3 h-3 mr-1" />
                            {favorite.count} coins
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your preferences and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Settings panel coming soon.</p>
                        <p className="text-sm text-gray-400">Configure notifications, privacy, and account preferences.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;

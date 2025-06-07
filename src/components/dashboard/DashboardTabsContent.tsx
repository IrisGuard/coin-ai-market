
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  MessageSquare, 
  Gavel,
  Plus,
  Edit,
  Trash2,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardTabsContentProps {
  watchlistItems: any[];
  recentTransactions: any[];
  favorites: any[];
}

const DashboardTabsContent: React.FC<DashboardTabsContentProps> = ({
  watchlistItems,
  recentTransactions,
  favorites
}) => {
  const { user } = useAuth();

  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Πρόσφατη Δραστηριότητα
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${transaction.amount}</p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Γρήγορες Ενέργειες
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col gap-2">
                  <Plus className="w-6 h-6" />
                  Νέα Αγγελία
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Gavel className="w-6 h-6" />
                  Νέα Δημοπρασία
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Μηνύματα
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Eye className="w-6 h-6" />
                  Παρακολούθηση
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="portfolio" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Η Συλλογή μου
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Δεν έχετε νομίσματα στη συλλογή σας ακόμα.</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Προσθήκη Νομίσματος
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Οι Αγγελίες μου
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-3">Δεν έχετε ενεργές αγγελίες.</p>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Νέα Αγγελία
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Auctions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5" />
                Οι Δημοπρασίες μου
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-3">Δεν έχετε ενεργές δημοπρασίες.</p>
                  <Button size="sm">
                    <Gavel className="w-4 h-4 mr-2" />
                    Νέα Δημοπρασία
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Bids */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Οι Προσφορές μου
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-gray-600">Δεν έχετε κάνει προσφορές ακόμα.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Watchlist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Παρακολούθηση
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {watchlistItems.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600">Δεν παρακολουθείτε κανένα νόμισμα.</p>
                  </div>
                ) : (
                  watchlistItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">${item.current_price}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Favorites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Αγαπημένα
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favorites.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600">Δεν έχετε αγαπημένα νομίσματα.</p>
                  </div>
                ) : (
                  favorites.slice(0, 5).map((favorite) => (
                    <div key={favorite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{favorite.name}</p>
                        <p className="text-sm text-gray-600">${favorite.price}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Μηνύματα
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-gray-600 mb-3">Δεν έχετε νέα μηνύματα.</p>
                <Badge variant="secondary">0 νέα</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Αξιολογήσεις
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold">5.0</span>
                </div>
                <p className="text-sm text-gray-600">Βασισμένο σε 0 αξιολογήσεις</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
};

export default DashboardTabsContent;

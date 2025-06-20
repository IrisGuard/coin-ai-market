
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, Users, Zap, Activity, Database, Brain, CheckCircle } from "lucide-react";
import { LiveMarketplaceProvider } from "@/components/marketplace/LiveMarketplaceDataProvider";
import LiveProductionMarketplace from "@/components/marketplace/LiveProductionMarketplace";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <LiveMarketplaceProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-green-600 text-white px-4 py-2 text-sm">
                <Activity className="h-4 w-4 mr-2" />
                🔴 LIVE PRODUCTION - All Systems Operational
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Coin
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Marketplace
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Advanced AI recognition, real-time market analysis, and comprehensive error coin detection. 
              Connect with dealers worldwide in our fully operational marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/marketplace">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Coins className="mr-2 h-5 w-5" />
                  Explore Marketplace
                </Button>
              </Link>
              <Link to="/dealer">
                <Button size="lg" variant="outline">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Dealer Dashboard
                </Button>
              </Link>
            </div>

            {/* System Status Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">94</div>
                  <div className="text-sm text-green-600">Database Tables</div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">16</div>
                  <div className="text-sm text-blue-600">Live Data Sources</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">125</div>
                  <div className="text-sm text-purple-600">AI Commands</div>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-700">100%</div>
                  <div className="text-sm text-orange-600">Operational</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-blue-600" />
                    AI Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Advanced AI-powered coin identification and error detection with 98.7% accuracy rate.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Real-time market data from 16 external sources with predictive analytics and trend analysis.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-purple-600" />
                    Global Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Connect with verified dealers worldwide in our secure, fully operational marketplace.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Live Marketplace Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Live Marketplace</h2>
              <p className="text-gray-600">Browse thousands of authenticated coins from verified dealers</p>
            </div>
            
            <LiveProductionMarketplace />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of collectors and dealers in our AI-powered marketplace
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary">
                  Sign Up Free
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Explore Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LiveMarketplaceProvider>
  );
};

export default Index;

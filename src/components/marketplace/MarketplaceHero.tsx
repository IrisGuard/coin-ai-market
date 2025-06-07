
import React from 'react';
import { Search, Menu, Coins, Gavel, Globe, MapPin, Star, DollarSign, Crown, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const MarketplaceHero = () => {
  // All coin categories for dropdown with icons
  const allCategories = [
    { name: 'Ancient Coins', href: '/marketplace?category=ancient', icon: Crown },
    { name: 'Modern Coins', href: '/marketplace?category=modern', icon: Coins },
    { name: 'Error Coins', href: '/marketplace?category=error', icon: Shield },
    { name: 'Graded', href: '/marketplace?category=graded', icon: Star },
    { name: 'Auctions', href: '/marketplace?auctions=true', icon: Gavel },
    { name: 'European', href: '/marketplace?category=european', icon: Globe },
    { name: 'American', href: '/marketplace?category=american', icon: MapPin },
    { name: 'Asian', href: '/marketplace?category=asian', icon: Globe },
    { name: 'Collectibles', href: '/marketplace?category=collectible', icon: Star },
    { name: 'Gold Coins', href: '/marketplace?category=gold', icon: DollarSign },
    { name: 'Silver Coins', href: '/marketplace?category=silver', icon: Coins },
    { name: 'Rare', href: '/marketplace?category=rare', icon: Crown }
  ];

  // Split into main and specialty for better organization
  const mainCategories = allCategories.slice(0, 5);
  const specialtyCategories = allCategories.slice(5);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-pink bg-clip-text text-transparent mb-3">
            Find the perfect coin for you
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover authentic coins from verified dealers worldwide
          </p>

          {/* Search Bar with Dropdown */}
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              {/* Search Bar */}
              <div className="flex-1 flex">
                <input
                  type="text"
                  placeholder="Search for coins, years, countries..."
                  className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-l-lg focus:outline-none focus:border-electric-orange focus:ring-2 focus:ring-electric-orange/20 text-gray-700"
                />
                <button className="px-8 py-4 bg-gradient-to-r from-electric-orange to-electric-red hover:from-electric-orange/90 hover:to-electric-red/90 text-white font-medium rounded-r-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>

              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="px-6 py-4 h-auto text-lg border-2 border-gray-300 hover:border-electric-orange hover:bg-electric-orange/10 transition-all duration-200 shadow-md hover:shadow-lg text-electric-purple"
                  >
                    <Menu className="w-5 h-5 mr-2" />
                    Browse Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50" align="end">
                  <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-electric-blue">
                    Main Categories
                  </DropdownMenuLabel>
                  {mainCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <DropdownMenuItem key={category.name} asChild>
                        <a 
                          href={category.href}
                          className="flex items-center gap-3 px-4 py-2 text-electric-purple hover:bg-electric-orange/10 hover:text-electric-orange transition-colors cursor-pointer"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{category.name}</span>
                        </a>
                      </DropdownMenuItem>
                    );
                  })}
                  
                  <DropdownMenuSeparator className="my-1" />
                  
                  <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-electric-green">
                    Specialty Categories
                  </DropdownMenuLabel>
                  {specialtyCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <DropdownMenuItem key={category.name} asChild>
                        <a 
                          href={category.href}
                          className="flex items-center gap-3 px-4 py-2 text-electric-purple hover:bg-electric-green/10 hover:text-electric-green transition-colors cursor-pointer"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{category.name}</span>
                        </a>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;

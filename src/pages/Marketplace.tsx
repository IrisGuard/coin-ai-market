
import { useState } from "react";
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import MarketplaceStats from "@/components/marketplace/MarketplaceStats";

const Marketplace = () => {
  usePageView();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    country: "",
    year: "",
    grade: "",
    priceRange: "",
    category: "",
  });
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <MarketplaceHeader />
        <MarketplaceStats />
        <MarketplaceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <MarketplaceGrid
          searchTerm={searchTerm}
          selectedFilters={selectedFilters}
          sortBy={sortBy}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;

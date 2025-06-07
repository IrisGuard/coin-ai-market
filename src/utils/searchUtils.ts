
export const createDefaultSearchParams = () => ({
  query: '',
  priceRange: [0, 10000] as [number, number],
  yearRange: [1800, 2024] as [number, number],
  country: '',
  rarity: '',
  condition: '',
  mintMark: '',
  hasImage: true,
  isAuction: false,
  hasGrading: false,
  sortBy: 'relevance'
});

export const hasActiveFilters = (params: ReturnType<typeof createDefaultSearchParams>) => {
  const defaults = createDefaultSearchParams();
  
  return (
    params.query !== defaults.query ||
    JSON.stringify(params.priceRange) !== JSON.stringify(defaults.priceRange) ||
    JSON.stringify(params.yearRange) !== JSON.stringify(defaults.yearRange) ||
    params.country !== defaults.country ||
    params.rarity !== defaults.rarity ||
    params.condition !== defaults.condition ||
    params.mintMark !== defaults.mintMark ||
    params.hasImage !== defaults.hasImage ||
    params.isAuction !== defaults.isAuction ||
    params.hasGrading !== defaults.hasGrading ||
    params.sortBy !== defaults.sortBy
  );
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService, ListingData } from '@/services/marketplaceService';
import { toast } from 'sonner';

export const useMarketplace = () => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: () => marketplaceService.getMarketplaceStats(),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const createListingMutation = useMutation({
    mutationFn: (listingData: ListingData) => marketplaceService.createListing(listingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-stats'] });
      toast.success('Listing created successfully!');
    },
    onError: (error) => {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    }
  });

  const updateListingMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ListingData> }) => 
      marketplaceService.updateListing(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast.success('Listing updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing. Please try again.');
    }
  });

  const deleteListingMutation = useMutation({
    mutationFn: (listingId: string) => marketplaceService.deleteListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-stats'] });
      toast.success('Listing cancelled successfully!');
    },
    onError: (error) => {
      console.error('Error deleting listing:', error);
      toast.error('Failed to cancel listing. Please try again.');
    }
  });

  return {
    stats,
    statsLoading,
    createListing: createListingMutation.mutate,
    updateListing: updateListingMutation.mutate,
    deleteListing: deleteListingMutation.mutate,
    isCreating: createListingMutation.isPending,
    isUpdating: updateListingMutation.isPending,
    isDeleting: deleteListingMutation.isPending
  };
};

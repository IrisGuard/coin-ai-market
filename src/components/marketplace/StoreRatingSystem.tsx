
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, Award, TrendingUp, Clock } from 'lucide-react';

interface StoreRatingSystemProps {
  storeId: string;
  averageRating: number;
  totalReviews: number;
  recentReviews: any[];
}

const StoreRatingSystem: React.FC<StoreRatingSystemProps> = ({
  storeId,
  averageRating,
  totalReviews,
  recentReviews
}) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => setSelectedRating(index + 1) : undefined}
      />
    ));
  };

  const displayRating = averageRating > 0 ? averageRating.toFixed(1) : 'Not yet rated';
  const displayReviews = totalReviews > 0 ? `Based on ${totalReviews} reviews` : 'No reviews yet';

  const storeMetrics = [
    { label: 'Response Time', value: 'Coming Soon', icon: MessageCircle, color: 'text-electric-blue' },
    { label: 'Customer Service', value: 'Coming Soon', icon: Award, color: 'text-electric-purple' },
    { label: 'Item Accuracy', value: 'Coming Soon', icon: TrendingUp, color: 'text-brand-primary' },
    { label: 'Shipping Speed', value: 'Coming Soon', icon: Clock, color: 'text-electric-blue' }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <Card className="border-2 border-electric-blue/20 bg-gradient-to-br from-white to-electric-blue/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Overview */}
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary mb-2">
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating || 0))}
              </div>
              <p className="text-brand-medium mb-4">
                {displayReviews}
              </p>
              <Button 
                className="bg-gradient-to-r from-brand-primary to-electric-purple hover:from-brand-primary/90 hover:to-electric-purple/90 text-white"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                Write a Review
              </Button>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              <h4 className="font-semibold text-brand-primary mb-4">Rating Distribution</h4>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm w-6 text-brand-primary">{stars}</span>
                  <Star className="w-4 h-4 text-gray-300" />
                  <div className="flex-1 bg-electric-blue/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-electric-blue to-electric-purple h-2 rounded-full" 
                      style={{ width: '0%' }}
                    />
                  </div>
                  <span className="text-sm text-brand-medium w-12">0</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Performance Metrics */}
      <Card className="border-2 border-electric-blue/20 bg-gradient-to-br from-white to-electric-blue/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-brand-primary mb-4">Store Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {storeMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                <div className="font-semibold text-brand-primary">{metric.value}</div>
                <div className="text-sm text-brand-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="border-2 border-electric-blue/20 bg-gradient-to-br from-white to-electric-blue/5">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-brand-primary mb-4">Write Your Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-primary mb-2">Rating</label>
                <div className="flex gap-1">
                  {renderStars(selectedRating, true)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-primary mb-2">Review</label>
                <Textarea
                  placeholder="Share your experience with this store..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="border-electric-blue/20 focus:border-electric-blue"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                  className="border-electric-blue/20 text-brand-primary hover:bg-electric-blue/10"
                >
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-brand-primary to-electric-purple hover:from-brand-primary/90 hover:to-electric-purple/90 text-white">
                  Submit Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      <Card className="border-2 border-electric-blue/20 bg-gradient-to-br from-white to-electric-blue/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-brand-primary mb-4">Customer Reviews</h3>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-electric-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-brand-primary mb-2">No reviews yet</h4>
            <p className="text-brand-medium">Be the first to review this store and help other customers make informed decisions.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreRatingSystem;

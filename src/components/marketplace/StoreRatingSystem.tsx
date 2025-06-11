
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageCircle, Award, TrendingUp } from 'lucide-react';

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

  const getRatingDistribution = () => {
    // Mock rating distribution - in real app, this would come from database
    return [
      { stars: 5, count: 45, percentage: 75 },
      { stars: 4, count: 12, percentage: 20 },
      { stars: 3, count: 2, percentage: 3 },
      { stars: 2, count: 1, percentage: 2 },
      { stars: 1, count: 0, percentage: 0 },
    ];
  };

  const storeMetrics = [
    { label: 'Response Time', value: '< 2 hours', icon: MessageCircle, color: 'text-blue-600' },
    { label: 'Shipping Speed', value: '4.8/5', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Item Accuracy', value: '4.9/5', icon: Award, color: 'text-purple-600' },
    { label: 'Customer Service', value: '4.7/5', icon: ThumbsUp, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Overview */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-gray-600">
                Based on {totalReviews} reviews
              </p>
              <Button 
                className="mt-4"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                Write a Review
              </Button>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {getRatingDistribution().map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <span className="text-sm w-6">{rating.stars}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Performance Metrics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Store Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {storeMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                <div className="font-semibold">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-1">
                  {renderStars(selectedRating, true)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <Textarea
                  placeholder="Share your experience with this store..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
                <Button>Submit Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reviews */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {/* Mock reviews - in real app, these would come from database */}
            {[
              {
                id: 1,
                author: "John D.",
                rating: 5,
                date: "2 days ago",
                comment: "Excellent service! Fast shipping and exactly as described. Highly recommended!",
                verified: true
              },
              {
                id: 2,
                author: "Sarah M.",
                rating: 4,
                date: "1 week ago",
                comment: "Great selection of coins. Professional packaging and quick response to questions.",
                verified: true
              },
              {
                id: 3,
                author: "Mike R.",
                rating: 5,
                date: "2 weeks ago",
                comment: "Outstanding dealer! Authentic coins, fair prices, and exceptional customer service.",
                verified: true
              }
            ].map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.author}</span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreRatingSystem;

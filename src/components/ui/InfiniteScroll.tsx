
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  className?: string;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  hasMore,
  loading,
  onLoadMore,
  threshold = 300,
  loader,
  endMessage,
  className = ''
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
      threshold: 0.1
    });

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, [handleIntersection, threshold]);

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, loading, onLoadMore]);

  const defaultLoader = (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-2 text-gray-600">Loading more...</span>
    </div>
  );

  const defaultEndMessage = (
    <div className="flex justify-center items-center py-8">
      <span className="text-gray-500">No more items to load</span>
    </div>
  );

  return (
    <div className={className}>
      {children}
      
      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} className="h-1" />
      
      {/* Loading state */}
      {loading && (loader || defaultLoader)}
      
      {/* End message when no more items */}
      {!hasMore && !loading && (endMessage || defaultEndMessage)}
    </div>
  );
};

export default InfiniteScroll;

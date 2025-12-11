// ============================================================================
// USE INTERSECTION OBSERVER - Hook for lazy loading and infinite scroll
// ============================================================================

import { useState, useEffect, useRef, useCallback } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

interface IntersectionObserverResult {
  ref: (node: Element | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

/**
 * Hook for detecting when an element enters the viewport
 * Useful for lazy loading images, infinite scroll, animations
 *
 * @param options - IntersectionObserver options
 * @returns Object with ref callback and intersection state
 *
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.1,
 *   freezeOnceVisible: true
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting && <HeavyComponent />}
 *   </div>
 * );
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): IntersectionObserverResult {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<Element | null>(null);
  const frozen = useRef(false);

  const ref = useCallback((node: Element | null) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (!node) return;
    if (frozen.current && freezeOnceVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);

        if (entry.isIntersecting && freezeOnceVisible) {
          frozen.current = true;
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, threshold, root, rootMargin, freezeOnceVisible]);

  const isIntersecting = entry?.isIntersecting ?? false;

  return { ref, isIntersecting, entry };
}

/**
 * Hook for infinite scroll pagination
 *
 * @param onLoadMore - Callback when sentinel becomes visible
 * @param hasMore - Whether there's more data to load
 * @param isLoading - Whether data is currently loading
 * @returns Ref to attach to sentinel element
 *
 * @example
 * const { ref } = useInfiniteScroll({
 *   onLoadMore: () => fetchNextPage(),
 *   hasMore: hasNextPage,
 *   isLoading: isFetchingNextPage
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={ref} /> // Sentinel element
 *   </div>
 * );
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore = true,
  isLoading = false,
}: {
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  return { ref };
}

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, Briefcase, GraduationCap, Building2, TrendingUp } from 'lucide-react'
import { SearchResult } from '@/types/search'

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export default function SearchResults({ query, onClose }: SearchResultsProps) {
  const router = useRouter()
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [recommendations, setRecommendations] = useState<SearchResult | null>(null)
  const searchTimeout = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Fetch recommendations when the search field is empty or has minimal input
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/jobs/recommendations');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecommendations(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to load recommendations');
        setRecommendations({
          locations: [],
          positions: [],
          sectors: [],
          jobs: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (!query.trim() || query.trim().length < 2) {
      fetchRecommendations();
    } else {
      setRecommendations(null);
    }
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults(null)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`http://localhost:5000/api/jobs/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Error fetching search results:', error)
        setError('Failed to load results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    // Set new timeout
    searchTimeout.current = setTimeout(fetchResults, 300)

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [query, retryCount])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  const handleResultClick = (type: string, value: string) => {
    onClose()
    if (type === 'job') {
      router.push(`/jobs/${value}`)
    } else {
      router.push(`/jobs?${type}=${encodeURIComponent(value)}`)
    }
  }

  const renderSection = (title: string, items: any[] = [], type: string, isRecommendation: boolean = false) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
          {isRecommendation && <TrendingUp className="w-4 h-4" />}
          {title}
        </h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <button
              key={index}
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              onClick={() => handleResultClick(type, type === 'job' ? item._id : item.value)}
            >
              <div className="flex items-center gap-2">
                {type === 'location' && <MapPin className="w-4 h-4 text-gray-500" />}
                {type === 'position' && <Briefcase className="w-4 h-4 text-gray-500" />}
                {type === 'sector' && <GraduationCap className="w-4 h-4 text-gray-500" />}
                {type === 'job' && <Building2 className="w-4 h-4 text-gray-500" />}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {type === 'job' ? item.title : item.value}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-50"
      >
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        ref={containerRef}
        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-50"
      >
        <div className="text-center py-4">
          <p className="text-red-500 mb-2">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Show recommendations when there's no search query or minimal input
  if (!query.trim() || query.trim().length < 2) {
    if (!recommendations) return null;

    const hasRecommendations = recommendations.locations?.length > 0 || 
                             recommendations.positions?.length > 0 || 
                             recommendations.sectors?.length > 0 || 
                             recommendations.jobs?.length > 0;

    return (
      <div
        ref={containerRef}
        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-50 max-h-[80vh] overflow-y-auto"
      >
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Recommended for you</h3>
        {recommendations.locations?.length > 0 && renderSection('Popular Locations', recommendations.locations, 'location', true)}
        {recommendations.positions?.length > 0 && renderSection('Trending Positions', recommendations.positions, 'position', true)}
        {recommendations.sectors?.length > 0 && renderSection('Hot Sectors', recommendations.sectors, 'sector', true)}
        {recommendations.jobs?.length > 0 && renderSection('Featured Jobs', recommendations.jobs, 'job', true)}

        {!hasRecommendations && (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">No recommendations available</p>
          </div>
        )}
      </div>
    )
  }

  // Show search results when there's a search query
  if (!results) return null;

  const hasResults = results.locations?.length > 0 || 
                    results.positions?.length > 0 || 
                    results.sectors?.length > 0 || 
                    results.jobs?.length > 0;

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-50 max-h-[80vh] overflow-y-auto"
    >
      {results.locations?.length > 0 && renderSection('Locations', results.locations, 'location')}
      {results.positions?.length > 0 && renderSection('Positions', results.positions, 'position')}
      {results.sectors?.length > 0 && renderSection('Sectors', results.sectors, 'sector')}
      {results.jobs?.length > 0 && renderSection('Jobs', results.jobs, 'job')}

      {!hasResults && (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">No results found</p>
        </div>
      )}
    </div>
  )
} 
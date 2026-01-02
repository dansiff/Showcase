"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader, PageFooter } from '@/components/PageHeaderFooter'
import { PlayCircle, Download, Share2, Heart, Grid, List, Search, Filter, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: string
  title: string
  description?: string
  type: 'image' | 'video' | 'audio'
  thumbnail: string
  src: string
  duration?: string
  size?: string
  category: string
  tags: string[]
  createdAt: string
  views?: number
  likes?: number
}

// Sample media data - replace with API calls to your database
const SAMPLE_MEDIA: MediaItem[] = [
  {
    id: '1',
    title: 'Summer Vibes - Product Launch',
    description: 'Exciting announcement for our newest product lineup',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=300&fit=crop',
    src: '/videos/sample-1.mp4',
    duration: '2:45',
    category: 'Product',
    tags: ['launch', 'product', 'announcement'],
    createdAt: '2025-12-20',
    views: 1240,
    likes: 89,
  },
  {
    id: '2',
    title: 'Team Collaboration Highlights',
    description: 'Behind the scenes of our amazing team at work',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    category: 'Team',
    tags: ['team', 'culture', 'collaboration'],
    createdAt: '2025-12-18',
    views: 856,
    likes: 124,
  },
  {
    id: '3',
    title: 'Customer Success Story',
    description: 'How our solution transformed our client\'s business',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f9?w=400&h=300&fit=crop',
    src: '/videos/sample-3.mp4',
    duration: '3:20',
    category: 'Testimonial',
    tags: ['customer', 'success', 'case-study'],
    createdAt: '2025-12-15',
    views: 2100,
    likes: 287,
  },
  {
    id: '4',
    title: 'Product Walkthrough',
    description: 'Complete guide to using our platform features',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    src: '/videos/sample-4.mp4',
    duration: '8:15',
    category: 'Tutorial',
    tags: ['tutorial', 'guide', 'features'],
    createdAt: '2025-12-12',
    views: 3450,
    likes: 542,
  },
  {
    id: '5',
    title: 'Brand Identity Showcase',
    description: 'Visual representation of our brand guidelines',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    category: 'Branding',
    tags: ['brand', 'identity', 'design'],
    createdAt: '2025-12-10',
    views: 645,
    likes: 93,
  },
  {
    id: '6',
    title: 'Event Highlights Reel',
    description: 'Best moments from our annual conference',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
    src: '/videos/sample-6.mp4',
    duration: '5:30',
    category: 'Events',
    tags: ['event', 'conference', 'highlights'],
    createdAt: '2025-12-08',
    views: 1876,
    likes: 201,
  },
]

const CATEGORIES = ['All', 'Product', 'Team', 'Testimonial', 'Tutorial', 'Branding', 'Events']
const TAGS_ALL = ['launch', 'product', 'team', 'tutorial', 'case-study', 'branding']

export default function MediaShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>(SAMPLE_MEDIA)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    let filtered = SAMPLE_MEDIA

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.includes(query))
      )
    }

    setFilteredMedia(filtered)
  }, [selectedCategory, searchQuery])

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const openModal = (media: MediaItem) => {
    setSelectedMedia(media)
    setShowModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedMedia(null)
    document.body.style.overflow = 'unset'
    setIsMuted(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <PageHeader />

      {/* Hero Section */}
      <div className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-2">
            <PlayCircle className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Media Gallery</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Our Creative Showcase
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Explore our collection of videos, images, and multimedia content. Discover the stories behind our brand and connect with our work.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="border-y border-gray-800 bg-gray-900/50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Search Bar */}
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search content by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-gray-100 placeholder-gray-500 transition-colors hover:border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Category Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'border border-gray-700 text-gray-300 hover:border-indigo-500 hover:text-indigo-300'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Showing {filteredMedia.length} {filteredMedia.length === 1 ? 'item' : 'items'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                )}
                title="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                )}
                title="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {filteredMedia.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 py-16 text-center">
              <p className="text-gray-400">No media found matching your criteria. Try adjusting your filters.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map(media => (
                <MediaCard
                  key={media.id}
                  media={media}
                  onOpen={() => openModal(media)}
                  onLike={handleLike}
                  isLiked={liked.has(media.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMedia.map(media => (
                <MediaListItem
                  key={media.id}
                  media={media}
                  onOpen={() => openModal(media)}
                  onLike={handleLike}
                  isLiked={liked.has(media.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Modal */}
      {showModal && selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={closeModal}
          isMuted={isMuted}
          onMuteToggle={() => setIsMuted(!isMuted)}
          isLiked={liked.has(selectedMedia.id)}
          onLike={() => handleLike(selectedMedia.id, {} as any)}
        />
      )}

      <PageFooter />
    </div>
  )
}

interface MediaCardProps {
  media: MediaItem
  onOpen: () => void
  onLike: (id: string, e: React.MouseEvent) => void
  isLiked: boolean
}

function MediaCard({ media, onOpen, onLike, isLiked }: MediaCardProps) {
  return (
    <div
      onClick={onOpen}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
        <Image
          src={media.thumbnail}
          alt={media.title}
          fill
          className="object-cover transition-transform group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Play Button for Videos */}
        {media.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm transition-all group-hover:bg-indigo-600/80">
              <PlayCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        )}

        {/* Duration */}
        {media.duration && (
          <div className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
            {media.duration}
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {media.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
          {media.title}
        </h3>
        {media.description && (
          <p className="mb-4 text-sm text-gray-400 line-clamp-2">
            {media.description}
          </p>
        )}

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {media.tags.slice(0, 2).map(tag => (
            <span key={tag} className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer with actions */}
        <div className="flex items-center justify-between border-t border-gray-800 pt-4">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {media.views && <span>{media.views.toLocaleString()} views</span>}
            {media.likes && <span>{media.likes} likes</span>}
          </div>
          <button
            onClick={(e) => onLike(media.id, e)}
            className={cn(
              'transition-colors',
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            )}
          >
            <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}

interface MediaListItemProps {
  media: MediaItem
  onOpen: () => void
  onLike: (id: string, e: React.MouseEvent) => void
  isLiked: boolean
}

function MediaListItem({ media, onOpen, onLike, isLiked }: MediaListItemProps) {
  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-all hover:border-indigo-500/50 hover:bg-gray-900"
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-gray-800">
          <Image
            src={media.thumbnail}
            alt={media.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          {media.type === 'video' && media.duration && (
            <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
              {media.duration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                {media.title}
              </h3>
              <span className="rounded-full bg-indigo-600/20 px-2 py-1 text-xs font-semibold text-indigo-300">
                {media.category}
              </span>
            </div>
            {media.description && (
              <p className="mb-2 text-sm text-gray-400">{media.description}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {media.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              {media.views && <span>{media.views.toLocaleString()} views</span>}
              {media.likes && <span>{media.likes} likes</span>}
              <span>{new Date(media.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-gray-300 transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => onLike(media.id, e)}
                className={cn(
                  'transition-colors',
                  isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                )}
              >
                <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MediaModalProps {
  media: MediaItem
  onClose: () => void
  isMuted: boolean
  onMuteToggle: () => void
  isLiked: boolean
  onLike: () => void
}

function MediaModal({ media, onClose, isMuted, onMuteToggle, isLiked, onLike }: MediaModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative max-h-[90vh] max-w-4xl w-full rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-gray-300 hover:bg-black/75 hover:text-white transition-colors backdrop-blur-sm"
          >
            <span className="text-2xl">×</span>
          </button>

          {/* Media Content */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
            {media.type === 'video' ? (
              <video
                src={media.src}
                controls
                autoPlay
                muted={isMuted}
                className="h-full w-full"
              />
            ) : (
              <Image
                src={media.src}
                alt={media.title}
                fill
                className="object-contain"
              />
            )}
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{media.title}</h2>
                {media.description && (
                  <p className="text-gray-400 mb-4">{media.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {media.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onLike}
                  className={cn(
                    'rounded-lg p-3 transition-colors flex items-center gap-2',
                    isLiked
                      ? 'bg-red-600/20 text-red-500'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  )}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
                  <span className="text-sm">{media.likes}</span>
                </button>
                <button className="rounded-lg bg-gray-800 p-3 text-gray-300 hover:bg-gray-700 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="rounded-lg bg-gray-800 p-3 text-gray-300 hover:bg-gray-700 transition-colors">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-800 pt-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Category</p>
                <p className="text-white font-semibold">{media.category}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Published</p>
                <p className="text-white font-semibold">
                  {new Date(media.createdAt).toLocaleDateString()}
                </p>
              </div>
              {media.views && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Views</p>
                  <p className="text-white font-semibold">{media.views.toLocaleString()}</p>
                </div>
              )}
              {media.type === 'video' && media.duration && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Duration</p>
                  <p className="text-white font-semibold">{media.duration}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

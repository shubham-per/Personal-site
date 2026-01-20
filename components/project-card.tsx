import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  description: string
  imageUrl: string
  tags: string[]
  keywords?: string[]
  projectLink?: string
  photos?: string[]
  cardStyle?: string
}

export default function ProjectCard({ 
  title, 
  description, 
  imageUrl, 
  tags, 
  keywords = [], 
  projectLink, 
  photos = [],
  cardStyle = 'style1'
}: ProjectCardProps) {
  
  const getCardStyle = () => {
    switch (cardStyle) {
      case 'style2':
        return "overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-600 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 hover:scale-105"
      case 'style3':
        return "overflow-hidden bg-white/90 backdrop-blur-sm border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
      case 'style4':
        return "overflow-hidden bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
      default:
        return "overflow-hidden bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
    }
  }

  const getTagStyle = () => {
    switch (cardStyle) {
      case 'style2':
        return "bg-cyan-600/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-600/30"
      case 'style3':
        return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
      case 'style4':
        return "bg-white/20 text-white border-white/30 hover:bg-white/30"
      default:
        return "bg-slate-700 hover:bg-slate-600"
    }
  }

  const getKeywordStyle = () => {
    switch (cardStyle) {
      case 'style2':
        return "bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded"
      case 'style3':
        return "bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
      case 'style4':
        return "bg-white/20 text-white text-xs px-2 py-1 rounded"
      default:
        return "bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
    }
  }

  return (
    <Card className={getCardStyle()}>
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {cardStyle === 'style4' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        )}
      </div>
      <CardContent className="p-4">
        <h4 className={`text-xl font-bold mb-2 ${cardStyle === 'style4' ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h4>
        <p className={`text-sm mb-4 ${cardStyle === 'style4' ? 'text-white/80' : 'text-gray-600'}`}>
          {description}
        </p>
        
        {/* Project link */}
        {projectLink && (
          <div className="mb-3">
            <a 
              href={projectLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-sm underline ${
                cardStyle === 'style4' 
                  ? 'text-cyan-300 hover:text-cyan-200' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              🔗 View Project
            </a>
          </div>
        )}
        
        {/* Keywords */}
        {keywords && keywords.length > 0 && (
          <div className="mb-3">
            <p className={`text-xs mb-1 ${cardStyle === 'style4' ? 'text-white/60' : 'text-gray-500'}`}>
              Keywords:
            </p>
            <div className="flex flex-wrap gap-1">
              {keywords.map((keyword, index) => (
                <span key={index} className={getKeywordStyle()}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className={getTagStyle()}>
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Additional photos */}
        {photos && photos.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200/20">
            <p className={`text-xs mb-2 ${cardStyle === 'style4' ? 'text-white/60' : 'text-gray-500'}`}>
              Photos:
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {photos.slice(0, 3).map((photo, index) => (
                <img 
                  key={index} 
                  src={photo} 
                  alt={`${title} photo ${index + 1}`}
                  className="w-12 h-12 object-cover rounded border flex-shrink-0"
                />
              ))}
              {photos.length > 3 && (
                <div className={`w-12 h-12 rounded border flex items-center justify-center text-xs flex-shrink-0 ${
                  cardStyle === 'style4' 
                    ? 'bg-white/20 text-white border-white/30' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  +{photos.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

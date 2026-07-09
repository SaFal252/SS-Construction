import { useState } from 'react'

const Portfolio = () => {
  const [filter, setFilter] = useState('all')
  const [lightboxImage, setLightboxImage] = useState(null)

  const projects = [
    { id: 1, title: 'Luxury Villa', location: 'Tokha', type: 'Residential', year: '2024', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80' },
    { id: 2, title: 'Commercial Complex', location: 'Tarkeshwor', type: 'Commercial', year: '2024', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
    { id: 3, title: 'Modern Apartment', location: 'Kathmandu', type: 'Residential', year: '2023', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
    { id: 4, title: 'Office Building', location: 'Machhapokhari', type: 'Commercial', year: '2023', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
    { id: 5, title: 'Family House', location: 'Tokha', type: 'Residential', year: '2023', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
    { id: 6, title: 'Shopping Mall', location: 'Tarkeshwor', type: 'Commercial', year: '2022', image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3c9e?w=800&q=80' },
  ]

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.type === filter)

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-primary-light pt-28 pb-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-2">Our Portfolio</h1>
          <p className="text-gray-400 text-lg">Showcasing our completed projects</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-card sticky top-20 z-40 shadow-lg shadow-black/20">
        <div className="container-custom py-4">
          <div className="flex justify-center space-x-4">
            {['all', 'Residential', 'Commercial'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  filter === type
                    ? 'bg-accent text-primary'
                    : 'bg-primary text-secondary hover:bg-primary-light'
                }`}
              >
                {type === 'all' ? 'All Projects' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-2xl overflow-hidden cursor-pointer group card card-hover-border"
              onClick={() => setLightboxImage(project.image)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-heading font-semibold text-secondary mb-1">{project.title}</h3>
                <p className="text-gray-400 text-sm">{project.location} • {project.year}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                  {project.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center p-4" 
          onClick={() => setLightboxImage(null)}
        >
          <button className="absolute top-4 right-4 text-white hover:text-accent transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={lightboxImage} 
            alt="" 
            className="max-w-full max-h-[90vh] object-contain animate-scale-in" 
          />
        </div>
      )}
    </div>
  )
}

export default Portfolio

import { useState, useEffect, useRef } from 'react';
// Removed react-tiktok-embed due to Vite compatibility issues
  // TikTok video URLs for Our Properties section
  const tiktokVideos = [
    'https://www.tiktok.com/@ssconstructionpvt.ltd/video/7621085552133066004',
    'https://www.tiktok.com/@ssconstructionpvt.ltd/video/7619606279119555861',
    'https://www.tiktok.com/@ssconstructionpvt.ltd/video/7619268130312867092',
    'https://www.tiktok.com/@ssconstructionpvt.ltd/video/7618994026410183956',
    'https://www.tiktok.com/@ssconstructionpvt.ltd/video/7618558599744310548',
    'https://www.tiktok.com/@ssconstructionpvt.ltd/video/7617853863755828501',
    'https://www.tiktok.com/@ssconstructionpvt.ltd/video/7615969257234730260',
    'https://www.tiktok.com/@ssconstructionpvt.ltd/video/7615154550953037076',
    'https://www.tiktok.com/@ssconstructionpvt.ltd/video/7611879681092029716',
  ];
import { Link } from 'react-router-dom';
import api from '../api';
import { siteSettingsAPI } from '../api';
import PageLoader from '../components/PageLoader';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

// Removed sampleProperties array for cleaner code. Use API data only.

// Removed unused propertyTypes array.

// Helper function to get listing type
const getListingType = (property) => {
  const houseType = property.house_type?.toLowerCase()
  if (houseType === 'buy') return 'Buy'
  if (houseType === 'sell') return 'Sell'
  return 'Build'
}

// Helper function to get badge color
const getBadgeColor = (type) => {
  switch (type) {
    case 'Buy': return 'bg-blue-500'
    case 'Sell': return 'bg-red-500'
    case 'Build': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

// Helper function to get build type badge color
const getBuildTypeColor = (type) => {
  switch (type) {
    case 'Residential': return 'bg-green-500'
    case 'Commercial': return 'bg-blue-500'
    case 'Mixed': return 'bg-amber-500'
    default: return 'bg-gray-500'
  }
}

// Helper function to get status badge color
const getStatusColor = (status) => {
  switch (status) {
    case 'Planning': return 'bg-gray-500'
    case 'In Progress': return 'bg-blue-500'
    case 'Ready to Build': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const Home = () => {
  const { user, isPublicUser } = useAuth()
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true)
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [exclusiveProperties, setExclusiveProperties] = useState([])
  const [recentProperties, setRecentProperties] = useState([])
  const [buildProjects, setBuildProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [services, setServices] = useState([])
  const [whyChooseUs, setWhyChooseUs] = useState([])
  const [stats, setStats] = useState([
    { value: '20+', label: 'Years Experience' },
    { value: '500+', label: 'Projects' },
    { value: '100+', label: 'Happy Clients' },
    { value: '4', label: 'Areas Served' },
  ])
  const heroRef = useRef(null)

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all properties
        const propertiesRes = await api.get('/properties/')
        const propsData = propertiesRes.data.results || propertiesRes.data
        setProperties(propsData)
        setFilteredProperties(propsData)

        // Fetch exclusive properties for home showcase
        try {
          const featuredRes = await api.get('/properties/featured/')
          const featuredData = featuredRes.data.results || featuredRes.data
          setExclusiveProperties(featuredData.slice(0, 4))
        } catch (e) {
          console.log('Exclusive properties not available')
        }

        // Fetch recent approved properties for home showcase
        try {
          const recentRes = await api.get('/properties/approved/')
          const recentData = recentRes.data.results || recentRes.data
          setRecentProperties(recentData.slice(0, 6))
        } catch (e) {
          console.log('Recent properties not available')
        }
        
        // Fetch build projects
        try {
          const buildRes = await api.get('/properties/build/')
          const buildData = buildRes.data.results || buildRes.data
          setBuildProjects(buildData)
        } catch (e) { console.log('Build projects not available') }
        
        // Fetch services from API
        try {
          const servicesRes = await siteSettingsAPI.getServices()
          const servicesData = servicesRes.data.results || servicesRes.data
          if (servicesData.length > 0) setServices(servicesData)
        } catch (e) { console.log('Services not available') }
        
        // Fetch Why Choose Us from API
        try {
          const whyChooseUsRes = await siteSettingsAPI.getWhyChooseUs()
          const whyData = whyChooseUsRes.data.results || whyChooseUsRes.data
          if (whyData.length > 0) setWhyChooseUs(whyData)
        } catch (e) { console.log('Why Choose Us not available') }
        
        // Fetch stats from SiteSettings
        try {
          const settingsRes = await siteSettingsAPI.getSettings()
          const settingsData = settingsRes.data.results || settingsRes.data
          const statsMap = {}
          settingsData.forEach(s => { statsMap[s.key] = s.value })
          const newStats = [
            { value: statsMap.total_properties || '20+', label: 'Properties' },
            { value: statsMap.happy_clients || '100+', label: 'Happy Clients' },
            { value: statsMap.years_experience || '20+', label: 'Years Experience' },
            { value: statsMap.projects_completed || '500+', label: 'Projects Completed' },
          ]
          setStats(newStats)
        } catch (e) { console.log('Stats not available') }
        
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to sample data if API fails
        setProperties([])
        setFilteredProperties([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.05 }
      )
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el)
      })
      return () => observer.disconnect()
    }, 200)
    return () => clearTimeout(timer)
  }, [filteredProperties, loading])

  // Filter properties when filter or search changes
  useEffect(() => {
    let result = properties

    // Filter by listing type (Buy/Sell/Build)
    if (activeFilter !== 'All') {
      result = result.filter(p => {
        const houseType = p.house_type?.toLowerCase()
        if (activeFilter === 'Buy') return houseType === 'buy'
        if (activeFilter === 'Sell') return houseType === 'sell'
        if (activeFilter === 'Build') return houseType !== 'buy' && houseType !== 'sell'
        return true
      })
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        (p.location?.toLowerCase() || '').includes(query) ||
        (p.house_type?.toLowerCase() || p.type?.toLowerCase() || '').includes(query) ||
        (p.title?.toLowerCase() || '').includes(query)
      )
    }

    setFilteredProperties(result)
  }, [activeFilter, searchQuery, properties])

  // Default fallback data for whyChooseUs
  const defaultWhyChooseUs = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Trusted Quality',
      description: 'Built with premium materials and expert craftsmanship'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'On-Time Delivery',
      description: 'We complete projects within the agreed timeline'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Expert Team',
      description: 'Professional architects and skilled workers'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Competitive Pricing',
      description: 'Best value for your investment'
    },
  ]

  // Use API data or fallback to default
  const displayWhyChooseUs = whyChooseUs.length > 0 ? whyChooseUs : defaultWhyChooseUs

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-28 md:pb-0"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-zoom-in"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80)'
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-primary" />
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto animate-fade-in-up animate-delay-200">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-slide-in-down animate-delay-300"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
          >
            Find Your{' '}
            <span className="text-accent animate-pulse">Dream House</span>
          </h1>
          <p 
            className="text-base sm:text-lg md:text-2xl mb-10 text-gray-200 animate-fade-in-up animate-delay-500"
          >
            Premium Properties in <span className="text-accent">Tokha, Tarkeshwor</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-700 px-2 sm:px-0">
            <Link
              to="/buy"
              className="btn-primary text-base sm:text-lg px-8 py-4 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              View Properties
            </Link>
            <Link
              to="/contact"
              className="btn-secondary text-base sm:text-lg px-8 py-4 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              Contact Us
            </Link>
          </div>
          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-subtle animate-delay-1000">
            <svg className="w-6 h-6 text-white/70 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Welcome Banner for Public Users */}
      {isPublicUser && showWelcomeBanner && (
        <div className="bg-primary border-b-2 border-[#FFD700] py-3">
          <div className="container-custom flex items-center justify-between">
            <p className="text-[#FFD700] font-medium">
              👋 Welcome back, {user?.first_name || user?.full_name?.split(' ')[0] || 'User'}! Browse our latest properties below.
            </p>
            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <section className="py-16 bg-gradient-to-r from-accent-dark to-accent">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="animate-fade-in-up animate-delay-300 transition-transform duration-300 hover:scale-110 hover:shadow-2xl bg-white/10 rounded-xl py-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary animate-pulse animate-delay-500">{stat.value}</p>
                <p className="text-primary/80 font-medium mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Exclusive Properties */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12 animate-fade-in-up animate-delay-200">
            <div>
              <h2 className="section-title text-secondary">Exclusive Properties</h2>
              <p className="text-gray-400 mt-4 max-w-2xl">
                Handpicked premium properties featured by our admin team.
              </p>
            </div>
            <Link to="/buy" className="btn-secondary w-fit">
              View All Properties
            </Link>
          </div>

          {exclusiveProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {exclusiveProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-3xl p-10 text-center border border-white/10">
              <p className="text-gray-400 font-medium">
                No exclusive properties yet. Mark a property as exclusive from the admin panel to feature it here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Properties */}
      <section className="section-padding bg-primary-light">
        <div className="container-custom">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12 animate-fade-in-up animate-delay-200">
            <div>
              <h2 className="section-title text-secondary">Recent Properties</h2>
              <p className="text-gray-400 mt-4 max-w-2xl">
                Latest approved listings added to our collection.
              </p>
            </div>
            <Link to="/buy" className="btn-primary w-fit">
              Explore Buy Property
            </Link>
          </div>

          {recentProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-3xl p-10 text-center border border-white/10">
              <p className="text-gray-400 font-medium">
                No recent properties available right now.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up animate-delay-200">
            <h2 className="section-title text-secondary">Why Choose Us</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Experience the difference of working with a trusted construction partner
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayWhyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl text-center card card-hover-border animate-fade-in-up animate-delay-300 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent animate-pulse animate-delay-500">
                  {item.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold text-secondary mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up animate-delay-200">
            <h2 className="section-title text-secondary">Our Services</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Comprehensive construction and real estate solutions tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Buy/Sell Property */}
            <Link 
              to="/buy" 
              className="group bg-card rounded-2xl p-8 card card-hover-border animate-fade-in-up animate-delay-300 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors animate-pulse animate-delay-500">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-secondary mb-3 group-hover:text-accent transition-colors">Buy Property</h3>
              <p className="text-gray-400">
                Find your dream property or sell your real estate. We connect buyers 
                and sellers in Tokha, Tarkeshwor, and beyond.
              </p>
            </Link>
            {/* Sell Property */}
            <Link 
              to="/sell" 
              className="group bg-card rounded-2xl p-8 card card-hover-border animate-fade-in-up animate-delay-400 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors animate-pulse animate-delay-600">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-secondary mb-3 group-hover:text-accent transition-colors">Sell Your Property</h3>
              <p className="text-gray-400">
                List your property with us and get the best value. We help you sell 
                faster and at better prices.
              </p>
            </Link>
            {/* Build Your Property */}
            <Link 
              to="/build-property" 
              className="group bg-card rounded-2xl p-8 card card-hover-border animate-fade-in-up animate-delay-500 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors animate-pulse animate-delay-700">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-secondary mb-3 group-hover:text-accent transition-colors">Build Your Property</h3>
              <p className="text-gray-400">
                Build your dream home with our expert construction team. We deliver quality 
                construction in Tokha, Tarkeshwor, and beyond.
              </p>
            </Link>
            {/* Home Improvement & Services */}
            <Link
              to="/home-improvement"
              className="group bg-card rounded-2xl p-8 card card-hover-border animate-fade-in-up animate-delay-600 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors animate-pulse animate-delay-800">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 7v13a1 1 0 001 1h10a1 1 0 001-1V7M8 7V4a2 2 0 012-2h4a2 2 0 012 2v3" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-secondary mb-3 group-hover:text-accent transition-colors">Home Improvement & Services</h3>
              <p className="text-gray-400">
                Professional home improvement, renovation and trade services to maintain
                and upgrade your property — plumbing, electrical, carpentry and more.
              </p>
            </Link>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="section-title text-secondary">How It Works</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Simple steps to buy, sell, or build your dream property with us
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl text-center card card-hover-border animate-on-scroll">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-heading font-semibold text-secondary mb-2">Search & Explore</h3>
              <p className="text-gray-400 text-sm">Browse properties or plans that fit your needs and budget.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl text-center card card-hover-border animate-on-scroll">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-heading font-semibold text-secondary mb-2">Connect & Consult</h3>
              <p className="text-gray-400 text-sm">Contact our team for expert advice and property visits.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl text-center card card-hover-border animate-on-scroll">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-heading font-semibold text-secondary mb-2">Close & Celebrate</h3>
              <p className="text-gray-400 text-sm">Finalize your deal and start your new journey with us!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="section-title text-secondary">Get In Touch</h2>
              <p className="text-gray-400 mt-4 mb-8">
                Ready to find your dream home or start your construction project? 
                Contact us today for a free consultation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-secondary font-medium">Location</p>
                    <p className="text-gray-400">Tokha, Tarkeshwor, Kathmandu</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-secondary font-medium">Phone</p>
                    <p className="text-gray-400">+977 9810163311</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-secondary font-medium">Email</p>
                    <p className="text-gray-400">surajandsupriyaconstruction@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll">
              <Link
                to="/contact"
                className="block bg-card rounded-2xl p-8 card card-hover-border text-center"
              >
                <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-heading font-semibold text-secondary mb-3">Send us a Message</h3>
                <p className="text-gray-400 mb-6">
                  Have questions? We'd love to hear from you. Click to send us a message.
                </p>
                <span className="btn-primary inline-block">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-r from-accent-dark to-accent relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <div className="container-custom relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6 animate-on-scroll">
              Ready to Build Your Dream?
            </h2>
            <p className="text-primary/80 text-lg mb-10 max-w-2xl mx-auto animate-on-scroll">
              Let's discuss your project today and turn your vision into reality
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll delay-200">
              <a
                href="tel:+9779810163311"
                className="bg-primary text-secondary px-8 py-4 rounded-full font-semibold hover:bg-primary-light transition-all duration-300 hover:scale-105"
              >
                📞 Call Now
              </a>
              <a
                href="https://wa.me/9779810163311"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-all duration-300 hover:scale-105"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

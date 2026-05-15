import { useState, useEffect } from 'react'

const Testimonials = ({ testimonials = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoScroll, setAutoScroll] = useState(true)

  // Default testimonials if none provided
  const defaultTestimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Happy Customer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      text: 'Found my dream home through this platform. The agent was professional and supportive throughout the entire process. Highly recommended!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Property Seller',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      text: 'Sold my property much faster than expected. The team provided excellent marketing and market insights. Great experience!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Arun Poudel',
      role: 'First-Time Buyer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun',
      text: 'As a first-time buyer, I was nervous, but the team guided me through every step. Professional and trustworthy!',
      rating: 5,
    },
    {
      id: 4,
      name: 'Maya Thapa',
      role: 'Investor',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
      text: 'Excellent investment opportunities and market analysis. The platform has all the tools needed for smart decisions.',
      rating: 4.5,
    },
  ]

  const testimonialData = testimonials.length > 0 ? testimonials : defaultTestimonials

  useEffect(() => {
    if (!autoScroll) return

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonialData.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoScroll, testimonialData.length])

  const goToTestimonial = (index) => {
    setActiveIndex(index)
    setAutoScroll(false)
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(i => (
          <svg
            key={i}
            className={`w-4 h-4 ${i <= Math.floor(rating) ? 'text-accent' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <section className="py-20 bg-primary-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Thousands of satisfied customers have found their perfect property through our platform. Read their stories below.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Testimonial */}
          <div className="lg:col-span-2">
            <div className="card p-8 h-full flex flex-col justify-between">
              {/* Rating */}
              {renderStars(testimonialData[activeIndex].rating)}

              {/* Text */}
              <p className="text-gray-300 text-lg leading-relaxed mb-8 italic">
                "{testimonialData[activeIndex].text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <img
                  src={testimonialData[activeIndex].image}
                  alt={testimonialData[activeIndex].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-white">
                    {testimonialData[activeIndex].name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {testimonialData[activeIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col gap-4">
            <div className="card p-6 bg-gradient-to-br from-accent/20 to-accent/5">
              <div className="text-4xl font-bold text-accent mb-2">98%</div>
              <p className="text-gray-300">Client Satisfaction</p>
            </div>
            <div className="card p-6 bg-gradient-to-br from-green-500/20 to-green-500/5">
              <div className="text-4xl font-bold text-green-400 mb-2">5,000+</div>
              <p className="text-gray-300">Properties Sold</p>
            </div>
            <div className="card p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5">
              <div className="text-4xl font-bold text-blue-400 mb-2">20+</div>
              <p className="text-gray-300">Years Experience</p>
            </div>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center gap-3">
          {testimonialData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              onMouseEnter={() => setAutoScroll(false)}
              onMouseLeave={() => setAutoScroll(true)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-accent w-8'
                  : 'bg-white/20 w-2 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Additional Testimonials Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonialData.slice(0, 2).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="card p-6 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer"
              onClick={() => goToTestimonial(index)}
            >
              {renderStars(testimonial.rating)}
              <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

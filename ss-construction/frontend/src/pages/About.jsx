import Logo from '../components/Logo'

const About = () => {
  const areas = [
    { name: 'Tokha', description: 'Our primary service area with numerous residential projects' },
    { name: 'Tarkeshwor', description: 'Growing neighborhood with commercial and residential developments' },
    { name: 'Machhapokhari', description: 'Premium location for luxury villas and apartments' },
    { name: 'Kathmandu', description: 'Capital city coverage for all types of properties' },
  ]

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-primary-light pt-28 pb-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-2">About Us</h1>
          <p className="text-gray-400 text-lg">Building dreams since 2075</p>
        </div>
      </div>

      {/* Company Story */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">Our Story</h2>
              <p className="text-gray-400 mb-4 text-lg leading-relaxed">
                SS Construction was established in 2075 (2018 BS) with a vision to transform 
                the construction and real estate landscape in Kathmandu. Based in Tokha, 
                Tarkeshwor, we have grown to become one of the most trusted names in the industry.
              </p>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                With over 20 years of experience, we've successfully completed 500+ projects 
                including residential homes, commercial buildings, and luxury villas. Our 
                commitment to quality, transparency, and customer satisfaction sets us apart.
              </p>
              <div className="flex items-center space-x-8 mt-8">
                <div className="text-center">
                  <p className="text-4xl font-heading font-bold text-accent">20+</p>
                  <p className="text-gray-400">Years Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-heading font-bold text-accent">500+</p>
                  <p className="text-gray-400">Projects Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-heading font-bold text-accent">100+</p>
                  <p className="text-gray-400">Happy Clients</p>
                </div>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
                alt="About Us"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Areas Served */}
      <section className="section-padding bg-primary-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-secondary">Areas We Serve</h2>
            <p className="text-gray-400 mt-4">Proudly serving these neighborhoods in Kathmandu</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areas.map((area, index) => (
              <div 
                key={index} 
                className="bg-card p-6 rounded-2xl card card-hover-border"
              >
                <h3 className="text-xl font-heading font-semibold text-secondary mb-2">{area.name}</h3>
                <p className="text-gray-400 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-2xl">
              <h3 className="text-2xl font-heading font-bold text-accent mb-4">Our Mission</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                To deliver high-quality construction and real estate services that exceed 
                customer expectations while maintaining transparency, integrity, and 
                sustainability in all our projects.
              </p>
            </div>
            <div className="bg-gradient-to-r from-accent-dark to-accent p-8 rounded-2xl">
              <h3 className="text-2xl font-heading font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-primary/80 text-lg leading-relaxed">
                To be the most trusted construction and real estate company in Nepal, 
                known for exceptional quality, innovative designs, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-primary-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-secondary">Our Team</h2>
            <p className="text-gray-400 mt-4">Meet the experts behind our success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-8 text-center card card-hover-border">
                <div className="w-28 h-28 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-accent text-3xl font-bold">T{i}</span>
                </div>
                <h3 className="text-xl font-heading font-semibold text-secondary mb-1">Team Member {i}</h3>
                <p className="text-accent">Position</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

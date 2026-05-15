import { motion } from 'framer-motion'
import { Phone, MessageCircle } from 'lucide-react'

const MobileBottomBar = () => {
  const phoneNumber = '9779810163311'
  
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-lg border-t border-white/10 shadow-lg md:hidden z-50"
    >
      <div className="flex items-center justify-around py-3 px-4">
        {/* Call Now Button */}
        <a
          href={`tel:${phoneNumber}`}
          className="relative flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-full font-semibold hover:bg-accent-light transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Phone size={20} />
          <span>Call Now</span>
          {/* Pulse effect */}
          <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />
        </a>
        
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-400 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <MessageCircle size={20} />
          <span>WhatsApp</span>
          {/* Pulse effect */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
        </a>
      </div>
    </motion.div>
  )
}

export default MobileBottomBar

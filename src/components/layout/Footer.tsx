
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-harvest-cream py-12 border-t border-harvest-sage/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link 
                to="/" 
                className="inline-block text-2xl font-semibold text-harvest-sage mb-4"
              >
                harvest
              </Link>
              <p className="text-harvest-charcoal/70 mb-6 text-sm">
                Connecting food donors with volunteers to reduce waste and fight hunger in our community.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
              </div>
            </motion.div>
          </div>
          
          <div className="col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-harvest-charcoal font-medium mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/volunteer" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Volunteer
                  </Link>
                </li>
                <li>
                  <Link to="/donor" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Donate Food
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Partner With Us
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
          
          <div className="col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-harvest-charcoal font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Food Safety Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Volunteer Handbook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Donation FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Food Waste Statistics
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
          
          <div className="col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-harvest-charcoal font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-harvest-charcoal/70 hover:text-harvest-sage transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-harvest-sage/10 text-center"
        >
          <p className="text-sm text-harvest-charcoal/60">
            &copy; {currentYear} Harvest App. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

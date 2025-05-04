import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Users, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Testimonials from '@/components/shared/Testimonials';
import PageTransition from '@/components/ui/page-transition';

const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Restaurant Owner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    content: "Harvest has changed how we deal with surplus food. Now instead of throwing away extras, we know it's going directly to people who need it. The platform is incredibly easy to use!"
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    content: "Being a part of Harvest lets me make a real difference in my community. I've met amazing people and helped provide meals for those in need. The scheduling system makes it easy to volunteer when I have time."
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Community Organizer',
    image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    content: "Harvest creates a beautiful connection between donors and volunteers. Our community center has received fresh food that would have otherwise gone to waste. The impact on families has been incredible."
  }
];

const features = [
  {
    icon: Package,
    title: 'Simple Donation Process',
    description: 'Quickly list surplus food items with details on quantity, location, and pickup times.'
  },
  {
    icon: Users,
    title: 'Connect with Volunteers',
    description: 'Get matched with nearby volunteers who can collect and redistribute your donations.'
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: "Track the status of your donations and receive notifications when they're claimed."
  },
  {
    icon: Award,
    title: 'Make a Difference',
    description: 'See your direct impact with metrics on food rescued and people helped.'
  }
];

const Index = () => {
  return (
    <PageTransition>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20">
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-fooddrop-cream to-white"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-fooddrop-charcoal leading-tight">
                    Connecting food surplus with those who need it most
                  </h1>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <p className="text-lg text-fooddrop-charcoal/70 max-w-lg">
                    FoodDrop is a platform that connects food donors with volunteers to combat hunger and reduce waste in our communities.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
                >
                  <Button 
                    asChild
                    className="bg-fooddrop-sage hover:bg-fooddrop-sage/90 text-white px-6 py-6 rounded-md shadow-sm"
                  >
                    <Link to="/donor">
                      <span>I Want to Donate</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline"
                    className="border-fooddrop-sage text-fooddrop-charcoal hover:bg-fooddrop-sage/10 px-6 py-6 rounded-md"
                  >
                    <Link to="/volunteer">
                      <span>I Want to Volunteer</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="People sharing food" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-medium text-fooddrop-charcoal mb-4">How FoodDrop Works</h2>
                <p className="text-fooddrop-charcoal/70 max-w-2xl mx-auto">
                  We make it simple to donate surplus food and volunteer to help those in need.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="p-6 glass rounded-xl border border-fooddrop-sage/20"
                >
                  <div className="h-12 w-12 bg-fooddrop-sage/10 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-fooddrop-sage" />
                  </div>
                  <h3 className="text-xl font-medium text-fooddrop-charcoal mb-2">{feature.title}</h3>
                  <p className="text-fooddrop-charcoal/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <Testimonials testimonials={testimonials} />
        
        {/* CTA Section */}
        <section className="py-20 bg-fooddrop-sage/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-medium text-fooddrop-charcoal">Ready to make a difference?</h2>
                <p className="text-lg text-fooddrop-charcoal/70">
                  Join our community of donors and volunteers working together to reduce food waste and feed those in need.
                </p>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4 justify-center">
                  <Button 
                    asChild
                    className="bg-fooddrop-sage hover:bg-fooddrop-sage/90 text-white px-6 py-6 rounded-md shadow-sm"
                  >
                    <Link to="/donor">
                      <span>Start Donating</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline"
                    className="border-fooddrop-sage text-fooddrop-charcoal hover:bg-fooddrop-sage/10 px-6 py-6 rounded-md"
                  >
                    <Link to="/volunteer">
                      <span>Become a Volunteer</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default Index;

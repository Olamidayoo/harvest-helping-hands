
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/ui/page-transition';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sprout, Users, Utensils } from 'lucide-react';

const About = () => {
  return (
    <PageTransition>
      <Navbar />
      
      <main className="min-h-screen pt-24 pb-16 bg-harvest-cream/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-harvest-charcoal mb-6">About Harvest</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl text-harvest-charcoal/80 mb-8">
                Harvest is a community-driven platform connecting food donors with volunteers to reduce waste and fight hunger in our communities.
              </p>
              
              <p className="text-harvest-charcoal/70">
                Founded with a simple mission to ensure that good food doesn't go to waste, Harvest creates a bridge between those with excess food and those who can help distribute it to people in need. Whether you're a restaurant with leftover meals, a grocery store with surplus produce, or an individual with extra food from an event, our platform makes it easy to connect with volunteers who can ensure your donation reaches those who need it most.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card className="glass hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-harvest-sage/10 mr-4">
                      <Utensils className="h-6 w-6 text-harvest-sage" />
                    </div>
                    <h3 className="text-xl font-semibold text-harvest-charcoal">For Donors</h3>
                  </div>
                  <p className="text-harvest-charcoal/70">
                    Easily list your excess food for donation. Our platform connects you with local volunteers who can pick up and distribute your donations to community organizations, shelters, and food banks.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-harvest-sage/10 mr-4">
                      <Heart className="h-6 w-6 text-harvest-sage" />
                    </div>
                    <h3 className="text-xl font-semibold text-harvest-charcoal">For Volunteers</h3>
                  </div>
                  <p className="text-harvest-charcoal/70">
                    Make a difference in your community by helping transport food donations to those who need them. Browse available donations in your area and choose when and where you'd like to help.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-3xl font-semibold text-harvest-charcoal mb-8">Our Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <Card className="glass text-center p-6">
                <Sprout className="h-12 w-12 text-harvest-sage mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-harvest-charcoal mb-2">5,000+</h3>
                <p className="text-harvest-charcoal/70">Meals rescued</p>
              </Card>
              
              <Card className="glass text-center p-6">
                <Users className="h-12 w-12 text-harvest-sage mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-harvest-charcoal mb-2">300+</h3>
                <p className="text-harvest-charcoal/70">Active volunteers</p>
              </Card>
              
              <Card className="glass text-center p-6">
                <Utensils className="h-12 w-12 text-harvest-sage mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-harvest-charcoal mb-2">150+</h3>
                <p className="text-harvest-charcoal/70">Donors registered</p>
              </Card>
            </div>
            
            <h2 className="text-3xl font-semibold text-harvest-charcoal mb-8">Join Our Mission</h2>
            <p className="text-harvest-charcoal/70 mb-6">
              Whether you're a restaurant, grocery store, event organizer, or individual with excess food, or someone who wants to help reduce food waste in your community, we invite you to join our mission. Together, we can build a world where good food never goes to waste.
            </p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default About;


import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <div className="py-16 bg-harvest-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-medium text-harvest-charcoal mb-4">Stories of Impact</h2>
            <p className="text-harvest-charcoal/70 max-w-2xl mx-auto">
              Read how Harvest is making a difference in communities by connecting donors with volunteers.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full glass border-harvest-sage/20 hover:border-harvest-sage/40 transition-all duration-300">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="mb-4 text-harvest-sage">
            <Quote className="h-8 w-8 opacity-80" />
          </div>
          
          <p className="text-harvest-charcoal/80 mb-6 flex-grow">"{testimonial.content}"</p>
          
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-harvest-sage">
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium text-harvest-charcoal">{testimonial.name}</h4>
              <p className="text-sm text-harvest-charcoal/60">{testimonial.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Testimonials;

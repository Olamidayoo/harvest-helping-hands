
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';
import PageTransition from '@/components/ui/page-transition';

const Login = () => {
  return (
    <PageTransition>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-16 bg-harvest-cream/30 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LoginForm />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default Login;

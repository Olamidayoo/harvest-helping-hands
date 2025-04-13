
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 glass' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-semibold text-harvest-charcoal"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center"
            >
              <span className="text-harvest-sage font-bold">harvest</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <NavLinks />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-harvest-sage/10 border-harvest-sage/20 text-harvest-sage hover:bg-harvest-sage/20"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {userRole === 'donor' ? 'Donor' : 'Volunteer'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userRole === 'donor' && (
                    <DropdownMenuItem asChild>
                      <Link to="/donor">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  
                  {userRole === 'volunteer' && (
                    <DropdownMenuItem asChild>
                      <Link to="/volunteer">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem 
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  className="border-harvest-sage text-harvest-sage hover:bg-harvest-sage/10"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  className="bg-harvest-sage hover:bg-harvest-sage/90 text-white"
                  asChild
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-harvest-sage/10 border-harvest-sage/20 text-harvest-sage hover:bg-harvest-sage/20"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userRole === 'donor' && (
                    <DropdownMenuItem asChild>
                      <Link to="/donor">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  
                  {userRole === 'volunteer' && (
                    <DropdownMenuItem asChild>
                      <Link to="/volunteer">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem 
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden glass mt-2 px-4 py-5 mx-4 rounded-xl"
        >
          <nav className="flex flex-col space-y-4">
            <NavLinks />
            
            {!user && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-harvest-sage/10">
                <Button 
                  variant="outline"
                  className="w-full border-harvest-sage text-harvest-sage hover:bg-harvest-sage/10"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  className="w-full bg-harvest-sage hover:bg-harvest-sage/90 text-white"
                  asChild
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

const NavLinks = () => {
  const location = useLocation();
  const { user, userRole } = useAuth();
  
  // Base links that everyone sees
  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];
  
  // Add role-specific links if user is logged in
  if (user) {
    if (userRole === 'donor') {
      links.push({ name: 'Donate', path: '/donor' });
    } else if (userRole === 'volunteer') {
      links.push({ name: 'Volunteer', path: '/volunteer' });
    }
  } else {
    // If user is not logged in, show both options
    links.push(
      { name: 'Donate', path: '/login?role=donor' },
      { name: 'Volunteer', path: '/login?role=volunteer' }
    );
  }

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`relative px-1 py-2 text-sm font-medium transition-colors hover:text-harvest-sage ${
            location.pathname === link.path
              ? 'text-harvest-sage'
              : 'text-harvest-charcoal'
          }`}
        >
          {link.name}
          {location.pathname === link.path && (
            <motion.span
              layoutId="navbar-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-harvest-sage"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </Link>
      ))}
    </>
  );
};

export default Navbar;

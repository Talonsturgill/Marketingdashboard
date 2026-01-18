import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Overview from './pages/Overview';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Content from './pages/Content';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { CustomCursor } from './components/ui/custom-cursor';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto w-full">
            <Overview />
          </motion.div>
        } />
        <Route path="/events" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto w-full">
            <Events />
          </motion.div>
        } />
        <Route path="/events/:id" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto w-full">
            <EventDetail />
          </motion.div>
        } />
        <Route path="/content" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto w-full">
            <Content />
          </motion.div>
        } />
        <Route path="/reports" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto w-full p-8 text-center text-text-secondary">
            <h2 className="text-3xl font-display font-bold text-gradient-primary mb-4">Reports Center</h2>
            <p className="text-lg">Automated insights generation coming soon.</p>
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000,   // Cache persists for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: false,    // Don't refetch on component mount if data exists
      retry: 1,                 // Only retry failed requests once
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="crt-overlay" />
        <div className="min-h-screen relative">
          <CustomCursor />
          <Sidebar />
          <MobileNav />

          {/* Main content area - offset for sidebar on large screens */}
          <main className="relative z-10 lg:ml-72 pt-6 pb-32 px-6 lg:px-10">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;


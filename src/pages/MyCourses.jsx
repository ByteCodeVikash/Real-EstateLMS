import React, { useState } from 'react';
import { Search, Filter, Play, Clock, BookOpen, MoreVertical, Star } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { mockData } from '../data/mockData';
import { motion } from 'framer-motion';

const MyCourses = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Security', 'Design', 'Business', 'Technology'];

  const filteredCourses = filter === 'All' 
    ? mockData.courses 
    : mockData.courses.filter(c => c.category === filter);

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-premium-text">You have {mockData.courses.length} active courses in your library.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-text" />
            <input 
              type="text" 
              placeholder="Search library..." 
              className="bg-premium-card border border-premium-border rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/50 w-full md:w-64 transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 shrink-0 ${
              filter === cat 
                ? 'bg-premium-accent text-white shadow-lg shadow-premium-accent/20' 
                : 'bg-premium-border/50 text-premium-text hover:bg-premium-border hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-0 overflow-hidden flex flex-col h-full group">
              <div className="relative h-44 overflow-hidden">
                <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-premium-dark/90 via-transparent to-transparent"></div>
                
                {course.isPremium && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 p-1.5 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                   <Badge variant={course.status === 'Completed' ? 'success' : 'premium'}>
                    {course.status}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-snug group-hover:text-premium-accent transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <button className="text-premium-text hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm text-premium-text mb-6">By {course.instructor}</p>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-xs text-premium-text">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>24 Lessons</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-premium-text">Progress</span>
                      <span className="text-premium-accent">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-premium-border rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-premium rounded-full"
                      ></motion.div>
                    </div>
                  </div>

                  <Button className="w-full py-2.5 rounded-lg group">
                    {course.progress === 100 ? 'Watch Again' : 'Continue'} 
                    <Play className="ml-2 w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-premium-border/30 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-premium-text" />
          </div>
          <h3 className="text-xl font-bold mb-2">No courses found</h3>
          <p className="text-premium-text max-w-xs">We couldn't find any courses matching your search or filters.</p>
          <Button variant="outline" className="mt-6" onClick={() => setFilter('All')}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default MyCourses;

import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Clock, CheckCircle, Zap, Play, ChevronRight, Calendar, Users, Star } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { mockData } from '../data/mockData';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
          <p className="text-premium-text">Your market analysis track is 75% complete. Ready for the NYC Live Session?</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="premium" className="py-2 px-4">
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" /> Premium Member
            </span>
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" /> Schedule
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockData.stats.map((stat, i) => (
          <GlassCard key={i} className="relative overflow-hidden group">
            <div className={stat.bg + " absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"}></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className={stat.bg + " p-3 rounded-xl"}>
                <stat.icon className={stat.color + " w-6 h-6"} />
              </div>
              <div>
                <p className="text-sm text-premium-text mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Market Analysis Trend</h3>
            <select className="bg-premium-border/50 border-none rounded-lg text-sm px-3 py-1 text-white focus:ring-1 focus:ring-premium-accent">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.weeklyActivity}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121214', 
                    border: '1px solid #1f1f23',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#7c3aed' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#7c3aed" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Live Classes */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Live Now</h3>
            <Badge variant="danger" className="animate-pulse">Live</Badge>
          </div>
          <div className="space-y-6">
            {mockData.liveClasses.map((item) => (
              <div key={item.id} className="flex gap-4 group cursor-pointer">
                <div className="relative shrink-0">
                  <img src={item.image} className="w-12 h-12 rounded-full object-cover border-2 border-premium-border group-hover:border-premium-accent transition-colors" />
                  {item.isLive && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-premium-card"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate group-hover:text-premium-accent transition-colors">{item.title}</p>
                  <p className="text-sm text-premium-text mb-2">Mentor: {item.mentor}</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-premium-accent" />
                    <span className="text-xs text-premium-accent font-medium">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">View Schedule</Button>
          </div>
        </GlassCard>
      </div>

      {/* Recent Lectures */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Continue Learning</h3>
          <Button variant="ghost" className="text-premium-accent">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockData.courses.slice(0, 3).map((course) => (
            <GlassCard key={course.id} className="group p-0 overflow-hidden flex flex-col">
              <div className="relative h-48">
                <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-premium-dark/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant={course.status === 'Completed' ? 'success' : 'premium'} className="mb-2">
                    {course.category}
                  </Badge>
                  <h4 className="font-bold text-lg line-clamp-1">{course.title}</h4>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-premium-text">{course.instructor}</span>
                  <span className="text-premium-text">{course.duration}</span>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-premium-text">Progress</span>
                    <span className="text-premium-accent font-bold">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-premium-border rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-premium rounded-full"
                    ></motion.div>
                  </div>
                </div>
                <Button className="w-full group">
                  Continue <Play className="ml-2 w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

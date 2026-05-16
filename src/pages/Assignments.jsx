import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Clock, CheckCircle, AlertCircle, MessageSquare, Download, Calendar } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';

const assignments = [
  {
    id: 1,
    title: "DRM Implementation Plan",
    course: "Anti-Piracy & DRM Implementation",
    dueDate: "May 20, 2026",
    status: "Pending",
    difficulty: "Hard",
    description: "Create a detailed technical document outlining the implementation of Widevine L1 DRM for a streaming platform."
  },
  {
    id: 2,
    title: "Security Architecture Diagram",
    course: "Advanced Full-Stack Security",
    dueDate: "May 18, 2026",
    status: "Submitted",
    difficulty: "Medium",
    description: "Design a secure system architecture for a multi-tenant SaaS application with JWT authentication."
  },
  {
    id: 3,
    title: "UX Research: Fintech App",
    course: "UI/UX Mastery",
    dueDate: "May 15, 2026",
    status: "Graded",
    grade: "A+",
    difficulty: "Easy",
    description: "Conduct user research for a premium fintech application focusing on trust and security visual cues."
  }
];

const Assignments = () => {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assignments</h1>
          <p className="text-premium-text">Manage your tasks and track your academic progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Download Syllabus</Button>
          <Button>Submit New</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Assignment List */}
        <div className="lg:col-span-2 space-y-6">
          {assignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      assignment.status === 'Graded' ? 'bg-green-500/10' : 'bg-premium-accent/10'
                    }`}>
                      <FileText className={`w-7 h-7 ${
                        assignment.status === 'Graded' ? 'text-green-400' : 'text-premium-accent'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-premium-accent transition-colors">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-premium-text">{assignment.course}</p>
                      </div>
                      <Badge variant={
                        assignment.status === 'Pending' ? 'warning' : 
                        assignment.status === 'Submitted' ? 'info' : 'success'
                      }>
                        {assignment.status} {assignment.grade && `- ${assignment.grade}`}
                      </Badge>
                    </div>
                    
                    <p className="text-premium-text text-sm mb-6 leading-relaxed">
                      {assignment.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-xs text-premium-text">
                        <Calendar className="w-4 h-4 text-premium-accent" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-premium-text">
                        <AlertCircle className="w-4 h-4 text-premium-accent" />
                        <span>Difficulty: {assignment.difficulty}</span>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        <Button variant="ghost" size="sm">Details</Button>
                        {assignment.status === 'Pending' ? (
                          <Button size="sm">Submit Now</Button>
                        ) : (
                          <Button variant="outline" size="sm">View Submission</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-xl font-bold mb-6">Performance Overview</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-green-400 w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <span className="font-bold">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="text-blue-400 w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Instructor Feedback</span>
                </div>
                <span className="font-bold">12 New</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">Average Time</span>
                </div>
                <span className="font-bold">4.2h / week</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-8">View Detailed Report</Button>
          </GlassCard>

          <GlassCard className="bg-gradient-premium border-none relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
             <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
                <p className="text-white/80 text-sm mb-6">Connect with a mentor for one-on-one assistance with your assignments.</p>
                <Button className="w-full bg-white text-premium-accent hover:bg-white/90">Book a Mentor</Button>
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Assignments;

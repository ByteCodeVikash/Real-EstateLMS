import React from 'react';
import { Shield, ShieldCheck, Monitor, Smartphone, Tablet, Key, Lock, Fingerprint, Eye, EyeOff, Globe, LogOut, ChevronRight, AlertCircle } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { mockData } from '../data/mockData';

const ProfileSecurity = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security & Devices</h1>
          <p className="text-premium-text">Manage your account security and authorized devices.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="py-1.5 px-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Account Secured
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Security Strength Widget */}
        <GlassCard className="lg:col-span-1">
          <h3 className="text-xl font-bold mb-8">Security Strength</h3>
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="80" cy="80" r="70" 
                  className="stroke-premium-border" strokeWidth="8" fill="transparent"
                />
                <circle 
                  cx="80" cy="80" r="70" 
                  className="stroke-premium-accent" strokeWidth="8" fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 * (1 - 0.85)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">85%</span>
                <span className="text-xs text-premium-text uppercase tracking-widest font-bold">Excellent</span>
              </div>
            </div>
            <p className="text-sm text-premium-text mb-8">
              Your account is very secure. Enable physical security keys for 100% protection.
            </p>
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-xs p-3 bg-premium-border/30 rounded-lg">
                <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> 2FA Enabled</span>
                <span className="text-green-400 font-bold">YES</span>
              </div>
              <div className="flex items-center justify-between text-xs p-3 bg-premium-border/30 rounded-lg">
                <span className="flex items-center gap-2"><Fingerprint className="w-3.5 h-3.5" /> Biometrics</span>
                <span className="text-green-400 font-bold">YES</span>
              </div>
              <div className="flex items-center justify-between text-xs p-3 bg-premium-border/30 rounded-lg">
                <span className="flex items-center gap-2"><Key className="w-3.5 h-3.5" /> Hardware Key</span>
                <span className="text-premium-accent font-bold">ADD</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Device Management */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Authorized Devices</h3>
            <span className="text-sm text-premium-text">Max Limit: 3 Devices</span>
          </div>
          
          <div className="space-y-4">
            {mockData.devices.map((device) => (
              <div key={device.id} className="p-5 rounded-2xl border border-premium-border bg-premium-dark/40 flex items-center justify-between group hover:border-premium-accent transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-premium-border flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                    <device.icon className="w-7 h-7 text-premium-text group-hover:text-premium-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold">{device.name}</p>
                      {device.status === 'Active Now' && (
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-premium-text">{device.location} • {device.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={device.status === 'Active Now' ? 'success' : 'info'}>{device.type}</Badge>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-premium-accent/5 border border-premium-accent/20 flex items-start gap-4">
            <Shield className="w-6 h-6 text-premium-accent shrink-0" />
            <div>
              <p className="text-sm font-bold text-premium-accent mb-1">Advanced Content Protection</p>
              <p className="text-xs text-premium-text leading-relaxed">
                Your account is bound to these authorized terminals. To maintain license integrity, 
                simultaneous streaming is limited to 3 verified devices. Contact support for corporate multi-user licensing.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Login Activity */}
        <GlassCard className="lg:col-span-3">
          <h3 className="text-xl font-bold mb-8">Recent Login Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-premium-border text-xs text-premium-text uppercase tracking-widest font-bold">
                  <th className="pb-4 px-4">Browser / Device</th>
                  <th className="pb-4 px-4">IP Address</th>
                  <th className="pb-4 px-4">Location</th>
                  <th className="pb-4 px-4">Time</th>
                  <th className="pb-4 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-premium-border/30">
                {[
                  { browser: 'Chrome on MacOS', ip: '192.168.1.45', loc: 'San Francisco, US', time: 'Active Now', status: 'Success' },
                  { browser: 'Safari on iOS', ip: '10.0.0.12', loc: 'San Jose, US', time: '2h ago', status: 'Success' },
                  { browser: 'Firefox on Linux', ip: '45.12.34.89', loc: 'Berlin, DE', time: '5h ago', status: 'Blocked' },
                  { browser: 'Chrome on MacOS', ip: '192.168.1.45', loc: 'San Francisco, US', time: '1d ago', status: 'Success' },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-medium">{row.browser}</td>
                    <td className="py-4 px-4 text-sm text-premium-text font-mono">{row.ip}</td>
                    <td className="py-4 px-4 text-sm text-premium-text">{row.loc}</td>
                    <td className="py-4 px-4 text-sm text-premium-text">{row.time}</td>
                    <td className="py-4 px-4 text-right">
                      <Badge variant={row.status === 'Success' ? 'success' : 'danger'}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfileSecurity;

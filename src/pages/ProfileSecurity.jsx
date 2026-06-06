import React from 'react';
import { Shield, ShieldCheck, Monitor, Smartphone, Tablet, Key, Lock, Fingerprint, Eye, EyeOff, Globe, LogOut, ChevronRight, AlertCircle } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { mockData } from '../data/mockData';

const ProfileSecurity = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Security & Devices</h1>
          <p className="text-sm text-slate-400 font-bold">Manage your account security and authorized devices.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="py-2 px-4 flex items-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
            <ShieldCheck className="w-4.5 h-4.5" /> Account Secured
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Security Strength Widget */}
        <GlassCard className="lg:col-span-1 bg-[#0b0b0d] border border-premium-border p-6 shadow-sm rounded-2xl">
          <h3 className="text-xl font-black text-white mb-8">Security Strength</h3>
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="80" cy="80" r="70" 
                  className="stroke-slate-100" strokeWidth="8" fill="transparent"
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
                <span className="text-4xl font-black text-white">85%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">Excellent</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 font-semibold mb-8">
              Your account is very secure. Enable physical security keys for 100% protection.
            </p>
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-xs p-3.5 bg-[#0f0f12] border border-premium-border rounded-xl shadow-sm text-slate-600 font-bold">
                <span className="flex items-center gap-2 text-slate-500"><Lock className="w-3.5 h-3.5" /> 2FA Enabled</span>
                <span className="text-emerald-400 font-black">YES</span>
              </div>
              <div className="flex items-center justify-between text-xs p-3.5 bg-[#0f0f12] border border-premium-border rounded-xl shadow-sm text-slate-600 font-bold">
                <span className="flex items-center gap-2 text-slate-500"><Fingerprint className="w-3.5 h-3.5" /> Biometrics</span>
                <span className="text-emerald-400 font-black">YES</span>
              </div>
              <div className="flex items-center justify-between text-xs p-3.5 bg-[#0f0f12] border border-premium-border rounded-xl shadow-sm text-slate-600 font-bold">
                <span className="flex items-center gap-2 text-slate-500"><Key className="w-3.5 h-3.5" /> Hardware Key</span>
                <span className="text-premium-accent font-black cursor-pointer hover:underline">ADD</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Device Management */}
        <GlassCard className="lg:col-span-2 bg-[#0b0b0d] border border-premium-border p-6 shadow-sm rounded-2xl text-left">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white">Authorized Devices</h3>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Max Limit: 3 Devices</span>
          </div>
          
          <div className="space-y-4">
            {mockData.devices.map((device) => (
              <div key={device.id} className="p-5 rounded-2xl border border-premium-border bg-[#0f0f12]/50 flex items-center justify-between group hover:border-premium-accent/20 transition-all shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#0b0b0d] border border-premium-border flex items-center justify-center rounded-2xl shadow-sm group-hover:scale-105 transition-transform">
                    <device.icon className="w-7 h-7 text-slate-400 group-hover:text-premium-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="font-bold text-white">{device.name}</p>
                      {device.status === 'Active Now' && (
                        <span className="w-2 h-2 bg-emerald-500/100 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">{device.location} • {device.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={device.status === 'Active Now' ? 'success' : 'info'} className="text-[9px] font-black">{device.type}</Badge>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-500/100/10 hover:text-red-400 rounded-lg border border-transparent hover:border-red-500/20 shadow-none">
                    <LogOut className="w-4.5 h-4.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-[#0A66C2]/10/50 border border-[#0A66C2]/20 flex items-start gap-4 shadow-sm">
            <Shield className="w-6 h-6 text-premium-accent shrink-0" />
            <div>
              <p className="text-sm font-black text-premium-accent mb-1 uppercase tracking-wider">Advanced Content Protection</p>
              <p className="text-xs text-slate-500 leading-relaxed font-bold">
                Your account is bound to these authorized terminals. To maintain license integrity, 
                simultaneous streaming is limited to 3 verified devices. Contact support for corporate multi-user licensing.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Login Activity */}
        <GlassCard className="lg:col-span-3 bg-[#0b0b0d] border border-premium-border p-6 shadow-sm rounded-2xl">
          <h3 className="text-xl font-black text-white mb-8">Recent Login Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-premium-border text-xs text-slate-400 uppercase tracking-widest font-black">
                  <th className="pb-4 px-4">Browser / Device</th>
                  <th className="pb-4 px-4">IP Address</th>
                  <th className="pb-4 px-4">Location</th>
                  <th className="pb-4 px-4">Time</th>
                  <th className="pb-4 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { browser: 'Chrome on MacOS', ip: '192.168.1.45', loc: 'San Francisco, US', time: 'Active Now', status: 'Success' },
                  { browser: 'Safari on iOS', ip: '10.0.0.12', loc: 'San Jose, US', time: '2h ago', status: 'Success' },
                  { browser: 'Firefox on Linux', ip: '45.12.34.89', loc: 'Berlin, DE', time: '5h ago', status: 'Blocked' },
                  { browser: 'Chrome on MacOS', ip: '192.168.1.45', loc: 'San Francisco, US', time: '1d ago', status: 'Success' },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-[#0f0f12]/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-white text-sm">{row.browser}</td>
                    <td className="py-4 px-4 text-xs text-slate-400 font-mono font-bold">{row.ip}</td>
                    <td className="py-4 px-4 text-xs text-slate-400 font-bold">{row.loc}</td>
                    <td className="py-4 px-4 text-xs text-slate-400 font-bold">{row.time}</td>
                    <td className="py-4 px-4 text-right">
                      <Badge variant={row.status === 'Success' ? 'success' : 'danger'} className="text-[9px] font-black">{row.status}</Badge>
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

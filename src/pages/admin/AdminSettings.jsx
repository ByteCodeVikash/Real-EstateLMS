import React, { useState } from 'react';
import { Settings, CreditCard, Paintbrush, Mail, Globe, Save } from 'lucide-react';
import { Button } from '../../components/UI';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [generalForm, setGeneralForm] = useState({ siteName: 'BJ Reality Training Courses', supportEmail: 'support@bjreality.com', platformFee: '0.00', currency: 'USD' });
  const [brandingForm, setBrandingForm] = useState({ primaryColor: '#2563eb', fontStyle: 'Plus Jakarta Sans', darkModeDefault: true });
  const [paymentForm, setPaymentForm] = useState({ stripePublicKey: 'pk_test_51Nx...', stripeSecretKey: 'sk_test_51Nx...', sandboxMode: true });
  const [smtpForm, setSmtpForm] = useState({ smtpHost: 'smtp.sendgrid.net', smtpPort: '587', smtpUser: 'apikey', encryption: 'TLS' });

  const handleSave = (e) => {
    e.preventDefault();
    alert("Mock Success: System variables updated and synced with cloud servers!");
  };

  const tabs = [
    { id: 'general', label: 'Platform General', icon: Settings },
    { id: 'branding', label: 'Custom Branding', icon: Paintbrush },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    { id: 'smtp', label: 'Mailing Gateway', icon: Mail }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase">Platform Settings</h1>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Configure global variables, currency overrides, transaction fees, custom branding tokens, and gateway APIs.</p>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Hand Tab list */}
        <div className="flex flex-col gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider text-left border ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-premium-accent/15 to-violet-500/5 border-premium-accent/25 text-premium-accent'
                  : 'bg-white dark:bg-slate-900 border-premium-border/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <t.icon className="w-4.5 h-4.5" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Right Hand Form Content */}
        <div className="lg:col-span-3 rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <form onSubmit={handleSave} className="space-y-6">
            
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-premium-heading dark:text-white tracking-tight uppercase border-b border-slate-100 dark:border-slate-855 pb-2">General Platform Config</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Site Brand Name</label>
                  <input
                    type="text"
                    required
                    value={generalForm.siteName}
                    onChange={(e) => setGeneralForm({ ...generalForm, siteName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Support Email Address</label>
                    <input
                      type="email"
                      required
                      value={generalForm.supportEmail}
                      onChange={(e) => setGeneralForm({ ...generalForm, supportEmail: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Platform Transaction Fee (%)</label>
                    <input
                      type="text"
                      required
                      value={generalForm.platformFee}
                      onChange={(e) => setGeneralForm({ ...generalForm, platformFee: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-premium-heading dark:text-white tracking-tight uppercase border-b border-slate-100 dark:border-slate-855 pb-2">Custom Branding & Styles</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Primary Theme Hex</label>
                  <input
                    type="text"
                    required
                    value={brandingForm.primaryColor}
                    onChange={(e) => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Global Typography Family</label>
                    <select
                      value={brandingForm.fontStyle}
                      onChange={(e) => setBrandingForm({ ...brandingForm, fontStyle: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    >
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      <option value="Outfit">Outfit</option>
                      <option value="Inter">Inter</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Force System Dark Mode</label>
                    <div className="mt-2.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-650 dark:text-slate-450 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={brandingForm.darkModeDefault}
                          onChange={(e) => setBrandingForm({ ...brandingForm, darkModeDefault: e.target.checked })}
                          className="rounded text-premium-accent border-premium-border dark:border-slate-700 w-4 h-4 cursor-pointer"
                        />
                        Default dark theme mode on first visit
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-premium-heading dark:text-white tracking-tight uppercase border-b border-slate-100 dark:border-slate-855 pb-2">Stripe Payment Gateway</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Stripe Public API Key</label>
                  <input
                    type="text"
                    required
                    value={paymentForm.stripePublicKey}
                    onChange={(e) => setPaymentForm({ ...paymentForm, stripePublicKey: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Stripe Secret Key</label>
                    <input
                      type="password"
                      required
                      value={paymentForm.stripeSecretKey}
                      onChange={(e) => setPaymentForm({ ...paymentForm, stripeSecretKey: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Transaction Sandbox</label>
                    <div className="mt-2.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-650 dark:text-slate-450 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentForm.sandboxMode}
                          onChange={(e) => setPaymentForm({ ...paymentForm, sandboxMode: e.target.checked })}
                          className="rounded text-premium-accent border-premium-border dark:border-slate-700 w-4 h-4 cursor-pointer"
                        />
                        Sandbox Mode enabled (No real charges)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'smtp' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-premium-heading dark:text-white tracking-tight uppercase border-b border-slate-100 dark:border-slate-855 pb-2">SMTP Mail Configuration</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">SMTP Host Server</label>
                    <input
                      type="text"
                      required
                      value={smtpForm.smtpHost}
                      onChange={(e) => setSmtpForm({ ...smtpForm, smtpHost: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">SMTP Port Number</label>
                    <input
                      type="text"
                      required
                      value={smtpForm.smtpPort}
                      onChange={(e) => setSmtpForm({ ...smtpForm, smtpPort: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mailing Username</label>
                    <input
                      type="text"
                      required
                      value={smtpForm.smtpUser}
                      onChange={(e) => setSmtpForm({ ...smtpForm, smtpUser: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mailing Secure Encryption</label>
                    <select
                      value={smtpForm.encryption}
                      onChange={(e) => setSmtpForm({ ...smtpForm, encryption: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    >
                      <option value="TLS">TLS Secure Port (Recommended)</option>
                      <option value="SSL">SSL Port</option>
                      <option value="None">None (Insecure)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end">
              <Button variant="primary" size="sm" type="submit">
                <Save className="w-4 h-4 mr-2" /> Save Settings Config
              </Button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}

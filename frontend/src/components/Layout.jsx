import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareQuote,
  Layers,
  FlaskConical,
  Sliders,
  Split,
  Star,
  LineChart,
  FileText,
  Settings,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/chat', label: 'Chatbot', icon: MessageSquareQuote },
  { path: '/compare', label: 'Compare Personas', icon: Layers },
  { path: '/experiments', label: '20-Concept Experiment', icon: FlaskConical },
  { path: '/playground', label: 'Prompt Playground', icon: Sliders },
  { path: '/ablation', label: 'Ablation Study', icon: Split },
  { path: '/ratings', label: 'Student Ratings', icon: Star },
  { path: '/analytics', label: 'Analytics & Charts', icon: LineChart },
  { path: '/research', label: 'Research Summary', icon: FileText },
  { path: '/settings', label: 'Settings & Dataset', icon: Settings },
];

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800">
      
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-tight">Persona-Based Chatbot</h1>
            <p className="text-[10px] text-slate-500 font-medium">Prompt Engineering in Practice</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen lg:sticky lg:top-0`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center space-x-3.5 bg-slate-50/50">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                Persona Chatbot
              </h2>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/60 inline-block mt-0.5">
                Prompt Engineering Lab
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Research & Experimentation
            </div>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Academic Info Card in Sidebar */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 m-3 rounded-2xl border border-slate-200/80">
            <div className="flex items-center space-x-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Academic Project</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              BTech CSE / AI-ML Project demonstrating prompt engineering across 20 concepts, 5 personas, and an ablation study.
            </p>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Research Disclaimer Banner */}
        <div className="bg-gradient-to-r from-indigo-50/90 via-slate-50 to-indigo-50/50 border-b border-indigo-100/80 px-4 lg:px-8 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="font-medium text-slate-700">
              <strong className="text-indigo-900 font-bold">Student Research Project:</strong> Demonstrating prompt engineering in practice. Educational demonstration, not a scientifically validated clinical AI evaluation system.
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Demo Dataset Active
            </span>
          </div>
        </div>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

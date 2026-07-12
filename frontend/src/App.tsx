
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Directory } from './pages/Directory';
import { Registration } from './pages/Registration';
import { Details } from './pages/Details';
import { Package, Plus } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col gap-6 sticky top-0 h-screen">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">AssetFlow</h1>
          </div>
          <nav className="flex flex-col gap-2 flex-1">
            <Link to="/assets" className="px-4 py-2.5 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors">
              Asset Directory
            </Link>
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-800">
            <Link to="/assets/new" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors w-full">
              <Plus size={18} />
              Register Asset
            </Link>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Package size={24} className="text-blue-500" />
            <h1 className="text-lg font-bold">AssetFlow</h1>
          </div>
          <Link to="/assets/new" className="bg-blue-600 p-2 rounded-lg">
            <Plus size={20} />
          </Link>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Directory />} />
            <Route path="/assets" element={<Directory />} />
            <Route path="/assets/new" element={<Registration />} />
            <Route path="/assets/:id" element={<Details />} />
          </Routes>
        </main>
        
        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <Link to="/assets" className="text-slate-600 flex flex-col items-center">
            <Package size={24} />
            <span className="text-xs mt-1 font-medium">Assets</span>
          </Link>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

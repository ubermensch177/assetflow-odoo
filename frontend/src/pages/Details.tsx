import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, QrCode, RefreshCw, Send, ArrowRightLeft } from 'lucide-react';
import { AssetStatusBadge } from '../components/ui/AssetStatusBadge';
import { QRDisplay } from '../components/ui/QRDisplay';
import { AssetDetailsCard } from '../components/ui/AssetDetailsCard';
import { AssetTimeline } from '../components/ui/AssetTimeline';
import { AssetHistoryTable } from '../components/ui/AssetHistoryTable';
import { AllocationModal } from '../components/ui/AllocationModal';
import { ReturnModal } from '../components/ui/ReturnModal';
import { TransferModal } from '../components/ui/TransferModal';

export function Details() {
  const { id } = useParams();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [isQRDialogVisible, setQRDialogVisible] = useState(false);
  const [isAllocateDialogVisible, setAllocateDialogVisible] = useState(false);
  const [isReturnDialogVisible, setReturnDialogVisible] = useState(false);
  const [isTransferDialogVisible, setTransferDialogVisible] = useState(false);

  const fetchAsset = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/assets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAsset(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, [id]);

  const handleAction = async (endpoint: string, data: any) => {
    try {
      const res = await fetch(`http://localhost:5001/api/assets/${id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to ${endpoint} asset`);
      }
      // Re-fetch to update state
      await fetchAsset();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (!asset) return <div className="text-center p-12 text-slate-500">Asset not found</div>;

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/assets" className="p-2 mt-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{asset.name}</h2>
              <AssetStatusBadge status={asset.status} />
            </div>
            <p className="text-slate-500 font-mono mt-1">{asset.assetTag} &bull; SN: {asset.serialNumber}</p>
            {asset.currentHolderId && (
              <p className="text-sm font-medium text-slate-700 mt-2 bg-slate-100 inline-block px-3 py-1 rounded-full">
                Currently with: {asset.currentHolderId}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setQRDialogVisible(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
          >
            <QrCode size={18} />
            View QR
          </button>
          
          {asset.status === 'Available' ? (
            <button 
              onClick={() => setAllocateDialogVisible(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <Send size={18} />
              Allocate
            </button>
          ) : asset.status === 'Allocated' ? (
            <>
              <button 
                onClick={() => setTransferDialogVisible(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                <ArrowRightLeft size={18} />
                Transfer
              </button>
              <button 
                onClick={() => setReturnDialogVisible(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                <RefreshCw size={18} />
                Return
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6 -mb-px overflow-x-auto">
          {['details', 'timeline', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'details' && <AssetDetailsCard asset={asset} />}
        {activeTab === 'timeline' && <AssetTimeline asset={asset} />}
        {activeTab === 'history' && <AssetHistoryTable history={asset.history} />}
      </div>

      <QRDisplay 
        isOpen={isQRDialogVisible} 
        onClose={() => setQRDialogVisible(false)} 
        assetTag={asset.assetTag}
        assetName={asset.name}
      />

      <AllocationModal 
        isOpen={isAllocateDialogVisible} 
        onClose={() => setAllocateDialogVisible(false)} 
        onAllocate={(data) => {
          handleAction('allocate', data);
          setAllocateDialogVisible(false);
        }}
      />

      <ReturnModal 
        isOpen={isReturnDialogVisible} 
        onClose={() => setReturnDialogVisible(false)} 
        onReturn={(data) => {
          handleAction('return', data);
          setReturnDialogVisible(false);
        }}
      />
      
      <TransferModal 
        isOpen={isTransferDialogVisible} 
        onClose={() => setTransferDialogVisible(false)} 
        onTransfer={(data) => {
          handleAction('transfer', data);
          setTransferDialogVisible(false);
        }}
      />
    </div>
  );
}

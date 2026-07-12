
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';

interface QRDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  assetTag: string;
  assetName: string;
}

export function QRDisplay({ isOpen, onClose, assetTag, assetName }: QRDisplayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Asset QR Code</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <QRCodeSVG value={`assetflow://asset/${assetTag}`} size={200} />
          </div>
          <div className="text-center">
            <p className="font-medium text-slate-900">{assetName}</p>
            <p className="text-sm text-slate-500 font-mono mt-1">{assetTag}</p>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm w-full"
          >
            Print Label
          </button>
        </div>
      </div>
    </div>
  );
}

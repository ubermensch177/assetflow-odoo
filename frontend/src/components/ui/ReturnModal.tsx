import { useState } from 'react';
import { X } from 'lucide-react';

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturn: (data: any) => void;
}

export function ReturnModal({ isOpen, onClose, onReturn }: ReturnModalProps) {
  const [conditionOnIn, setConditionOnIn] = useState('Good');
  const [damageNotes, setDamageNotes] = useState('');
  const [remarks, setRemarks] = useState('');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Return Asset</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Return Date *</label>
            <input 
              value={returnDate} onChange={e => setReturnDate(e.target.value)}
              type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Condition on Return *</label>
            <select 
              value={conditionOnIn} onChange={e => setConditionOnIn(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Lost">Lost</option>
              <option value="Broken">Broken</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Damage Notes (if any)</label>
            <textarea 
              value={damageNotes} onChange={e => setDamageNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe any damage..." rows={2} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Remarks</label>
            <textarea 
              value={remarks} onChange={e => setRemarks(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="General remarks..." rows={2} />
          </div>
          <button 
            onClick={() => onReturn({ conditionOnIn, damageNotes, remarks, returnDate })}
            disabled={!returnDate}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors mt-2 disabled:opacity-50">
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
}

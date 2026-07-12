import { useState } from 'react';
import { X } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: any) => void;
}

export function TransferModal({ isOpen, onClose, onTransfer }: TransferModalProps) {
  const [assignedTo, setAssignedTo] = useState('');
  const [department, setDepartment] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [condition, setCondition] = useState('Good');
  const [purpose, setPurpose] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Transfer Asset</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">New Assignee (Employee) *</label>
            <input 
              value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
              type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Employee Name or ID" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">New Department *</label>
            <input 
              value={department} onChange={e => setDepartment(e.target.value)}
              type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Department" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Expected Return Date</label>
            <input 
              value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)}
              type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Transfer Purpose</label>
            <input 
              value={purpose} onChange={e => setPurpose(e.target.value)}
              type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Project Reassignment" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Current Condition</label>
            <select 
              value={condition} onChange={e => setCondition(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <button 
            onClick={() => onTransfer({ assignedTo, department, expectedReturn, purpose, condition })}
            disabled={!assignedTo || !department}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-2 disabled:opacity-50">
            Request Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

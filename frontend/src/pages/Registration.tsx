import { useState } from 'react';
import { AssetForm } from '../components/ui/AssetForm';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';


export function Registration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5001/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
          purchaseDate: new Date(data.purchaseDate)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register asset');
      }

      navigate('/assets');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/assets" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <PackagePlus className="text-blue-600" />
            Register New Asset
          </h2>
          <p className="text-slate-500 mt-1">Enter the details of the new asset below</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <AssetForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
}

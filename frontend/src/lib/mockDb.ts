export const DEFAULT_ASSETS = [
  { id: '1', assetTag: 'LPT-001', name: 'MacBook Pro M3', serialNumber: 'C02X20YZJGH7', category: 'Laptops', department: 'Engineering', location: 'San Francisco Office', status: 'Available', condition: 'New', purchaseDate: '2023-11-01', purchaseCost: 2499.00, expectedLifetime: 36, history: [{ date: '2023-11-01T10:00:00Z', action: 'Created', performedBy: 'SystemAdmin', details: 'Asset registered in system' }], allocations: [] },
  { id: '2', assetTag: 'LPT-002', name: 'Dell XPS 15', serialNumber: 'DX15XYZ789', category: 'Laptops', department: 'Sales', location: 'New York Office', status: 'Allocated', condition: 'Good', purchaseDate: '2023-05-15', purchaseCost: 1899.00, expectedLifetime: 36, history: [{ date: '2023-05-15T10:00:00Z', action: 'Created', performedBy: 'SystemAdmin', details: 'Asset registered in system' }], allocations: [] },
  { id: '3', assetTag: 'MNT-001', name: 'LG Ultrawide 34"', serialNumber: 'LG34XYZ789', category: 'Monitors', department: 'Design', location: 'San Francisco Office', status: 'Reserved', condition: 'New', purchaseDate: '2024-01-10', purchaseCost: 899.00, expectedLifetime: 60, history: [{ date: '2024-01-10T10:00:00Z', action: 'Created', performedBy: 'SystemAdmin', details: 'Asset registered in system' }], allocations: [] },
  { id: '4', assetTag: 'MBL-001', name: 'iPhone 15 Pro', serialNumber: 'IP15XYZ789', category: 'Mobile Devices', department: 'Management', location: 'London Office', status: 'Under Maintenance', condition: 'Fair', purchaseDate: '2023-09-20', purchaseCost: 999.00, expectedLifetime: 24, history: [{ date: '2023-09-20T10:00:00Z', action: 'Created', performedBy: 'SystemAdmin', details: 'Asset registered in system' }], allocations: [] },
];

export function getMockAssets() {
  const stored = localStorage.getItem('mockAssets');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('mockAssets', JSON.stringify(DEFAULT_ASSETS));
  return DEFAULT_ASSETS;
}

export function addMockAsset(asset: any) {
  const assets = getMockAssets();
  asset.id = Date.now().toString();
  asset.history = [{ date: new Date().toISOString(), action: 'Created', performedBy: 'SystemAdmin', details: 'Asset registered in system' }];
  asset.allocations = [];
  asset.status = asset.status || 'Available';
  assets.push(asset);
  localStorage.setItem('mockAssets', JSON.stringify(assets));
}

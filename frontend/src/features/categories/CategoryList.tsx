import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const mockCategories = [
  { id: '1', name: 'Laptops', description: 'MacBooks, Windows machines', status: 'ACTIVE' },
  { id: '2', name: 'Monitors', description: 'External displays', status: 'ACTIVE' },
  { id: '3', name: 'Peripherals', description: 'Keyboards, mice, docks', status: 'INACTIVE' },
];

export function CategoryList() {
  const [categories, setCategories] = useState(mockCategories);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [editingCat, setEditingCat] = useState<any>(null);

  const handleCreate = () => {
    if (!newCatName) return;
    const newCat = {
      id: Date.now().toString(),
      name: newCatName,
      description: newCatDesc,
      status: 'ACTIVE',
    };
    setCategories([...categories, newCat]);
    setCreateModalOpen(false);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleEditClick = (cat: any) => {
    setEditingCat(cat);
    setEditModalOpen(true);
  };

  const handleUpdate = () => {
    setCategories(categories.map(c => c.id === editingCat.id ? editingCat : c));
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage asset types and optional metadata structures.</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>Create Category</Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>
                  <Badge variant={cat.status === 'ACTIVE' ? 'success' : 'destructive'}>
                    {cat.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(cat)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Category"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <Input 
              placeholder="e.g. Laptops" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input 
              placeholder="Hardware devices" 
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Category"
      >
        {editingCat && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category Name</label>
              <Input 
                value={editingCat.name}
                onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input 
                value={editingCat.description}
                onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={editingCat.status}
                onChange={(e) => setEditingCat({ ...editingCat, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

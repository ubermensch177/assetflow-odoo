import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const mockDepartments = [
  { id: '1', name: 'Engineering', parentId: null, status: 'ACTIVE', head: 'John Doe', employees: 42 },
  { id: '2', name: 'Frontend', parentId: '1', status: 'ACTIVE', head: 'Alice', employees: 12 },
  { id: '3', name: 'Human Resources', parentId: null, status: 'ACTIVE', head: 'Jane Smith', employees: 5 },
];

export function DepartmentList() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [editingDept, setEditingDept] = useState<any>(null);

  const handleCreate = () => {
    if (!newDeptName) return;
    const newDept = {
      id: Date.now().toString(),
      name: newDeptName,
      parentId: null,
      status: 'ACTIVE',
      head: 'Unassigned',
      employees: 0,
    };
    setDepartments([...departments, newDept]);
    setCreateModalOpen(false);
    setNewDeptName('');
  };

  const handleEditClick = (dept: any) => {
    setEditingDept(dept);
    setEditModalOpen(true);
  };

  const handleUpdate = () => {
    setDepartments(departments.map(d => d.id === editingDept.id ? editingDept : d));
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage organizational hierarchy and teams.</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>Create Department</Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Head</TableHead>
              <TableHead>Parent Department</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => {
              const parent = departments.find(d => d.id === dept.parentId);
              return (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>{dept.head}</TableCell>
                  <TableCell>{parent ? parent.name : '-'}</TableCell>
                  <TableCell>{dept.employees}</TableCell>
                  <TableCell>
                    <Badge variant={dept.status === 'ACTIVE' ? 'success' : 'destructive'}>
                      {dept.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(dept)}>Edit</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Department"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department Name</label>
            <Input 
              placeholder="e.g. Marketing" 
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Department"
      >
        {editingDept && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department Name</label>
              <Input 
                value={editingDept.name}
                onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={editingDept.status}
                onChange={(e) => setEditingDept({ ...editingDept, status: e.target.value })}
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

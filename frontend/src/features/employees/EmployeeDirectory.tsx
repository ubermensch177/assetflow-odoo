import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const mockEmployees = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'ADMIN', status: 'ACTIVE', department: 'IT' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'EMPLOYEE', status: 'ACTIVE', department: 'HR' },
  { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', role: 'ASSET_MANAGER', status: 'INACTIVE', department: 'Operations' },
];

export function EmployeeDirectory() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handlePromoteClick = (user: any) => {
    setSelectedUser(user);
    setPromotionModalOpen(true);
  };

  const handlePromote = (role: string) => {
    setEmployees(employees.map(e => e.id === selectedUser.id ? { ...e, role } : e));
    setPromotionModalOpen(false);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setEmployees(employees.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const filteredEmployees = employees.filter(e => 
    e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage personnel, roles, and access statuses.</p>
        </div>
        <div className="w-full sm:w-72">
          <Input 
            placeholder="Search employees..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.firstName} {employee.lastName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Badge variant="outline">{employee.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'destructive'}>
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handlePromoteClick(employee)}>Promote</Button>
                  <Button 
                    variant={employee.status === 'ACTIVE' ? 'destructive' : 'secondary'} 
                    size="sm"
                    onClick={() => handleToggleStatus(employee.id, employee.status)}
                  >
                    {employee.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={promotionModalOpen}
        onClose={() => setPromotionModalOpen(false)}
        title={`Promote ${selectedUser?.firstName} ${selectedUser?.lastName}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Select a new role for this employee.</p>
          <div className="flex flex-col space-y-2">
            {['EMPLOYEE', 'DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN'].map((role) => (
              <Button 
                key={role} 
                variant={selectedUser?.role === role ? 'default' : 'outline'}
                onClick={() => handlePromote(role)}
              >
                {role}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';
import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { EmployeeDirectory } from './features/employees/EmployeeDirectory';
import { DepartmentList } from './features/departments/DepartmentList';
import { CategoryList } from './features/categories/CategoryList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* App Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeeDirectory />} />
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/categories" element={<CategoryList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

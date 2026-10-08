import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyForm = lazy(() => import('./pages/PropertyForm'));
const Enquiries = lazy(() => import('./pages/Enquiries'));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<div>Loading Admin...</div>}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/edit/:id" element={<PropertyForm />} />
          <Route path="enquiries" element={<Enquiries />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;

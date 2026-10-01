import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import TripResults from './pages/TripResults';
import Dashboard from './pages/Dashboard';
import SavedTrips from './pages/SavedTrips';
import SharedTripView from './pages/SharedTripView';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<PlanTrip />} />
          <Route path="/trip/:id" element={<TripResults />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/saved" element={<SavedTrips />} />
          <Route path="/share/trip/:id" element={<SharedTripView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, Home } from 'lucide-react';
import AOS from 'aos';
import AllEntries from './components/AllEntries';
import IncomeList from './components/IncomeList';
import ExpenseList from './components/ExpenseList';
import EntryForm from './components/EntryForm';
import { getAllEntries, addEntry as addEntryToDb } from './services/budgetService';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out'
    });

    // Fetch entries from Supabase on component mount
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await getAllEntries();
    
    if (error) {
      setError('Failed to load entries. Please check your Supabase connection.');
      console.error('Error:', error);
      // Use sample data as fallback
      setEntries([
        {
          id: 1,
          type: 'income',
          amount: 5000,
          description: 'Monthly Salary',
          category: 'Salary',
          date_created: '2025-11-28T10:00:00'
        },
        {
          id: 2,
          type: 'expense',
          amount: 1200,
          description: 'Rent Payment',
          category: 'Housing',
          date_created: '2025-11-27T14:30:00'
        }
      ]);
    } else {
      setEntries(data || []);
      setError(null);
    }
    
    setLoading(false);
  };

  const addEntry = async (newEntry) => {
    const { data, error } = await addEntryToDb(newEntry);
    
    if (error) {
      alert('Failed to add entry. Please try again.');
      console.error('Error adding entry:', error);
      return false;
    }
    
    // Refresh entries after adding
    await fetchEntries();
    return true;
  };

  const totalIncome = entries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

  const totalExpense = entries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <Router>
      <div className="app-container">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container-fluid">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <DollarSign className="me-2" size={28} />
              <span className="fw-bold">Budget Tracker</span>
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    <Home size={18} className="me-1" />
                    All Entries
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/income">
                    <TrendingUp size={18} className="me-1" />
                    Income
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/expenses">
                    <TrendingDown size={18} className="me-1" />
                    Expenses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add">
                    <PlusCircle size={18} className="me-1" />
                    Add Entry
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Error Alert */}
        {error && (
          <div className="container mt-3">
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>Note:</strong> {error}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="container mt-4">
          <div className="row g-3 mb-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="card summary-card balance-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Balance</h6>
                      <h3 className="mb-0 fw-bold">${balance.toFixed(2)}</h3>
                    </div>
                    <DollarSign size={40} className="text-primary opacity-75" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card summary-card income-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Total Income</h6>
                      <h3 className="mb-0 fw-bold text-success">${totalIncome.toFixed(2)}</h3>
                    </div>
                    <TrendingUp size={40} className="text-success opacity-75" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card summary-card expense-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Total Expenses</h6>
                      <h3 className="mb-0 fw-bold text-danger">${totalExpense.toFixed(2)}</h3>
                    </div>
                    <TrendingDown size={40} className="text-danger opacity-75" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-white">Loading your budget data...</p>
            </div>
          ) : (
            /* Routes */
            <Routes>
              <Route path="/" element={<AllEntries entries={entries} onRefresh={fetchEntries} />} />
              <Route path="/income" element={<IncomeList entries={entries} onRefresh={fetchEntries} />} />
              <Route path="/expenses" element={<ExpenseList entries={entries} onRefresh={fetchEntries} />} />
              <Route path="/add" element={<EntryForm onAddEntry={addEntry} />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;

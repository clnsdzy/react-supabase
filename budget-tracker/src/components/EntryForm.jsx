import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { updateEntry } from '../services/budgetService';

function EntryForm({ onAddEntry }) {
  const navigate = useNavigate();
  const location = useLocation();
  const editEntry = location.state?.editEntry;
  
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Pre-fill form if editing
  useEffect(() => {
    if (editEntry) {
      setFormData({
        type: editEntry.type,
        amount: editEntry.amount.toString(),
        description: editEntry.description,
        category: editEntry.category
      });
      setIsEditMode(true);
    }
  }, [editEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    let success = false;

    if (isEditMode) {
      // Update existing entry
      const { error } = await updateEntry(editEntry.id, {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category
      });

      if (error) {
        alert('Failed to update entry. Please try again.');
        console.error('Update error:', error);
      } else {
        success = true;
      }
    } else {
      // Add new entry
      success = await onAddEntry({
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category
      });
    }

    setLoading(false);

    if (success) {
      // Reset form
      setFormData({
        type: 'income',
        amount: '',
        description: '',
        category: ''
      });

      // Navigate to home
      navigate('/');
    }
  };

  return (
    <div className="entry-form-container" data-aos="fade-up">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{isEditMode ? 'Edit Entry' : 'Add New Entry'}</h4>
          <p className="mb-0 small opacity-75">
            {isEditMode ? 'Update your income or expense transaction' : 'Record a new income or expense transaction'}
          </p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Transaction Type</label>
              <div className="btn-group w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="type"
                  id="income"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                />
                <label className="btn btn-outline-success" htmlFor="income">
                  Income
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="type"
                  id="expense"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                />
                <label className="btn btn-outline-danger" htmlFor="expense">
                  Expense
                </label>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label fw-bold">
                Amount
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-bold">
                Description
              </label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="form-label fw-bold">
                Category
              </label>
              <select
                className="form-select"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {formData.type === 'income' ? (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Business">Business</option>
                    <option value="Investment">Investment</option>
                    <option value="Gift">Gift</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Housing">Housing</option>
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditMode ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save size={18} className="me-2" />
                    {isEditMode ? 'Update Entry' : 'Save Entry'}
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                <X size={18} className="me-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EntryForm;

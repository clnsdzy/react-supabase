import { Calendar, Tag, TrendingDown, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEntry } from '../services/budgetService';

function ExpenseList({ entries, onRefresh }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(null);
  // Filter only expense entries and sort by date_created (newest first)
  const expenseEntries = entries
    .filter(entry => entry.type === 'expense')
    .sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

  const totalExpense = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id, description) => {
    if (!window.confirm(`Are you sure you want to delete "${description}"?`)) {
      return;
    }

    setDeleting(id);
    const { error } = await deleteEntry(id);

    if (error) {
      alert('Failed to delete entry. Please try again.');
      console.error('Delete error:', error);
    } else {
      await onRefresh();
    }

    setDeleting(null);
  };

  const handleEdit = (entry) => {
    navigate('/add', { state: { editEntry: entry } });
  };

  return (
    <div className="entries-container" data-aos="fade-up">
      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">Expenses</h4>
              <p className="mb-0 small opacity-75">All expense transactions</p>
            </div>
            <TrendingDown size={32} />
          </div>
        </div>
        <div className="card-body">
          <div className="alert alert-danger mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Total Expenses:</span>
              <span className="h4 mb-0">${totalExpense.toFixed(2)}</span>
            </div>
          </div>
          
          {expenseEntries.length === 0 ? (
            <div className="text-center py-5">
              <TrendingDown size={48} className="text-muted mb-3" />
              <p className="text-muted">No expense entries yet.</p>
            </div>
          ) : (
            <div className="list-group">
              {expenseEntries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="list-group-item"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-2">{entry.description}</h6>
                      <div className="d-flex align-items-center text-muted small">
                        <Tag size={14} className="me-1" />
                        <span className="me-3">{entry.category}</span>
                        <Calendar size={14} className="me-1" />
                        <span>{formatDate(entry.date_created)}</span>
                      </div>
                    </div>
                    <div className="text-end d-flex align-items-center gap-3">
                      <h5 className="mb-0 fw-bold text-danger">
                        -${parseFloat(entry.amount).toFixed(2)}
                      </h5>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(entry)}
                          title="Edit entry"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(entry.id, entry.description)}
                          disabled={deleting === entry.id}
                          title="Delete entry"
                        >
                          {deleting === entry.id ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseList;

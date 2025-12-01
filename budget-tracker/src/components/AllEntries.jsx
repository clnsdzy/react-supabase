import { Calendar, DollarSign, Tag, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEntry } from '../services/budgetService';

function AllEntries({ entries, onRefresh }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(null);
  // Sort entries by date_created (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date_created) - new Date(a.date_created)
  );

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
      alert(`Failed to delete entry: ${error.message || 'Unknown error'}`);
      console.error('Delete error:', error);
    } else {
      // Refresh the entries list
      await onRefresh();
    }

    setDeleting(null);
  };

  const handleEdit = (entry) => {
    // Navigate to add page with entry data for editing
    navigate('/add', { state: { editEntry: entry } });
  };

  return (
    <div className="entries-container" data-aos="fade-up">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h4 className="mb-0">All Entries</h4>
          <p className="text-muted mb-0 small">Showing all income and expenses</p>
        </div>
        <div className="card-body p-0">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-5">
              <DollarSign size={48} className="text-muted mb-3" />
              <p className="text-muted">No entries yet. Start by adding your first transaction!</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {sortedEntries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="list-group-item list-group-item-action"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <span className={`badge ${entry.type === 'income' ? 'bg-success' : 'bg-danger'} me-2`}>
                          {entry.type.toUpperCase()}
                        </span>
                        <h6 className="mb-0">{entry.description}</h6>
                      </div>
                      <div className="d-flex align-items-center text-muted small">
                        <Tag size={14} className="me-1" />
                        <span className="me-3">{entry.category}</span>
                        <Calendar size={14} className="me-1" />
                        <span>{formatDate(entry.date_created)}</span>
                      </div>
                    </div>
                    <div className="text-end d-flex align-items-center gap-3">
                      <h5 className={`mb-0 fw-bold ${entry.type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {entry.type === 'income' ? '+' : '-'}${parseFloat(entry.amount).toFixed(2)}
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

export default AllEntries;

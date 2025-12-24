import { useState } from 'react';
import { portfolioAPI } from '../../services/portfolioAPI';

/**
 * Portfolio Actions Component
 * Provides actions like duplicate, export, import, delete
 */
const PortfolioActions = ({ portfolio, onPortfolioChange, onNavigate }) => {
  const [exporting, setExporting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const portfolioData = {
        ...portfolio,
        exportedAt: new Date().toISOString(),
      };
      
      const dataStr = JSON.stringify(portfolioData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-${portfolio.slug || 'export'}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Portfolio exported successfully!');
    } catch (error) {
      console.error('Error exporting portfolio:', error);
      alert('Failed to export portfolio');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importedData = JSON.parse(text);
        
        // Remove export-specific fields
        delete importedData.exportedAt;
        delete importedData._id;
        delete importedData.createdAt;
        delete importedData.updatedAt;
        
        if (confirm('Import this portfolio? This will replace your current portfolio data.')) {
          onPortfolioChange(importedData);
          alert('Portfolio imported successfully! Don\'t forget to save.');
        }
      } catch (error) {
        console.error('Error importing portfolio:', error);
        alert('Failed to import portfolio. Please check the file format.');
      }
    };
    input.click();
  };

  const handleDuplicate = async () => {
    if (!portfolio._id) {
      alert('Please save your portfolio first before duplicating.');
      return;
    }

    if (!confirm('Create a duplicate of this portfolio?')) {
      return;
    }

    try {
      setDuplicating(true);
      const duplicateData = {
        ...portfolio,
        slug: `${portfolio.slug}-copy-${Date.now()}`,
        title: `${portfolio.hero?.title || 'Portfolio'} (Copy)`,
      };
      
      delete duplicateData._id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;
      
      const response = await portfolioAPI.createPortfolio(duplicateData);
      const newPortfolio = response.data?.data || response.data;
      
      alert('Portfolio duplicated successfully!');
      if (newPortfolio._id) {
        onNavigate(`/portfolio-constructor`);
        window.location.reload(); // Reload to show the new portfolio
      }
    } catch (error) {
      console.error('Error duplicating portfolio:', error);
      alert('Failed to duplicate portfolio');
    } finally {
      setDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (!portfolio._id) {
      alert('No portfolio to delete.');
      return;
    }

    if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete your portfolio. Are you absolutely sure?')) {
      return;
    }

    try {
      setDeleting(true);
      await portfolioAPI.deletePortfolio(portfolio._id);
      alert('Portfolio deleted successfully!');
      onNavigate('/dashboard');
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Failed to delete portfolio');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="portfolio-actions">
      <h3>Portfolio Actions</h3>
      <p className="section-description">
        Manage your portfolio with these actions.
      </p>

      <div className="actions-grid">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="action-button"
          style={{
            padding: '1rem',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%',
          }}
        >
          {exporting ? 'Exporting...' : '📥 Export Portfolio'}
        </button>

        <button
          onClick={handleImport}
          className="action-button"
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%',
          }}
        >
          📤 Import Portfolio
        </button>

        <button
          onClick={handleDuplicate}
          disabled={duplicating || !portfolio._id}
          className="action-button"
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            cursor: portfolio._id ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            width: '100%',
            opacity: portfolio._id ? 1 : 0.6,
          }}
        >
          {duplicating ? 'Duplicating...' : '📋 Duplicate Portfolio'}
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting || !portfolio._id}
          className="action-button"
          style={{
            padding: '1rem',
            backgroundColor: 'var(--error)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: portfolio._id ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            width: '100%',
            opacity: portfolio._id ? 1 : 0.6,
          }}
        >
          {deleting ? 'Deleting...' : '🗑️ Delete Portfolio'}
        </button>
      </div>
    </div>
  );
};

export default PortfolioActions;


import React from 'react';
import { 
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ArrowUpDown, FileX 
} from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found.",
  searchable = true,
  searchPlaceholder = "Search...",
  pagination = true,
  pageSize = 10,
  actions
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  // Search Filter
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter(row => {
      return columns.some(col => {
        const val = row[col.accessor];
        return val && String(val).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const currentData = React.useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const handleSort = (key) => {
    if (!key) return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="datatable-wrapper card" style={{ padding: 0, overflow: 'hidden' }}>
      {searchable && (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Showing {filteredData.length} records
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  onClick={() => col.sortable && handleSort(col.accessor)}
                  style={{ 
                    padding: '0.75rem 1rem', 
                    fontWeight: 600, 
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    {col.header}
                    {col.sortable && <ArrowUpDown size={13} style={{ opacity: sortConfig.key === col.accessor ? 1 : 0.4 }} />}
                  </div>
                </th>
              ))}
              {actions && <th style={{ padding: '0.75rem 1rem', textAlignment: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td colSpan={columns.length + (actions ? 1 : 0)} style={{ padding: '1rem' }}>
                    <div style={{ height: '20px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                  </td>
                </tr>
              ))
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} style={{ padding: '3rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <FileX size={32} />
                    <p style={{ fontWeight: 500 }}>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIdx) => (
                <tr key={rowIdx} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color var(--transition-fast)' }} className="table-row-hover">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{ padding: '0.875rem 1rem' }}>
                      {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft size={16} /></button>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={16} /></button>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight size={16} /></button>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

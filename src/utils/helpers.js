export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

export const getTypeColor = (type) => {
  const normalized = (type || '').toUpperCase();
  if (normalized === 'LOST') return 'badge-lost';
  if (normalized === 'FOUND') return 'badge-found';
  return 'badge-closed';
};

export const getStatusColor = (status) => {
  const normalized = (status || '').toUpperCase();
  if (normalized === 'ACTIVE') return 'badge-active';
  if (normalized === 'RESOLVED') return 'badge-resolved';
  return 'badge-closed';
};

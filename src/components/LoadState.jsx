// Muestra "cargando" o el error de una llamada a la API; si todo está bien, no renderiza nada (children opcional).
export default function LoadState({ loading, error, onRetry, children }) {
  if (loading) return <p style={{ color: 'var(--text-sub)' }}>Cargando...</p>;
  if (error) {
    return (
      <div className="card text-center">
        <p style={{ color: '#ff3333' }}>{error.userMessage || error.message}</p>
        {onRetry && <button className="btn-blue mt-2" onClick={onRetry}>Reintentar</button>}
      </div>
    );
  }
  return children ?? null;
}

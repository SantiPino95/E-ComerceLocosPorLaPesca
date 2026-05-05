function Tabs({ tabs, activo, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #0077b6' }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontWeight: activo === tab ? 'bold' : 'normal',
            background: activo === tab ? '#0077b6' : '#eee',
            color: activo === tab ? 'white' : '#333',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default Tabs
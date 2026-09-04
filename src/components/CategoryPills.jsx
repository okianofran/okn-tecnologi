import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Laptop, 
  Gamepad2, 
  Headphones, 
  Watch, 
  Cpu, 
  Camera 
} from 'lucide-react';

export default function CategoryPills({ categories, selectedCategory, onSelectCategory }) {
  const getCategoryIcon = (iconName, isSelected) => {
    const size = 18;
    const color = isSelected ? '#00f2ff' : '#94a3b8';
    switch (iconName) {
      case 'Sparkles': return <Sparkles size={size} color={color} />;
      case 'Smartphone': return <Smartphone size={size} color={color} />;
      case 'Laptop': return <Laptop size={size} color={color} />;
      case 'Gamepad2': return <Gamepad2 size={size} color={color} />;
      case 'Headphones': return <Headphones size={size} color={color} />;
      case 'Watch': return <Watch size={size} color={color} />;
      case 'Cpu': return <Cpu size={size} color={color} />;
      case 'Camera': return <Camera size={size} color={color} />;
      default: return <Sparkles size={size} color={color} />;
    }
  };

  return (
    <section style={{ padding: '15px 0 25px 0' }}>
      <div className="container-store">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(56, 66, 255, 0.4), rgba(0, 242, 255, 0.25))' 
                    : 'rgba(15, 23, 56, 0.65)',
                  border: isSelected 
                    ? '1.5px solid #00f2ff' 
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  fontFamily: 'var(--font-display)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 0 20px rgba(0, 242, 255, 0.35)' : 'none',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(0, 242, 255, 0.4)';
                    e.currentTarget.style.background = 'rgba(25, 36, 85, 0.7)';
                    e.currentTarget.style.color = '#00f2ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = 'rgba(15, 23, 56, 0.65)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }
                }}
              >
                {getCategoryIcon(cat.icon, isSelected)}
                <span>{cat.name}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: isSelected ? '#00f2ff' : '#64748b',
                  background: isSelected ? 'rgba(0, 242, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 6px',
                  borderRadius: '6px'
                }}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

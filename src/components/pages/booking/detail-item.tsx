// --- Componente auxiliar DetailItem (mantido) ---

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, className = "" }) => (
  <div className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors ${className}`}>
    <div className="text-primary mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground break-words">{value}</p>
    </div>
  </div>
);

export { DetailItem };

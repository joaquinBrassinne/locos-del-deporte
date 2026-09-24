import { Admin } from '../../components/Admin';
import { Aceptados } from '../../components/Aceptados';
import '../../components/AdminPanel.css'; 

export default function AdminPage() {
  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem 0' }}>
      <h1 style={{ textAlign: 'center', color: '#1f2937', marginBottom: '2rem' }}>
        Panel de Control
      </h1>
      
      <div className="admin-dashboard">
        <Admin />
        <Aceptados />
      </div>
    </div>
  );
}
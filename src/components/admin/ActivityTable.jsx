import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { getReservas } from '../../api/reservas';

const ActivityTable = () => {
  const { refreshTrigger } = useDashboard();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, [refreshTrigger]);

  const fetchActivities = async () => {
    try {
      const { data } = await getReservas();
      
      // Filtrar solo las reservas aprobadas o anuladas recientemente
      const recentActions = data
        .filter(r => r.estado === 'APROBADA' || r.estado === 'ANULADA')
        .sort((a, b) => {
          const dateA = new Date(a.fecha_confirmacion || a.fecha_evento);
          const dateB = new Date(b.fecha_confirmacion || b.fecha_evento);
          return dateB - dateA;
        })
        .slice(0, 10); // Últimas 10 acciones

      const formattedActivities = recentActions.map(r => {
        const actionDate = new Date(r.fecha_confirmacion || r.fecha_evento);
        const now = new Date();
        const diffHours = Math.floor((now - actionDate) / (1000 * 60 * 60));
        
        let timeStr;
        if (diffHours < 1) {
          timeStr = 'Hace unos minutos';
        } else if (diffHours < 24) {
          timeStr = `Hace ${diffHours}h`;
        } else if (diffHours < 48) {
          timeStr = 'Ayer';
        } else {
          timeStr = actionDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        }

        return {
          id: r.id,
          time: timeStr,
          user: 'admin',
          action: r.estado === 'APROBADA' ? 'APROBADA' : 'ANULADA',
          message: `${r.estado === 'APROBADA' ? 'Aprobó' : 'Anuló'} reserva ${r.codigo_reserva} - ${r.cliente_nombre || 'Cliente'}`,
          color: r.estado === 'APROBADA' ? 'green' : 'red'
        };
      });

      setActivities(formattedActivities);
    } catch (err) {
      console.error('Error al cargar actividades:', err);
    }
  };

  const badges = {
    blue: "bg-blue-100 text-blue-600",
    red: "bg-rose-100 text-rose-600",
    green: "bg-emerald-100 text-emerald-600",
    gray: "bg-gray-100 text-gray-600"
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h4 className="text-xl font-bold text-gray-800">Actividad Reciente</h4>
        <button className="text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors">Ver todo</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha/Hora</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acción</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Mensaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activities.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                  No hay actividad reciente
                </td>
              </tr>
            ) : (
              activities.map((item) => (
                <tr key={item.id} className="hover:bg-pink-50/30 transition-colors cursor-default">
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{item.time}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-800">{item.user}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${badges[item.color]}`}>
                      {item.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;

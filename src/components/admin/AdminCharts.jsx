import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { useDashboard } from '../../contexts/DashboardContext';

const AdminCharts = ({ reservations = [] }) => {
  const { refreshTrigger } = useDashboard();
  const [revenueData, setRevenueData] = useState([]);
  const [demandData, setDemandData] = useState([]);

  useEffect(() => {
    if (reservations.length > 0) {
      calculateChartData();
    }
  }, [reservations, refreshTrigger]);

  const calculateChartData = () => {
    // Calcular Tendencia de Ingresos (últimos 7 días)
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Sumar ingresos de reservas aprobadas en ese día
      const dayIncome = reservations
        .filter(r => {
          if (r.estado === 'APROBADA' && r.fecha_confirmacion) {
            const confirmDate = new Date(r.fecha_confirmacion).toISOString().split('T')[0];
            return confirmDate === dateStr;
          }
          return false;
        })
        .reduce((sum, r) => sum + parseFloat(r.total || 0), 0);
      
      // Nombres de días en español
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const dayName = dayNames[date.getDay()];
      
      last7Days.push({
        name: dayName,
        value: Math.round(dayIncome)
      });
    }
    
    setRevenueData(last7Days);

    // Calcular Demanda por Día de la Semana
    const weekdayCounts = {
      'Lun': 0, 'Mar': 0, 'Mié': 0, 'Jue': 0, 'Vie': 0, 'Sáb': 0, 'Dom': 0
    };
    
    reservations.forEach(r => {
      if (r.fecha_evento) {
        const eventDate = new Date(r.fecha_evento);
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const dayName = dayNames[eventDate.getDay()];
        if (weekdayCounts.hasOwnProperty(dayName)) {
          weekdayCounts[dayName]++;
        }
      }
    });
    
    const demandArray = Object.entries(weekdayCounts).map(([name, value]) => ({
      name,
      value
    }));
    
    setDemandData(demandArray);
  };

  // Datos para servicios estrella (mantener estático por ahora)
  const pieData = [
    { name: 'Combo Boda Premium', value: 400 },
    { name: 'Cumpleaños Kids', value: 300 },
    { name: 'Graduación PRO', value: 200 },
    { name: 'Bautizo Standard', value: 100 },
  ];

  const COLORS = ['#ec4899', '#f97316', '#a78bfa', '#2dd4bf'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Tendencia de Ingresos */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20">
        <h4 className="text-xl font-bold text-gray-800 mb-6">Tendencia de Ingresos (7 días)</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => `$${value}`}
              />
              <Area type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Servicios Estrella */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20">
        <h4 className="text-xl font-bold text-gray-800 mb-6">Servicios Estrella</h4>
        <div className="h-[300px] w-full flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 flex flex-col space-y-3 px-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm text-gray-600 truncate max-w-[120px]">{entry.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demanda por Día */}
      <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20">
        <h4 className="text-xl font-bold text-gray-800 mb-6">Demanda por Día de la Semana</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#fce7f3'}} 
                contentStyle={{ borderRadius: '1rem', border: 'none' }}
                formatter={(value) => [`${value} reservas`, 'Cantidad']}
              />
              <Bar dataKey="value" fill="#fb923c" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;

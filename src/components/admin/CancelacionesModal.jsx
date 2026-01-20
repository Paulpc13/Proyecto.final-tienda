import React, { useState, useEffect } from 'react';
import { X, XCircle, Calendar, User, DollarSign } from 'lucide-react';
import { getReservas } from '../../api/reservas';

const CancelacionesModal = ({ isOpen, onClose }) => {
  const [canceledReservations, setCanceledReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCanceled();
    }
  }, [isOpen]);

  const fetchCanceled = async () => {
    try {
      setLoading(true);
      const { data } = await getReservas();
      const canceled = data.filter(r => r.estado === 'ANULADA' || r.estado === 'CANCELADA');
      setCanceledReservations(canceled);
    } catch (err) {
      console.error('Error al cargar cancelaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-8 flex justify-between items-center border-b border-gray-100 bg-rose-50">
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-red-500 bg-clip-text text-transparent">
              Cancelaciones (30d)
            </h2>
            <p className="text-gray-400 text-sm font-medium">Reservas anuladas o canceladas</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-rose-100 rounded-2xl transition-all duration-300 text-gray-400 hover:text-rose-500 hover:rotate-90 group"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="font-bold text-gray-400">Cargando cancelaciones...</p>
            </div>
          ) : canceledReservations.length === 0 ? (
            <div className="py-20 text-center bg-emerald-50 rounded-3xl border border-emerald-100">
              <XCircle className="mx-auto text-emerald-500 mb-2" size={48} />
              <h3 className="text-emerald-700 font-black text-xl">¡Excelente!</h3>
              <p className="text-emerald-600/70">No hay cancelaciones recientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {canceledReservations.map((reserva) => (
                <div 
                  key={reserva.id} 
                  className="bg-rose-50 rounded-2xl border border-rose-100 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-rose-600">#{reserva.codigo_reserva}</h3>
                      <p className="text-sm text-gray-500">{reserva.nombre_evento || 'Evento'}</p>
                    </div>
                    <span className="px-4 py-1 bg-rose-500 text-white text-xs font-black rounded-full">
                      {reserva.estado}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-rose-400" />
                      <span className="text-gray-600">{reserva.cliente_nombre || 'Cliente'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-rose-400" />
                      <span className="text-gray-600">{reserva.fecha_evento}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-rose-400" />
                      <span className="text-gray-600 font-bold">${parseFloat(reserva.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelacionesModal;

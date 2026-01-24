import React, { useEffect, useState } from 'react'
import NavBar1 from '../components/NavBar1';
import axios from 'axios'
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { format } from 'date-fns';
import { FiClipboard, FiCheckCircle, FiClock, FiActivity, FiUser, FiTruck, FiTrendingUp, FiMapPin, FiChevronRight } from 'react-icons/fi';

const Dean = () => {
  const [reports, setReports] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [vehicleFuel, setVehicleFuel] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [totalLiters, setTotalLiters] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('completed');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [repRes, fuelRes, driverRes] = await Promise.all([
          axios.get('http://localhost:4000/api/report'),
          axios.get('http://localhost:4000/api/fuel'),
          axios.get('http://localhost:4000/api/user/drivers')
        ]);
        setReports(repRes.data);
        setFuels(fuelRes.data.fuels);
        setDrivers(driverRes.data);
      } catch (error) {
        console.error('Data fetching error:', error);
      }
    };
    fetchAllData();
  }, []);

  const fetchReportsByVehicleNo = async (vehicleNo, index) => {
    try {
      setSelectedIndex(index);
      const response = await axios.get(`http://localhost:4000/api/report/${vehicleNo}`);
      const { data } = response;
      setVehicleFuel(data);
      let totalLiters = 0, totalKm = 0;
      data.forEach((item) => {
        totalLiters += item.litre;
        totalKm += item.km;
      });
      setTotalLiters(totalLiters);
      setTotalKm(totalKm);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavBar1 />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Institutional Review Board</h1>
          <p className="text-secondary-500 font-medium">Audit fleet operations, fuel consumption, and mission reports.</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Completed Missions', value: reports.length, icon: <FiCheckCircle />, color: 'emerald' },
            { label: 'Pending Reviews', value: fuels.length, icon: <FiClock />, color: 'primary' },
            { label: 'Total Distance', value: `${reports.reduce((acc, curr) => acc + curr.km, 0)} km`, icon: <FiTrendingUp />, color: 'purple' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-2xl text-secondary-900">
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
                <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 p-1.5 bg-slate-200/50 w-fit rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-white text-primary-600 shadow-sm' : 'text-secondary-500 hover:text-secondary-900'}`}
          >
            Mission Archive
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'review' ? 'bg-white text-primary-600 shadow-sm' : 'text-secondary-500 hover:text-secondary-900'}`}
          >
            Pending Audits
          </button>
        </div>

        {activeTab === 'completed' ? (
          <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {reports.length > 0 ? reports.map((report) => (
              <div key={report._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-enterprise transition-all flex flex-col lg:flex-row items-center gap-8 group">
                <div className="w-full lg:w-1/4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary-600 font-bold">
                      {report.firstName[0]}{report.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-secondary-900">{report.firstName} {report.lastName}</p>
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded-full w-fit">{report.vehicleNo}</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-2/4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-1">Kilometers</p>
                    <p className="font-bold text-secondary-900">{report.km} km</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-1">Liters Used</p>
                    <p className="font-bold text-secondary-900">{report.litre} L</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-1">Route</p>
                    <p className="font-bold text-secondary-900 truncate">{report.splace} <FiChevronRight className="inline" /> {report.dplace}</p>
                  </div>
                </div>

                <div className="w-full lg:w-1/4 text-right">
                  <p className="text-xs font-bold text-secondary-400">{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</p>
                  <p className="text-[10px] text-secondary-400 font-medium">{format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <FiClipboard className="mx-auto text-4xl text-slate-200 mb-4" />
                <p className="text-secondary-400 font-medium">No completed reports archived yet.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {fuels.length > 0 ? fuels.map((fuel) => (
              <div key={fuel._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border-l-4 border-l-primary-500 border-slate-100 hover:shadow-enterprise transition-all flex flex-col lg:flex-row items-center gap-8 group">
                <div className="w-full lg:w-1/4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600"><FiTruck /></div>
                  <div>
                    <p className="font-bold text-secondary-900">{fuel.dName} {fuel.dlastName}</p>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">{fuel.vehicleNo}</p>
                  </div>
                </div>
                <div className="w-full lg:w-2/4">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-1">Mission Path</span>
                      <span className="text-sm font-bold text-secondary-900">{fuel.splace} → {fuel.dplace}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/4 flex justify-end items-center gap-4">
                  <span className="px-4 py-1.5 bg-primary-50 text-primary-600 text-[10px] font-bold uppercase tracking-widest rounded-full">In Review</span>
                  <FiClock className="text-primary-500 animate-pulse" />
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <FiActivity className="mx-auto text-4xl text-slate-200 mb-4" />
                <p className="text-secondary-400 font-medium">No missions currently pending review.</p>
              </div>
            )}
          </div>
        )}

        {/* Driver Directory Section */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold text-secondary-900 mb-8">Personnel Efficiency Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver, index) => (
              <div key={driver._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-enterprise transition-all group overflow-hidden">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-slate-50 group-hover:scale-105 transition-transform">
                    <img className="w-full h-full object-cover" src={`http://localhost:4000/uploads/pimages/${driver.pimages}`} alt={driver.firstName} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900">{driver.firstName} {driver.lastName}</h3>
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">{driver.drivertype}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 mb-6">
                  {selectedIndex === index ? (
                    <div className="grid grid-cols-2 gap-4 animate-slide-up">
                      <div>
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-1">Total Fuel</p>
                        <p className="text-lg font-bold text-secondary-900">{totalLiters} L</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-1">Total Distance</p>
                        <p className="text-lg font-bold text-secondary-900">{totalKm} km</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2 text-secondary-400">
                      <p className="text-xs font-bold uppercase tracking-widest">Awaiting selection</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => fetchReportsByVehicleNo(driver.vehicleNo, index)}
                  className="w-full py-4 bg-white border-2 border-slate-100 text-secondary-600 font-bold rounded-2xl hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-2 group"
                >
                  Analyze Records <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dean;
import React, { useEffect, useState } from 'react';
import NavBar1 from '../components/NavBar1';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import axios from 'axios';
import L from 'leaflet'
import { FiMapPin, FiTruck, FiNavigation, FiClock, FiCheckCircle, FiUsers, FiSearch, FiArrowRight } from 'react-icons/fi';

const VehicleDeployer = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [email, setemail] = useState('');
  const [vehicleNo, setvehicleNo] = useState('');
  const [firstName, setfisrtName] = useState('');
  const [lastName, setlastName] = useState('');
  const [slat, setslat] = useState('7.0639');
  const [slong, setslong] = useState('38.4764');
  const [dlat, setdlat] = useState('7.0639');
  const [dlong, setdlong] = useState('38.4764');
  const [error, setError] = useState(null);
  const [deployers, setDeployers] = useState([]);
  const [splace, setsplace] = useState('')
  const [dplace, setdplace] = useState('')
  const [km, setkm] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const selectDriver = (a, b, c, d) => {
    setemail(a); setfisrtName(b); setlastName(c); setvehicleNo(d);
  };

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setslat(lat); setslong(lng);
  };

  const MapClickHandler = () => {
    useMapEvents({ click: handleMapClick });
    return null;
  };

  const handleMapClickDest = (event) => {
    const { lat, lng } = event.latlng;
    setdlat(lat); setdlong(lng);
  };

  const MapClickHandlerDest = () => {
    useMapEvents({ click: handleMapClickDest });
    return null;
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const deploy = { slat, slong, dlat, dlong, email, firstName, lastName, splace, dplace, km };
    
    if (deployers.some((d) => d.email === email)) {
      setError('The driver is already on duty.');
      setIsLoading(false);
      return;
    }
    if (!vehicleNo) {
      setError('Driver must have an assigned vehicle.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/deployer', deploy);
      setSuccessMessage('Mission allocated successfully');
      setemail(''); setslat('7.0639'); setslong('38.4764'); setdlat('7.0639'); setdlong('38.4764');
      setError(null);
      setIsLoading(false);
      fetchAllDeployers();
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
      setIsLoading(false);
    }
  };

  const MarkerIcon = new L.icon({
    iconUrl: require("../assets/img/marker.png"),
    iconSize: [30, 35],
  });

  const fetchAllDeployers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/deployer/deploy');
      setDeployers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Prevent unauthorized access and back navigation
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'vehicle deployer') {
      navigate('/', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchAllDeployers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavBar1 />
      
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Mission Control</h1>
          <p className="text-secondary-500 font-medium">Coordinate and deploy fleet resources for institutional missions.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          
          {/* Left: Deployment Form */}
          <div className="xl:col-span-2 space-y-12">
            
            {/* Map Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-glass border border-slate-100 flex flex-col h-[450px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center"><FiMapPin /></div>
                  <h3 className="font-bold text-secondary-900 uppercase tracking-widest text-xs">Origin Point</h3>
                </div>
                <div className="flex-grow rounded-3xl overflow-hidden border border-slate-100 relative mb-4">
                  <MapContainer center={[slat, slong]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    <Marker position={[slat, slong]} icon={MarkerIcon} />
                    <MapClickHandler />
                  </MapContainer>
                </div>
                <input 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  placeholder="Street / Area Name"
                  onChange={(e) => setsplace(e.target.value)} 
                  value={splace}
                />
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] shadow-glass border border-slate-100 flex flex-col h-[450px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center"><FiNavigation /></div>
                  <h3 className="font-bold text-secondary-900 uppercase tracking-widest text-xs">Destination Point</h3>
                </div>
                <div className="flex-grow rounded-3xl overflow-hidden border border-slate-100 relative mb-4">
                  <MapContainer center={[dlat, dlong]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    <Marker position={[dlat, dlong]} icon={MarkerIcon} />
                    <MapClickHandlerDest />
                  </MapContainer>
                </div>
                <input 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  placeholder="Street / Area Name"
                  onChange={(e) => setdplace(e.target.value)} 
                  value={dplace}
                />
              </div>
            </div>

            {/* Drivers Selection */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-glass border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-3">
                  <FiUsers className="text-primary-600" /> Available Personnel
                </h3>
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
                  <input className="pl-11 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none" placeholder="Search drivers..." />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {drivers.map((driver) => (
                  <div 
                    key={driver._id} 
                    onClick={() => selectDriver(driver.email, driver.firstName, driver.lastName, driver.vehicleNo)}
                    className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${
                      email === driver.email ? 'border-primary-600 bg-primary-50 shadow-sm' : 'border-slate-50 hover:border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                      <img className="w-full h-full object-cover" src={`http://localhost:4000/uploads/pimages/${driver.pimages}`} alt={driver.firstName} />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{driver.firstName} {driver.lastName}</p>
                      <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest">{driver.drivertype || 'Standard'}</p>
                    </div>
                    {email === driver.email && <FiCheckCircle className="text-primary-600 text-xl animate-scale-in" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Confirmation & Active Orders */}
          <div className="space-y-8">
            <div className="bg-secondary-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <FiPlusCircle className="text-primary-400" /> Deployment Summary
              </h3>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><FiTruck /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-secondary-400 tracking-widest">Selected Driver</p>
                    <p className="font-bold text-lg">{firstName ? `${firstName} ${lastName}` : '---'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><FiArrowRight /></div>
                  <div className="flex-grow">
                    <p className="text-[10px] uppercase font-bold text-secondary-400 tracking-widest">Estimated Distance</p>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white outline-none w-24 focus:bg-white/10"
                        onChange={(e) => setkm(e.target.value)} 
                        value={km}
                        placeholder="0.0"
                      />
                      <span className="font-bold text-primary-400">Kilometers</span>
                    </div>
                  </div>
                </div>
              </div>

              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs mb-6 font-medium">{error}</div>}
              {successMessage && <div className="p-4 bg-accent-500/10 border border-accent-500/20 rounded-2xl text-accent-400 text-xs mb-6 font-medium">{successMessage}</div>}

              <button 
                onClick={handleSubmit} 
                disabled={isLoading || !email}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary-600/20 flex items-center justify-center gap-3"
              >
                {isLoading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Allocation'}
              </button>
            </div>

            {/* Current Deployments Widget */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-glass border border-slate-100">
              <h3 className="text-lg font-bold text-secondary-900 mb-6 flex items-center gap-3">
                <FiClock className="text-accent-600" /> Active Deployments
              </h3>
              <div className="space-y-4">
                {deployers.slice(0, 5).map((d) => (
                  <div key={d._id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-enterprise transition-all border border-transparent hover:border-slate-100">
                    <div>
                      <p className="font-bold text-secondary-900 text-sm">{d.firstName} {d.lastName}</p>
                      <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">{d.splace} → {d.dplace}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                  </div>
                ))}
                {deployers.length === 0 && (
                  <div className="text-center py-10">
                    <FiNavigation className="mx-auto text-3xl text-slate-200 mb-2" />
                    <p className="text-xs text-secondary-400 font-bold uppercase tracking-widest">No active missions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Re-defining icons not correctly imported or mapped
const FiPlusCircle = (props) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

export default VehicleDeployer;
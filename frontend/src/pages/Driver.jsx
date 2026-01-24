import React, { useEffect, useState } from 'react';
import NavBar1 from '../components/NavBar1';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { HiOutlineMapPin, HiOutlineTruck, HiOutlineBeaker, HiCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi2';
import Footer from '../components/Footer';

const Driver = () => {
  const [deploy, setDeploy] = useState(null);
  const [suser, setSUser] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [fuelData, setFuelData] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [SuccessReportMessage, setSuccessReportMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Prevent unauthorized access and back navigation
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'driver') {
      navigate('/', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchDeploy = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/deployer/${user.email}`);
        setDeploy(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchDeploy();
    }
  }, [user]);

  const MarkerIcon = new L.Icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user && user.email) {
          const response = await axios.get(`http://localhost:4000/api/user/${user.email}`);
          setSUser(response.data);
          if (response.data.vehicleNo) {
            getFuelByVehicleNo(response.data.vehicleNo);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setSUser({});
      }
    };
    fetchUser();
  }, [user]);

  const createFuel = async (e) => {
    e.preventDefault();
    
    if (!suser || !deploy) return;

    const formData = {
      dName: suser.firstName,
      dlastName: suser.lastName,
      vehicleNo: suser.vehicleNo,
      status: 'reviewing',
      km: deploy.km,
      litre: '',
      splace: deploy.splace,
      dplace: deploy.dplace
    };

    if (fuelData.some((fuel) => fuel.vehicleNo === formData.vehicleNo)) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/fuel', formData);
      if (response && response.data) {
        setSuccessMessage('Fuel request submitted successfully!');
        getFuelByVehicleNo(suser.vehicleNo);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('An error occurred while creating the fuel document:', error);
    }
  };

  const getFuelByVehicleNo = async (vehicleNo) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/fuel/${vehicleNo}`);
      setFuelData(response.data.fuels || []);
    } catch (error) {
      console.error('An error occurred while fetching the fuel documents:', error);
    }
  };

  const createReport = async (firstName, lastName, vehicleNo, km, litre, fuelid) => {
    try {
      await axios.post('http://localhost:4000/api/report', {
        firstName,
        lastName,
        vehicleNo,
        km,
        litre,
        destStatus: 'completed',
        splace: deploy.splace,
        dplace: deploy.dplace
      });
      await deleteDeployByEmail();
      await handleComplete(fuelid);
      setSuccessReportMessage('Mission completed successfully!');
      setDeploy(null);
      setFuelData([]);
      setTimeout(() => setSuccessReportMessage(''), 5000);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDeployByEmail = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/deployer/delete/${user.email}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplete = async (fuelId) => {
    try {
      await axios.delete(`http://localhost:4000/api/fuel/${fuelId}`);
    } catch (error) {
      console.error('An error occurred while deleting the fuel document:', error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <NavBar1 />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Driver Dashboard</h1>
          <p className="text-secondary-600">Track your mission and manage fuel requests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Mission Info & Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mission Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-glass border border-white/20 p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900 flex items-center gap-2">
                  <HiOutlineMapPin className="text-primary-600" />
                  Current Mission
                </h2>
                {deploy ? (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                    In Progress
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-600 text-sm font-medium rounded-full">
                    Idle
                  </span>
                )}
              </div>

              {deploy ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-100">
                      <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-1">From</p>
                      <p className="text-secondary-900 font-semibold">{deploy.splace}</p>
                    </div>
                    <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-100">
                      <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-1">To</p>
                      <p className="text-secondary-900 font-semibold">{deploy.dplace}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <HiOutlineTruck className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-primary-600 uppercase tracking-wider mb-0.5">Distance</p>
                      <p className="text-primary-900 font-bold text-lg">{deploy.km} <span className="text-sm font-normal text-primary-600">Kilometers</span></p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiOutlineExclamationCircle className="text-secondary-400 text-3xl" />
                  </div>
                  <p className="text-secondary-500 font-medium">No active mission assigned at the moment.</p>
                </div>
              )}
            </div>

            {/* Map Container */}
            <div className="bg-white rounded-2xl shadow-enterprise border border-secondary-200 overflow-hidden h-[400px] relative z-0">
              {deploy && deploy.slat && deploy.slong && deploy.dlat && deploy.dlong ? (
                <MapContainer center={[deploy.slat, deploy.slong]} zoom={7} className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[deploy.slat, deploy.slong]} icon={MarkerIcon}>
                    <Popup>
                      <div className="font-semibold text-primary-600">Start: {deploy.splace}</div>
                    </Popup>
                  </Marker>
                  <Marker position={[deploy.dlat, deploy.dlong]} icon={MarkerIcon}>
                    <Popup>
                      <div className="font-semibold text-accent-600">Destination: {deploy.dplace}</div>
                    </Popup>
                  </Marker>
                  <Polyline positions={[[deploy.slat, deploy.slong], [deploy.dlat, deploy.dlong]]} color="#3b82f6" weight={4} opacity={0.7} dashArray="10, 10" />
                </MapContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-secondary-50 text-secondary-400 space-y-2">
                  <HiOutlineMapPin className="text-4xl" />
                  <p>Map will be available once a mission is assigned</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Fuel Requests & Actions */}
          <div className="space-y-8">
            {/* Fuel Request Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-glass border border-white/20 p-6 animate-slide-up">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center gap-2">
                <HiOutlineBeaker className="text-primary-600" />
                Fuel Management
              </h2>

              {successMessage && (
                <div className="mb-4 p-3 bg-accent-100 text-accent-700 rounded-xl flex items-center gap-2 animate-bounce-slow">
                  <HiCheckCircle className="text-xl" />
                  <span className="text-sm font-medium">{successMessage}</span>
                </div>
              )}

              {SuccessReportMessage && (
                <div className="mb-4 p-3 bg-primary-100 text-primary-700 rounded-xl flex items-center gap-2 animate-bounce-slow">
                  <HiCheckCircle className="text-xl" />
                  <span className="text-sm font-medium">{SuccessReportMessage}</span>
                </div>
              )}

              {deploy && fuelData.length === 0 && !successMessage && (
                <div className="p-6 bg-secondary-50 rounded-2xl border border-secondary-100 text-center space-y-4">
                  <p className="text-secondary-600 text-sm">You have an active mission. Need fuel?</p>
                  <button 
                    onClick={createFuel}
                    className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/30 active:scale-95"
                  >
                    Request Fuel
                  </button>
                </div>
              )}

              {fuelData.length > 0 && (
                <div className="space-y-4">
                  <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">Active Requests</p>
                  {fuelData.map((fuel) => (
                    <div key={fuel._id} className="p-4 bg-white rounded-xl border border-secondary-100 shadow-sm space-y-4 transition-all hover:border-primary-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-secondary-900 font-semibold">{fuel.vehicleNo}</p>
                          <p className="text-xs text-secondary-500">{fuel.km} km distance</p>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          fuel.status === 'successed' ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700'
                        }`}>
                          {fuel.status}
                        </span>
                      </div>
                      
                      {fuel.status === 'successed' && (
                        <button 
                          onClick={() => createReport(fuel.dName, fuel.dlastName, fuel.vehicleNo, fuel.km, fuel.litre, fuel._id)}
                          className="w-full py-2 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-all text-sm shadow-md shadow-accent-500/20"
                        >
                          Complete Mission
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!deploy && fuelData.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-secondary-400 text-sm italic">No active requests</p>
                </div>
              )}
            </div>

            {/* Driver Profile Summary */}
            <div className="bg-secondary-900 rounded-2xl p-6 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <HiOutlineTruck size={100} />
              </div>
              <h3 className="text-lg font-semibold mb-4 relative z-10">Driver Info</h3>
              {suser ? (
                <div className="space-y-3 relative z-10">
                  <div>
                    <p className="text-secondary-400 text-xs uppercase tracking-widest">Full Name</p>
                    <p className="font-medium">{suser.firstName} {suser.lastName}</p>
                  </div>
                  <div>
                    <p className="text-secondary-400 text-xs uppercase tracking-widest">Vehicle Assigned</p>
                    <p className="font-medium">{suser.vehicleNo || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-secondary-400 text-xs uppercase tracking-widest">Experience</p>
                    <p className="font-medium text-primary-400">{suser.drivertype || 'Standard'}</p>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Driver;

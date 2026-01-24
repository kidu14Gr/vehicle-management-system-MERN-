import React, { useEffect, useState } from 'react';
import NavBar1 from '../components/NavBar1';
import Footer from '../components/Footer';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineBeaker, 
  HiOutlineTruck, 
  HiOutlineUserGroup, 
  HiOutlineCalculator, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineIdentification
} from 'react-icons/hi2';

const Fuel = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [fuels, setFuels] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [oil, setOil] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessages, setSuccessMessages] = useState({});
  const [vehicleFuel, setVehicleFuel] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [totalLiters, setTotalLiters] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Prevent unauthorized access and back navigation
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'fuel manager') {
      navigate('/', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAllFuel = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/fuel/status');
        setFuels(response.data.fuels || []);
      } catch (error) {
        console.error('Error fetching fuel documents:', error);
        setFuels([]);
      }
    };

    fetchAllFuel();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/vehicle');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

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

  const calculateOilAmount = (index, km, oilType) => {
    let fuelConsumption;
    switch (oilType?.toLowerCase()) {
      case 'nafta':
        fuelConsumption = 7;
        break;
      case 'benzin':
        fuelConsumption = 9;
        break;
      case 'petrol':
        fuelConsumption = 11;
        break;
      default:
        fuelConsumption = 8;
    }

    const oilAmount = (fuelConsumption / 100) * km;
    setOil({ index, amount: oilAmount.toFixed(2) });
  };

  const getVehicleOilType = (vehicleNo) => {
    const vehicle = vehicles.find((v) => v.vehicleNo === vehicleNo);
    return vehicle ? vehicle.oiltype : 'Unknown';
  };

  const updateFuelStatus = async (id, status, litre, index) => {
    try {
      setIsLoading(true);
      await axios.patch(`http://localhost:4000/api/fuel/${id}`, {
        status,
        litre,
      });
      
      setFuels(prev => prev.filter(f => f._id !== id));
      setSuccessMessages(prev => ({ ...prev, [index]: 'Fuel request approved!' }));
      setTimeout(() => {
        setSuccessMessages(prev => {
          const newMsgs = { ...prev };
          delete newMsgs[index];
          return newMsgs;
        });
      }, 5000);
      // Trigger notification update
      window.dispatchEvent(new CustomEvent('notificationUpdated'));
    } catch (error) {
      console.error('Error updating fuel status:', error);
    } finally {
      setIsLoading(false);
      setOil({});
    }
  };

  const fetchReportsByVehicleNo = async (vehicleNo, index) => {
    try {
      setSelectedIndex(index);
      const response = await axios.get(`http://localhost:4000/api/report/${vehicleNo}`);
      const data = response.data;
      setVehicleFuel(data);

      let liters = 0;
      let km = 0;
      data.forEach((item) => {
        liters += item.litre || 0;
        km += item.km || 0;
      });

      setTotalLiters(liters.toFixed(1));
      setTotalKm(km.toFixed(1));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <NavBar1 />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Fuel Management</h1>
            <p className="text-secondary-600">Approve and track fuel distribution across the fleet</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-enterprise border border-secondary-100 flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-xl">
                <HiOutlineBeaker className="text-primary-600 text-2xl" />
              </div>
              <div>
                <p className="text-xs font-medium text-secondary-500 uppercase">Pending Requests</p>
                <p className="text-2xl font-bold text-secondary-900">{fuels.length}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-enterprise border border-secondary-100 flex items-center gap-4">
              <div className="p-3 bg-accent-100 rounded-xl">
                <HiOutlineUserGroup className="text-accent-600 text-2xl" />
              </div>
              <div>
                <p className="text-xs font-medium text-secondary-500 uppercase">Active Drivers</p>
                <p className="text-2xl font-bold text-secondary-900">{drivers.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Fuel Requests */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-glass border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center gap-2">
                <HiOutlineClock className="text-primary-600" />
                Pending Approvals
              </h2>

              {fuels.length === 0 ? (
                <div className="text-center py-20 bg-secondary-50 rounded-2xl border border-dashed border-secondary-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <HiOutlineCheckCircle className="text-accent-500 text-3xl" />
                  </div>
                  <p className="text-secondary-500 font-medium">All fuel requests have been processed.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fuels.map((fuel, index) => (
                    <div key={fuel._id} className="group relative bg-white border border-secondary-100 rounded-2xl p-5 transition-all hover:shadow-lg hover:border-primary-200 animate-fade-in">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold">
                            {fuel.dName[0]}{fuel.dlastName[0]}
                          </div>
                          <div>
                            <p className="text-secondary-900 font-semibold leading-tight">{fuel.dName} {fuel.dlastName}</p>
                            <p className="text-xs text-secondary-500">Vehicle: {fuel.vehicleNo}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-[10px] font-bold rounded uppercase tracking-wider">
                          {fuel.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-secondary-50 p-2 rounded-lg">
                          <p className="text-[10px] text-secondary-400 uppercase font-bold mb-1">Distance</p>
                          <p className="text-secondary-900 font-semibold text-sm">{fuel.km} km</p>
                        </div>
                        <div className="bg-secondary-50 p-2 rounded-lg">
                          <p className="text-[10px] text-secondary-400 uppercase font-bold mb-1">Fuel Type</p>
                          <p className="text-secondary-900 font-semibold text-sm capitalize">{getVehicleOilType(fuel.vehicleNo)}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {oil.index === index ? (
                          <div className="flex items-center justify-between p-3 bg-accent-50 border border-accent-100 rounded-xl animate-slide-down">
                            <div>
                              <p className="text-[10px] text-accent-600 uppercase font-bold">Recommended</p>
                              <p className="text-accent-900 font-bold">{oil.amount} Liters</p>
                            </div>
                            <button 
                              disabled={isLoading}
                              onClick={() => updateFuelStatus(fuel._id, 'successed', oil.amount, index)}
                              className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                            >
                              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <HiOutlineCheckCircle />}
                              Approve
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => calculateOilAmount(index, fuel.km, getVehicleOilType(fuel.vehicleNo))}
                            className="w-full py-2 bg-secondary-100 hover:bg-primary-600 hover:text-white text-secondary-700 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                          >
                            <HiOutlineCalculator />
                            Calculate Fuel Needs
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Driver Stats */}
          <div className="space-y-8">
            <div className="bg-secondary-900 rounded-2xl shadow-enterprise p-6 text-white h-full">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <HiOutlineChartBar className="text-primary-400" />
                Fleet Analytics
              </h2>
              
              <div className="space-y-4">
                <p className="text-xs font-medium text-secondary-400 uppercase tracking-widest mb-2">Driver Profiles</p>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {drivers.map((driver, index) => (
                    <div 
                      key={driver._id} 
                      onClick={() => fetchReportsByVehicleNo(driver.vehicleNo, index)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        selectedIndex === index 
                        ? 'bg-primary-600 border-primary-500' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" 
                          src={`http://localhost:4000/uploads/pimages/${driver.pimages}`} 
                          alt={driver.firstName}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                        />
                        <div className="flex-grow">
                          <p className="text-sm font-semibold">{driver.firstName} {driver.lastName}</p>
                          <p className="text-[10px] text-secondary-400 group-hover:text-primary-200">{driver.drivertype}</p>
                        </div>
                        <HiOutlineIdentification className={selectedIndex === index ? 'text-white' : 'text-secondary-500'} />
                      </div>

                      {selectedIndex === index && (
                        <div className="mt-4 grid grid-cols-2 gap-2 pt-4 border-t border-primary-500 animate-fade-in">
                          <div>
                            <p className="text-[8px] uppercase font-bold text-primary-200">Total Km</p>
                            <p className="text-sm font-bold">{totalKm}</p>
                          </div>
                          <div>
                            <p className="text-[8px] uppercase font-bold text-primary-200">Total Liters</p>
                            <p className="text-sm font-bold">{totalLiters}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Fuel;

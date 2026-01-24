import React, { useEffect, useRef, useState } from 'react'
import NavBar1 from '../components/NavBar1';
import Footer from '../components/Footer';
import car from '../assets/img/car.jpeg'
import axios from 'axios'
import { FiPlus, FiTruck, FiUsers, FiDroplet, FiCheckCircle, FiImage, FiSettings, FiGrid, FiList } from 'react-icons/fi';
import { AiOutlineLike } from "react-icons/ai";

const VehicleManage = () => {
  const img = useRef();
  const [oilType, setoilType] = useState('');
  const [driver, setDriver] = useState('');
  const [fdriver, setfDriver] = useState('0000000');
  const [vehicleName, setvehicleName] = useState('')
  const [vehicleNo, setvehicleNo] = useState('')
  const [vimage, setVimage] = useState(null);
  const [urlvimage, setUrlVimage] = useState(car);
  const [vehicletype, setvehicleType] = useState('')
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ishLoading, setIshLoading] = useState(false);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [successAssign, setSuccessAssign] = useState('');

  const choose = () => img.current.click();

  useEffect(() => {
    if (vimage) {
      const url = URL.createObjectURL(vimage);
      setUrlVimage(url);
    }
  }, [vimage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oilType || !vehicleName || !vehicleNo || !vimage || !vehicletype) {
      setError("Please fill in all required fields.");
      return;
    }
    const vehicleExists = vehicles.some((v) => v.vehicleNo === vehicleNo);
    if (vehicleExists) {
      setError("Vehicle with the same number already exists.");
      return;
    }

    setIshLoading(true);
    const formData = new FormData();
    formData.append('oiltype', oilType);
    formData.append('driverId', fdriver);
    formData.append('vehicleName', vehicleName);
    formData.append('vehicleNo', vehicleNo);
    formData.append('vimage', vimage);
    formData.append('vehicleType', vehicletype);

    try {
      await axios.post('http://localhost:4000/api/vehicle', formData);
      setSuccessMessage('Vehicle added successfully');
      setError("");
      setvehicleName('');
      setvehicleNo('');
      setoilType('');
      setvehicleType('');
      setUrlVimage(car);
      fetchVehicles();
      setIshLoading(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setError("Failed to add vehicle. Please try again.");
      setIshLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/drivers/no');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/vehicle');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
  }, []);

  const handleAssign = async (vId, vNo, index) => {
    if (!driver) {
      alert("Please select a driver first");
      return;
    }
    setSelectedVehicleIndex(index);
    try {
      setIsLoading(true);
      await axios.patch(`http://localhost:4000/api/user/${driver}`, { vehicleNo: vNo });
      await axios.patch(`http://localhost:4000/api/vehicle/${vId}`, { driverId: driver });
      setSuccessAssign('success');
      fetchVehicles();
      fetchDrivers();
      setIsLoading(false);
      setTimeout(() => {
        setSuccessAssign('');
        setSelectedVehicleIndex(null);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <NavBar1 />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Vehicle Inventory Management</h1>
          <p className="text-secondary-600">Register new fleet assets and assign designated drivers</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Add Vehicle Form */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-glass border border-white overflow-hidden animate-fade-in">
                <div className="bg-primary-600 p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FiTruck size={100} />
                  </div>
                  <h2 className="text-2xl font-bold flex items-center gap-3 relative z-10">
                    <FiPlus /> New Vehicle
                  </h2>
                  <p className="text-primary-100 text-sm mt-1 opacity-80 relative z-10">Expand your institutional fleet inventory.</p>
                </div>
                
                <form className="p-8 space-y-5">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group cursor-pointer" onClick={choose}>
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-secondary-50 shadow-enterprise group-hover:border-primary-100 transition-all">
                        <img className="w-full h-full object-cover" src={urlvimage} alt="Vehicle preview" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <FiImage size={20} />
                      </div>
                      <input ref={img} type="file" hidden onChange={(e) => setVimage(e.target.files[0])} name="vimages" accept="image/*" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary-500 uppercase tracking-widest ml-1">Vehicle Name</label>
                      <input 
                        className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        placeholder="e.g. Toyota Coaster"
                        onChange={(e) => setvehicleName(e.target.value)}
                        value={vehicleName}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary-500 uppercase tracking-widest ml-1">Plate Number</label>
                      <input 
                        className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        placeholder="HU-####"
                        onChange={(e) => setvehicleNo(e.target.value)}
                        value={vehicleNo}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary-500 uppercase tracking-widest ml-1">Fuel Type</label>
                        <select className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl outline-none focus:border-primary-500 appearance-none" onChange={(e) => setoilType(e.target.value)} value={oilType}>
                          <option value="">Select</option>
                          <option value="petrol">Petrol</option>
                          <option value="nafta">Diesel</option>
                          <option value="benzin">Benzin</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary-500 uppercase tracking-widest ml-1">Category</label>
                        <select className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl outline-none focus:border-primary-500 appearance-none" onChange={(e) => setvehicleType(e.target.value)} value={vehicletype}>
                          <option value="">Select</option>
                          <option value="Mini">Mini Car</option>
                          <option value="Bus">Bus</option>
                          <option value="Truck">Truck</option>
                          <option value="Ambulance">Ambulance</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg border border-red-100 animate-shake">{error}</p>}
                  {successMessage && <p className="text-accent-600 text-xs font-bold bg-accent-50 p-2 rounded-lg border border-accent-100 animate-fade-in">{successMessage}</p>}

                  <button 
                    onClick={handleSubmit}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-600/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                    disabled={ishLoading}
                  >
                    {ishLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiCheckCircle /> Register Vehicle</>}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right: Vehicle List */}
          <div className="lg:w-2/3 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">Fleet Inventory</h2>
                <p className="text-secondary-500">Currently managing {vehicles.length} operational vehicles.</p>
              </div>
              <div className="flex gap-2 p-1 bg-white rounded-xl shadow-enterprise border border-secondary-100">
                <button className="p-2 bg-secondary-50 text-primary-600 rounded-lg"><FiGrid /></button>
                <button className="p-2 text-secondary-400 hover:text-secondary-600"><FiList /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {vehicles.map((v, index) => (
                <div key={v._id} className="bg-white rounded-3xl border border-secondary-100 shadow-enterprise overflow-hidden hover:shadow-glass transition-all group flex flex-col md:flex-row animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="md:w-72 h-48 md:h-auto overflow-hidden">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      src={`http://localhost:4000/uploads/vimages/${v.vimage}`} 
                      alt={v.vehicleName}
                      onError={(e) => { e.target.src = car }}
                    />
                  </div>
                  <div className="flex-grow p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors mb-2">{v.vehicleName}</h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary-500 uppercase tracking-widest bg-secondary-50 px-3 py-1 rounded-full border border-secondary-100">
                              <FiTruck /> {v.vehicleType}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                              <FiDroplet /> {v.oiltype}
                            </span>
                          </div>
                        </div>
                        <span className="text-lg font-mono font-bold text-secondary-900 bg-secondary-50 px-4 py-2 rounded-2xl border border-secondary-100 shadow-sm">
                          {v.vehicleNo}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col xl:flex-row items-end xl:items-center justify-between gap-6 pt-6 border-t border-secondary-50">
                      <div className="w-full xl:flex-grow max-w-lg">
                        <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-2">Assign Primary Driver</label>
                        <div className="flex gap-2">
                          <select 
                            className="flex-grow px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                            onChange={(e) => setDriver(e.target.value)}
                          >
                            <option value="">Select available driver...</option>
                            {drivers.map(d => (
                              <option key={d._id} value={d._id}>{d.firstName} {d.lastName} ({d.drivertype})</option>
                            ))}
                          </select>
                          <button 
                            onClick={() => handleAssign(v._id, v.vehicleNo, index)}
                            className="px-6 py-3 bg-secondary-900 text-white text-sm font-bold rounded-xl hover:bg-secondary-800 transition-all shadow-lg shadow-secondary-900/10 disabled:opacity-50 active:scale-95"
                            disabled={isLoading && selectedVehicleIndex === index}
                          >
                            {selectedVehicleIndex === index && isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Assign'}
                          </button>
                        </div>
                      </div>
                      
                      {selectedVehicleIndex === index && successAssign === 'success' && (
                        <div className="flex items-center gap-2 text-accent-600 animate-bounce">
                          <AiOutlineLike size={'1.5rem'} />
                          <span className="text-xs font-bold uppercase tracking-widest">Success</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VehicleManage;

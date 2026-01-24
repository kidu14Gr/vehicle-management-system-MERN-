import React, { useState, useEffect } from 'react';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "••••••••", 
  showStrength = false,
  confirmPassword = null,
  onConfirmChange = null,
  label = "Password",
  required = true
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (showStrength && value) {
      const newChecks = {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      };
      setChecks(newChecks);

      const strengthScore = Object.values(newChecks).filter(Boolean).length;
      setStrength((strengthScore / 5) * 100);
    } else {
      setStrength(0);
      setChecks({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    }
  }, [value, showStrength]);

  const passwordsMatch = confirmPassword !== null 
    ? value === confirmPassword && value.length > 0
    : null;

  const getStrengthColor = () => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-secondary-700 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
          <HiOutlineLockClosed />
        </div>
        <input 
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          className="w-full pl-11 pr-12 py-3 sm:py-3.5 bg-secondary-50 border border-secondary-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 placeholder-secondary-300 text-sm sm:text-base touch-manipulation"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors touch-manipulation"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <HiOutlineEyeSlash className="text-lg sm:text-xl" /> : <HiOutlineEye className="text-lg sm:text-xl" />}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {showStrength && value && (
        <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-secondary-50 rounded-xl border border-secondary-100">
          {/* Strength Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] sm:text-xs font-semibold text-secondary-600">Password Strength</span>
              <span className="text-[10px] sm:text-xs font-bold text-secondary-900">{Math.round(strength)}%</span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-secondary-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>

          {/* Strength Rules */}
          <div className="space-y-1.5 sm:space-y-2">
            {[
              { key: 'length', label: 'At least 8 characters' },
              { key: 'uppercase', label: 'One uppercase letter' },
              { key: 'lowercase', label: 'One lowercase letter' },
              { key: 'number', label: 'One number' },
              { key: 'special', label: 'One special character' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2 text-[10px] sm:text-xs">
                {checks[key] ? (
                  <HiOutlineCheckCircle className="text-green-500 flex-shrink-0 text-sm sm:text-base" />
                ) : (
                  <HiOutlineXCircle className="text-red-400 flex-shrink-0 text-sm sm:text-base" />
                )}
                <span className={checks[key] ? 'text-green-700 font-medium' : 'text-secondary-500'}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Password Field */}
      {confirmPassword !== null && onConfirmChange && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-secondary-700 ml-1">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
              <HiOutlineLockClosed />
            </div>
            <input 
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              className="w-full pl-11 pr-12 py-3 sm:py-3.5 bg-secondary-50 border border-secondary-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 placeholder-secondary-300 text-sm sm:text-base touch-manipulation"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={onConfirmChange}
              required={required}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors touch-manipulation"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <HiOutlineEyeSlash className="text-lg sm:text-xl" /> : <HiOutlineEye className="text-lg sm:text-xl" />}
            </button>
            {confirmPassword && (
              <div className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2">
                {passwordsMatch ? (
                  <HiOutlineCheckCircle className="text-green-500 text-lg sm:text-xl" />
                ) : (
                  <HiOutlineXCircle className="text-red-500 text-lg sm:text-xl" />
                )}
              </div>
            )}
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-500 ml-1">Passwords do not match</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;


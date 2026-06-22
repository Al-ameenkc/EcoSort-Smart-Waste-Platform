import React from 'react';
import { Link } from 'react-router-dom';

const DataConsentCheckbox = ({ checked, onChange, id = 'data-consent' }) => (
  <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#1a4032] focus:ring-[#1a4032] shrink-0"
    />
    <span className="text-xs text-slate-600 leading-relaxed">
      I consent to KanemWaste collecting and processing my personal data, including my full name,
      phone number, and location, to schedule pickups, verify hazard reports, and contact me about
      my request, as described in our{' '}
      <Link
        to="/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#1a4032] font-bold underline hover:text-green-700"
      >
        Privacy Policy
      </Link>
      .
    </span>
  </label>
);

export default DataConsentCheckbox;

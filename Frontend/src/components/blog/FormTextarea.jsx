import React from 'react';
import PropTypes from 'prop-types';

const FormTextarea = ({ label, id, name, placeholder, value, onChange, required, rows }) => {
  return (
    <div className="form-group flex flex-col">
      <label 
        htmlFor={id} 
        className="font-semibold text-sm mb-2 text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-gray-700 min-h-[200px] resize-y transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-sans"
      />
    </div>
  );
};

FormTextarea.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  rows: PropTypes.number
};

FormTextarea.defaultProps = {
  placeholder: '',
  required: false,
  rows: 6
};

export default FormTextarea;

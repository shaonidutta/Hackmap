import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ModernDatePicker.css';

interface ModernDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholderText?: string;
  id?: string;
  required?: boolean;
  className?: string;
  label?: string;
}

const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
  selected,
  onChange,
  minDate,
  placeholderText = 'Select date',
  id,
  required = false,
  className = '',
  label,
}) => {
  // Custom input component to style the input field
  const CustomInput = forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>(
    ({ value, onClick, onChange: onInputChange, placeholder }, ref) => (
      <div className="modern-date-picker-input-container">
        <div className="modern-date-picker-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          ref={ref}
          value={value as string}
          onClick={onClick}
          onChange={onInputChange}
          placeholder={placeholder as string}
          className="modern-date-picker-input"
          readOnly
        />
      </div>
    )
  );

  // Custom header component for the calendar
  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => (
    <div className="custom-header">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="month-nav-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="month-year">
        {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="month-nav-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className={`modern-date-picker-wrapper ${className}`}>
      {label && (
        <label htmlFor={id} className="modern-date-picker-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        showTimeSelect={false}
        minDate={minDate}
        placeholderText={placeholderText}
        required={required}
        customInput={<CustomInput />}
        popperClassName="modern-date-picker-popper"
        calendarClassName="modern-date-picker-calendar"
        renderCustomHeader={CustomHeader}
        popperModifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'viewport',
              padding: 8,
            },
          },
        ]}
        popperPlacement="bottom-start"
        showPopperArrow={false}
        fixedHeight
      />
    </div>
  );
};

export default ModernDatePicker;

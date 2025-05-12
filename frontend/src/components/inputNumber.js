import React, { useState } from 'react';
import '../App.css';



export function InputNumber({ value, onChange, disabled }) {
    return React.createElement('input', {
      type: 'number',
      min : "1",
      value: value,
      disabled : disabled,
      onChange: (e) => onChange(e.target.value),
      className: 'glass-number',
      placeholder: '0',
    });
  }
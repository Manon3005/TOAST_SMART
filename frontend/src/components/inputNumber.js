import React, { useState } from 'react';
import '../App.css';



export function InputNumber({ value, onChange }) {
    return React.createElement('input', {
      type: 'number',
      min : "1",
      value: value,
      onChange: (e) => onChange(e.target.value),
      className: 'glass-number',
      placeholder: '0',
    });
  }
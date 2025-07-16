import '../../styles/App.css'



export function InputNumber({ value, onChange, disabled }) {
    return React.createElement('input', {
      type: 'number',
      min : "1",
      value: value,
      onChange: (e) => onChange(e.target.value),
      className: 'glass-number',
      placeholder: '0',
      disabled: disabled
    });
  }
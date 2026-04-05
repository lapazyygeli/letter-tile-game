type FormInputProps = {
  name: string
  value: string
  type: 'text' | 'password'
  placeholder: string
  autoComplete?: string
  required?: boolean
  error?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

export function FormInput({
  name,
  value,
  type,
  placeholder,
  autoComplete,
  required = true,
  error,
  onChange,
}: FormInputProps) {
  return (
    <div>
      <input // Fixaa inputtien leveys
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        onChange={onChange}
        className={`bg-bg-light mb-4 w-full border px-6 py-3 ${error ? 'border-red-500' : 'border-border'}`}
      ></input>
      {error && <p className='px-1 text-xs text-red-400'>{error}</p>}
    </div>
  )
}

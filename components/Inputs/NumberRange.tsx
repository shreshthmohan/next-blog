export const NumberRange = ({
  label,
  onChange,
  id,
  value,
  rangeLimits = {},
  step = 1,
}) => {
  return (
    <div className="flex w-full items-center">
      <label className="w-[120px]" htmlFor={id}>
        {label}
      </label>

      <input
        type="number"
        className="w-12"
        name=""
        onChange={onChange}
        id={id}
        value={value}
        step={step}
      />
      <input
        className="ml-2 grow"
        onChange={onChange}
        type="range"
        step={step}
        value={value}
        {...rangeLimits}
      />
    </div>
  )
}

export default function ChampModifier({
	id,
	label,
	value,
	onChange,
	error,
	type = 'text',
	required = false,
	...inputProps
}) {
	return (
		<div>
			<label htmlFor={id} className="label">
				{label}
			</label>

			<input
				id={id}
				type={type}
				className="input w-full validator"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				required={required}
				{...inputProps}
			/>

			{error && (
				<div id={`${id}-error`} className="validator-hint">
					{error}
				</div>
			)}
		</div>
	);
}

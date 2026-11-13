import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
	const [visible, setVisible] = useState(false);
	const isPassword = type === 'password';

	return (
		<div>
			<label htmlFor={id} className="label">
				{label}
			</label>

			<label className="input w-full validator">
				<input
					id={id}
					type={isPassword && visible ? 'text' : type}
					className="grow"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					required={required}
					aria-describedby={error ? `${id}-error` : undefined}
					{...inputProps}
				/>

				{isPassword && (
					<button
						type="button"
						onClick={() => setVisible((v) => !v)}
						aria-label={
							visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
						}
						aria-pressed={visible}
						className="btn btn-ghost btn-xs btn-circle"
					>
						{visible ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				)}
			</label>

			{error && (
				<div id={`${id}-error`} className="validator-hint">
					{error}
				</div>
			)}
		</div>
	);
}

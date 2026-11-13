export default function SelectModifier({ value, onChange, liste, ...selectProps }) {
	return (
		<select
			className="select [&::picker(select)]:max-h-26 w-full"
			value={value}
			onChange={(e) => {
				onChange(Number(e.target.value));
			}}
		>
			{liste.map((l) => (
				<option key={l.id} value={l.id}>
					{l.intitule}
				</option>
			))}
		</select>
	);
}

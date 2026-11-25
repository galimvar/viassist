import { useState, useEffect } from 'react';

const AgendaMonth = () => {
	let data;

	if (!data)
		return (
			<div className="flex justify-self-center items-center h-[60dvh]">
				<span className="loading loading-spinner w-24 text-info "></span>
			</div>
		);
	return (
		<>
			<h2>EN CONSTRUCTION</h2>
			<div className="flex justify-self-center items-center h-[60dvh]">
				<span className="loading loading-spinner w-24 text-info "></span>
			</div>
		</>
	);
};

export default AgendaMonth;

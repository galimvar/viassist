import React from 'react';
import { useState } from 'react';
import { House, Newspaper, CalendarDays, Settings } from 'lucide-react';

export default function Nav() {
	return (
		<>
			<div className="dock dock-md">
				<button>
					<House size={144} color="#5bbebc" strokeWidth={1.75} />
					<span className="dock-label">Home</span>
				</button>

				<button>
					<Newspaper size={144} color="#5bbebc" strokeWidth={1.75} />
					<span className="dock-label">Journal de Bord</span>
				</button>

				<button>
					<CalendarDays size={144} color="#5bbebc" strokeWidth={1.75} />
					<span className="dock-label">Agenda</span>
				</button>

				<button>
					<Settings size={144} color="#5bbebc" strokeWidth={1.75} />
					<span className="dock-label">Paramètres</span>
				</button>
			</div>
		</>
	);
}

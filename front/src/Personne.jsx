import dayGridPlugin from '@fullcalendar/react/daygrid'
import listPlugin from '@fullcalendar/react/list'
import { EventCalendar } from './event-calendar'
import './app.css'

fetch(API + "");


export function App() {
  return (
    <EventCalendar
      plugins={[
        dayGridPlugin,
        listPlugin,
      ]}
      addButton={{
        text: 'Add Event',
        click() {
          alert('handle add event...')
        },
      }}
      availableViews={['dayGridMonth', 'dayGridWeek', 'listWeek']}
      initialView='dayGridMonth'
    />
  )
}
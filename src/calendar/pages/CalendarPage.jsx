import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { NavBar,CalendarEvent,CalendarModal, FavaddNew,FabDelete } from "../components";
import { localizer,getMesssages } from "../../helpers";

//import {addHours} from 'date-fns';
import { useEffect, useState } from 'react';
import { useUiStore,useCalendarStore, useAuthStore } from '../../hooks';


export const CalendarPage = () => {
const  {user} =  useAuthStore();
  const {openDateModal} =useUiStore();
  
  const {events,setActiveEvent,startLoadingEvents} = useCalendarStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || "week");

  const eventStyleGetter =(event,start,end,isSelected)=>{
   // console.log(event)
    const isMyEvent = ( user.uid === event.user._id ) || ( user.uid === event.user.uid );

    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }
    
    return {
      style
    }

  }
  const onDobleClick=(event)=>{
    //*console.log({onDobleClick:event});
    openDateModal();
    };
    const onSelect=(event)=>{
     //* console.log({onSelect:event})
     setActiveEvent(event);
    }
    const onViewChangue=(event)=>{
      //console.log({onViewChangue:event});
      localStorage.setItem('lastView',event);
      setLastView(event);
    }

    useEffect(() => {
      startLoadingEvents();
    }, []);
    
  
  return (
    <>
      <NavBar/>
      <Calendar
      culture='es'
      localizer={localizer}
      events={events}
      defaultView={lastView}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 'calc( 100vh - 80px )' }}
      messages={getMesssages()}
      eventPropGetter={eventStyleGetter}
      components={{
        event:CalendarEvent
      }}
      onDoubleClickEvent={onDobleClick}
      onSelectEvent={onSelect}
      onView={onViewChangue}
      />

      <CalendarModal/>

      <FavaddNew/>
      <FabDelete/>
    </>
  )
}

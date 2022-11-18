import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { calendarApi } from "../apis";
import { convertDateToString } from "../helpers";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";


export const useCalendarStore = () => {
    
    const dispatch =  useDispatch()
    
    const {events,activeEvent} =useSelector(state => state.calendar);
    const {user} =useSelector(state => state.auth);

    const setActiveEvent =(calendarEvent)=>{
      dispatch(onSetActiveEvent(calendarEvent));
    }

    const startSavingEvent = async(calendarEvent)=>{
     
    try {
      if (calendarEvent.id) {
       //Actualizando si viene id
       await calendarApi.put(`/events/${calendarEvent.id}`,calendarEvent);
       dispatch(onUpdateEvent({...calendarEvent,user}));
       return;
      } 
       //Creando si no tiene id
       const {data} = await calendarApi.post('/events',calendarEvent);
       
       dispatch(onAddNewEvent({...calendarEvent,id: data.evento.id, user}));
      
    } catch (error) {
      console.log(error);
      Swal.fire('Error al actualizar',error.response.data.msg,'error');
    }
    
    }  

    const startDeletingEvent = async ()=>{
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`);
      dispatch(onDeleteEvent());

    } catch (error) {
      console.log(error);
      Swal.fire('Error al eliminar',error.response.data.msg,'error');
    }

    }


    const startLoadingEvents =async()=>{
      try {
        const {data} = await calendarApi.get('/events');
        const events = convertDateToString(data.eventos);
        dispatch(onLoadEvents(events));
        //console.log(events)

      } catch (error) {
        console.log(error)
      }
    }


    return {
       //*proiedades
       events,
       activeEvent,
       hasEventSelected:!!activeEvent?.id,

       //*Metodos
       startDeletingEvent, 
       setActiveEvent,
       startSavingEvent,
       startLoadingEvents
  }
}

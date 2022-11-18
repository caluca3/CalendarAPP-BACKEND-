import {  useCalendarStore} from "../../hooks/useCalendarStore";


export const FabDelete = () => {
    const {startDeletingEvent,hasEventSelected} = useCalendarStore()
    
    const handleDeleteEvent =()=>{
       // console.log('hola');
        startDeletingEvent();
    }
    return (
        <>
           <button 
           aria-label="btn-delete"
           className="btn btn-danger fab-delete "
           onClick={handleDeleteEvent}
           style={{ display: hasEventSelected ? '' : 'none'}}>
               <i className="fa fa-trash-alt"></i>
           </button>
        </>
      )
}

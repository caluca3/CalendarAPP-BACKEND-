import { addHours } from "date-fns";
import { useCalendarStore, useUiStore } from "../../hooks"

export const FavaddNew = () => {

    const { openDateModal} = useUiStore();

    const {setActiveEvent} = useCalendarStore();

    const handleNewEvent =()=>{
        setActiveEvent({
             title:'',
             nota:'',
             start: new Date(),
             end: addHours(new Date(),2),
             bgColor:'#fafafa',
             user:{
               _id:'123',
               name:'Carlos'
             }
            });
        
        openDateModal();
    }
    
  return (
    <>
       <button className="btn btn-primary fab " onClick={handleNewEvent}>
           <i className="fa fa-plus"></i>
       </button>
    </>
  )
}

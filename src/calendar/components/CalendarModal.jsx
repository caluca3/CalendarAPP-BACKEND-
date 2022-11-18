import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal'
import Swal from 'sweetalert2';
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addHours, differenceInSeconds} from 'date-fns';
import es from 'date-fns/locale/es'
import { useCalendarStore, useUiStore } from '../../hooks';
import { getEnvVariable } from '../../helpers';

registerLocale('es',es)

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
if(getEnvVariable().VITE_MODE !== 'test'){
  Modal.setAppElement('#root');
}
  

export const CalendarModal = () => {

  //const [isOpen, setIsOpen] = useState(true)
  const {isDateModalOpen,closeDateModal} =useUiStore();

  const {activeEvent,startSavingEvent} = useCalendarStore();

  const [formSubmitted, setFormSubmitted] = useState(false)


  const [formValues, setFormValues] = useState({
        title:'Carlos',
        notes:'Campos',
        start:new Date(),
        end: addHours(new Date(),2)
  });

 const titleValid =useMemo(() =>{ 
   if (!formSubmitted) return '';
    return(formValues.title.length >0)
    ?''
    :'is-invalid'
   }, [formValues.title,formSubmitted]);


   useEffect(() => {
    if(activeEvent !== null){
      setFormValues({...activeEvent})
    }
   }, [activeEvent])
   

   
   
   const onInputChanged = ({target})=>{
     setFormValues({
       ...formValues,[target.name]:target.value
      });
    }
    const onDateChange = (event,changing)=>{
      setFormValues({
        ...formValues,[changing]:event
      })
    }
    
    const onCloseModal = ()=>{
     // console.log('Cerrando Modal');
      closeDateModal();
      
    }
    //*ESTE ES EL SUBMIT DEL FORMULARIO
      const onSubmitForm = async (event)=>{
        event.preventDefault()
        const difference = differenceInSeconds(formValues.end,formValues.start);
        
        if (isNaN(difference)||difference <=0) {
            console.log('Error en las fechas')
            Swal.fire('Fechas incorrectas','Por favor revisa las fechas','error');
            return;
        }
        if (formValues.title.length <= 0) return;
        //*console.log({difference})
        
      await  startSavingEvent(formValues);
      closeDateModal();
      setFormSubmitted(false);
      }

    return (
    <Modal 
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className='modal'
      overlayClassName="modal-fondo"
      closeTimeoutMS={180}
      >
       <h1> Nuevo evento </h1>
      <hr />
      <form 
       className="container" 
       onSubmit={onSubmitForm}>
         <div className="form-group mb-2">
           <label>Fecha y hora inicio</label>
           <DatePicker
             selected={formValues.start}
             onChange={(event)=>onDateChange(event,'start')}
             className='form-control'
             dateFormat="Pp"
             showTimeSelect
             locale='es'
             timeCaption='Hora'
             />
         </div>
         <div className="form-group mb-2">
           <label>Fecha y hora fin</label>
           <DatePicker
             minDate={formValues.start}
             selected={formValues.end}
             onChange={(event)=>onDateChange(event,'end')}
             className='form-control'
             dateFormat="Pp"
             showTimeSelect
             locale='es'
             timeCaption='Hora'
             />
         </div>
         <hr />
         <div className="form-group mb-2">
           <label>Titulo y notas</label>
           <input 
               type="text" 
               className={`form-control  ${titleValid}`}
               placeholder="Título del evento"
               name="title"
               autoComplete="off"
               value={formValues.title}
               onChange={onInputChanged}
           />
           <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
         </div>
         <div className="form-group mb-2">
           <textarea 
               type="text" 
               className="form-control"
               placeholder="Notas"
               rows="5"
               name="notes"
               value={formValues.notes}
               onChange={onInputChanged}
           ></textarea>
             <small id="emailHelp" className="form-text text-muted">Información adicional</small>
         </div>
         <button
             type="submit"
             className="btn btn-outline-primary btn-block"
         >
             <i className="far fa-save"></i>
             <span> Guardar</span>
         </button>
       </form> 
    </Modal>
  )
}

import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarFixtures"


describe('Pruebas en calendarSlice', () => {

    test('Debe regresar el estado por defecto', () => {
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);
     });

    test('onSetActiveEvent debe de activar un evento', () => { 
        const state = calendarSlice.reducer(calendarWithEventsState,onSetActiveEvent(events[0]));
        //console.log(state);
        expect(state.activeEvent).toEqual(events[0]);
     });

    test('onAddNewEvent debe de agregar un evento', () => { 
        const newEvent = {
            id:'3',
            start: new Date('2022-10-27 13:00:00'),
            end:  new Date('2022-10-27 15:00:00'),
            title:'EvolutionFit2',
            nota:'Claro que si puedes',
            }
            const state = calendarSlice.reducer(calendarWithEventsState,onAddNewEvent(newEvent));
            expect(state.events).toEqual([...events, newEvent]);
     });

    test('onUpdateEvent debe de agregar un evento', () => { 
        const updatedEvent = {
            id:'1',
            start: new Date('2020-10-27 13:00:00'),
            end:  new Date('2020-10-27 15:00:00'),
            title:'EvolutionFit2020',
            nota:'Claro que actualizo',
            }
            const state = calendarSlice.reducer(calendarWithEventsState,onUpdateEvent(updatedEvent));
            //console.log(state);
            expect(state.events).toContain(updatedEvent);
     });

    test('onDeleteEvent debe borrar el evento', () => {
         //calendarWithActiveEventState
         const state = calendarSlice.reducer(calendarWithActiveEventState,onDeleteEvent());
        //  console.log(state);
         expect(state.activeEvent).toBe(null)
         
      });

    test('onLoadEvents debe eestablecer los eventos', () => { 
        //initialState
        const state = calendarSlice.reducer(initialState,onLoadEvents(events));
        // console.log(state);
        expect(state.isLoadingEvents).toBe(false)
        expect(state.events).toEqual(events)

       });

    test('onLogoutCalendar debe limpiar el estado', () => { 
        //calendarWithActiveEventState
        const state = calendarSlice.reducer(calendarWithActiveEventState,onLogoutCalendar());
        console.log(state);
        expect(state).toEqual(initialState)
     });

 });

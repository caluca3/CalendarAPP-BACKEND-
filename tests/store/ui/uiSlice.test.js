import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store/ui/uiSlice"


describe('Pruebas en uiSlice', () => { 

    test('Debe llamar el initialState correctamente', () => { 
        expect(uiSlice.getInitialState().isDateModalOpen).toBe(false);
     });

    test('Debe cambiar el isDateModalOpen', () => {
        let state = uiSlice.getInitialState();
        state = uiSlice.reducer(state,onOpenDateModal());
        expect(state.isDateModalOpen).toBeTruthy();

        state = uiSlice.reducer(state,onCloseDateModal());
        expect(state.isDateModalOpen).toBeFalsy();
     });
 });
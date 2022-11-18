import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react"
import { Provider } from "react-redux";
import { useUiStore } from "../../src/hooks/useUiStore"
import { store } from "../../src/store/store";
import { uiSlice } from "../../src/store/ui/uiSlice";

const getMockStore = (initialState)=>{
    return configureStore({
        reducer:{
            ui:uiSlice.reducer
        },
        preloadedState:{
            ui:{...initialState}
        }
    })
}
describe('Pruebas en uiStore', () => { 

    
    test('Debe traer las propiedadades por defecto', () => {
        
        const mockStore = getMockStore({isDateModalOpen: false})
        const {result} = renderHook(()=> useUiStore(),{
            wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
        });
        //console.log(result)
        expect(result.current).toEqual({
            isDateModalOpen: false,
            closeDateModal: expect.any(Function),
            openDateModal:  expect.any(Function),
         })

    });
    test('opneDateModal cambia isDateModalOpen a true', () => {
        const mockStore = getMockStore({isDateModalOpen: false})
        const {result} = renderHook(()=> useUiStore(),{
            wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        const {openDateModal} = result.current;

        act( () =>openDateModal() );

        //console.log(result);
        expect(result.current.isDateModalOpen).toBe(true);  
    });
    test('closeDateModal cambia isDateModalOpen a false', () => {
        const mockStore = getMockStore({isDateModalOpen: true})
        const {result} = renderHook(()=> useUiStore(),{
            wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        const {closeDateModal} = result.current;

        act( () =>closeDateModal() );

        console.log(result);
        expect(result.current.isDateModalOpen).toBe(false);  
    });

});

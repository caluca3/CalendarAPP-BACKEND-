import { authSlice, clearLogout, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState, notAuthenticatedState } from "../../fixtures/authStates"
import { testUserCredenttial } from "../../fixtures/testUser";

describe('Pruebas en el authSlice', () => {
    
    test('Debe regresar el estado inicial', () => { 

        expect(authSlice.getInitialState()).toEqual(initialState);

    });
    test('Debe poder hacer Login', () => {

        const state = authSlice.reducer(initialState,onLogin(testUserCredenttial));
        // console.log(state)
        expect(state).toEqual({
            status: 'authenticated',
            user:testUserCredenttial,
            errorMessage: undefined
          });
    });
    test('Debe de realizar el logout', () => {
        const errorMessage = 'Credencial no valida';
        const state = authSlice.reducer(authenticatedState,onLogout(errorMessage));
        expect(state).toEqual({
            status: 'not-authenticated', // 'authenticated','not-authenticated',
            user: {},
            errorMessage: errorMessage,
        });
     })
     test('Debe limpiar el mensaje de error', () => { 
        const errorMessage = 'Credencial no valida';
        let state = authSlice.reducer(authenticatedState,onLogout(errorMessage));
        const newState = authSlice.reducer(state,clearLogout());
        expect(newState.errorMessage).toBe(undefined);

      })
 })
import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { da } from "date-fns/locale"
import { Provider } from "react-redux"
import { calendarApi } from "../../src/apis"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authSlice } from "../../src/store/auth/authSlice"
import { authenticatedState, initialState, notAuthenticatedState } from "../fixtures/authStates"
import { testUserCredentials } from "../fixtures/testUser"


const getMockStore = (initialState)=>{
    return configureStore({
        reducer:{
            auth: authSlice.reducer
        },
        preloadedState:{
            auth:{...initialState}
        }
    })
}

describe('Pruebas en useAuthStore', () => { 
    
    beforeEach(()=>localStorage.clear());

    test('Debe regresar los valores por defecto', () => {
        const mockStore = getMockStore({...initialState})
        const {result} = renderHook(()=> useAuthStore(),{
            wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
        });
        //console.log(result)
        expect(result.current).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken:expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister:expect.any(Function),
        });
     })
     test('Pruebas en startLogin', async () => { 
        const mockStore = getMockStore({...authenticatedState})
        const {result} = renderHook(()=> useAuthStore(),{
            wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async()=>{
            await result.current.startLogin(testUserCredentials)
        })
        const {errorMessage,user,status} = result.current
        expect({errorMessage,user,status}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'test', uid: '636d042274f8d8ee600a9b5f' }
            })
           expect(localStorage.getItem('token')).toEqual(expect.any(String));
           expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
     });

     test('startLogin debe fallar', async () => { 
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(()=> useAuthStore(),{
            wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async()=>{
            await result.current.startLogin({email:'213213@g', password: '21111165'})
        })
        const {errorMessage,user,status} = result.current
        expect({errorMessage,user,status}).toEqual( {
            errorMessage: 'Credenciales incorrectas',
            user: {},
            status: 'not-authenticated'
          })
          await waitFor(
            ()=>expect(result.current.errorMessage).toBe(undefined)
          )
      });

      test('startRegister debe registrar usuario', async () => {
          const mockStore = getMockStore({...notAuthenticatedState})      
          const {result} = renderHook(()=> useAuthStore(),{
              wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
            });

        const spy = jest.spyOn(calendarApi,'post').mockReturnValue({
            data:{
                ok:'true',
                uid :'12346897',
                name:'algun-name',
                token:'algun-token',
            }
        })
            
        await act(async()=>{
            await result.current.startRegister({email:'213213@gle', password: '21111165',name:'test User2'})
        })
        const {errorMessage,user,status} = result.current
        expect({errorMessage,user,status}).toEqual( {                              
            errorMessage: undefined,
            user: { name: 'algun-name', uid: '12346897' },
            status: 'authenticated'
          });

          spy.mockRestore();

        });

      test('startRegister debe fallar', async () => { 
        const mockStore = getMockStore({...notAuthenticatedState})      
          const {result} = renderHook(()=> useAuthStore(),{
              wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
            });

            await act(async()=>{
                await result.current.startRegister(testUserCredentials)
            })
            const {errorMessage,user,status} = result.current;
            //console.log({errorMessage,user,status});
            expect({errorMessage,user,status}).toEqual({
                errorMessage: 'Corrreo existente',
                user: {},
                status: 'not-authenticated'
              })
            await waitFor(
                ()=>expect(result.current.errorMessage).toBe(undefined)
              )
        });
        
        test('checkAthToken debe fallar rsi no hay token', async() => { 
            const mockStore = getMockStore({...initialState})      
            const {result} = renderHook(()=> useAuthStore(),{
              wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
            });

            await act(async()=>{
                await result.current.checkAuthToken()
            })
            const {errorMessage,user,status} = result.current;
            expect({errorMessage,user,status}).toEqual({ 
                errorMessage: undefined, 
                user: {}, 
                status: 'not-authenticated' });
         });
        
        test('checkAthToken debe traer token', async () => {

            const {data} = await calendarApi.post('/auth',testUserCredentials);
            localStorage.setItem('token', data.token);
            //console.log({data});

            const mockStore = getMockStore({...initialState})      
            const {result} = renderHook(()=> useAuthStore(),{
              wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
            });

            await act(async()=>{
                await result.current.checkAuthToken()
            })
            const {errorMessage,user,status} = result.current;
            console.log({errorMessage,user,status});
            expect({errorMessage,user,status}).toEqual({
                  errorMessage: undefined,
                  user: { name: 'test', uid: '636d042274f8d8ee600a9b5f' },
                  status: 'authenticated'
                })
               
        })

        test('startLogout debe cambiar status', async () => { 

            const mockStore = getMockStore({...authenticatedState})      
            const {result} = renderHook(()=> useAuthStore(),{
              wrapper:({children}) => <Provider store={mockStore}>{children}</Provider>
            });

            await act(async()=>{
                result.current.startLogout()
            })
            const {errorMessage,user,status} = result.current;
            expect({errorMessage,user,status}).toEqual( {
                errorMessage: undefined,
                user: {},
                status: 'not-authenticated' })
         });
})
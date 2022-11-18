import { fireEvent, render, screen }    from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import { CalendarPage } from "../../src/calendar";
import { useAuthStore } from "../../src/hooks";
import { AppRouter } from "../../src/router/AppRouter";


jest.mock("../../src/hooks/useAuthStore");

jest.mock("../../src/calendar",()=>({
    CalendarPage: ()=> <h1>CalendarPage</h1>
})) 

describe('Pruebas en <AppRouter/>', () => { 

    const mockCheckAuthToken = jest.fn();
    beforeEach(()=> jest.clearAllMocks());

    test('debe mostrar la pantalla de carga y llamar checkAuthtoken', async() => {
        useAuthStore.mockReturnValue({
            status:'checking',
            checkAuthToken:mockCheckAuthToken
            })
        await render(<AppRouter/>);
        
        expect(screen.getByText('Cargando.....')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();
    });
    test('debe mostrar la pantalla de login', () => {
        useAuthStore.mockReturnValue({
            status:'not-authenticated',
            checkAuthToken:mockCheckAuthToken
            })

         const {container} =render(
            <MemoryRouter>
                <AppRouter/>
            </MemoryRouter>);
        
        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect(container).toMatchSnapshot();
    });
    test('debe mostrar la pantalla de CalendarPage', () => {
        useAuthStore.mockReturnValue({
            status:'authenticated',
            checkAuthToken:mockCheckAuthToken
            })
        render(<MemoryRouter>
                 <AppRouter/>
              </MemoryRouter>);
        screen.debug();
        expect(screen.getByText(CalendarPage)).toBeTruthy();
        
    })
})
import { fireEvent, render, screen }    from "@testing-library/react"
import { FabDelete } from "../../../src/calendar/components/FabDelete"
import { useCalendarStore } from "../../../src/hooks/useCalendarStore";

jest.mock("../../../src/hooks/useCalendarStore")

describe('Pruebas en <FabDelete/>', () => {

    const mockStartDeletingEvent = jest.fn()
    beforeEach(()=> jest.clearAllMocks())

    test('Debe mostar el componente corectamente', () => { 
       
        useCalendarStore.mockReturnValue({
            hasEventSelected:false
        })

        render(<FabDelete/>);

        const btn = screen.getByLabelText('btn-delete');

        expect(btn.classList).toContain('btn');
        expect(btn.classList).toContain("btn-danger");
        expect(btn.classList).toContain('fab-delete');
        expect(btn.style.display).toBe('none');

    });
    test('Debe mostar el boton si hay evento activo', () => { 
       
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
        })
        render(<FabDelete/>);
        const btn = screen.getByLabelText('btn-delete');

        expect(btn.style.display).toBe('');
    });
    test('Debe llamar startDeletingEvent', () => { 
       
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            startDeletingEvent:mockStartDeletingEvent
        })
        render(<FabDelete/>);
        const btn = screen.getByLabelText('btn-delete');
        fireEvent.click(btn);

        expect(mockStartDeletingEvent).toHaveBeenCalled();
    });

 });
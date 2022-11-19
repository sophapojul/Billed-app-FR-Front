import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import BillsUI from '../views/BillsUI';
import Bills from '../containers/Bills';
import { bills } from '../fixtures/bills';
import { ROUTES, ROUTES_PATH } from '../constants/routes';
import { localStorageMock } from '../__mocks__/localStorage';
import router from '../app/Router';

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'a@a',
      }));
    });
    test('Then bill icon in vertical layout should be highlighted', async () => {
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await screen.findByTestId('icon-window');
      const windowIcon = screen.getByTestId('icon-window');
      expect(windowIcon).toHaveClass('active-icon');
    });
    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
      const antiChrono = (a, b) => ((a < b) ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    it('should open modal on click on eye icon', async () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const bill = new Bills({
        document,
        onNavigate: null,
        store: null,
        localStorage: window.localStorage,
      });
      const iconEye = screen.getAllByTestId('icon-eye')[0];
      const handleClickIconEye = jest.spyOn(bill, 'handleClickIconEye');
      iconEye.addEventListener('click', () => {
        bill.handleClickIconEye(iconEye);
      });
      userEvent.click(iconEye);
      const modale = screen.getByText('Justificatif');
      expect(modale).toBeInTheDocument();
      expect(handleClickIconEye).toHaveBeenCalledTimes(2);
    });
    it('should open new page on click on button newBill', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const bill = new Bills({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        },
        store: null,
        localStorage: window.localStorage,
      });
      const handleClickNewBill = jest.fn(bill.handleClickNewBill);
      const newBillBtn = screen.getByTestId('btn-new-bill');
      newBillBtn.addEventListener('click', handleClickNewBill);
      // userEvent.click(newBillBtn);
      fireEvent.click(newBillBtn);
      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.getByText(/Envoyer une note de frais/)).toBeInTheDocument();
    });
  });
});

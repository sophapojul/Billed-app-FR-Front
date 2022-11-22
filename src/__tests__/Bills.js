import { fireEvent, screen } from '@testing-library/dom';
import BillsUI from '../views/BillsUI';
import { bills } from '../fixtures/bills';
import { ROUTES, ROUTES_PATH } from '../constants/routes';
import { localStorageMock } from '../__mocks__/localStorage';
import router from '../app/Router';
import Bills from '../containers/Bills';
import mockStore from '../__mocks__/store';

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }));
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
    it('should open modal on click on eye icon', () => {
      const bill = new Bills({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        },
        store: mockStore,
        localStorage: window.localStorage,
      });
      const iconEyes = screen.getAllByTestId('icon-eye');
      const handleClickIconEye = jest.fn(bill.handleClickIconEye);
      $.fn.modal = jest.fn();
      for (let i = 0; i < iconEyes.length; i++) {
        const iconEye = iconEyes[i];
        handleClickIconEye(iconEye);
        fireEvent.click(iconEye);
      }
      expect(handleClickIconEye).toHaveBeenCalledTimes(iconEyes.length);
      expect($.fn.modal).toHaveBeenCalled();
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
      fireEvent.click(newBillBtn);
      expect(handleClickNewBill).toHaveBeenCalled();
    });
  });
});

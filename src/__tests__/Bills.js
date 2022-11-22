import { fireEvent, screen } from '@testing-library/dom';
import BillsUI from '../views/BillsUI';
import { bills } from '../fixtures/bills';
import { ROUTES, ROUTES_PATH } from '../constants/routes';
import { localStorageMock } from '../__mocks__/localStorage';
import Bills from '../containers/Bills';
import mockStore from '../__mocks__/store'; // import mockStore before router
import router from '../app/Router';

jest.mock('../app/Store', () => mockStore);

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

// test d'intégation GET
describe('Given I am a user connected as Employee', () => {
  beforeEach(() => {
    jest.spyOn(mockStore, 'bills');
    Object.defineProperty(
      window,
      'localStorage',
      { value: localStorageMock },
    );
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: 'a@a',
    }));
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
    router();
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  describe('When I navigate to Bills Page', () => {
    test('fetches bills from mock API GET', async () => {
      window.onNavigate(ROUTES_PATH.Bills);
      await screen.findByText('Mes notes de frais');
      document.body.innerHTML = BillsUI({ data: bills });
      const tbody = await screen.findByTestId('tbody');
      expect(tbody.children.length).toBe(4);
    });
    describe('When an error occurs on API', () => {
      test('fetches bills from an API and fails with 404 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => ({
          list: () => Promise.reject(new Error('Erreur 404')),
        }));
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.findByText(/Erreur 404/i);
        expect(message).toBeInTheDocument();
      });
      test('fetches messages from an API and fails with 500 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => ({
          list: () => Promise.reject(new Error('Erreur 500')),
        }));
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.findByText(/Erreur 500/i);
        expect(message).toBeInTheDocument();
      });
    });
  });
});

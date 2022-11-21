/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import NewBillUI from '../views/NewBillUI';
import NewBill from '../containers/NewBill';
import { localStorageMock } from '../__mocks__/localStorage';
import storeMock from '../__mocks__/store';
import { ROUTES } from '../constants/routes';

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'a@a',
      }));
      document.body.innerHTML = NewBillUI();
    });
    test('change file handler should alert if the file format is not supported', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: storeMock,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const blob = new Blob([''], { type: 'text/html' });
      const file = new File([blob], 'index.html', { type: 'text/html' });
      const input = screen.getByTestId('file');
      input.addEventListener('change', handleChangeFile);
      fireEvent.change(input, { target: { files: [file] } });
      userEvent.upload(input, file);
      expect(handleChangeFile).toHaveBeenCalledTimes(2);
      expect(spyAlert).toHaveBeenCalledWith('Format de fichier non supporté, le fichier doit être au format jpeg, jpg ou png');
      spyAlert.mockReset();
      spyAlert.mockRestore();
    });
    test('change file handler should display the file name if the file format is supported', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: storeMock,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const blob = new Blob([''], { type: 'image/png' });
      const file = new File([blob], 'test.png', { type: 'image/png' });
      const input = screen.getByTestId('file');
      input.addEventListener('change', handleChangeFile);
      fireEvent.change(input, { target: { files: [file] } });
      userEvent.upload(input, file);
      expect(handleChangeFile).toHaveBeenCalledTimes(2);
    });
    it('should add new bill when I fill correctly fields and I submit', async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: storeMock,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const form = screen.getByTestId('form-new-bill');
      form.addEventListener('submit', handleSubmit);
      const uint8 = new Uint8Array([0xff, 0xd8, 0xff]); // JPEG signature
      const file = new File([uint8], 'test.jpeg', { type: 'image/jpeg' });
      const input = screen.getByTestId('file');
      input.addEventListener('change', newBill.handleChangeFile);
      fireEvent.change(input, {
        target: {
          files: [file],
        },
      });
      fireEvent.change(screen.getByTestId('expense-name'), {
        target: { value: 'test' },
      });
      fireEvent.change(screen.getByTestId('datepicker'), {
        target: { value: '2021-03-01' },
      });
      fireEvent.change(screen.getByTestId('amount'), {
        target: { value: '100' },
      });
      fireEvent.change(screen.getByTestId('vat'), {
        target: { value: '20' },
      });
      fireEvent.change(screen.getByTestId('pct'), {
        target: { value: '20' },
      });
      fireEvent.change(screen.getByTestId('commentary'), {
        target: { value: 'test' },
      });
      newBill.fileName = 'test.jpeg';
      newBill.fileUrl = 'http://localhost:3000/test.jpeg';
      const submitButton = screen.getByText('Envoyer');
      submitButton.addEventListener('click', handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toBeCalledTimes(1);
    });
  });
});

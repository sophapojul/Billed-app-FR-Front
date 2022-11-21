/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import storeMock from '../__mocks__/store.js';
import { ROUTES } from '../constants/routes.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'a@a',
      }));
      const html = NewBillUI();
      document.body.innerHTML = html;
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
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const blob = new Blob([''], { type: 'text/html' });
      const file = new File([blob], 'index.html', { type: 'text/html' });
      const input = screen.getByTestId('file');
      input.addEventListener('change', handleChangeFile);
      fireEvent.change(input, { target: { files: [file] } });
      userEvent.upload(input, file);
      expect(handleChangeFile).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Format de fichier non supporté, le fichier doit être au format jpeg, jpg ou png');
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
      expect(handleChangeFile).toHaveBeenCalled();
    });
  });
});

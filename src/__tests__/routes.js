/**
 * @jest-environment jsdom
 */

import { screen } from '@testing-library/dom';
import { ROUTES, ROUTES_PATH } from '../constants/routes';

const data = [];
const loading = false;
const error = null;

describe('Given I am connected and I am on some page of the app', () => {
  describe('When I navigate to Login page', () => {
    test(('Then, it should render Login page'), () => {
      const pathname = ROUTES_PATH.Login;
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      expect(screen.getByText('Administration')).toBeInTheDocument();
    });
  });
  describe('When I navigate to Bills page', () => {
    test(('Then, it should render Bills page'), () => {
      const pathname = ROUTES_PATH.Bills;
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      expect(screen.getByText('Mes notes de frais')).toBeInTheDocument();
    });
  });
  describe('When I navigate to NewBill page', () => {
    test(('Then, it should render NewBill page'), () => {
      const pathname = ROUTES_PATH.NewBill;
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      expect(screen.getByText('Envoyer une note de frais')).toBeInTheDocument();
    });
  });
  describe('When I navigate to Dashboard', () => {
    test(('Then, it should render Dashboard page'), () => {
      const pathname = ROUTES_PATH.Dashboard;
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      expect(screen.getByText('Validations')).toBeInTheDocument();
    });
  });
  describe('When I navigate to anywhere else other than Login, Bills, NewBill, Dashboard', () => {
    test(('Then, it should render Loginpage'), () => {
      const pathname = '/anywhere-else';
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      expect(screen.getByText('Administration')).toBeInTheDocument();
    });
  });
});

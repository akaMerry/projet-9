/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import $ from "jquery";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
  });

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      // ajout
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    // ajout
    describe("When I click on New eye icon", () => {
      test("Then a modal shoud display some file", () => {
        document.body.innerHTML = BillsUI({ data: bills });

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const allBills = new Bills({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });

        // jQuery
        $.fn.modal = jest.fn();

        const eyeIcons = screen.getAllByTestId("icon-eye");
        const eyeIcon = eyeIcons[0];

        const handleClickIconEye = jest.fn(() =>
          allBills.handleClickIconEye(eyeIcon)
        );

        eyeIcon.addEventListener("click", handleClickIconEye);

        fireEvent.click(eyeIcon);

        expect(handleClickIconEye).toHaveBeenCalled();

        expect($.fn.modal).toHaveBeenCalledWith("show");
      });
    });

    describe("When I click on New bill button", () => {
      test("Then it should render New bill page", () => {
        document.body.innerHTML = BillsUI({ data: bills });

        const onNavigate = jest.fn((pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        });

        const allBills = new Bills({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });

        const handleNewBill = jest.fn(allBills.handleClickNewBill);

        const newBillBtn = screen.getByTestId("btn-new-bill");
        newBillBtn.addEventListener("click", handleNewBill);
        fireEvent.click(newBillBtn);

        expect(handleNewBill).toHaveBeenCalled();
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.NewBill);
      });
    });
  });
});

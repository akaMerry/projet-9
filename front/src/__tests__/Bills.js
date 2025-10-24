/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent, toBeOneOf } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router";
import { formatDate, formatStatus } from "../app/format.js";
import $ from "jquery";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  // ajout
  describe("When I am on Bills Page", () => {
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
    describe("When bills are retreived", () => {
      beforeEach(() => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );
      });

      test("Bills should return formatted", async () => {
        document.body.innerHTML = BillsUI({ data: bills });

        const onNavigate = jest.fn((pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        });

        const allBills = new Bills({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const fetchBills = await allBills.getBills();

        expect(fetchBills.length).toBe(4);

        fetchBills.forEach((bill) => {
          expect(["En attente", "Accepté", "Refusé"]).toContain(bill.status);
          expect(bill.date).toContain(".");
        });
      });

      test("Function should handle corrupted data and still return bills", async () => {
        const corruptedData = [
          { id: "bad", date: "not-a-date", status: "pending" },
        ];

        const formatSpy = jest
          .spyOn(require("../app/format.js"), "formatDate")
          .mockImplementationOnce(() => {
            throw new Error("Invalid date");
          });

        const corruptedStore = {
          bills: () => ({
            list: () => Promise.resolve(corruptedData),
          }),
        };

        document.body.innerHTML = BillsUI({ data: bills });

        const onNavigate = jest.fn((pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        });

        const allBills = new Bills({
          document,
          onNavigate,
          store: corruptedStore,
          localStorage: window.localStorage,
        });

        const result = await allBills.getBills();

        expect(result[0].date).toBe("not-a-date");
        expect(result[0].status).toBe(formatStatus("pending"));
        expect(formatSpy).toHaveBeenCalled();

        formatSpy.mockRestore();
      });

      test("Function should return undefined when store is not provided", () => {
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

        const result = allBills.getBills();
        expect(result).toBeUndefined();
      });
    });
  });
});

describe("When I navigate to Bills page", () => {
  test("Fetches bills from mock API GET", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "a@a" })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.Bills);
    await waitFor(() => screen.getByText("Mes notes de frais"));
  });
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "a@a",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });
    test("Fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("Fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });

      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});

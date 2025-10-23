/**
 * @jest-environment jsdom
 */

import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";

// ajout
jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({ email: "employee@test.tld" })
    );
  });

  describe("When I upload a file with invalid format", () => {
    test("Then an alert should appear and the input should be cleared", () => {
      document.body.innerHTML = NewBillUI();

      window.alert = jest.fn();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const fileInput = screen.getByTestId("file");
      const badFile = new File(["pdf"], "file.pdf", {
        type: "application/pdf",
      });

      fireEvent.change(fileInput, { target: { files: [badFile] } });

      expect(window.alert).toHaveBeenCalledWith(
        "Seuls les fichiers .jpg, .jpeg ou .png sont autorisés."
      );
      expect(fileInput.value).toBe("");
    });
  });

  describe("When I upload a file with valid format", () => {
    test("Then file data should be set", async () => {
      document.body.innerHTML = NewBillUI();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const fileInput = screen.getByTestId("file");

      const validFile = new File(["image"], "proof.png", { type: "image/png" });

      const createSpy = jest.spyOn(mockStore.bills(), "create");

      fireEvent.change(fileInput, { target: { files: [validFile] } });

      await waitFor(() => expect(createSpy).toHaveBeenCalled());

      expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg");
      expect(newBill.fileName).toBe("proof.png");
      expect(newBill.billId).toBe("1234");
    });
  });

  describe("When I submit a valid new bill", () => {
    test("Then it should update bill list and navigate to Bills page", async () => {
      const onNavigate = jest.fn((pathname) => {
        document.body.innerHTML = ROUTES({ pathname, data: [] });
      });

      document.body.innerHTML = NewBillUI();

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      fireEvent.change(screen.getByTestId("expense-type"), {
        target: { value: "Transports" },
      });
      expect(screen.getByTestId("expense-type").value).toBe("Transports");

      fireEvent.change(screen.getByTestId("expense-name"), {
        target: { value: "Bus ticket" },
      });
      expect(screen.getByTestId("expense-name").value).toBe("Bus ticket");

      fireEvent.change(screen.getByTestId("datepicker"), {
        target: { value: "2025-01-01" },
      });
      expect(screen.getByTestId("datepicker").value).toBe("2025-01-01");

      fireEvent.change(screen.getByTestId("amount"), {
        target: { value: "15" },
      });
      expect(screen.getByTestId("amount").value).toBe("15");

      fireEvent.change(screen.getByTestId("vat"), {
        target: { value: "10" },
      });
      expect(screen.getByTestId("vat").value).toBe("10");

      fireEvent.change(screen.getByTestId("pct"), {
        target: { value: "20" },
      });
      expect(screen.getByTestId("pct").value).toBe("20");

      fireEvent.change(screen.getByTestId("commentary"), {
        target: { value: "Test Bill" },
      });
      expect(screen.getByTestId("commentary").value).toBe("Test Bill");

      newBill.fileUrl = "https://localhost:3456/images/test.jpg";
      newBill.fileName = "test.jpg";

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

      form.addEventListener("submit", handleSubmit);

      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();

      await waitFor(() =>
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"])
      );
    });

    test("Then it should render Bills page", () => {
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    });
  });
});

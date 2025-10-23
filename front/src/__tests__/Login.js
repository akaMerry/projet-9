/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { fireEvent, screen } from "@testing-library/dom";
import { localStorageMock } from "../__mocks__/localStorage.js";

describe("Given that I am a user on login page", () => {
  describe("When I do not fill fields and I click on employee button Login In", () => {
    test("Then It should render Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("employee-email-input");
      expect(inputEmailUser.value).toBe("");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      expect(inputPasswordUser.value).toBe("");

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
    test("Then it should render Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  // describe("When I do fill fields in correct format and I click on employee button Login In", () => {
  //   test("Then I should be identified as an Employee in app", async () => {
  //     document.body.innerHTML = LoginUI();

  //     const inputData = {
  //       email: "employee@test.com",
  //       password: "azerty",
  //     };

  //     Object.defineProperty(window, "localStorage", {
  //       value: localStorageMock,
  //     });
  //     window.localStorage.setItem(
  //       "user",
  //       JSON.stringify({
  //         type: "Employee",
  //         email: inputData.email,
  //         password: inputData.password,
  //         status: "connected",
  //       })
  //     );

  //     const onNavigate = jest.fn((pathname) => {
  //       document.body.innerHTML = ROUTES({ pathname });
  //     });

  //     let PREVIOUS_LOCATION = "";

  //     const store = null;

  //     const login = new Login({
  //       document,
  //       localStorage: window.localStorage,
  //       onNavigate,
  //       PREVIOUS_LOCATION,
  //       store,
  //     });

  //     const inputEmailUser = screen.getByTestId("employee-email-input");
  //     fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
  //     expect(inputEmailUser.value).toBe(inputData.email);

  //     const inputPasswordUser = screen.getByTestId("employee-password-input");
  //     fireEvent.change(inputPasswordUser, {
  //       target: { value: inputData.password },
  //     });
  //     expect(inputPasswordUser.value).toBe(inputData.password);

  //     const form = screen.getByTestId("form-employee");

  //     const handleSubmit = jest.fn((e) => login.handleSubmitEmployee(e));

  //     login.login = jest.fn().mockResolvedValue({});

  //     form.addEventListener("submit", handleSubmit);

  //     fireEvent.submit(form);

  //     expect(handleSubmit).toHaveBeenCalled();
  //     expect(window.localStorage.setItem).toHaveBeenCalled();
  //     expect(window.localStorage.setItem).toHaveBeenCalledWith(
  //       "user",
  //       JSON.stringify({
  //         type: "Employee",
  //         email: inputData.email,
  //         password: inputData.password,
  //         status: "connected",
  //       })
  //     );
  //     expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.Bills);
  //   });

  //   test("It should render Bills page", () => {
  //     expect(screen.getByText("Mes notes de frais")).toBeInTheDocument();
  //   });
  // });
});

describe("Given that I am a user on login page", () => {
  describe("When I do not fill fields and I click on admin button Login In", () => {
    test("Then It should render Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("admin-email-input");
      expect(inputEmailUser.value).toBe("");

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      expect(inputPasswordUser.value).toBe("");

      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
    test("Then It should render Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  // describe("When I do fill fields in correct format and I click on admin button Login In", () => {
  //   test("Then I should be identified as an HR admin in app", () => {
  //     document.body.innerHTML = LoginUI();
  //     const inputData = {
  //       type: "Admin",
  //       email: "johndoe@email.com",
  //       password: "azerty",
  //       status: "connected",
  //     };

  //     const inputEmailUser = screen.getByTestId("admin-email-input");
  //     fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
  //     expect(inputEmailUser.value).toBe(inputData.email);

  //     const inputPasswordUser = screen.getByTestId("admin-password-input");
  //     fireEvent.change(inputPasswordUser, {
  //       target: { value: inputData.password },
  //     });
  //     expect(inputPasswordUser.value).toBe(inputData.password);

  //     const form = screen.getByTestId("form-admin");

  //     Object.defineProperty(window, "localStorage", {
  //       value: {
  //         getItem: jest.fn(),
  //         setItem: jest.fn(),
  //       },
  //       writable: true,
  //     });

  //     const onNavigate = jest.fn((pathname) => {
  //       document.body.innerHTML = ROUTES({ pathname });
  //     });
  //     let PREVIOUS_LOCATION = "";

  //     const store = jest.fn();

  //     const login = new Login({
  //       document,
  //       localStorage: window.localStorage,
  //       onNavigate,
  //       PREVIOUS_LOCATION,
  //       store,
  //     });

  //     const handleSubmit = jest.fn(login.handleSubmitAdmin);
  //     login.login = jest.fn().mockResolvedValue({});
  //     form.addEventListener("submit", handleSubmit);
  //     fireEvent.submit(form);
  //     expect(handleSubmit).toHaveBeenCalled();
  //     expect(window.localStorage.setItem).toHaveBeenCalled();
  //     expect(window.localStorage.setItem).toHaveBeenCalledWith(
  //       "user",
  //       JSON.stringify({
  //         type: "Admin",
  //         email: inputData.email,
  //         password: inputData.password,
  //         status: "connected",
  //       })
  //     );
  //     expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.Dashboard);
  //   });

  //   test("It should render HR dashboard page", () => {
  //     expect(screen.getByText("Validations")).toBeInTheDocument();
  //   });
  // });
});

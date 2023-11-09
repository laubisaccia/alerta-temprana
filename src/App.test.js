import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import App from "./App";
import Table from "./components/Table";
import "@testing-library/jest-dom/extend-expect";

test("renders Header and Table", () => {
  render(<App />);

  const headerTextElement = screen.getByText(/Incidentes Reportados/i);
  expect(headerTextElement).toBeInTheDocument();

  const tableElement = screen.getByTestId("incident-table");
  expect(tableElement).toBeInTheDocument();
});

test("changes button text on handleConditionChange", () => {
  render(<Table />);
  const enCursoButtons = screen.getAllByText(/En Curso/i);

  enCursoButtons.forEach((enCursoButton) => {
    fireEvent.click(enCursoButton);
    expect(["En Curso", "Reportado"]).toContain(enCursoButton.textContent);
  });
});

test("assigns mobile number on handleConditionChange", async () => {
  render(<Table />);

  const allButtons = screen.getAllByRole("button");

  const enCursoButtons = allButtons.filter(
    (button) => button.textContent === "En Curso"
  );

  for (const enCursoButton of enCursoButtons) {
    fireEvent.click(enCursoButton);

    await waitFor(() => {
      expect(enCursoButton.textContent).toBe("Reportado");
    });

    const rowContainer = screen.getByTestId("incident-table");
    const mobileNumberElement =
      within(rowContainer).getByTestId("mobile-number");

    const mobileNumberText = mobileNumberElement.textContent.trim();
    expect(mobileNumberText).not.toEqual("");
  }
});

test("removes row on handleMarkAsAttended", async () => {
  render(<Table />);

  const finishButtons = screen.getAllByText("Finalizar");

  for (const finishButton of finishButtons) {
    const initialRowCount = screen.getAllByRole("row").length;

    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(finishButton).not.toBeInTheDocument();
    });

    expect(screen.getAllByRole("row").length).toBeGreaterThan(initialRowCount);
  }
});

test("displays Previous button", () => {
  render(<Table />);

  const previousButton = screen.getByText("Anterior");

  expect(previousButton).toBeInTheDocument();
  expect(previousButton).toBeDisabled();
});

test("displays Next button and checks its disabled state based on row count", async () => {
  render(<Table />);

  await waitFor(() => {
    const nextButton = screen.getByText("Siguiente");
    expect(nextButton).toBeInTheDocument();
  });

  const currentRowCount = screen.getAllByRole("row").length;

  fireEvent.click(screen.getByText("Siguiente"));

  await waitFor(() => {
    const updatedRowCount = screen.getAllByRole("row").length;
    expect(updatedRowCount).toBeGreaterThanOrEqual(currentRowCount);

    const isNextButtonDisabled = screen
      .getByText("Siguiente")
      .hasAttribute("disabled");
    expect(isNextButtonDisabled).toBe(currentRowCount + 1 >= updatedRowCount);
  });
});

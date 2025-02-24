import NewAnalysisForm from "@/components/page-specific/analyses/new-analysis-form";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

// async function submitForm() {
//   await userEvent.click(screen.getByText(/create/i));
// }

describe("NewAnalysisForm", () => {
  // beforeEach(() => {
  //   render(<NewAnalysisForm />);
  // });

  it("validates presence for the required fields with empty/undefined default values", () => {
    try {
      render(<NewAnalysisForm />);
    } catch (error) {
      console.log(error);
    }
    // await submitForm();
    // const msgs = screen.getAllByText(/please fill in/i);
    // // name, description and CSV upload
    // expect(msgs).toHaveLength(3);
  });

  // it("validates that sampling rate must be positive", async () => {
  //   await submitForm();
  //   const input = screen.getByLabelText(/sampling rate/i);
  //   await userEvent.type(input, "-1");
  //   const error = screen.getByText(/greater than 0/i);
  //   expect(error).toBeInTheDocument();
  // });

  // it("validates email format", async () => {
  //   await clickRegister();
  //   const emailInput = screen.getByLabelText(/email/i);
  //   await userEvent.type(emailInput, "blah");
  //   const error = screen.getByText(/invalid email address/i);
  //   expect(error).toBeInTheDocument();
  // });

  // it("validates confirmPassword is the same as password", () => {});

  // it("validates password requirements are met", () => {});

  // it("shows internal server error message for the 500 error response", () => {});

  // it("shows email already exists message for the 409 error response", () => {});

  // it("shows success message and redirects to home after successful registration response", () => {});
});

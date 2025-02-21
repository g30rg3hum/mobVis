import RegisterForm from "@/components/page-specific/register/register-form";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

async function clickRegister() {
  await userEvent.click(screen.getByText(/register/i));
}

describe("RegisterForm", () => {
  beforeEach(() => {
    render(<RegisterForm />);
  });

  it("validates presence for all fields", async () => {
    await clickRegister();
    const msgs = screen.getAllByText(/please fill in/i);
    expect(msgs).toHaveLength(3);
  });

  it("validates email format", async () => {
    await clickRegister();
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "blah");
    const error = screen.getByText(/invalid email address/i);
    expect(error).toBeInTheDocument();
  });

  // it("validates confirmPassword is the same as password", () => {});

  // it("validates password requirements are met", () => {});

  // it("shows internal server error message for the 500 error response", () => {});

  // it("shows email already exists message for the 409 error response", () => {});

  // it("shows success message and redirects to home after successful registration response", () => {});
});

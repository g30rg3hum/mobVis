import NewAnalysisForm, {
  FormValues as NewAnalysisFormValues,
} from "@/components/page-specific/analyses/new-analysis-form";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

async function submitForm() {
  await userEvent.click(screen.getByText(/create/i));
}

async function fillForm(values: NewAnalysisFormValues) {
  const nameInput = screen.getByLabelText(/name/i);
  await userEvent.type(nameInput, values.name);

  const descriptionInput = screen.getByLabelText(/description/i);
  await userEvent.type(descriptionInput, values.description);

  const samplingRateInput = screen.getByLabelText(/sampling rate/i);
  await userEvent.type(samplingRateInput, values.samplingRate.toString());

  const sensorHeightInput = screen.getByLabelText(/sensor height/i);
  await userEvent.type(sensorHeightInput, values.sensorHeight.toString());

  const patientHeightInput = screen.getByLabelText(/patient height/i);
  await userEvent.type(patientHeightInput, values.patientHeight.toString());

  if (values.public) {
    const publicCheckbox = screen.getByLabelText(/public/i);
    await userEvent.click(publicCheckbox);
  }

  const csvInput = screen.getByLabelText(/csv/i);
  await userEvent.upload(csvInput, values.csvFile);

  if (values.convertToMs) {
    const convertCheckbox = screen.getByLabelText(/convert/i);
    await userEvent.click(convertCheckbox);
  }
}

describe("NewAnalysisForm", () => {
  beforeEach(() => {
    render(<NewAnalysisForm />);
  });

  afterEach(() => {
    cleanup();
  });

  it("validates presence for the required fields with empty/undefined default values", async () => {
    await submitForm();
    const msgs = screen.getAllByText(/please fill in/i);
    // name, description and CSV upload
    expect(msgs).toHaveLength(3);
  });

  it("validates that sampling rate and sensor and patient height must be positive", async () => {
    const samplingRateInput = screen.getByLabelText(/sampling rate/i);
    await userEvent.type(samplingRateInput, "-1");

    const sensorHeightInput = screen.getByLabelText(/sensor height/i);
    await userEvent.type(sensorHeightInput, "-1");
    await submitForm();

    const patientHeightInput = screen.getByLabelText(/patient height/i);
    await userEvent.type(patientHeightInput, "-1");
    await submitForm();

    const errors = screen.getAllByText(/greater than 0/i);
    expect(errors).toHaveLength(3);
  });

  it("validates that sampling rate should be an integer", async () => {
    const samplingRateInput = screen.getByLabelText(/sampling rate/i);
    await userEvent.type(samplingRateInput, "4.3244");
    await submitForm();

    const error = screen.getByText(/please enter an integer/i);
    expect(error).toBeInTheDocument();
  });

  it("returns the correct submitted data", async () => {
    const values = {
      name: "Testing analysis",
      description: "This is the best analysis",
      samplingRate: 100,
      sensorHeight: 1.69,
      patientHeight: 1.8,
      setting: "laboratory",
      public: true,
      csvFile: new File([""], "test.csv", { type: "text/csv" }),
      convertToMs: false,
    };

    cleanup(); // get rid of the previous render.

    const submissionHandler = jest.fn();
    render(<NewAnalysisForm submissionHandler={submissionHandler} />);

    await fillForm(values);
    await submitForm();

    await waitFor(() => {
      expect(submissionHandler).toHaveBeenCalledTimes(1);
      expect(submissionHandler).toHaveBeenCalledWith(values);
    });
  });
});

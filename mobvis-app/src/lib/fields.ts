export const refinedParamNames = new Map([
  ["n_strides", "Number of strides"],
  ["duration_s", "Duration (s)"],
  ["cadence_spm", "Cadence (steps per minute)"],
  ["stride_length_m", "Stride length (m)"],
  ["walking_speed_mps", "Walking speed (m/s)"],
  ["stride_duration_s", "Stride duration (s)"],
  ["lr_label", "Left/Right label"],
]);

export const perWbDataFields = [
  "wb_id",
  "n_strides",
  "duration_s",
  "cadence_spm",
  "stride_length_m",
  "walking_speed_mps",
  "stride_duration_s",
];

export const perStrideDataFields = [
  "s_id",
  "lr_label",
  "stride_duration_s",
  "cadence_spm",
  "stride_length_m",
  "walking_speed_mps",
];

export const refinedInputFieldNames = new Map([
  ["name", "Name"],
  ["description", "Description"],
  ["samplingRate", "Sampling rate (Hz)"],
  ["sensorHeight", "Sensor height (m)"],
  ["patientHeight", "Patient height (m)"],
  ["setting", "Setting"],
  ["public", "Public"],
  ["csvFile", "CSV file"],
  ["convertToMs", "Convert to CSV to milliseconds"],
]);

export const inputFields = [
  "name",
  "description",
  "samplingRate",
  "sensorHeight",
  "patientHeight",
  "setting",
  "public",
  "csvFile",
  "convertToMs",
];

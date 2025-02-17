import pandas as pd
from pathlib import Path
from mobgap.data import LabExampleDataset
from mobgap.utils.conversions import to_body_frame
from mobgap.utils.interpolation import naive_sec_paras_to_regions
from mobgap.gait_sequences import GsdIluz
from mobgap.initial_contacts import IcdShinImproved

from dmo_extraction import load_csv, create_dataset_from_dataframe

# lab_example_data = LabExampleDataset(reference_system="INDIP")
# long_trial = lab_example_data.get_subset(
#   cohort="MS", participant_id="001", test="Test11", trial="Trial1"
# )
# print(long_trial.data_ss)
# imu_data = to_body_frame(long_trial.data_ss)
# print(imu_data)
# sampling_rate_hz = long_trial.sampling_rate_hz
# participant_metadata = long_trial.participant_metadata


if __name__ == "__main__":
  data = load_csv(Path("/Users/georgehum/Documents/universitynotes/year 3/dissertation/app/sample_data/MobD CVS_MS data example 2/imu_data.csv"), True)
  print("csv loaded")
  sensor_height_m = 1.13
  height_m = 1.77
  sampling_rate_hz = 100
  dataset = create_dataset_from_dataframe(data, sensor_height_m, height_m, "free_living", sampling_rate_hz)
  print("dataframe dataset created")

  # print(dataset)
  data = dataset[0]
  # print(data.data_ss)
  # print(data.participant_metadata)
  imu_data_body_frame = to_body_frame(data.data_ss)
  gsd = GsdIluz()
  gsd.detect(imu_data_body_frame, sampling_rate_hz=sampling_rate_hz)
  gait_sequences = gsd.gs_list_
  print(gait_sequences)

  first_gait_sequence = gait_sequences.iloc[0]
  print(first_gait_sequence)

  # imu data over the first gait sequence
  first_gait_sequence_data = imu_data_body_frame.iloc[first_gait_sequence.start : first_gait_sequence.end]

  icd = IcdShinImproved()
  icd.detect(first_gait_sequence_data, sampling_rate_hz=sampling_rate_hz)
  ic_list = icd.ic_list_
  print(ic_list)

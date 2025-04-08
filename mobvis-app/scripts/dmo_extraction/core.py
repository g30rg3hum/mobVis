from tempfile import SpooledTemporaryFile
from typing import Union

import pandas as pd
import numpy as np
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)
from pathlib import Path
from mobgap.consts import GRAV_MS2
from mobgap.data import GaitDatasetFromData
from mobgap.pipeline import MobilisedPipelineImpaired

required_csv_columns = ["samples", "acc_x", "acc_y", "acc_z", "gyr_x", "gyr_y", "gyr_z"]
cols_error_message = f"Please input a CSV file with all of these columns: {required_csv_columns}."
setting_error_message = "measurement_condition must be either 'laboratory' or 'free_living'"

def is_valid_measurement_condition(measurement_condition: str):
  if (measurement_condition not in ["laboratory", "free_living"]):
    raise ValueError(setting_error_message)

def load_csv(file: Union[Path,SpooledTemporaryFile], convertAccFromGToMs: bool = False) -> pd.DataFrame:
  data = pd.read_csv(file)

  # check if the csv data file has the right columns
  if (set(required_csv_columns).issubset(data.columns) == False):
    raise ValueError(cols_error_message)

  if (convertAccFromGToMs):
    data[["acc_x", "acc_y", "acc_z"]] = (data[["acc_x", "acc_y", "acc_z"]] * GRAV_MS2)

  return data

def create_dataset_from_dataframe(data: pd.DataFrame, sensor_height_m: float, height_m: float, measurement_condition: str, sampling_rate_hz = int) -> GaitDatasetFromData:
  is_valid_measurement_condition(measurement_condition)

  participant_metadata = {
    "cohort": "MS",
    "sensor_height_m": sensor_height_m,
    "height_m": height_m,
  }

  recording_metadata = {"measurement_condition": measurement_condition}

  # load the single recording into a valid GaitDataset form.
  loaded_data = {}
  participant_metadata_dataset = {}
  recording_metadata_dataset = {}

  loaded_data[("MS", "1")] = {
    "LowerBack": data
  }
  participant_metadata_dataset[("MS", "1")] = participant_metadata
  recording_metadata_dataset[("MS", "1")] = recording_metadata
  
  dataset = GaitDatasetFromData(
    loaded_data,
    sampling_rate_hz,
    participant_metadata_dataset,
    recording_metadata_dataset,
    index_cols = ["cohort", "id"],
  )

  return dataset

# CSV must have columns: samples, acc_x, acc_y_ acc_z, gyr_x_ gyr_y, gyr_z (according to the explained mobgap coord. system)
def extract_dmos(file: Union[Path,  SpooledTemporaryFile], sensor_height_m: float, height_m: float, measurement_condition: str, sampling_rate_hz: int, convertAccFromGToMs: bool = False) -> MobilisedPipelineImpaired:
  # check that measurement condition is one of two types
  is_valid_measurement_condition(measurement_condition)

  # load data, convert to m/s^2 if needed
  data = load_csv(file, convertAccFromGToMs)
  print("data loaded successfully!")

  # create dataset from dataframe
  dataset = create_dataset_from_dataframe(data, sensor_height_m, height_m, measurement_condition, sampling_rate_hz)  
  print ("gait dataset created successfully!")

  # run the single record through the pipeline
  record = dataset[0]
  pipeline = MobilisedPipelineImpaired().run(record)
  print("ran pipeline successfully!")
  
  return pipeline # pipeline object with attributes for gait parameters.

# calculate the max, min, average and variance
def calculate_aggregates(param_name: str, values: list) -> list:
  return [param_name, max(values), min(values), np.mean(values), np.var(values)]

def calculate_aggregate_parameters(per_wb_params: pd.DataFrame) -> pd.DataFrame:

  # for each parameter, calculating average, max, min, variance

  # get the lists of values for each parameter.
  n_strides_list = per_wb_params["n_strides"].tolist()
  duration_s_list = per_wb_params["duration_s"].tolist()
  cadence_spm_list = per_wb_params["cadence_spm"].tolist()
  stride_length_m_list = per_wb_params["stride_length_m"].tolist()
  stride_duration_s_list = per_wb_params["stride_duration_s"].tolist()
  walking_speed_mps_list = per_wb_params["walking_speed_mps"].tolist()

  data = [
    calculate_aggregates("n_strides", n_strides_list),
    calculate_aggregates("duration_s", duration_s_list),
    calculate_aggregates("cadence_spm", cadence_spm_list),
    calculate_aggregates("stride_length_m", stride_length_m_list),
    calculate_aggregates("stride_duration_s", stride_duration_s_list),
    calculate_aggregates("walking_speed_mps", walking_speed_mps_list)
  ]

  dataframe = pd.DataFrame(data, columns=["param", "max", "min", "avg", "var"])

  return dataframe
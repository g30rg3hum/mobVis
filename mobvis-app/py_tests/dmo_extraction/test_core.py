import sys
import os
import pytest
import scipy
import numpy as np
# append path to access core functions.
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../scripts/dmo_extraction")))
from core import *
from mobgap.data import GaitDatasetFromData

class TestIsValidMeasurementCondition:
  def test_ok_if_valid_setting(self):
    # these should not throw an error
    is_valid_measurement_condition("laboratory")
    is_valid_measurement_condition("free_living")

  def test_raises_error_if_unsupported_setting(self):
    with pytest.raises(ValueError):
      is_valid_measurement_condition("some random setting")

class TestLoadCsv:
  def test_reads_csv_and_converts_correctly(self):
    # this file is in g
    file_path = Path(__file__).parent.parent.parent / "sample_data" / "TimeMeasure1_Test11_Trial1.csv"
    convertAccFromGToMs = True
    data = load_csv(file_path, convertAccFromGToMs)

    # basically just has to be in a valid dataframe with right columns.
    assert list(data.columns) == ["samples", "acc_x", "acc_y", "acc_z", "gyr_x", "gyr_y", "gyr_z"]

    # check that a cell contains the correct value.
    assert data.loc[1, "gyr_x"] == -1.4157

    # check that acceleration values have been correctly converted
    assert round(data.loc[0, "acc_x"], 5) == round(0.9752501965095115 * scipy.constants.g, 5)
    assert round(data.loc[0, "acc_y"], 5) == round(-0.024094858111587597 * scipy.constants.g, 5)
    assert round(data.loc[0, "acc_z"], 5) == round(0.0895453386834444 * scipy.constants.g, 5)

class TestCreateDatasetFromDataframe:
  def test_returns_valid_gait_dataset_with_data(self):
    data = pd.DataFrame({
      "samples": [0, 1, 2],
      "acc_x": [0.2834, 0.234, 0.234],
      "acc_y": [0.345, 0.345, 0.8723],
      "acc_z": [0.7234, 0.2347, 0.7234],
      "gyr_x": [0.2347, 0.123, 0.123],
      "gyr_y": [0.473, 0.234, 0.7123],
      "gyr_z": [0.8123, 0.1238, 0.8712],
    })
    sensor_height_m = 1.6
    height_m = 1.8
    measurement_condition = "laboratory"
    sampling_rate_hz = 100

    dataset = create_dataset_from_dataframe(data, sensor_height_m, height_m, measurement_condition, sampling_rate_hz)

    assert isinstance(dataset, GaitDatasetFromData)
    # check the single record
    single_record = dataset[0]
    assert single_record.data_ss.equals(data) == True

# NOTE: skip testing extract_dmos because it is just a function that calls all the tested functions above, and calls the run method of the Mobilised pipeline, which should be tested by mobgap.

class TestCalculateAggregates:
  def test_returns_list_with_correct_aggregates(self):
    values = [1, 2, 3, 4, 5]
    aggregates = calculate_aggregates("param", values)

    assert aggregates == ["param", 5, 1, 3, 2]

class TestCalculateAggregateParameters:
  def test_throws_error_if_param_not_found(self):
    per_wb_params = pd.DataFrame({
      "n_strides": [1, 2, 3, 4, 5],
      # missing duration_s
      "cadence_spm": [2, 3, 8, 1, 2],
      "stride_length_m": [1, 8, 2, 7, 4],
      "stride_duration_s": [1, 2, 3, 4, 5],
      "walking_speed_mps": [8, 3, 2, 1, 7],
    })

    with pytest.raises(KeyError):
      calculate_aggregate_parameters(per_wb_params)

  def test_returns_aggregates_dataframe_correctly(self):
    per_wb_params = pd.DataFrame({
      "n_strides": [1, 2, 3, 4, 5],
      "duration_s": [8, 3, 4, 2, 8],
      "cadence_spm": [2, 3, 8, 1, 2],
      "stride_length_m": [1, 8, 2, 7, 4],
      "stride_duration_s": [1, 2, 3, 4, 5],
      "walking_speed_mps": [8, 3, 2, 1, 7],
    })

    result = calculate_aggregate_parameters(per_wb_params)

    assert list(result.columns) == ["param", "max", "min", "avg", "var"]
    assert result.shape[0] == 6 # all five parameters.
    
  



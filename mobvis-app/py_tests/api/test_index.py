import pytest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../api")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../scripts/dmo_extraction")))
from pathlib import Path
from index import app, general_error_message
from fastapi.testclient import TestClient
from core import setting_error_message, cols_error_message

client = TestClient(app)

class TestDmoExtraction():
  def test_valid_request_parameters_returns_response_data(self):
    file_path = Path(__file__).parent.parent.parent / "sample_data" / "TimeMeasure1_Test11_Trial1.csv"
    files = {"csvFile": open(file_path, "rb")}
    data = {
      "name": "Test extraction",
      "description": "Test description",
      "public": True,
      "samplingRate": 100,
      "sensorHeight": 1.65,
      "patientHeight": 1.80,
      "setting": "laboratory",
      "convertToMs": True,
    }
    response = client.post("/api/py/dmo_extraction", data=data, files=files)
    assert response.status_code == 200
    assert "per_wb_parameters" in response.json()
    assert "per_stride_parameters" in response.json()
    assert "aggregate_parameters" in response.json()

  def test_invalid_setting_returns_error_msg(self):
    file_path = Path(__file__).parent.parent.parent / "sample_data" / "TimeMeasure1_Test11_Trial1.csv"
    files = {"csvFile": open(file_path, "rb")}
    data = {
      "name": "Test extraction",
      "description": "Test description",
      "public": True,
      "samplingRate": 100,
      "sensorHeight": 1.65,
      "patientHeight": 1.80,
      "setting": "invalid_setting",
      "convertToMs": True,
    }
    response = client.post("/api/py/dmo_extraction", data=data, files=files)
    assert response.status_code == 400
    assert response.json()["detail"] == setting_error_message # must be defined.

  def test_invalid_sampling_rate_returns_error_message(self):
    file_path = Path(__file__).parent.parent.parent / "sample_data" / "TimeMeasure1_Test11_Trial1.csv"
    files = {"csvFile": open(file_path, "rb")}
    data = {
      "name": "Test extraction",
      "description": "Test description",
      "public": True,
      "samplingRate": 1, # invalid
      "sensorHeight": 1.65,
      "patientHeight": 1.80,
      "setting": "laboratory",
      "convertToMs": True,
    }
    
    response = client.post("/api/py/dmo_extraction", data=data, files=files)
    assert response.status_code == 400
    assert response.json()["detail"] == general_error_message

  def test_csv_file_containing_invalid_columns_returns_error_message(self):
    file_path = Path(__file__).parent.parent.parent / "sample_data" / "acc_z_missing.csv"
    files = {"csvFile": open(file_path, "rb")}
    data = {
      "name": "Test extraction",
      "description": "Test description",
      "public": True,
      "samplingRate": 100, # invalid
      "sensorHeight": 1.65,
      "patientHeight": 1.80,
      "setting": "laboratory",
      "convertToMs": True,
    }

    response = client.post("/api/py/dmo_extraction", data=data, files=files)
    assert response.status_code == 400
    assert response.json()["detail"] == cols_error_message

  def test_invalid_acc_units_returns_error_message(self):
    file_path = Path(__file__).parent.parent.parent / "sample_data" / "TimeMeasure1_Test11_Trial1.csv"
    files = {"csvFile": open(file_path, "rb")}
    data = {
      "name": "Test extraction",
      "description": "Test description",
      "public": True,
      "samplingRate": 100, # invalid
      "sensorHeight": 1.65,
      "patientHeight": 1.80,
      "setting": "laboratory",
      "convertToMs": False,
    }

    response = client.post("/api/py/dmo_extraction", data=data, files=files)
    assert response.status_code == 400
    assert response.json()["detail"] == general_error_message
    

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../scripts/fastapi/api")))
from pathlib import Path
from main import app
from fastapi.testclient import TestClient

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
    response = client.post("/dmo_extraction", data=data, files=files)
    assert response.status_code == 200
    assert "per_wb_parameters" in response.json()
    assert "per_stride_parameters" in response.json()
    assert "aggregate_parameters" in response.json()

  def test_invalid_request_parameters_returns_error_msg(self):
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
    response = client.post("/dmo_extraction", data=data, files=files)
    assert response.status_code == 400
    assert bool(response.json()["detail"]) # must be defined.
    

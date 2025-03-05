import sys
import os
sys.path.append(os.path.abspath("../../dmo_extraction"));
from core import extract_dmos

from typing import Annotated

from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  # NextJS runs on here.
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.post("/dmo_extraction")
def dmo_extraction(name: Annotated[str, Form()], description: Annotated[str, Form()], samplingRate: Annotated[int, Form()], sensorHeight: Annotated[float, Form()], patientHeight: Annotated[float, Form()], setting: Annotated[str, Form()], public: Annotated[bool, Form()], convertToMs: Annotated[bool, Form()], file: UploadFile):
  # validation has been handled in the FE.
  # TODO: perhaps also do backend validation here.

  # run all of this information through mobgap.

  # try:
  results = extract_dmos(file.file, sensorHeight, patientHeight, setting, samplingRate, convertToMs)

  per_wb_parameters = results.per_wb_parameters_
  per_stride_parameters = results.per_stride_parameters_

  # need to calculate the aggregated parameters.
  # maybe take a few of the relevant fields from the ones existing.

  # for now: store everything into JSON and send it over to the front end.
  # will save into the database if time allows.

  


  # except Exception as e:
  
  

  # aggregated parameters
  # per walking bout parameters
  # per stride parameters

  

  # make sure to close the file.
  file.file.close()

  print(results.per_wb_parameters_)

  return "yes"

  

  # return name, description, samplingRate, sensorHeight, patientHeight, setting, public, convertToMs, file.filename
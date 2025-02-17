% dynaportOmxRead - Reads raw timestamped data from measurement file
% and maps it to a time axis of exactly 100 Hz
%
% Syntax:  [markers, data] = dynaportOmxRead(measFile, varargin)
%
% Inputs:
%    
%    measFile   -   string with file name(including path) of the 
%                   measurement file (.OMX) 
%                   e.g: 'C:\folder\folder\measurement.OMX'
%    varargin(1) The markers in ONE of the following format: 
%               - STRING with file name(including path) of the
%                   marker file(.JSON).
%                   e.g: 'C:\folder\folder\measuement.JSON'                   
%               - STRUCT containing informationabout measurement request.
%                   The struct contain a field 'markers'. 
%                   e.g: measInfo.markers<1x2 cell> cell contains
%                   '[{"trial":"ST' 
%               - STRING with the raw JSON which contains the markers.
%                   e.g: '[{"trial":"STS","marker":"399","item_id":"122"...
%                         ,"setting":null,"color":"#D6ECB3","lineWidth":1,...
%                          "xaxis":{"from":2.00,"to":10.00}}]
%      
% Outputs:
% 
%   markers - struct or matrix containing the markers.
%   data    - nx7 matrix containing signal data
%   data : | column 1 | column 2 | column 3 | column 4 | column 5 | column 6 | column 7 |
%          | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
%          | timestamp| ACC_vt   | ACC_ml   | ACC_ap   | GYR_yaw  | GYR_pitch| GYR_roll |
% 
% NOTE: 
%   - if only the "measFile" is provided as input the function 
%               will retreive the markers from the .OMX file.
%   - if there are external markers(in any format) provided in the 
%               first varargin the output contains these markers.
%         
% Example:
%   [markers, data] = dynaportOmxRead('C:\folder\measurement.OMX')
%   [markers, data] = dynaportOmxRead('C:\folder\measurement.OMX', 'C:\folder\measurement.JSON')
%
% Other m-files required: - getMarkers.m
%                         - fromUnixTime.m
%                         - OMX_readFile.m
%                         - getMetaData.m
%                         - calcSampleData.m
%                         - nearestInSorted.m
% 
% Subfunctions: none
% MAT-files required: none
%
% Author: Erik Ainsworth
%           Rick van der Ploeg
% Created: May 2014 
% Updated: June 2019

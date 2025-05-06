# mobVis: a dissertation project on building a visualisation interface for gait analysis in people with multiple sclerosis

## How to run mobVis

Since this project has not been deployed to the web, you must run and host it locally on your system.

1. Open the terminal / your command line.
2. `git clone` this repository into your system.
3. `cd` into your local repository folder, then `cd mobvis-app`. This is where the actual Next.js project lies.
4. Ensure you have `npm` (see guide [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)), Python (of version <3.13 and >=3.9) and `pip` installed (see [here](https://www.python.org/downloads/)). Please make sure you install one of the stated versions of Python (e.g. 3.12) as `mobgap` (the Python library used to extract data) strictly supports these versions only.
5. Create a virtual environment based on the Python version you installed: e.g. `python3.12 -m venv venv`. Make sure that you're still in `mobvis-app`.
6. Please make sure you then also activate this newly created virtual environment.
   i. On macOS/Linux: `source venv/bin/activate`
   ii. On Windows: `venv\Scripts\activate`
7. Run `npm install` to install all the required front-end dependencies.
8. Run `npm run dev` in your terminal and a local server running the project should show in the terminal. (see image below) It is usually running on https://localhost:3000.
   <br />
   ![URL in terminal to access the app](resources/url_screenshot.png)
   <br />
9. Enter the URL into your preferred browser and start using mobVis.
10. There are test CSV files with associated metadata that you can test the interface with. A larger recording file can be found [here](https://drive.google.com/file/d/1jAkQli0QtsLrlVSY6r_Uh5ow4U-jhsBG/view?usp=sharing), and a smaller recording file [here](https://drive.google.com/file/d/1jGn1Zm9KASzCb_steYBibl-GjlGZWgYb/view?usp=sharing). The metadata can be found in the `resources` folder.

## Possible problems

### "'Failed to proxy http://127.0.0.1:8000/api/py/dmo_extraction' when trying to submit inputs in the form"

This is likely due to not having installed the required Python packages in `requirements.txt` properly. Please make sure you correctly follow steps 4-6 above. If you run the system with `npm run dev` afterwards and it still doesn't work, try to do `npm run py-dev`, exit once done running (using CTRL+C), before running `npm run dev` again, to specifically command the installation of the Python packages before running the app again.

## Help

If you have any trouble running the app, please contact me at hmw.geo@gmail.com or wwhum1@sheffield.ac.uk.

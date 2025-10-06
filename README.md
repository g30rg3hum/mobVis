# <picture><source media="(prefers-color-scheme: dark)" srcset="./resources/logo-white.png"><source media="(prefers-color-scheme: light)" srcset="./resources/logo-black.png"><img style="display: inline-block; vertical-align: middle;" height="50" alt="mobVis Logo" src="./resources/logo-black.png"></picture>

This is my university dissertation project on developing a visualisation interface for clinicians to closely evaluate the impaired mobility of their multiple sclerosis patients.

The final dissertation report can be found [here.](./FINAL_DISSERTATION_REPORT.pdf)

![GIF demonstration](/./resources/demo.gif)

## Features

- **Extraction of key digital mobility outcomes (DMOs):** useful parameters about mobility are extracted from comma-separated-values (CSV) file of walking data (collected using inertial-measurement-unit sensors) using [Mobilise-D's mobgap.](https://github.com/mobilise-d/mobgap)
  - DMOs are extracted (then visualised) on three core levels:
- **Visualisation of DMOs:** practical graphs, charts, and plots are generated to provide various insights surrounding mobility, using the extracted DMOs and D3.js.
- **Intuitive application flow and beautiful UI:** a user-friendly interface backed by a natural use-path, implemented using Next.js and React.js.
- **Persistence of uploaded data:** data uploaded/generated from recent analyses are stored in the user browser client's local storage.

A more detailed documentation of implemented features can be found in sub-section 5.2 (beginning page 73) of the [dissertation report.](./FINAL_DISSERTATION_REPORT.pdf#page=73)

## Who is this made for and why?

This project is made for **clinicians, who specifically work with patients who have multiple sclerosis (MS)**, an auto-immune condition that impairs mobility amongst other core bodily functions.

Generated visualisations of DMOs help the clinicians to form conclusions about patient gait and thus recommend more specific remedies for their overall mobility.

## Installation

Due to the payment requirement of a more complex, demanding deployment accompanied by the limited scope of a university dissertation project, this project has not been deployed to a web server. **You must run and host it locally on your system.**

### Prerequisites

Ensure you have the following installed before following the [installation steps:](#installation-steps)

- Node package manager (`npm`). [[installation]](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Python (3.9 <= version < 3.14). [[installation]](https://www.python.org/downloads/)
  - NOTE: the involved DMO extraction library `mobgap` strictly supports these versions at the time of writing.
- Python package manager `pip` (should automatically be installed with Python).

### Installation steps

1. Open your command line/terminal.
2. `git clone` this repository into your system.
3. Navigate (`cd`) into your local copy of this repository, then into the `mobvis-app` directory. This is where the actual files for the application reside.
4. Create a virtual environment to install and set aside all the required Python packages for this project. This has to be based on the Python version you installed. For example, run `python3.12 -m venv venv` if you installed Python 3.12. Make sure that you're still in `mobvis-app` during this.
5. Then make sure also activate this newly created virtual environment. On macOS/Linux: execute `source venv/bin/activate`. On Windows, execute `venv\Scripts\activate`.
6. Run `npm install` to install all the required front-end dependencies.
7. Run `npm run dev`, which will ensure you also have all the back-end Python dependencies, and also run a local server that is hosting the project. The URL, typically https://localhost:3000 (unless you have something else running on port 3000), will be displayed.
8. Copy and paste the URL into your preferred browser and start using _mobVis._

## Usage

Simply fill in the form for a new gait assessment at the homepage. This will involve providing details about the patient and their walking data, to properly extract the DMOs.

Once this form is submitted, navigate to the other pages (summary, each walking bout, each stride) to view and customise the generated visualisations.

I have provided test CSV files with required metadata that you can test the app with. A larger recording file of a patient's walking can be found [here](https://drive.google.com/file/d/1jAkQli0QtsLrlVSY6r_Uh5ow4U-jhsBG/view?usp=sharing), and a smaller one [here.](https://drive.google.com/file/d/1jGn1Zm9KASzCb_steYBibl-GjlGZWgYb/view?usp=sharing) Associated metadata can be found in the `resources` folder.

## Possible issues

### Failed to proxy /api/py/dmo_extraction' when trying to submit inputs in the form

This is likely due to not having installed the required Python packages in `requirements.txt` properly. Please ensure you've correctly followed steps 4-7 above. If this still fails, ensure the development server is off, and manually install the packages using `npm run py-dev` and exit once done running (CTRL+C). Then, run the development server again (`npm run dev`).

## Help

If you have any trouble running the app, please contact me at hmw.geo@gmail.com.

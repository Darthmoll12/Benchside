## Overview

BenchSide is a minimalist chemical inventory manager designed for small research and chemistry teaching labs for schools and universities.

It strives to be a platform more effective than spreadsheet inventories while simultaneously providing a much simpler user experience than many modern enterprise solutions currently on the market.


### The Problem it Solves.
Current chemical inventorying software applications struggle with maintaining hazardous waste disposal management, poor location and expiration tracking, and having too complex user interfaces and entries. Additionally, small teaching labs are underserved and need limited features without the complexities of enterprise software. Therefore, BenchSide solves these problems by providing simple features for tracking chemical expiration dates, where the chemicals are stored, when they were opened, how they should be disposed, and more. This provides professors and TAs the ability to track chemicals in a simplified manner without relying on messy spreadsheets which are prone to error, confusion, and wasted time.

### How Benchside is an improvement over spreadsheets.
Benchside doesn’t just track chemicals. Spreadsheets can do that too. Benchside protects the teaching semester or the research project from unneeded stress or chaos by preventing poor or erroneous inputs, generating automatic alerts such as when a bottle is approaching its expiration date, encoding the teaching lab’s workflow (disposal, protocols, storage location, etc.), and generating clean records of instrument use while enforcing accountability. Each of these features ensures successful inventorying while preventing risk associated with spreadsheets.

### What does Benchside v1 include?
The first version of Benchside includes a simple dashboard for looking up and tracking chemicals, expiration dates, storage location (such as room number/shelf location), when they were opened, logging instrument users/time of use, and easy SDS integration/access.

### What Benchside v1 does not include.
Benchside version 1 does not yet include full regulatory compliance management, advanced data analytics/AI integration, automatic purchasing, nor electronic lab notebook functionality. Benchside v1 is not meant to be a full laboratory information management system (LIMS). However, future versions of Benchside may contain many of the aforementioned features after further product development/iteration, giuded by user validation and feedback.


## Approach

BenchSide approaches this problem with one focus in mind: Elegant Simplicity. There are two factors to this focus:

### Elegance

BenchSide strives to make the chemical inventorying process an elegant and user-friendly process that is not only functional but also enjoyable to use. This is achieved by making the inventorying process as seamless as possible by including such features as: spreadsheet/csv file upload and download features to reduce time to transfer between inventory systems, SDS integration with chemicals for easy safety infomation lookup, and tagging low-stock chemicals for order-form integration.

### Simplicity

BenchSide's UI is purposefully designed to be minimal and easy to navigate. Chemicals can be viewed in both card form and table form, each with expandables that reveal more information on each chemical. A minimal form to add new chemicals to the list provides for straightforward entry without bottlenecking the process: Only certain fields are required, and ones that are readily available from chemical bottles. This allows chemical entries to be made in a timely manner in the event that additional qualifiers are not accessible.


## Project Structure

### Src Folder

#### /app
The /app folder contains the primary files that describe the layout of the webpage and actually run the page itself. Here you can find global.css, layout.js, and page.js, which is the main file for the project.

#### /components
This folder contains Javascript and Ant Design components that can be reused when necessary. For instance, the ChemicalForm.js component file describes the structure and layout of the "Add Chemical" form. The ChemicalForm component is then imported and called directly within the page.js file.

#### /lib
The /lib folder contains any global constants needed to perform functions across the project. For instance, the constants.js file contains a constant that houses structured information on GHS pictograms. This constant is imported to page.js so other functions can draw information from it.


### Public Folder
The public folder contains any files that house information to be publicly displayed on the webpage. This primarily includes .svg files for icons, logos, etc. 

#### /ghs
This folder houses .png files of each pictogram from the Globally Harmonized System of chemical classification. This allows users to select from images of the actual pictograms rather than from text descriptions.


## Future Work
BenchSide is designed to be simple and easy to use. The first versions of this application will only include what is absolutely necessary. 

However, future work may include the addition of AI APIs to help automatically identify chemicals that need to be ordered, suggest reactants/solvents to use for a certain desired product, and more. These features could be very useful once BenchSide is already being used and validated by a significant number of users.

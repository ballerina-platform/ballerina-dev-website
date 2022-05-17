## Inputs and Outputs

<table>
    <tr>
        <td><b>Inputs</b></td>
        <td>Latest examples directory from ballerina-distribution [<a href="https://github.com/ballerina-platform/ballerina-distribution">1</a>] repository.</td>
    </tr>
    <tr>
        <td><b>Outputs</b></td>
        <td>HTML files corresponding to the BBEs.</td>
    </tr>
</table>

## Process

### 1. Prerequisites

- Download and install Node.js [[2](https://nodejs.org/en/download/)].

### 2. Installing dependencies

- Navigate to the **script's** directory.
- Install the dependencies.
  
```bash
# navigate to the directory of the script
cd ./.github/scripts/bbe

# install dependencies
npm install

# navigate back to the root of the repo
cd ../../..
```
### 3. Deleting the existing BBE HTML files

- Delete all the HTML files located in the **./learn/by-examples** directory excluding the `404.html` and `index.html` files.

### 4. Running the script

- The script `markdownConverter.js` is used to convert the BBE content written in markdown to HTML.

<table>
    <tr>
        <td><b>Location from root</b></td>
        <td>./.github/scripts/bbe/markdownConverter.js</td>
    </tr>
    <tr>
        <td><b>Inputs</b></td>
        <td>
            1. Location of the <b>examples</b> directory.</br>
            2. Location of the output to be saved.
        </td>
    </tr>
    <tr>
        <td><b>Outputs</b></td>
        <td>HTML files corresponding to the markdown BBE files.</td>
    </tr>
</table>

- From the root of the ballerina-dev-website repository, run the script using Node.js.

```bash
node ./.github/scripts/bbe/markdownConverter.js <relative_path_to_examples> <relative_path_for_output_HTMLs>
```

> By default,
>
>1. <relative_path_to_examples> = “./examples”
>2. <relative_path_for_output_HTMLs> = “./learn/by-example”

- Generated output BBE HTML files will be saved in the specified directory.

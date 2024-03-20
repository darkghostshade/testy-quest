export const ApiConnectionReplacement = () => {// Initialize state with an initial value
    if (process.env.REACT_APP_APICONNECTION !== undefined) {
        console.log(process.env.APICONNECTION);
        return (process.env.REACT_APP_APICONNECTION); // Update the state value using the setUrl function
    }
    else {
        console.log("https://localhost:44303")
        return ("https://localhost:44303");
    } // Return the current state value
}
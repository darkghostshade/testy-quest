export const ApiConnectionReplacement = () => {// Initialize state with an initial value
    if (process.env.APICONNECTION !== undefined) {
        console.log(process.env.APICONNECTION);
        return (process.env.APICONNECTION); // Update the state value using the setUrl function
    }
    else {
        console.log(process.env.APICONNECTION);
        console.log("https://localhost:44303")
        return ("https://localhost:44303");
    } // Return the current state value
}
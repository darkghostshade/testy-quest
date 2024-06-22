export const QuestionApiConnectionReplacement = () => {// Initialize state with an initial value
    if (process.env.APICONNECTION !== undefined) {
        console.log(process.env.APICONNECTION);
        return (process.env.APICONNECTION); // Update the state value using the setUrl function
    }
    else {
        console.log(process.env.APICONNECTION);
        return ("http://api.question.testy-quest.nl");
    } 
}
export const ApiConnectionReplacement = () => {// Initialize state with an initial value
    if (process.env.APICONNECTION !== undefined) {
        console.log(process.env.APICONNECTION);
        return (process.env.APICONNECTION); // Update the state value using the setUrl function
    }
    else {
        console.log(process.env.APICONNECTION);
        return ("http://api.testy-quest.nl");
    } 
}

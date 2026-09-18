function mapExecutionStatus(executionResult) {
    const executionStatus = executionResult?.status;

    switch (executionStatus) {
        case "COMPILATION_ERROR":
            return "Compilation Error";

        case "TIME_LIMIT_EXCEEDED":
            return "Time Limit Exceeded";

        case "MEMORY_LIMIT_EXCEEDED":
            return "Memory Limit Exceeded";

        case "RUNTIME_ERROR":
            return "Runtime Error";

        case "EXECUTION_ERROR":
            return "Runtime Error";

        case "EXECUTED":
            return null;

        default:
            return "Runtime Error";
    }
}

module.exports = {
    mapExecutionStatus
};
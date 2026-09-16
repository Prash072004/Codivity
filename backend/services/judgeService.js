function normalizeOutput(output) {
    return String(output ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .join(" ");
}

function judgeExecution({ executionResult, expectedOutput }) {
    const executionStatus = executionResult?.status;

    if (executionStatus === "COMPILATION_ERROR") {
        return { status: "Compilation Error" };
    }

    if (executionStatus === "TIME_LIMIT_EXCEEDED") {
        return { status: "Time Limit Exceeded" };
    }

    if (executionStatus === "MEMORY_LIMIT_EXCEEDED") {
        return { status: "Memory Limit Exceeded" };
    }

    if (executionStatus !== "EXECUTED") {
        return { status: "Runtime Error" };
    }

    return {
        status: normalizeOutput(executionResult.stdout) === normalizeOutput(expectedOutput)
            ? "Accepted"
            : "Wrong Answer"
    };
}

module.exports = {
    judgeExecution
};

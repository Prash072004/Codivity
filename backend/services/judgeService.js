function normalizeOutput(output) {
    return String(output ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .join(" ");
}

function judgeExecution({ executionResult, expectedOutput }) {
    return {
        status: normalizeOutput(executionResult.stdout) === normalizeOutput(expectedOutput)
            ? "Accepted"
            : "Wrong Answer"
    };
}

module.exports = {
    judgeExecution
};
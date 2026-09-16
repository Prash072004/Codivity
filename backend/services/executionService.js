const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const CPP_IMAGE = "codivity-cpp-execution:dev";

function runCommand(command, args, options = {}) {
    const { input, timeoutMs } = options;

    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: ["pipe", "pipe", "pipe"]
        });
        let stdout = "";
        let stderr = "";
        let timedOut = false;
        let timeout;

        child.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        if (timeoutMs) {
            timeout = setTimeout(() => {
                timedOut = true;
                child.kill();
            }, timeoutMs);
        }

        child.on("error", reject);
        child.on("close", (exitCode, signal) => {
            if (timeout) {
                clearTimeout(timeout);
            }

            resolve({ stdout, stderr, exitCode, signal, timedOut });
        });

        child.stdin.end(input === undefined ? undefined : input);
    });
}

function getExecutionLimits(limits = {}) {
    const timeoutMs = Number.isFinite(Number(limits.timeoutMs))
        ? Math.max(100, Number(limits.timeoutMs))
        : 5000;
    const memoryMb = Number.isFinite(Number(limits.memoryMb))
        ? Math.max(32, Number(limits.memoryMb))
        : 128;
    const cpus = Number.isFinite(Number(limits.cpus))
        ? Math.max(0.1, Number(limits.cpus))
        : 1;

    return { timeoutMs, memoryMb, cpus };
}

async function executeCode({ language, sourceCode, input = "", limits = {} }) {
    const languageName = String(language?.name || "").toLowerCase();

    if (!languageName.includes("c++") && !languageName.includes("cpp")) {
        throw new Error(`Unsupported execution language: ${language?.name || "unknown"}`);
    }

    if (typeof sourceCode !== "string") {
        throw new Error("sourceCode must be a string");
    }

    if (typeof input !== "string") {
        throw new Error("input must be a string");
    }

    const executionLimits = getExecutionLimits(limits);
    const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "codivity-cpp-"));
    const sourcePath = path.join(temporaryDirectory, "main.cpp");
    let containerId;

    try {
        await fs.writeFile(sourcePath, sourceCode, "utf8");

        const container = await runCommand("docker", [
            "run", "-d", "--rm", "--network", "none",
            "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
            "--memory", `${executionLimits.memoryMb}m`,
            "--cpus", String(executionLimits.cpus),
            "--pids-limit", "64",
            "--tmpfs", "/workspace:rw,exec,size=64m",
            CPP_IMAGE, "tail", "-f", "/dev/null"
        ], { timeoutMs: 10000 });

        if (container.exitCode !== 0 || !container.stdout.trim()) {
            throw new Error(`Failed to start C++ execution container: ${container.stderr.trim()}`);
        }

        containerId = container.stdout.trim();

        const copyResult = await runCommand("docker", [
            "cp", sourcePath, `${containerId}:/tmp/main.cpp`
        ], { timeoutMs: 10000 });

        if (copyResult.exitCode !== 0) {
            throw new Error(`Failed to copy source into execution container: ${copyResult.stderr.trim()}`);
        }

        const compileResult = await runCommand("docker", [
            "exec", containerId, "g++", "-std=c++17", "-O2",
            "/tmp/main.cpp", "-o", "/tmp/main"
        ], { timeoutMs: executionLimits.timeoutMs });

        if (compileResult.timedOut || compileResult.exitCode !== 0) {
            return {
                status: "COMPILATION_ERROR",
                stdout: compileResult.stdout,
                stderr: compileResult.stderr || "Compilation failed",
                exitCode: compileResult.exitCode,
                runtime: null,
                memory: null
            };
        }

        const startedAt = Date.now();
        const executionResult = await runCommand("docker", [
            "exec", "-i", containerId, "/tmp/main"
        ], { input, timeoutMs: executionLimits.timeoutMs });

        return {
            status: executionResult.timedOut || executionResult.exitCode !== 0
                ? "RUNTIME_ERROR"
                : "EXECUTED",
            stdout: executionResult.stdout,
            stderr: executionResult.stderr,
            exitCode: executionResult.exitCode,
            runtime: Date.now() - startedAt,
            memory: null
        };
    } finally {
        if (containerId) {
            await runCommand("docker", ["rm", "-f", containerId], { timeoutMs: 10000 })
                .catch(() => {});
        }

        await fs.rm(temporaryDirectory, { recursive: true, force: true });
    }
}

module.exports = {
    executeCode
};

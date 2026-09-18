const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { getExecutionConfig } = require("../config/executionLanguages");

function runCommand(command, args, options = {}) {
    const { input, timeoutMs, onTimeout } = options;

    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: [
                input === undefined ? "ignore" : "pipe",
                "pipe",
                "pipe"
            ]
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
            timeout = setTimeout(async () => {
                timedOut = true;

                try {
                    if (onTimeout) {
                        await onTimeout();
                    }
                } catch (error) {
                    console.error("Timeout cleanup error:", error);
                }

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

        if (input !== undefined) {
            child.stdin.end(input);
        }
    });
}

async function wasContainerOOMKilled(containerId) {
    const inspectResult = await runCommand("docker", [
        "inspect",
        "--format",
        "{{.State.OOMKilled}}",
        containerId
    ], { timeoutMs: 5000 });

    if (inspectResult.exitCode !== 0) {
        return false;
    }

    return inspectResult.stdout.trim() === "true";
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

    return {
        timeoutMs,
        memoryMb,
        cpus,
        pidsLimit: 64
    };
}

async function executeCode({ language, sourceCode, input = "", limits = {} }) {
    const languageConfig = getExecutionConfig(language);

    if (!languageConfig.enabled) {
        throw new Error(
            `Execution is not enabled for ${languageConfig.name}`
        );
    }

    if (typeof sourceCode !== "string") {
        throw new Error("sourceCode must be a string");
    }

    if (typeof input !== "string") {
        throw new Error("input must be a string");
    }

    const executionLimits = getExecutionLimits(limits);

    const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "codivity-cpp-"));
    const sourcePath = path.join(
        temporaryDirectory,
        languageConfig.sourceFile
    );
    let containerId;

    try {
        await fs.writeFile(sourcePath, sourceCode, "utf8");

        const container = await runCommand("docker", [
            "run", "-d", "--rm", "--read-only", "--network", "none",
            "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
            "--memory", `${executionLimits.memoryMb}m`,
            "--cpus", String(executionLimits.cpus),
            "--pids-limit", String(executionLimits.pidsLimit),
            "--tmpfs", "/workspace:rw,exec,size=64m",
            languageConfig.dockerImage, "tail", "-f", "/dev/null"
        ], { timeoutMs: 10000 });

        if (container.exitCode !== 0 || !container.stdout.trim()) {
            throw new Error(`Failed to start C++ execution container: ${container.stderr.trim()}`);
        }

        containerId = container.stdout.trim();

        const sourceCodeResult = await runCommand("docker", [
            "exec", "-i", containerId, "bash", "-c",
            `cat > /workspace/${languageConfig.sourceFile}`
        ], {
            input: sourceCode,
            timeoutMs: 10000
        });

        if (sourceCodeResult.exitCode !== 0) {
            throw new Error(
                `Failed to write source into execution container: ${sourceCodeResult.stderr.trim()}`
            );
        }

        if (languageConfig.compile) {
            const compileArgs = languageConfig.compile.args.map((arg) => {
                if (arg === languageConfig.sourceFile) {
                    return `/workspace/${arg}`;
                }

                if (arg === "main") {
                    return "/workspace/main";
                }

                return arg;
            });

            const compileResult = await runCommand("docker", [
                "exec",
                containerId,
                languageConfig.compile.command,
                ...compileArgs
            ], {
                timeoutMs:
                    languageConfig.compileTimeoutMs ||
                    executionLimits.timeoutMs
            });

            if (compileResult.timedOut || compileResult.exitCode !== 0) {
                console.error(`${languageConfig.name} compilation failed:`);
                console.error("Exit code:", compileResult.exitCode);
                console.error("Signal:", compileResult.signal);
                console.error("Timed out:", compileResult.timedOut);
                console.error("Compiler stderr:", compileResult.stderr);

                return {
                    status: "COMPILATION_ERROR",
                    stdout: compileResult.stdout,
                    stderr: compileResult.stderr || "Compilation failed",
                    exitCode: compileResult.exitCode,
                    runtime: null,
                    memory: null
                };
            }
        }

    const startedAt = Date.now();

    const runCommandPath =
        languageConfig.run.command === "./main"
            ? "/workspace/main"
            : languageConfig.run.command;

    const runArgs = languageConfig.run.args.map((arg) => {
        if (arg === languageConfig.sourceFile) {
            return `/workspace/${arg}`;
        }

        return arg;
    });

    const executionResult = await runCommand("docker", [
        "exec",
        "-i",
        containerId,
        runCommandPath,
        ...runArgs
    ], {
        input,
            timeoutMs: executionLimits.timeoutMs,
            onTimeout: async () => {
                await runCommand("docker", [
                    "kill",
                    containerId
                ], { timeoutMs: 5000 });
            }
    });
        
        const memoryLimitExceeded = !executionResult.timedOut
            ? await wasContainerOOMKilled(containerId)
            : false;

        return {
            status: executionResult.timedOut
                ? "TIME_LIMIT_EXCEEDED"
                : memoryLimitExceeded
                    ? "MEMORY_LIMIT_EXCEEDED"
                    : executionResult.exitCode !== 0
                        ? "RUNTIME_ERROR"
                        : "EXECUTED",
            stdout: executionResult.stdout,
            stderr: executionResult.stderr,
            exitCode: executionResult.exitCode,
            runtime: Date.now() - startedAt,
            memory: null
        };
    } catch (error) {
        console.error(
            `${languageConfig.name} execution infrastructure error:`,
            error
        );
        throw new Error(`${languageConfig.name} execution service failed`);    } finally {
        if (containerId) {
            try {
                await runCommand("docker", ["rm", "-f", containerId], {
                    timeoutMs: 10000
                });
            } catch (error) {
                console.error(
                    `Failed to clean up execution container ${containerId}:`,
                    error
                );
            }
        }

        await fs.rm(temporaryDirectory, { recursive: true, force: true });
    }
}

module.exports = {
    executeCode
};

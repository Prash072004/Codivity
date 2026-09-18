const executionLanguages = {
    cpp: {
        key: "cpp",
        name: "C++",
        enabled: true,

        dockerImage: "codivity-cpp-execution:dev",

        sourceFile: "main.cpp",

        shell: "bash",

        compileTimeoutMs: 20000,

        compile: {
            command: "g++",
            args: [
                "-std=c++17",
                "-O2",
                "main.cpp",
                "-o",
                "main"
            ]
        },

        run: {
            command: "./main",
            args: []
        }
    },

    python: {
        key: "python",
        name: "Python",
        enabled: true,
        dockerImage: "python:3.12-slim",
        sourceFile: "main.py",
        shell: "bash",
        compile: null,
        run: {
            command: "python3",
            args: ["main.py"]
        }
    },

    javascript: {
        key: "javascript",
        name: "JavaScript",
        enabled: true,

        dockerImage: "node:22-alpine",

        sourceFile: "main.js",

        shell: "sh",

        compile: null,

        run: {
            command: "node",
            args: ["main.js"]
        }
    }
};

function getExecutionConfig(language) {
    const languageName = String(language?.name || "")
        .trim()
        .toLowerCase();

    if (languageName === "c++" || languageName === "cpp") {
        return executionLanguages.cpp;
    }

    if (languageName === "python") {
        return executionLanguages.python;
    }

    if (languageName === "javascript" || languageName === "js") {
        return executionLanguages.javascript;
    }

    throw new Error(
        `Unsupported execution language: ${language?.name || "unknown"}`
    );
}

function validateExecutionConfig(config) {
    if (!config || typeof config !== "object") {
        throw new Error("Invalid execution configuration");
    }

    if (typeof config.dockerImage !== "string" ||
        !config.dockerImage.trim()) {
        throw new Error(
            `Invalid execution configuration for ${config.name || "unknown"}: dockerImage is required`
        );
    }

    if (typeof config.sourceFile !== "string" ||
        !config.sourceFile.trim()) {
        throw new Error(
            `Invalid execution configuration for ${config.name || "unknown"}: sourceFile is required`
        );
    }

    if (!config.run || typeof config.run !== "object") {
        throw new Error(
            `Invalid execution configuration for ${config.name || "unknown"}: run configuration is required`
        );
    }

    if (typeof config.run.command !== "string" ||
        !config.run.command.trim()) {
        throw new Error(
            `Invalid execution configuration for ${config.name || "unknown"}: run command is required`
        );
    }

    if (!Array.isArray(config.run.args)) {
        throw new Error(
            `Invalid execution configuration for ${config.name || "unknown"}: run args must be an array`
        );
    }

    if (config.compile !== null && config.compile !== undefined) {
        if (typeof config.compile !== "object") {
            throw new Error(
                `Invalid execution configuration for ${config.name || "unknown"}: compile configuration is invalid`
            );
        }

        if (typeof config.compile.command !== "string" ||
            !config.compile.command.trim()) {
            throw new Error(
                `Invalid execution configuration for ${config.name || "unknown"}: compile command is required`
            );
        }

        if (!Array.isArray(config.compile.args)) {
            throw new Error(
                `Invalid execution configuration for ${config.name || "unknown"}: compile args must be an array`
            );
        }
    }

    // Optional language-specific resource limits
    if (config.limits !== undefined) {
        if (
            !config.limits ||
            typeof config.limits !== "object" ||
            Array.isArray(config.limits)
        ) {
            throw new Error(
                `Invalid execution configuration for ${config.name || "unknown"}: limits must be an object`
            );
        }

        const allowedLimitKeys = [
            "timeoutMs",
            "memoryMb",
            "pidsLimit"
        ];

        for (const key of Object.keys(config.limits)) {
            if (!allowedLimitKeys.includes(key)) {
                throw new Error(
                    `Invalid execution configuration for ${config.name || "unknown"}: unsupported limit "${key}"`
                );
            }
        }

        if (config.limits.timeoutMs !== undefined) {
            const timeoutMs = config.limits.timeoutMs;

            if (
                typeof timeoutMs !== "number" ||
                !Number.isFinite(timeoutMs) ||
                timeoutMs < 100
            ) {
                throw new Error(
                    `Invalid execution configuration for ${config.name || "unknown"}: timeoutMs is invalid`
                );
            }
        }

        if (config.limits.memoryMb !== undefined) {
            const memoryMb = config.limits.memoryMb;

            if (
                typeof memoryMb !== "number" ||
                !Number.isFinite(memoryMb) ||
                memoryMb < 32
            ) {
                throw new Error(
                    `Invalid execution configuration for ${config.name || "unknown"}: memoryMb is invalid`
                );
            }
        }

        if (config.limits.pidsLimit !== undefined) {
            const pidsLimit = config.limits.pidsLimit;

            if (
                typeof pidsLimit !== "number" ||
                !Number.isInteger(pidsLimit) ||
                pidsLimit < 1
            ) {
                throw new Error(
                    `Invalid execution configuration for ${config.name || "unknown"}: pidsLimit is invalid`
                );
            }
        }
    }

    return true;
}

module.exports = {
    executionLanguages,
    getExecutionConfig,
    validateExecutionConfig
};
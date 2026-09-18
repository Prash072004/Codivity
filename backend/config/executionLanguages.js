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

    return true;
}

module.exports = {
    executionLanguages,
    getExecutionConfig,
    validateExecutionConfig
};
const executionLanguages = {
    cpp: {
        key: "cpp",
        name: "C++",
        enabled: true,

        dockerImage: "codivity-cpp-execution:dev",

        sourceFile: "main.cpp",

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

module.exports = {
    executionLanguages,
    getExecutionConfig
};
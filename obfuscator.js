// 1. Initialize the Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
let editor;

require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: "-- Paste your Roblox script here...\nprint('Hello from Ghost-Obf!')",
        language: 'lua',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: true }
    });
});

// 2. The Obfuscation Engine
function runObfuscation() {
    const rawCode = editor.getValue();
    if (!rawCode || rawCode.trim() === "") return alert("Please enter some code!");

    // LAYER 1: Generate Junk Code to confuse decompilers
    let junkCode = "--[[\n";
    for(let i = 0; i < 8; i++) {
        const randomHex = Math.random().toString(16).substring(2, 8);
        junkCode += `    _0x${randomHex} = ${Math.floor(Math.random() * 100000)};\n`;
    }
    junkCode += "]]\n";

    // LAYER 2: Convert source code to Byte Array
    const byteArray = rawCode.split('').map(char => char.charCodeAt(0));
    const formattedBytes = byteArray.join(',');

    // LAYER 3: The Virtual Execution Wrapper
    // This reconstructs the code in-memory so it's harder to steal
    const protectedTemplate = `
${junkCode}
local _0xGhostData = {${formattedBytes}}
local _0xGhostBuffer = ""

for _0xIdx = 1, #_0xGhostData do
    _0xGhostBuffer = _0xGhostBuffer .. string.char(_0xGhostData[_0xIdx])
end

local _0xPayload, _0xErr = loadstring(_0xGhostBuffer)
if _0xPayload then
    pcall(_0xPayload)
else
    warn("[GHOST-OBF ERROR]: " .. tostring(_0xErr))
end
-- Protected by Ghost-Obfuscator v1.0
`.trim();

    // Set the obfuscated code back into the editor
    editor.setValue(protectedTemplate);
}

// 3. Copy Function
function copyToClipboard() {
    const code = editor.getValue();
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('button[onclick="copyToClipboard()"]');
        const originalText = btn.innerText;
        btn.innerText = "COPIED!";
        btn.classList.replace('bg-slate-800', 'bg-green-600');
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.replace('bg-green-600', 'bg-slate-800');
        }, 2000);
    }).catch(err => {
        alert("Failed to copy: " + err);
    });
}

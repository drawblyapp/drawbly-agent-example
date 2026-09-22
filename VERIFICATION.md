# Verification

Checked September 22, 2026 on Windows with Node.js 24.19.0 and FFmpeg 7.1.1.

- Downloaded the current public renderer ZIP into a fresh folder and installed its declared dependency there. ZIP SHA-256 matched the released artifact: `b62352bd191b2ace9f6862a790d8856633c8b144a7a927243343b1cfd5829a61`.
- Ran `render-example.mjs` against that extracted kit. The helper produced all four expected files.
- FFprobe reported H.264, 1200 × 720, 30 fps, exactly 21 seconds and 630 frames. There is no audio stream in this captioned example. FFmpeg decoded the entire video without errors.
- Inspected the final preview: labels, request/response directions, caption and Drawbly credit are visible and do not overlap.
- Opened the generated drawing through the actual application's file-input handler in its automated harness. All 18 objects and their geometry survived unchanged; editing a label and Undo restored the original objects. This is an automated import check, not a claim of a physical-device test.
- A second invocation against the existing output folder failed as intended; SHA-256 hashes of all four output files remained unchanged.
- Changed the example to `GET /invoices/42`, rendered it through the optional recipe argument into a path containing spaces, and checked the changed labels in the editable output.

No macOS/Linux run, physical phone check, live narration review or network-isolation test was performed. Renderer/helper source has no AI or network calls; dependency installation and downloading the kit do require network access. Different local fonts may change pixels.

| Output | SHA-256 |
|---|---|
| `api-request.mp4` | `46c8e3c222d880ff6ccadb1b06998a58a722ee637ac1683673e62d17781d0c1a` |
| `api-request.drawing.json` | `80bd047f38604e0fc26fe2c43d80d9f6c1f29cb94303f2e0176f8fc2fd03dceb` |
| `api-request.video.json` | `b0f92573636194d6543350988aa0718c46f9ebeab078fde3468e09c6b696fc6b` |
| `preview.png` | `b793f786409000bd3c97af437569c60a8f930ecd7b1f07dabc1e98c8e51ed0f5` |

These hashes identify the inspected artifacts; they do not promise byte-identical output on every operating system or FFmpeg/font version.

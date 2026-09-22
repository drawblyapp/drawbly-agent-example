# An API explanation an agent can render

Turn a small JSON recipe into a 21-second captioned MP4 and a diagram you can edit in [Drawbly](https://drawbly.com/?utm_source=github&utm_medium=sample&utm_campaign=agent_api_flow). The example follows a successful order lookup: client → API → data store → API → client.

![Finished diagram and caption](output/preview.png)

This is an original, agent-authored example, derived from Drawbly's [API request-flow template](https://drawbly.com/templates/api-request-flow). It is not a recording of a person drawing. The example deliberately omits authentication, caches, failures and infrastructure details.

## Run it

1. Install **Node.js 22.14+**, npm, and **FFmpeg with ffprobe**. Put FFmpeg on PATH, or set `FFMPEG_PATH` and `FFPROBE_PATH` to the executables. A local sans-serif font is needed; font rendering can vary across systems.
2. Download the [Drawbly renderer kit](https://drawbly.com/drawbly-renderer.zip) and extract it into a folder called `renderer` beside this example folder. Install its dependencies once:

```sh
npm install --prefix ../renderer
```

3. From this example folder, run:

```sh
node render-example.mjs ../renderer ./my-first-render
```

The parent folder must exist and the output folder must be new. Paths containing spaces should be quoted. The helper executes the local renderer and FFmpeg directly, without a shell. It does not download or install software, request API keys, or invoke an AI provider.

Expected files:

| File | Use |
|---|---|
| `api-request.mp4` | 21-second, 30 fps H.264 video; captions and Drawbly credit included |
| `api-request.drawing.json` | Editable diagram; open via **Files → Open drawing** in Drawbly |
| `api-request.video.json` | Normalized recipe for another render |
| `preview.png` | Final video frame, including the caption and credit |

The canvas and video are 1200 × 720; the renderer fits the drawing above the caption and credit. This sample has **no audio stream**. Supply a narration file through the [recipe contract](https://drawbly.com/agent-video.html) when you want sound. Optional neural speech setup is in the kit's `VIDEO-PRODUCTION.md` and is not required for this first run.

Existing output directories are refused. If a run fails, keep its files for diagnosis and use a fresh output folder after fixing the error. The renderer validates the recipe and preserves supplied stroke points. Drawings and recordings remain local; installing dependencies and obtaining the kit require internet, while rendering does not.

## Give this to an agent

```text
Use api-request.video.json as a starting point. Make a short explanation of
our successful GET /invoices/42 request. Keep the client, API and data store;
change the order labels to invoice labels and update the three captions.
Do not invent authentication, caching or database behavior.
Preserve the Drawbly credit. Write invoice-request.video.json, then run:
node render-example.mjs ../renderer ./invoice-render invoice-request.video.json
Inspect the final frame and timing. Return the MP4, preview PNG and editable
drawing. Describe these as generated assets, not manually drawn artwork.
```

An agent supplies and checks the content. Drawbly supplies rendering. This sample does not inspect a codebase, run an LLM, install a skill or expose a hosted MCP server. Its local execution has no usage telemetry. Website visits from the link above can be attributed under Drawbly's existing privacy controls; they do not count offline renders.

## Direct command, without the helper

Create an empty destination folder first, then use the existing kit directly:

```sh
node ../renderer/render-recipe.mjs api-request.video.json output-folder/api-request.mp4
```

That command creates the MP4 and both JSON sidecars. The helper adds the PNG preview and refuses an already existing output directory.

## Reproduction notes

Verified on Windows with Node.js 24.19.0, FFmpeg 7.1.1 and the public kit downloaded September 22, 2026. Kit SHA-256:

```text
b62352bd191b2ace9f6862a790d8856633c8b144a7a927243343b1cfd5829a61
```

The download URL is mutable; a later kit may have a different hash. This example has not been tested on macOS or Linux. See `VERIFICATION.md` for the checked outputs. The original sample files in this repository are MIT licensed. The separately downloaded renderer and your installed dependencies are outside this sample license.


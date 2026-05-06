import { corsHeaders } from "https://deno.land/x/edge_cors@0.0.6/src/cors.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const { fileName, fileData } = await req.json();

    if (!fileName || !fileData) {
      return new Response(
        JSON.stringify({ error: "fileName and fileData are required" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    if (![".ppt", ".pptx"].includes(ext)) {
      return new Response(
        JSON.stringify({ error: "Only .ppt and .pptx files are supported" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Decode base64 to binary
    const binaryStr = atob(fileData);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // Write to temp file
    const tmpDir = await Deno.makeTempDir();
    const inputPath = `${tmpDir}/${fileName}`;
    await Deno.writeFile(inputPath, bytes);

    // Convert using LibreOffice
    const process = new Deno.Command("soffice", {
      args: [
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        tmpDir,
        inputPath,
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stderr } = await process.output();

    if (code !== 0) {
      const errText = new TextDecoder().decode(stderr);
      console.error("LibreOffice error:", errText);
      return new Response(
        JSON.stringify({ error: "Conversion failed. LibreOffice is not available in this environment. Please try a different approach." }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Read the output PDF
    const pdfName = fileName.replace(/\.(pptx?|PPTX?)$/, ".pdf");
    const pdfPath = `${tmpDir}/${pdfName}`;
    const pdfBytes = await Deno.readFile(pdfPath);

    // Convert to base64
    const pdfBase64 = btoa(
      pdfBytes.reduce((data: string, byte: number) => data + String.fromCharCode(byte), "")
    );

    // Cleanup
    try {
      await Deno.remove(tmpDir, { recursive: true });
    } catch { /* ignore cleanup errors */ }

    return new Response(
      JSON.stringify({ pdfData: pdfBase64, fileName: pdfName }),
      { headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("PPT to PDF error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Conversion failed" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});

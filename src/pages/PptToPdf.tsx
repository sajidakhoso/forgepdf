import ToolPage from '@/components/ToolPage';
import { pptxToPdf } from '@/lib/pdf-tools';

const PptToPdf = () => (
  <ToolPage
    title="PPT to PDF"
    description="Convert PowerPoint presentations (.ppt, .pptx) to PDF format."
    toolPath="/ppt-to-pdf"
    accept=".ppt,.pptx"
    uploadLabel="Drop your PowerPoint file here (.ppt, .pptx)"
    buttonLabel="Convert to PDF"
    outputName={(f) => `${(f[0]?.name || 'presentation').replace(/\.(pptx?|PPTX?)$/, '')}.pdf`}
    process={(f) => pptxToPdf(f[0])}
  />
);

export default PptToPdf;

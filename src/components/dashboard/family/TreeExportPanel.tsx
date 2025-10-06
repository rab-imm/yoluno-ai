import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileJson, Image, FileText } from "lucide-react";
import { toPng, toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface TreeExportPanelProps {
  treeElementId: string;
  exportData: () => string;
}

export const TreeExportPanel = ({ treeElementId, exportData }: TreeExportPanelProps) => {
  const { toast } = useToast();

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPNG = async () => {
    try {
      const element = document.getElementById(treeElementId);
      if (!element) {
        toast({
          title: "Export failed",
          description: "Tree element not found",
          variant: "destructive",
        });
        return;
      }

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: 'white',
      });

      const blob = await (await fetch(dataUrl)).blob();
      downloadFile(blob, `family-tree-${Date.now()}.png`);

      toast({
        title: "Export successful",
        description: "Family tree exported as PNG",
      });
    } catch (error) {
      console.error('Export to PNG failed:', error);
      toast({
        title: "Export failed",
        description: "Could not export tree as PNG",
        variant: "destructive",
      });
    }
  };

  const exportToJPEG = async () => {
    try {
      const element = document.getElementById(treeElementId);
      if (!element) {
        toast({
          title: "Export failed",
          description: "Tree element not found",
          variant: "destructive",
        });
        return;
      }

      const dataUrl = await toJpeg(element, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: 'white',
      });

      const blob = await (await fetch(dataUrl)).blob();
      downloadFile(blob, `family-tree-${Date.now()}.jpg`);

      toast({
        title: "Export successful",
        description: "Family tree exported as JPEG",
      });
    } catch (error) {
      console.error('Export to JPEG failed:', error);
      toast({
        title: "Export failed",
        description: "Could not export tree as JPEG",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = async () => {
    try {
      const element = document.getElementById(treeElementId);
      if (!element) {
        toast({
          title: "Export failed",
          description: "Tree element not found",
          variant: "destructive",
        });
        return;
      }

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: 'white',
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      });

      const img = document.createElement('img');
      img.src = dataUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = img.width / img.height;
      const pdfRatio = pdfWidth / pdfHeight;

      let finalWidth = pdfWidth;
      let finalHeight = pdfHeight;

      if (imgRatio > pdfRatio) {
        finalHeight = pdfWidth / imgRatio;
      } else {
        finalWidth = pdfHeight * imgRatio;
      }

      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, finalWidth, finalHeight);
      pdf.save(`family-tree-${Date.now()}.pdf`);

      toast({
        title: "Export successful",
        description: "Family tree exported as PDF",
      });
    } catch (error) {
      console.error('Export to PDF failed:', error);
      toast({
        title: "Export failed",
        description: "Could not export tree as PDF",
        variant: "destructive",
      });
    }
  };

  const exportToJSON = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      downloadFile(blob, `family-tree-data-${Date.now()}.json`);

      toast({
        title: "Export successful",
        description: "Family tree data exported as JSON",
      });
    } catch (error) {
      console.error('Export to JSON failed:', error);
      toast({
        title: "Export failed",
        description: "Could not export tree data as JSON",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Download className="w-4 h-4" />
        Export Family Tree
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={exportToPNG}>
          <Image className="w-4 h-4 mr-2" />
          PNG
        </Button>
        
        <Button variant="outline" size="sm" onClick={exportToJPEG}>
          <Image className="w-4 h-4 mr-2" />
          JPEG
        </Button>
        
        <Button variant="outline" size="sm" onClick={exportToPDF}>
          <FileText className="w-4 h-4 mr-2" />
          PDF
        </Button>
        
        <Button variant="outline" size="sm" onClick={exportToJSON}>
          <FileJson className="w-4 h-4 mr-2" />
          JSON
        </Button>
      </div>
    </Card>
  );
};

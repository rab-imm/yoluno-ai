import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";
import { useState } from "react";

interface NarrativeEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialDate?: string;
  onSave: (data: { title: string; content: string; storyDate?: string }) => void;
  onCancel: () => void;
}

export const NarrativeEditor = ({
  initialTitle = "",
  initialContent = "",
  initialDate = "",
  onSave,
  onCancel,
}: NarrativeEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [storyDate, setStoryDate] = useState(initialDate);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  const handleSave = () => {
    if (!editor || !title.trim()) return;
    
    onSave({
      title: title.trim(),
      content: editor.getHTML(),
      storyDate: storyDate || undefined,
    });
  };

  if (!editor) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Story Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give this story a title..."
        />
      </div>

      <div className="space-y-2">
        <Label>Story Date (Optional)</Label>
        <Input
          type="date"
          value={storyDate}
          onChange={(e) => setStoryDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Story Content</Label>
        <div className="border rounded-lg overflow-hidden">
          <div className="flex gap-1 p-2 border-b bg-muted/50">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-muted" : ""}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-muted" : ""}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-muted" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-muted" : ""}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
          </div>
          <EditorContent editor={editor} className="bg-background" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          Save Story
        </Button>
      </div>
    </div>
  );
};

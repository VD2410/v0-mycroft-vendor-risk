"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Document {
    document_id: number;
    user_id: string;
    name: string;
    pdfname: string;
    s3_key: string;
    created_at: string;
}

interface DocumentSelectorProps {
    documents: Document[];
    selectedDocument: number | null;
    onDocumentChange: (documentId: number) => void;
    isLoading?: boolean;
}

export function DocumentSelector({
    documents,
    selectedDocument,
    onDocumentChange,
    isLoading = false,
}: DocumentSelectorProps) {
    return (
        <div className="w-full max-w-xs">
            <Select
                value={selectedDocument?.toString() || ""}
                onValueChange={(value) => onDocumentChange(parseInt(value))}
                disabled={isLoading || documents.length === 0}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={
                            isLoading
                                ? "Loading documents..."
                                : documents.length === 0
                                    ? "No documents available"
                                    : "Select a document"
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    {documents.map((doc) => (
                        <SelectItem key={doc.document_id} value={doc.document_id.toString()}>
                            {doc.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Document {
  id: number;
  name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  formation_id: number;
  formation_name?: string;
  uploaded_by: number;
  uploaded_at: string;
}

export interface DocumentUpload {
  formation_id: number;
  file: File;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Récupérer tous les documents
  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/documents`);
  }

  // Récupérer documents par formation
  getDocumentsByFormation(formationId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/formations/${formationId}/documents`);
  }

  // Upload document
  uploadDocument(upload: DocumentUpload): Observable<Document> {
    const formData = new FormData();
    formData.append('file', upload.file);
    formData.append('formation_id', upload.formation_id.toString());
    if (upload.name) {
      formData.append('name', upload.name);
    }

    return this.http.post<Document>(`${this.apiUrl}/documents`, formData);
  }

  // Supprimer document
  deleteDocument(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documents/${id}`);
  }

  // Télécharger document
  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${id}/download`, {
      responseType: 'blob'
    });
  }

  // Récupérer URL de téléchargement
  getDownloadUrl(id: number): string {
    return `${this.apiUrl}/documents/${id}/download`;
  }
}


<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Get documents for a formation
     */
    public function getFormationDocuments($formationId)
    {
        $user = Auth::user();
        
        // Check if user has access to this formation
        $formation = Formation::find($formationId);
        if (!$formation) {
            return response()->json([
                'success' => false,
                'message' => 'Formation not found'
            ], 404);
        }

        // Check permissions
        $hasAccess = false;
        if ($user->role === 'admin') {
            $hasAccess = true;
        } elseif ($user->role === 'formateur' && $formation->formateur_id === $user->id) {
            $hasAccess = true;
        } elseif ($user->role === 'employe') {
            // Check if employee is participant in this formation
            $hasAccess = $formation->participants()->where('user_id', $user->id)->exists();
        }

        if (!$hasAccess) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this formation'
            ], 403);
        }

        $documents = Document::where('formation_id', $formationId)
            ->with('uploader')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'name' => $document->name,
                    'original_name' => $document->original_name,
                    'file_path' => $document->file_path,
                    'file_size' => $document->file_size,
                    'mime_type' => $document->mime_type,
                    'description' => $document->description,
                    'uploaded_by' => [
                        'id' => $document->uploader->id,
                        'name' => $document->uploader->first_name . ' ' . $document->uploader->last_name,
                        'role' => $document->uploader->role
                    ],
                    'created_at' => $document->created_at,
                    'download_url' => route('documents.download', $document->id)
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'formation' => [
                    'id' => $formation->id,
                    'title' => $formation->title
                ],
                'documents' => $documents
            ]
        ]);
    }

    /**
     * Upload document for a formation (trainers only)
     */
    public function uploadDocument(Request $request, $formationId)
    {
        $user = Auth::user();
        
        // Check if user is trainer or admin
        if (!in_array($user->role, ['formateur', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only trainers and admins can upload documents'
            ], 403);
        }

        $formation = Formation::find($formationId);
        if (!$formation) {
            return response()->json([
                'success' => false,
                'message' => 'Formation not found'
            ], 404);
        }

        // Check if trainer is assigned to this formation
        if ($user->role === 'formateur' && $formation->formateur_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not assigned to this formation'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // 10MB max
            'description' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $fileName = Str::uuid() . '.' . $extension;
        
        // Store file
        $filePath = $file->storeAs('formations/' . $formationId, $fileName, 'public');
        
        // Create document record
        $document = Document::create([
            'name' => $fileName,
            'original_name' => $originalName,
            'file_path' => $filePath,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'description' => $request->description,
            'formation_id' => $formationId,
            'uploaded_by' => $user->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully',
            'data' => [
                'id' => $document->id,
                'name' => $document->name,
                'original_name' => $document->original_name,
                'file_size' => $document->file_size,
                'mime_type' => $document->mime_type,
                'description' => $document->description,
                'created_at' => $document->created_at,
                'download_url' => route('documents.download', $document->id)
            ]
        ]);
    }

    /**
     * Download document
     */
    public function downloadDocument($documentId)
    {
        $user = Auth::user();
        
        $document = Document::with('formation')->find($documentId);
        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        $formation = $document->formation;
        
        // Check permissions
        $hasAccess = false;
        if ($user->role === 'admin') {
            $hasAccess = true;
        } elseif ($user->role === 'formateur' && $formation->formateur_id === $user->id) {
            $hasAccess = true;
        } elseif ($user->role === 'employe') {
            // Check if employee is participant in this formation
            $hasAccess = $formation->participants()->where('user_id', $user->id)->exists();
        }

        if (!$hasAccess) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this document'
            ], 403);
        }

        // Check if file exists
        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found on server'
            ], 404);
        }

        return Storage::disk('public')->download($document->file_path, $document->original_name);
    }

    /**
     * Delete document (trainers and admins only)
     */
    public function deleteDocument($documentId)
    {
        $user = Auth::user();
        
        $document = Document::with('formation')->find($documentId);
        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        $formation = $document->formation;
        
        // Check permissions
        $canDelete = false;
        if ($user->role === 'admin') {
            $canDelete = true;
        } elseif ($user->role === 'formateur' && $formation->formateur_id === $user->id) {
            $canDelete = true;
        } elseif ($document->uploaded_by === $user->id) {
            $canDelete = true;
        }

        if (!$canDelete) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to delete this document'
            ], 403);
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        // Delete document record
        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully'
        ]);
    }

    /**
     * Get all documents for admin
     */
    public function getAllDocuments()
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only admins can view all documents'
            ], 403);
        }

        $documents = Document::with(['formation', 'uploader'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'name' => $document->name,
                    'original_name' => $document->original_name,
                    'file_size' => $document->file_size,
                    'mime_type' => $document->mime_type,
                    'description' => $document->description,
                    'formation' => [
                        'id' => $document->formation->id,
                        'title' => $document->formation->title
                    ],
                    'uploaded_by' => [
                        'id' => $document->uploader->id,
                        'name' => $document->uploader->first_name . ' ' . $document->uploader->last_name,
                        'role' => $document->uploader->role
                    ],
                    'created_at' => $document->created_at,
                    'download_url' => route('documents.download', $document->id)
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $documents
        ]);
    }
}

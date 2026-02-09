# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

#### API Integration (2024)

- **API Service Layer** (`src/services/api.service.ts`)
  - Centralized API communication with backend service
  - Type-safe request/response interfaces
  - Automatic error handling and formatting
  - Support for summarization endpoints

- **Custom Hooks**
  - `useSummarizer` hook (`src/hooks/useSummarizer.ts`)
  - Provides clean interface for text summarization
  - Built-in loading and error states
  - Success and error callbacks support

- **Documentation**
  - Comprehensive API integration guide (`docs/API_INTEGRATION.md`)
  - Migration instructions for other features
  - Testing procedures and examples

### Changed

#### Summarizer Feature

- **Updated Summarizer Component** (`src/views/summarizer.tsx`)
  - Migrated from direct Gemini API calls to backend service API
  - Replaced `useGemini` hook with `useSummarizer` hook
  - Removed client-side prompt construction logic
  - Simplified error handling with callbacks
  - Maintained all existing UI/UX functionality

### Security

- **API Key Protection**
  - Removed API key exposure from frontend
  - Moved sensitive keys to backend service
  - Reduced client-side attack surface

### Improved

- **Architecture**
  - Centralized AI provider integration on backend
  - Better separation of concerns
  - Easier to maintain and update
  - Prepared for future scalability

- **Error Handling**
  - Consistent error messages across application
  - Better error propagation from backend
  - User-friendly error notifications

### Technical Details

**Backend Integration:**
- Endpoint: `POST /api/v1/docxiq/research/summarize`
- Controller: `ResearchSupportController.summarizeText`
- Route: `/docxiq/research/summarize`

**Frontend Changes:**
- New service layer for API calls
- Custom hook for feature-specific logic
- Type-safe interfaces throughout
- Maintained backward compatibility with UI

**Environment Variables:**
- Frontend: `VITE_API_URL` (default: http://localhost:5000/api/v1)
- Backend: `GEMINI_API_KEY` (server-side only)

### Migration Impact

- **Breaking Changes:** None for end users
- **Developer Changes:** 
  - Must run backend service for summarizer to work
  - Update `.env` with `VITE_API_URL` if using custom backend URL
  - `useGemini` hook deprecated for summarizer (still available for other features)

### Future Enhancements

- [ ] Migrate Paraphraser to backend API
- [ ] Migrate Text Expander to backend API
- [ ] Add authentication and user management
- [ ] Implement request caching
- [ ] Add WebSocket support for streaming
- [ ] Usage analytics and rate limiting
- [ ] Batch processing support

### Notes

This update represents Phase 1 of migrating all AI features to the backend service. The Summarizer serves as the proof-of-concept for this architectural change. Other features (Paraphraser, Converter, etc.) will follow the same pattern in future updates.

---

## Previous Versions

(Previous changelog entries would go here)
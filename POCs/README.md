# Proof of Concepts (POCs)

This directory contains experimental implementations and technical hypothesis validations. Each POC is designed to be completed within 2-3 hours and demonstrates specific technical approaches or validates architectural decisions.

> **Note:** These projects focus on concept demonstrations rather than production code, as the implementation details were rapidly prototyped using Claude Sonnet for validation purposes.

---

## 🏋️ RAG Gym Program
**AI-Powered Fitness Program Generator**

An intelligent fitness program creator that leverages RAG (Retrieval-Augmented Generation) to provide personalized workout recommendations based on trusted fitness expert content.

### Implementation Flow:

1. **Content Transcription**
   - Transcribe YouTube videos from popular fitness influencers using online services
   - Process fitness podcasts through OpenAI Whisper for audio-to-text conversion

2. **Knowledge Base Creation**
   - Train RAG system using Lance vector database
   - Generate embeddings using OpenAI Embeddings API
   - Index transcribed content for semantic search

3. **Application Development**
   - Develop Node.js scripts for content processing and retrieval
   - Implement program generation logic

4. **Program Generation**
   - Generate personalized fitness programs using relevant information from trusted sources
   - Ensure recommendations are based on expert knowledge and user requirements

### Technologies:
- **Vector Database:** Lance
- **Embeddings:** OpenAI Embeddings API  
- **Transcription:** OpenAI Whisper, Online transcription services
- **Runtime:** Node.js
- **AI Model:** RAG implementation

---

## 🛍️ AI Stylist & Product Researcher
**Intelligent E-commerce Product Discovery Platform**

An AI-powered system that understands natural language queries and converts them into structured marketplace searches, providing users with relevant product recommendations.

### Implementation Flow:

1. **Integration Setup**
   - Integrate MCP Firecrawl into Cursor development environment
   - Configure web scraping capabilities for marketplace interaction

2. **Marketplace Analysis**
   - Use Firecrawl to interact with marketplace filters and navigation
   - Generate seed files containing marketplace structure and filtering logic

3. **Scraper Generation**
   - Generate Playwright-based website scrapers using Claude Sonnet
   - Base generation on pre-written templates and marketplace seed data

4. **Query Processing**
   - Parse user prompts using OpenAI API
   - Convert natural language into filter parameters understood by scraper modules

5. **Data Retrieval & Response**
   - Scrape marketplace data based on user queries
   - Return relevant, structured results to users

### Future Enhancements:

- **Advanced Query Processing:** Implement RAG-based user prompt parsing for more sophisticated query-to-scraper parameter conversion
- **Data Validation:** Integrate OpenCV or similar computer vision tools for validating raw data from multiple marketplaces
- **Multi-marketplace Support:** Expand to handle diverse e-commerce platforms with unified query interface

### Technologies:
- **Web Scraping:** Firecrawl, Playwright
- **AI Processing:** Claude Sonnet, OpenAI API
- **Development Environment:** Cursor with MCP integration
- **Future Tech Stack:** RAG, OpenCV, Computer Vision APIs
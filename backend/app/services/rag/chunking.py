from langchain.text_splitter import RecursiveCharacterTextSplitter

class Chunker:
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )

    def chunk_text(self, text_pages: list[dict]) -> list[dict]:
        """
        Chunks text while preserving page metadata.
        Input: [{'text': '...', 'page': 1}, ...]
        Output: [{'text': '...', 'page': 1, 'chunk_index': 0}, ...]
        """
        chunks = []
        global_index = 0
        
        for page in text_pages:
            page_text = page['text']
            page_num = page['page']
            
            raw_chunks = self.splitter.split_text(page_text)
            
            for raw_chunk in raw_chunks:
                chunks.append({
                    "text": raw_chunk,
                    "page": page_num,
                    "chunk_index": global_index,
                    "section_heading": "TODO" # Placeholder for heading extraction
                })
                global_index += 1
                
        return chunks

chunker = Chunker()

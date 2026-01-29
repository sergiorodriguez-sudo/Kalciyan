import io
from pypdf import PdfReader

class TextExtractor:
    @staticmethod
    def extract_from_pdf(file_content: bytes) -> list[dict]:
        """
        Extracts text from PDF bytes.
        Returns a list of dicts: {'text': str, 'page': int}
        """
        try:
            reader = PdfReader(io.BytesIO(file_content))
            pages = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    pages.append({"text": text, "page": i + 1})
            return pages
        except Exception as e:
            print(f"Error extracting PDF: {e}")
            return []

    @staticmethod
    def extract_from_gdoc(gdoc_content: str) -> list[dict]:
        """
        Extracts text from Google Doc (assuming exported as text or HTML).
        For now, treating raw text as single page/chunk.
        """
        # TODO: smart splitting by headings
        return [{"text": gdoc_content, "page": 1}]

extractor = TextExtractor()

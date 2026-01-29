import jsPDF from 'jspdf';

export const generatePDF = (question: string, answer: string, evidence: any[]) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 153); // Blue
    doc.text("Reporte SGI - Kalciyan", 20, 20);

    // Question
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Consulta:", 20, 35);
    doc.setFont("helvetica", "normal");
    const splitQuestion = doc.splitTextToSize(question, 170);
    doc.text(splitQuestion, 20, 42);

    // Answer
    let yPos = 42 + (splitQuestion.length * 7) + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Respuesta Generada:", 20, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
    const splitAnswer = doc.splitTextToSize(answer, 170);
    doc.text(splitAnswer, 20, yPos);

    // Evidence Table
    yPos += (splitAnswer.length * 7) + 15;
    doc.setFont("helvetica", "bold");
    doc.text("Evidencias / Fuentes:", 20, yPos);
    yPos += 10;

    evidence.forEach((item, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`[${index + 1}] Doc: ${item.doc_id} (Pág. ${item.page})`, 20, yPos);
        yPos += 5;
        doc.setFont("helvetica", "italic");
        doc.setTextColor(80, 80, 80);
        const splitEv = doc.splitTextToSize(`"${item.text}"`, 160);
        doc.text(splitEv, 25, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += (splitEv.length * 5) + 5;
    });

    doc.save("reporte_sgi.pdf");
};

const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generateTaskListPDF = (tarefas, res) => {
  const doc = new PDFDocument();

  // define headers HTTP para forçar download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=tarefas.pdf');

  doc.pipe(res);

  doc.fontSize(18).text('Lista de Tarefas', { align: 'center' });
  doc.moveDown();

  tarefas.forEach((tarefa, index) => {
    doc
      .fontSize(12)
      .text(`${index + 1}. ${tarefa.descricao} [${tarefa.situacao}]`, {
        continued: false
      });
  });

  doc.end(); // finaliza e envia o PDF
};

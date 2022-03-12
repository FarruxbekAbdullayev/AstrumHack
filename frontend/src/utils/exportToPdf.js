import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

export const exportToPdf = ({ tableId, fileName, auth, tableTime }) => {
  const size = "A4";
  const doc = new jsPDF(size);
  doc.text(10, 10, `${fileName}`);
  doc.text(`No: _`, 105, 10, null, null, "center");
  doc.setFontSize(10);
  doc.text(`${moment(tableTime ?? new Date()).format('DD.MM.YYYY / hh:mm')}`, 200, 10, null, null, "right");
  doc.text(10, 290, "Topshirdi:");
    doc.text(100, 290, "Qabul qildi:");
  doc.text(10, 490, "Topshirdi:");
    doc.text(100, 490, "Qabul qildi:");
  const table = document.querySelector(`#${tableId} table`);
  // const tableRows = document.querySelectorAll(`#${tableId} table tr`);
  // document.querySelector(".ant-table-measure-row").remove();
  // tableRows.forEach((item) => {
    //   item.lastChild.classList.add("d-none");
    // });
    
  doc.autoTable({ html: table });
  doc.save( `${fileName} ${auth?.firstName} ${auth?.lastName} ${new Date().toLocaleDateString('ru')}.pdf`);
};




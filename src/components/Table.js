import { useState } from "react";
import dataTable from "../data";
import "../index.css";
const tipoIncidenteColors = {
  Transito: "text-blue-500   ",
  Incendio: "text-red-500 ",
  Inundacion: "text-yellow-500 ",
  Ambulancia: "text-green-500 ",
};

const Table = ({ markAsAttended }) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [data, setData] = useState(dataTable);
  const [attendedIncidents, setAttendedIncidents] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const lastPage = Math.ceil(data.length / itemsPerPage);

  const openImageViewer = (image) => {
    setCurrentImage(image);
    setViewerVisible(true);
  };

  const closeImageViewer = () => {
    setViewerVisible(false);
    setCurrentImage(null);
  };

  const handleConditionChange = (id) => {
    const newData = [...data];
    const index = newData.findIndex((item) => item.id === id);
    if (index > -1) {
      const item = newData[index];
      if (item.condicion === "En Curso") {
        item.condicion = "Reportado";
        item.movil = String(Math.floor(10000 + Math.random() * 90000));
      } else {
        item.condicion = "En Curso";
        item.movil = "";
      }
      setData(newData);
    }
  };

  const handleMarkAsAttended = (id) => {
    const itemToMarkAsAttended = data.find((item) => item.id === id);
    if (itemToMarkAsAttended) {
      const attendedItem = {
        ...itemToMarkAsAttended,
        fechaAtencion: new Date().toLocaleString(),
        movilAsignado: itemToMarkAsAttended.movil,
      };
      setAttendedIncidents((prevAttendedIncidents) => [
        attendedItem,
        ...prevAttendedIncidents,
      ]);
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="bg-gray-200 w-full flex items-center justify-center mt-10 mb-10">
        <h2 className="text-lg font-semibold">Incidentes Reportados</h2>
      </div>
      <table className="min-w-full" data-testid="incident-table">
        <thead>
          <tr>
            <th className="px-1 py-1 text-left text-xs">Fecha</th>
            <th className="px-1 py-1 text-left text-xs">Usuario</th>
            <th className="px-1 py-1 text-left text-xs">Localización</th>
            <th className="px-1 py-1 text-left text-xs">Tipo Incidente</th>
            <th className="px-1 py-1 text-left text-xs">Foto</th>
            <th className="px-1 py-1 text-left text-xs">Condición</th>

            <th className="px-1 py-1 text-left text-xs">Acciones</th>
            <th className="px-1 py-1 text-left text-xs">Movil</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id} className="my-custom-row">
              <td className="px-1 text-xs" style={{ whiteSpace: "nowrap" }}>
                {item.fecha}
              </td>
              <td className="px-1 text-xs" style={{ whiteSpace: "nowrap" }}>
                {item.usuario}
              </td>
              <td className="px-1 text-xs" style={{ whiteSpace: "nowrap" }}>
                {item.localizacion}
              </td>
              <td className="px-1 text-xs">
                <span
                  className={`inline-flex items-center rounded-md ${
                    tipoIncidenteColors[item.detalles]
                  } px-1 py-1 text-xs font-medium `}
                >
                  {item.detalles}
                </span>
              </td>
              <td className="px-1 py-1 text-xs">
                <img
                  src={item.fotoUrl}
                  alt="Foto"
                  className="w-8 h-8 object-contain cursor-pointer"
                  onClick={() => openImageViewer(item.fotoUrl)}
                />
              </td>
              <td className="px-1 py-1 text-xs">
                <button
                  onClick={() => handleConditionChange(item.id)}
                  className={`${
                    item.condicion === "En Curso"
                      ? "bg-green-500"
                      : "bg-red-500"
                  } text-white py-1 px-1 rounded`}
                >
                  {item.condicion === "En Curso" ? "En Curso" : "Reportado"}
                </button>
              </td>
              <td className="px-1 py-1 text-xs">
                <button
                  onClick={() => handleMarkAsAttended(item.id)}
                  className={`${
                    item.condicion === "En Curso"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white py-1 px-1 rounded`}
                  disabled={item.condicion === "En Curso"}
                >
                  Finalizar
                </button>
              </td>
              <td
                data-testid="mobile-number"
                className="px-1 text-xs"
                style={{ whiteSpace: "nowrap" }}
              >
                {item.movil}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-700">
          Mostrando{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, data.length)} a{" "}
          {Math.min(currentPage * itemsPerPage, data.length)} de {data.length}{" "}
          resultados
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-1 py-1 text-xs text-gray-700 bg-gray-200 rounded hover:bg-gray-300 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className={`px-1 py-1 text-xs text-gray-700 bg-gray-200 rounded hover-bg-gray-300 ${
              currentPage >= lastPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
      {viewerVisible && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-3 shadow-md relative">
            <img
              src={currentImage}
              alt="Imagen ampliada"
              className="w-full h-auto"
            />
            <button
              onClick={closeImageViewer}
              className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 rounded-full"
            >
              <span className="text-xs font-bold">&times;</span>
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="bg-gray-200 w-full flex items-center justify-center mt-10 mb-10">
          <h2 className="text-lg font-semibold ">Incidentes Atendidos</h2>
        </div>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-1 py-1 text-left text-xs">Fecha</th>
              <th className="px-1 py-1 text-left text-xs">Usuario</th>
              <th className="px-1 py-1 text-left text-xs">Localización</th>
              <th className="px-1 py-1 text-left text-xs">Tipo Incidente</th>
              <th className="px-1 py-1 text-left text-xs">Movil Asignado</th>
            </tr>
          </thead>
          <tbody>
            {attendedIncidents.map((item) => (
              <tr key={item.id}>
                <td
                  className="px-1 py-1 text-xs"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {item.fechaAtencion}
                </td>
                <td className="px-1 py-1 text-xs">{item.usuario}</td>
                <td className="px-1 py-1 text-xs">{item.localizacion}</td>
                <td className="px-1 py-1 text-xs">
                  <span
                    className={`inline-flex items-center rounded-md ${
                      tipoIncidenteColors[item.detalles]
                    } px-1 py-1 text-xs font-medium `}
                  >
                    {item.detalles}
                  </span>
                </td>
                <td
                  className="px-1 py-1 text-xs"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {item.movilAsignado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

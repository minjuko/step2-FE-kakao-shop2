const QueryStatus = ({ title, message, isError = false }) => {
  return (
    <div
      className="m-8 rounded-md border border-gray-200 bg-gray-50 p-8 text-center"
      role={isError ? "alert" : "status"}
    >
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
};

export default QueryStatus;

const LoadingSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="monkedex-grid-item">
          <div className="monkedex-skeleton" style={{ height: "300px" }} />
          <div className="monkedex-grid-item-info">
            <div
              className="monkedex-skeleton"
              style={{ height: "20px", width: "70%", marginBottom: "8px" }}
            />
            <div
              className="monkedex-skeleton"
              style={{ height: "16px", width: "50%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

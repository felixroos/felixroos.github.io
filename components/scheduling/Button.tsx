export function Button({ onClick, children }) {
  return (
    <button
      className="text-white bg-sky-600 border-2 border-sky-800 p-2 m-1 rounded-md"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

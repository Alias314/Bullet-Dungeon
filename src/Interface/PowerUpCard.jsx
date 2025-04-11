export default function PowerUpCard({ title, description, onSelectFunction }) {
  return (
    <div
      className="w-80 h-64 p-6 border border-white rounded-lg flex flex-col items-center bg-white hover:bg-gray-400 cursor-pointer"
      onClick={onSelectFunction}
    >
      <h1 className="text-3xl font-semibold mb-2">{title}</h1>
      <p className="text-lg text-center">{description}</p>
    </div>
  );
}

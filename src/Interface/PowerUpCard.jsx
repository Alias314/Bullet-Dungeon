export default function PowerUpCard({ title, description, image, onSelectFunction }) {
  return (
    <div
      className="w-80 p-6 border border-white rounded-lg flex flex-col items-center bg-white hover:bg-gray-400 cursor-pointer"
      onClick={onSelectFunction}
    >
      <h1 className="text-3xl font-semibold mb-2">{title}</h1>
      
      <img className="bg-black rounded-2xl" src={`assets/icons/${image}`} />
      <p className="text-lg text-center">{description}</p>
    </div>
  );
}

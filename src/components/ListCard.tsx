import Link from "next/link";

interface ListCardProps {
  list: {
    id: string;
    name: string;
    imageLinks: string[];
    responseCodes: number[];
  };
  onDelete: (id: string) => void;
}

export default function ListCard({ list, onDelete }: ListCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2">{list.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {list.imageLinks.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`HTTP ${list.responseCodes[index]}`}
            className="w-full h-auto rounded shadow-md"
          />
        ))}
      </div>
      <div className="flex justify-between">
        <Link
          href={`/lists/edit/${list.id}`}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(list.id)}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
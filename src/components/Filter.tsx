interface FilterProps {
    filter: string;
    setFilter: (filter: string) => void;
    onSearch: () => void;
  }
  
  export default function Filter({ filter, setFilter, onSearch }: FilterProps) {
    return (
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter (e.g., 203, 2xx)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={onSearch}
          className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Search
        </button>
      </div>
    );
  }
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Sortable from "sortablejs";

interface ListCardProps {
	list: {
		id: string;
		name: string;
		imageLinks: string[];
		responseCodes: number[];
		favoriteImages: string[]; // For starred images
		tags: string[]; // List of tags
		isFavorite: boolean; // Is list a favorite
	};
	onDelete: (id: string) => void;
}

export default function ListCard({ list, onDelete }: ListCardProps) {
	const [images, setImages] = useState(
		list.imageLinks.map((src, index) => ({
			src,
			responseCode: list.responseCodes[index],
		}))
	);
	const [isFavorite, setIsFavorite] = useState(list.isFavorite);
	const [favoriteImages, setFavoriteImages] = useState(
		list.favoriteImages || []
	);
	const [nameFilter, setNameFilter] = useState("");
	const [regexFilter, setRegexFilter] = useState("");
	const [tags, setTags] = useState(list.tags || []);
	const router = useRouter();

	const sortableContainerRef = useRef(null);

	// Sort images when the order is changed by SortableJS
	const initializeSortable = () => {
		if (sortableContainerRef.current) {
			Sortable.create(sortableContainerRef.current, {
				animation: 150,
				onEnd: (evt) => {
					const { oldIndex, newIndex } = evt;

					// Ensure newIndex is defined
					if (typeof newIndex === "number" && typeof oldIndex === "number") {
						const newImages = [...images];
						const [movedItem] = newImages.splice(oldIndex, 1);
						newImages.splice(newIndex, 0, movedItem);
						setImages(newImages);
					}
				},
			});
		}
	};

	const handleStarImage = (src: string) => {
		setFavoriteImages((prevFavorites) =>
			prevFavorites.includes(src)
				? prevFavorites.filter((img) => img !== src)
				: [...prevFavorites, src]
		);
	};

	const handleRemoveImage = (src: string) => {
		setImages(images.filter((img) => img.src !== src));
	};

	const handleStarList = () => {
		setIsFavorite(!isFavorite);
	};

	const handleSave = async () => {
		const listRef = doc(db, "lists", list.id);
		await updateDoc(listRef, {
			imageLinks: images.map((img) => img.src),
			responseCodes: images.map((img) => img.responseCode),
			favoriteImages,
			isFavorite,
			tags,
		});
		router.push("/lists");
	};

	// Inside ListCard component where you are filtering the images by responseCode
	const filteredImages = images.filter((img) => {
		const nameMatch = img.src.includes(nameFilter);
		const regexMatch = regexFilter
			? img.responseCode &&
			  new RegExp(regexFilter).test(img.responseCode.toString())
			: true; // Ensure responseCode is defined before attempting to convert it to a string
		return nameMatch && regexMatch;
	});

	return (
		<div className="bg-white p-4 rounded shadow-md mb-4">
			<h2 className="text-xl font-bold mb-2">{list.name}</h2>

			<div className="flex justify-between">
				<input
					type="text"
					placeholder="Filter by name"
					value={nameFilter}
					onChange={(e) => setNameFilter(e.target.value)}
					className="mb-4 p-2 border rounded w-1/2"
				/>
				<input
					type="text"
					placeholder="Filter by response code (regex)"
					value={regexFilter}
					onChange={(e) => setRegexFilter(e.target.value)}
					className="mb-4 p-2 border rounded w-1/2"
				/>
			</div>

			<div
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
				ref={sortableContainerRef}
				onMouseEnter={initializeSortable}
			>
				{filteredImages.map((img, index) => (
					<div key={index} className="relative">
						<img
							src={img.src}
							alt={`HTTP ${img.responseCode}`}
							className="w-full h-auto rounded shadow-md"
						/>
						<button
							onClick={() => handleStarImage(img.src)}
							className={`absolute top-0 right-0 p-1 ${
								favoriteImages.includes(img.src)
									? "text-yellow-400"
									: "text-gray-500"
							}`}
						>
							★
						</button>
						<button
							onClick={() => handleRemoveImage(img.src)}
							className="absolute bottom-0 right-0 p-1 text-red-500"
						>
							🗑
						</button>
					</div>
				))}
			</div>

			<div className="flex justify-between mt-4">
				<button
					onClick={handleStarList}
					className={`bg-yellow-500 text-white p-2 rounded ${
						isFavorite ? "hover:bg-yellow-600" : "hover:bg-gray-600"
					}`}
				>
					{isFavorite ? "★ Remove from Favorites" : "☆ Add to Favorites"}
				</button>
				<button
					onClick={() => onDelete(list.id)}
					className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
				>
					Delete List
				</button>
			</div>

			<div className="mt-4">
				<h3 className="text-lg font-semibold">Tags</h3>
				<input
					type="text"
					placeholder="Add tags (comma-separated)"
					value={tags.join(", ")}
					onChange={(e) => setTags(e.target.value.split(","))}
					className="p-2 border rounded w-full"
				/>
			</div>

			<button
				onClick={handleSave}
				className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
			>
				Save Changes
			</button>
		</div>
	);
}

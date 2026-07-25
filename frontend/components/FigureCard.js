import Link from 'next/link';
import Image from 'next/image';

export default function FigureCard({ figure }) {
  const imageUrl = figure.profileImage?.url || '/placeholder-avatar.png';

  return (
    <Link
      href={`/figures/${figure._id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100"
    >
      <div className="relative w-full h-48 bg-slate-100">
        {figure.profileImage?.url ? (
          <Image src={imageUrl} alt={figure.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            Tidak ada gambar
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800">{figure.name}</h3>
        <span className="inline-block mt-1 text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
          {figure.category}
        </span>
      </div>
    </Link>
  );
}

// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo da Ótica */}
          <div className="relative w-10 h-10 md:w-12 md:h-12">
             <Image 
                src="/images/logo.webp" 
                alt="Logo Óticas Vizz" 
                fill
                className="object-contain"
                priority
             />
          </div>
        </Link>

        {/* Texto descritivo */}
      </div>
    </header>
  );
}
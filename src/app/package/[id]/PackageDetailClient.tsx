'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface PackageDetailClientProps {
  pkgId: string;
}

const PackageDetailClient = ({ pkgId }: PackageDetailClientProps) => {
  const { user: authUser, isAdmin } = useAuth();

  return (
    <div className="mt-4">
      {isAdmin && (
        <div>
          <Link href={`/admin/packages/edit/${pkgId}`}>
            <button className="p-2 bg-blue-500 text-white rounded">Edit Package</button>
          </Link>
        </div>
      )}
      <div>
        <p>User: {authUser?.email}</p>
        <p>Role: {isAdmin ? 'Admin' : 'User'}</p>
      </div>
    </div>
  );
};

export default PackageDetailClient;
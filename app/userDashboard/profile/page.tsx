import { auth } from '@/auth';
import { lusitana } from '@/app/ui/fonts';
import ProfileView from '@/app/ui/profile-view';
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Hồ sơ cá nhân
      </h1>
      <Suspense fallback={<div className="p-6">Đang tải thông tin...</div>}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}

async function ProfileContent() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return <div>Bạn chưa đăng nhập.</div>;
  }

  return <ProfileView user={user} />;
}
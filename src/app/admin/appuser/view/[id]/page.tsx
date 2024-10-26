import { verifySession } from '@/app/lib/session';
import AppUsersViewPage from '@/app/pages/admin/appuser/AppUsersViewPage'
import { fetchAppUsers } from '@/services/appusers';

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const tokendata = await verifySession();

  const appUserData = await fetchAppUsers(tokendata);
  const idFltr = appUserData.filter((val: any) => val.id == id);

  return (
    <div>
    <AppUsersViewPage appUserData={idFltr[0]} />
    </div>
  )
}
